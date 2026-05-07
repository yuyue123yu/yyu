-- ========================================
-- PERFORMANCE OPTIMIZATION: ADD INDEXES
-- Migration: 014_add_performance_indexes
-- Description: Add indexes for better query performance
-- ========================================

-- ========================================
-- SERVICES TABLE INDEXES
-- ========================================

-- Tenant ID index (most common query)
CREATE INDEX IF NOT EXISTS idx_services_tenant_id 
ON services(tenant_id);

-- Active services index
CREATE INDEX IF NOT EXISTS idx_services_active 
ON services(is_active);

-- Slug index for SEO URLs
CREATE INDEX IF NOT EXISTS idx_services_slug 
ON services(slug);

-- Category index for filtering
CREATE INDEX IF NOT EXISTS idx_services_category 
ON services(category);

-- Display order index for sorting
CREATE INDEX IF NOT EXISTS idx_services_display_order 
ON services(display_order);

-- Soft delete index
CREATE INDEX IF NOT EXISTS idx_services_deleted_at 
ON services(deleted_at);

-- Composite index for common query pattern
CREATE INDEX IF NOT EXISTS idx_services_tenant_active_order 
ON services(tenant_id, is_active, display_order) 
WHERE deleted_at IS NULL;

-- ========================================
-- PROFILES TABLE INDEXES
-- ========================================

-- Tenant ID index
CREATE INDEX IF NOT EXISTS idx_profiles_tenant_id 
ON profiles(tenant_id);

-- Email index for login
CREATE INDEX IF NOT EXISTS idx_profiles_email 
ON profiles(email);

-- User type index for filtering
CREATE INDEX IF NOT EXISTS idx_profiles_user_type 
ON profiles(user_type);

-- Super admin index
CREATE INDEX IF NOT EXISTS idx_profiles_super_admin 
ON profiles(super_admin) 
WHERE super_admin = TRUE;

-- ========================================
-- TENANT_SETTINGS TABLE INDEXES
-- ========================================

-- Tenant ID index (unique, but explicit for clarity)
CREATE INDEX IF NOT EXISTS idx_tenant_settings_tenant_id 
ON tenant_settings(tenant_id);

-- ========================================
-- TENANTS TABLE INDEXES
-- ========================================
-- (Already created in 001_create_tenants_table.sql)
-- - idx_tenants_subdomain
-- - idx_tenants_status
-- - idx_tenants_subscription_plan
-- - idx_tenants_status_subscription
-- - idx_tenants_created_by

-- Add primary_domain index if not exists
CREATE INDEX IF NOT EXISTS idx_tenants_primary_domain 
ON tenants(primary_domain);

-- ========================================
-- AUDIT_LOGS TABLE INDEXES (if exists)
-- ========================================

-- Check if audit_logs table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'audit_logs'
  ) THEN
    -- Tenant ID index
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
    
    RAISE NOTICE 'Audit logs indexes created successfully';
  ELSE
    RAISE NOTICE 'Audit logs table does not exist, skipping indexes';
  END IF;
END $$;

-- ========================================
-- VERIFICATION
-- ========================================

-- List all indexes on services table
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'services'
ORDER BY indexname;

-- List all indexes on profiles table
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'profiles'
ORDER BY indexname;

-- ========================================
-- ANALYZE TABLES
-- ========================================

-- Update table statistics for query planner
ANALYZE services;
ANALYZE profiles;
ANALYZE tenant_settings;
ANALYZE tenants;

-- ========================================
-- COMPLETION MESSAGE
-- ========================================

DO $$
BEGIN
  RAISE NOTICE 'Performance indexes created successfully';
END $$;
