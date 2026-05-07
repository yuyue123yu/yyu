-- ========================================
-- FIX AUDIT LOGS TABLE
-- 修复现有的 audit_logs 表，添加缺失的字段
-- ========================================

-- ========================================
-- ADD MISSING COLUMNS
-- ========================================

-- 添加 tenant_id 字段
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'audit_logs' AND column_name = 'tenant_id'
  ) THEN
    ALTER TABLE audit_logs ADD COLUMN tenant_id UUID REFERENCES tenants(id);
  END IF;
END $$;

-- 添加其他可能缺失的字段
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'audit_logs' AND column_name = 'old_data'
  ) THEN
    ALTER TABLE audit_logs ADD COLUMN old_data JSONB;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'audit_logs' AND column_name = 'new_data'
  ) THEN
    ALTER TABLE audit_logs ADD COLUMN new_data JSONB;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'audit_logs' AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE audit_logs ADD COLUMN ip_address TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'audit_logs' AND column_name = 'user_agent'
  ) THEN
    ALTER TABLE audit_logs ADD COLUMN user_agent TEXT;
  END IF;
END $$;

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
-- ENABLE RLS (如果还没启用)
-- ========================================

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ========================================
-- DROP OLD POLICIES (如果存在)
-- ========================================

DROP POLICY IF EXISTS "管理员可以查看自己租户的审计日志" ON audit_logs;
DROP POLICY IF EXISTS "系统可以插入审计日志" ON audit_logs;
DROP POLICY IF EXISTS "Super Admin 可以查看所有审计日志" ON audit_logs;

-- ========================================
-- CREATE NEW RLS POLICIES
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
