-- ========================================
-- SOFT DELETE: ADD deleted_at COLUMN
-- 安全版本 - 分步执行
-- ========================================

-- ========================================
-- STEP 1: ADD deleted_at COLUMN
-- ========================================

-- 为 services 表添加 deleted_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'services' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE services ADD COLUMN deleted_at TIMESTAMPTZ;
  END IF;
END $$;

-- 为 tenant_settings 表添加 deleted_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tenant_settings' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE tenant_settings ADD COLUMN deleted_at TIMESTAMPTZ;
  END IF;
END $$;

-- 为 profiles 表添加 deleted_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN deleted_at TIMESTAMPTZ;
  END IF;
END $$;

-- ========================================
-- STEP 2: ADD INDEXES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_services_deleted_at ON services(deleted_at);
CREATE INDEX IF NOT EXISTS idx_tenant_settings_deleted_at ON tenant_settings(deleted_at);
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON profiles(deleted_at);

-- ========================================
-- STEP 3: ADD slug COLUMN TO SERVICES
-- ========================================

-- 为 services 表添加 slug 字段（用于 SEO URL）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'services' AND column_name = 'slug'
  ) THEN
    ALTER TABLE services ADD COLUMN slug TEXT;
  END IF;
END $$;

-- 为 slug 创建索引
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);

-- ========================================
-- STEP 4: UPDATE RLS POLICIES
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
