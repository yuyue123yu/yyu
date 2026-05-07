-- ========================================
-- AUDIT LOGS TABLE WITH RLS
-- 简化版本 - 只创建表和基本策略
-- ========================================

-- ========================================
-- CREATE TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ========================================
-- CREATE INDEXES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_created ON audit_logs(tenant_id, created_at DESC);

-- ========================================
-- ENABLE RLS
-- ========================================

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ========================================
-- CREATE RLS POLICIES
-- ========================================

CREATE POLICY "管理员可以查看自己租户的审计日志"
ON audit_logs FOR SELECT
USING (
  tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "系统可以插入审计日志"
ON audit_logs FOR INSERT
WITH CHECK (true);

CREATE POLICY "Super Admin 可以查看所有审计日志"
ON audit_logs FOR SELECT
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND super_admin = TRUE)
);
