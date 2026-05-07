-- ========================================
-- SOFT DELETE: ADD deleted_at COLUMN
-- Migration: 015_add_soft_delete
-- Description: Add soft delete support to key tables
-- ========================================

-- ========================================
-- ADD deleted_at COLUMN
-- ========================================

-- Services table
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Tenant settings table
ALTER TABLE tenant_settings 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Profiles table (optional, for user deactivation)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- ========================================
-- ADD INDEXES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_services_deleted_at 
ON services(deleted_at);

CREATE INDEX IF NOT EXISTS idx_tenant_settings_deleted_at 
ON tenant_settings(deleted_at);

CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at 
ON profiles(deleted_at);

-- ========================================
-- UPDATE RLS POLICIES
-- ========================================

-- Drop existing policies
DROP POLICY IF EXISTS "公开读取活跃服务" ON services;
DROP POLICY IF EXISTS "管理员可以管理自己租户的服务" ON services;

-- Recreate policies with soft delete check
CREATE POLICY "公开读取活跃服务"
ON services FOR SELECT
USING (
  is_active = TRUE 
  AND deleted_at IS NULL
);

CREATE POLICY "管理员可以管理自己租户的服务"
ON services FOR ALL
USING (
  tenant_id IN (
    SELECT tenant_id FROM profiles WHERE id = auth.uid()
  )
  AND deleted_at IS NULL
);

-- ========================================
-- CREATE HELPER FUNCTIONS
-- ========================================

-- Function to soft delete a service
CREATE OR REPLACE FUNCTION soft_delete_service(service_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE services
  SET deleted_at = NOW()
  WHERE id = service_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to restore a soft deleted service
CREATE OR REPLACE FUNCTION restore_service(service_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE services
  SET deleted_at = NULL
  WHERE id = service_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to permanently delete old soft deleted records
CREATE OR REPLACE FUNCTION cleanup_old_deleted_records(days_old INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete services older than specified days
  DELETE FROM services
  WHERE deleted_at IS NOT NULL
  AND deleted_at < NOW() - (days_old || ' days')::INTERVAL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON COLUMN services.deleted_at IS 
'Soft delete timestamp. NULL means not deleted.';

COMMENT ON COLUMN tenant_settings.deleted_at IS 
'Soft delete timestamp. NULL means not deleted.';

COMMENT ON COLUMN profiles.deleted_at IS 
'Soft delete timestamp for user deactivation. NULL means active.';

COMMENT ON FUNCTION soft_delete_service(UUID) IS 
'Soft delete a service by setting deleted_at timestamp';

COMMENT ON FUNCTION restore_service(UUID) IS 
'Restore a soft deleted service by clearing deleted_at';

COMMENT ON FUNCTION cleanup_old_deleted_records(INTEGER) IS 
'Permanently delete records that have been soft deleted for more than specified days';

-- ========================================
-- VERIFICATION
-- ========================================

DO $$
BEGIN
  -- Check if columns were added
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'deleted_at'
  ) THEN
    RAISE NOTICE 'Soft delete columns added successfully';
  ELSE
    RAISE EXCEPTION 'Failed to add soft delete columns';
  END IF;
END $$;

RAISE NOTICE 'Soft delete migration completed successfully';
