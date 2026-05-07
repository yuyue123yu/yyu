-- ========================================
-- SOFT DELETE: ADD deleted_at COLUMN
-- 简化版本 - 只添加字段和索引
-- ========================================

-- ========================================
-- ADD deleted_at COLUMN
-- ========================================

ALTER TABLE services ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE tenant_settings ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- ========================================
-- ADD INDEXES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_services_deleted_at ON services(deleted_at);
CREATE INDEX IF NOT EXISTS idx_tenant_settings_deleted_at ON tenant_settings(deleted_at);
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON profiles(deleted_at);

-- ========================================
-- UPDATE RLS POLICIES
-- ========================================

-- Drop existing policies
DROP POLICY IF EXISTS "公开读取活跃服务" ON services;
DROP POLICY IF EXISTS "管理员可以管理自己租户的服务" ON services;

-- Recreate policies with soft delete check
CREATE POLICY "公开读取活跃服务"
ON services FOR SELECT
USING (is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY "管理员可以管理自己租户的服务"
ON services FOR ALL
USING (
  tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid())
  AND deleted_at IS NULL
);
