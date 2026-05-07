-- =============================================
-- SUPER ADMIN SYSTEM: AUDIT LOGS TABLE
-- Migration: 003_create_audit_logs_table
-- Description: Create audit_logs table for immutable logging of all super admin actions
-- Requirements: Req 8 (Audit Trail and Compliance)
-- =============================================

-- =============================================
-- AUDIT LOGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  -- Primary identification
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Super admin who performed the action
  super_admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  
  -- Action details
  action_type TEXT NOT NULL,
  target_entity TEXT NOT NULL,
  target_id UUID,
  
  -- Change tracking
  changes JSONB,
  
  -- Request metadata
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  
  -- Timestamp (immutable, no updated_at)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Index for super_admin_id lookups (query by admin)
CREATE INDEX IF NOT EXISTS idx_audit_logs_super_admin 
  ON public.audit_logs(super_admin_id);

-- Index for action_type filtering
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_type 
  ON public.audit_logs(action_type);

-- Composite index for target entity and ID lookups
CREATE INDEX IF NOT EXISTS idx_audit_logs_target 
  ON public.audit_logs(target_entity, target_id);

-- Index for created_at with DESC for recent logs first
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at 
  ON public.audit_logs(created_at DESC);

-- Composite index for admin + date range queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_date 
  ON public.audit_logs(super_admin_id, created_at DESC);

-- GIN index for JSONB queries on changes
CREATE INDEX IF NOT EXISTS idx_audit_logs_changes_gin 
  ON public.audit_logs USING GIN (changes);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on audit_logs table
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Temporary policy: Allow service role full access for SELECT
-- This will be replaced with super_admin policies after profiles.super_admin column is added
CREATE POLICY "Service role can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (true);

-- Temporary policy: Allow service role to insert audit logs
-- This will be replaced with super_admin policies after profiles.super_admin column is added
CREATE POLICY "Service role can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (true);

-- Policy: IMMUTABILITY - Prevent all UPDATE operations
CREATE POLICY "Audit logs are immutable - no updates"
  ON public.audit_logs FOR UPDATE
  USING (false);

-- Policy: IMMUTABILITY - Prevent all DELETE operations
CREATE POLICY "Audit logs cannot be deleted"
  ON public.audit_logs FOR DELETE
  USING (false);

-- =============================================
-- HELPER FUNCTION FOR LOGGING
-- =============================================

-- Function to log audit events with automatic metadata capture
CREATE OR REPLACE FUNCTION log_audit_event(
  p_action_type TEXT,
  p_target_entity TEXT,
  p_target_id UUID DEFAULT NULL,
  p_changes JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
  current_session_id TEXT;
BEGIN
  -- Get session ID from settings if available
  BEGIN
    current_session_id := current_setting('app.session_id', true);
  EXCEPTION
    WHEN OTHERS THEN
      current_session_id := NULL;
  END;
  
  -- Insert audit log entry
  INSERT INTO public.audit_logs (
    super_admin_id,
    action_type,
    target_entity,
    target_id,
    changes,
    ip_address,
    user_agent,
    session_id
  ) VALUES (
    auth.uid(),
    p_action_type,
    p_target_entity,
    p_target_id,
    p_changes,
    p_ip_address,
    p_user_agent,
    current_session_id
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION log_audit_event IS 
  'Helper function to log super admin actions with automatic metadata capture';

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE public.audit_logs IS 
  'Immutable audit trail of all super admin actions for compliance and security monitoring';

COMMENT ON COLUMN public.audit_logs.id IS 
  'Unique identifier for the audit log entry';

COMMENT ON COLUMN public.audit_logs.super_admin_id IS 
  'Foreign key to auth.users - the super admin who performed the action';

COMMENT ON COLUMN public.audit_logs.action_type IS 
  'Type of action performed (e.g., tenant.create, user.update, password.reset)';

COMMENT ON COLUMN public.audit_logs.target_entity IS 
  'Entity type affected by the action (e.g., tenant, user, admin, settings)';

COMMENT ON COLUMN public.audit_logs.target_id IS 
  'UUID of the specific entity affected (if applicable)';

COMMENT ON COLUMN public.audit_logs.changes IS 
  'JSONB object containing before/after values for the change';

COMMENT ON COLUMN public.audit_logs.ip_address IS 
  'IP address from which the action was performed';

COMMENT ON COLUMN public.audit_logs.user_agent IS 
  'Browser/client user agent string';

COMMENT ON COLUMN public.audit_logs.session_id IS 
  'Session identifier for tracking related actions';

COMMENT ON COLUMN public.audit_logs.created_at IS 
  'Timestamp when the action was performed (immutable)';

-- =============================================
-- ACTION TYPE DOCUMENTATION
-- =============================================

COMMENT ON COLUMN public.audit_logs.action_type IS 
  'Action types include:
  - Tenant: tenant.create, tenant.update, tenant.delete, tenant.activate, tenant.deactivate
  - User: user.create, user.update, user.delete, user.migrate, user.impersonate
  - Admin: admin.create, admin.update, admin.revoke
  - Password: password.reset, password.force_change
  - Settings: settings.update, settings.delete
  - Backup: backup.create, backup.restore
  - API: api_key.create, api_key.revoke';

-- =============================================
-- VALIDATION
-- =============================================

-- Verify table was created successfully
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'audit_logs'
  ) THEN
    RAISE EXCEPTION 'Failed to create audit_logs table';
  END IF;
  
  -- Verify foreign key constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_type = 'FOREIGN KEY'
    AND table_schema = 'public'
    AND table_name = 'audit_logs'
  ) THEN
    RAISE EXCEPTION 'Foreign key constraint on super_admin_id not found';
  END IF;
  
  -- Verify immutability policies exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public'
    AND tablename = 'audit_logs'
    AND policyname = 'Audit logs are immutable - no updates'
  ) THEN
    RAISE EXCEPTION 'Immutability policy for UPDATE not found';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public'
    AND tablename = 'audit_logs'
    AND policyname = 'Audit logs cannot be deleted'
  ) THEN
    RAISE EXCEPTION 'Immutability policy for DELETE not found';
  END IF;
  
  RAISE NOTICE 'Audit logs table created successfully';
  RAISE NOTICE 'Immutability policies enforced: UPDATE and DELETE operations blocked';
  RAISE NOTICE 'Indexes created: super_admin, action_type, target, created_at';
  RAISE NOTICE 'Helper function log_audit_event() created';
END $$;
