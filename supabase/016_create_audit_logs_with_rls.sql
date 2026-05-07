-- ========================================
-- AUDIT LOGS TABLE WITH RLS
-- Migration: 016_create_audit_logs_with_rls
-- Description: Create audit logs table with proper RLS policies
-- ========================================

-- ========================================
-- CREATE TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Tenant and user info
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  
  -- Action details
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  
  -- Data changes
  old_data JSONB,
  new_data JSONB,
  
  -- Request metadata
  ip_address TEXT,
  user_agent TEXT,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ========================================
-- CREATE INDEXES
-- ========================================

-- Tenant ID index (most common query)
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id 
ON audit_logs(tenant_id);

-- User ID index
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id 
ON audit_logs(user_id);

-- Created at index (for time-based queries)
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at 
ON audit_logs(created_at DESC);

-- Resource index
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource 
ON audit_logs(resource_type, resource_id);

-- Action index
CREATE INDEX IF NOT EXISTS idx_audit_logs_action 
ON audit_logs(action);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_created 
ON audit_logs(tenant_id, created_at DESC);

-- ========================================
-- ENABLE RLS
-- ========================================

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ========================================
-- CREATE RLS POLICIES
-- ========================================

-- Policy 1: 管理员可以查看自己租户的审计日志
CREATE POLICY "管理员可以查看自己租户的审计日志"
ON audit_logs FOR SELECT
USING (
  tenant_id IN (
    SELECT tenant_id FROM profiles WHERE id = auth.uid()
  )
);

-- Policy 2: 系统可以插入审计日志（通过 service_role）
CREATE POLICY "系统可以插入审计日志"
ON audit_logs FOR INSERT
WITH CHECK (true);

-- Policy 3: Super Admin 可以查看所有审计日志
CREATE POLICY "Super Admin 可以查看所有审计日志"
ON audit_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND super_admin = TRUE
  )
);

-- ========================================
-- CREATE HELPER FUNCTION
-- ========================================

-- Function to create audit log entry
CREATE OR REPLACE FUNCTION create_audit_log(
  p_tenant_id UUID,
  p_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id UUID DEFAULT NULL,
  p_old_data JSONB DEFAULT NULL,
  p_new_data JSONB DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO audit_logs (
    tenant_id,
    user_id,
    action,
    resource_type,
    resource_id,
    old_data,
    new_data,
    ip_address,
    user_agent
  ) VALUES (
    p_tenant_id,
    p_user_id,
    p_action,
    p_resource_type,
    p_resource_id,
    p_old_data,
    p_new_data,
    p_ip_address,
    p_user_agent
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON TABLE audit_logs IS 
'Audit log table for tracking all important actions in the system';

COMMENT ON COLUMN audit_logs.tenant_id IS 
'Tenant ID for multi-tenant isolation';

COMMENT ON COLUMN audit_logs.user_id IS 
'User who performed the action';

COMMENT ON COLUMN audit_logs.action IS 
'Action performed (e.g., CREATE, UPDATE, DELETE, LOGIN)';

COMMENT ON COLUMN audit_logs.resource_type IS 
'Type of resource affected (e.g., service, user, setting)';

COMMENT ON COLUMN audit_logs.resource_id IS 
'ID of the affected resource';

COMMENT ON COLUMN audit_logs.old_data IS 
'Previous state of the resource (for UPDATE actions)';

COMMENT ON COLUMN audit_logs.new_data IS 
'New state of the resource (for CREATE/UPDATE actions)';

COMMENT ON FUNCTION create_audit_log IS 
'Helper function to create audit log entries';

-- ========================================
-- VERIFICATION
-- ========================================

DO $$
BEGIN
  -- Check if table was created
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'audit_logs'
  ) THEN
    RAISE NOTICE 'Audit logs table created successfully';
  ELSE
    RAISE EXCEPTION 'Failed to create audit logs table';
  END IF;
  
  -- Check if RLS is enabled
  IF EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public' 
    AND tablename = 'audit_logs' 
    AND rowsecurity = true
  ) THEN
    RAISE NOTICE 'RLS enabled on audit_logs table';
  ELSE
    RAISE WARNING 'RLS not enabled on audit_logs table';
  END IF;
END $$;

RAISE NOTICE 'Audit logs migration completed successfully';
