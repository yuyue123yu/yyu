-- ========================================
-- PERFORMANCE OPTIMIZATION: ADD INDEXES
-- 简化版本 - 只创建索引，不包含复杂逻辑
-- ========================================

-- ========================================
-- SERVICES TABLE INDEXES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_services_tenant_id ON services(tenant_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);
CREATE INDEX IF NOT EXISTS idx_services_deleted_at ON services(deleted_at);
CREATE INDEX IF NOT EXISTS idx_services_tenant_active_order ON services(tenant_id, is_active, display_order) WHERE deleted_at IS NULL;

-- ========================================
-- PROFILES TABLE INDEXES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_profiles_tenant_id ON profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_super_admin ON profiles(super_admin) WHERE super_admin = TRUE;

-- ========================================
-- TENANT_SETTINGS TABLE INDEXES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_tenant_settings_tenant_id ON tenant_settings(tenant_id);

-- ========================================
-- TENANTS TABLE INDEXES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_tenants_primary_domain ON tenants(primary_domain);

-- ========================================
-- ANALYZE TABLES
-- ========================================

ANALYZE services;
ANALYZE profiles;
ANALYZE tenant_settings;
ANALYZE tenants;
