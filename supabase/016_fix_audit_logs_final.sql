-- ========================================
-- FIX AUDIT LOGS TABLE - FINAL VERSION
-- 只添加缺失的字段，不依赖不存在的字段
-- ========================================

-- ========================================
-- STEP 1: 添加缺失的字段
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

-- 添加 old_data 字段
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'audit_logs' AND column_name = 'old_data'
  ) THEN
    ALTER TABLE audit_logs ADD COLUMN old_data JSONB;
  END IF;
END $$;

-- 添加 new_data 字段
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'audit_logs' AND column_name = 'new_data'
  ) THEN
    ALTER TABLE audit_logs ADD COLUMN new_data JSONB;
  END IF;
END $$;

-- 添加 ip_address 字段
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'audit_logs' AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE audit_logs ADD COLUMN ip_address TEXT;
  END IF;
END $$;

-- 添加 user_agent 字段
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
-- STEP 2: 创建索引
-- ========================================

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- 只为存在的字段创建索引
DO $$
BEGIN
  -- 检查 user_id 字段是否存在
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'audit_logs' AND column_name = 'user_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
  END IF;
  
  -- 检查 resource_type 和 resource_id 字段是否存在
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'audit_logs' AND column_name = 'resource_type'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'audit_logs' AND column_name = 'resource_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
  END IF;
  
  -- 检查 action 字段是否存在
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'audit_logs' AND column_name = 'action'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
  END IF;
END $$;

-- ========================================
-- STEP 3: 启用 RLS
-- ========================================

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 4: 删除旧策略（如果存在）
-- ========================================

DROP POLICY IF EXISTS "管理员可以查看自己租户的审计日志" ON audit_logs;
DROP POLICY IF EXISTS "系统可以插入审计日志" ON audit_logs;
DROP POLICY IF EXISTS "Super Admin 可以查看所有审计日志" ON audit_logs;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON audit_logs;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON audit_logs;

-- ========================================
-- STEP 5: 创建新的 RLS 策略
-- ========================================

-- 策略 1: 管理员可以查看自己租户的审计日志
CREATE POLICY "管理员可以查看自己租户的审计日志"
ON audit_logs FOR SELECT
USING (
  tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid())
);

-- 策略 2: 系统可以插入审计日志
CREATE POLICY "系统可以插入审计日志"
ON audit_logs FOR INSERT
WITH CHECK (true);

-- 策略 3: Super Admin 可以查看所有审计日志
CREATE POLICY "Super Admin 可以查看所有审计日志"
ON audit_logs FOR SELECT
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND super_admin = TRUE)
);
