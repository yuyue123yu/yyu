-- ========================================
-- PERFORMANCE OPTIMIZATION: ADD INDEXES
-- 安全版本 - 只为存在的字段创建索引
-- ========================================

-- ========================================
-- SERVICES TABLE INDEXES
-- ========================================

-- 基本索引（这些字段肯定存在）
CREATE INDEX IF NOT EXISTS idx_services_tenant_id ON services(tenant_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);

-- 复合索引
CREATE INDEX IF NOT EXISTS idx_services_tenant_active_order 
ON services(tenant_id, is_active, display_order);

-- ========================================
-- PROFILES TABLE INDEXES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_profiles_tenant_id ON profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);

-- ========================================
-- TENANT_SETTINGS TABLE INDEXES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_tenant_settings_tenant_id ON tenant_settings(tenant_id);

-- ========================================
-- TENANTS TABLE INDEXES
-- ========================================

-- 这些索引可能已经在 001 中创建了，使用 IF NOT EXISTS 确保安全
CREATE INDEX IF NOT EXISTS idx_tenants_subdomain ON tenants(subdomain);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);

-- 新增：primary_domain 索引（用于自定义域名识别）
CREATE INDEX IF NOT EXISTS idx_tenants_primary_domain ON tenants(primary_domain);

-- ========================================
-- ANALYZE TABLES
-- ========================================

ANALYZE services;
ANALYZE profiles;
ANALYZE tenant_settings;
ANALYZE tenants;
