-- 步驟 1: 檢查 services 表是否存在
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'services'
) AS table_exists;

-- 步驟 2: 如果表存在，查看表結構
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'services'
ORDER BY ordinal_position;

-- 步驟 3: 刪除舊表（如果存在）
DROP TABLE IF EXISTS services CASCADE;

-- 步驟 4: 重新創建表
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  name_zh TEXT NOT NULL,
  name_en TEXT,
  name_ms TEXT,
  description_zh TEXT,
  description_en TEXT,
  description_ms TEXT,
  
  category TEXT NOT NULL,
  icon TEXT,
  color TEXT DEFAULT 'from-blue-400 to-blue-500',
  
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  premium_price DECIMAL(10,2),
  currency TEXT DEFAULT 'MYR',
  duration_minutes INTEGER DEFAULT 30,
  
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_hot BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  badge TEXT,
  
  case_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  seo_title_zh TEXT,
  seo_title_en TEXT,
  seo_title_ms TEXT,
  seo_description_zh TEXT,
  seo_description_en TEXT,
  seo_description_ms TEXT,
  seo_keywords TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 步驟 5: 創建索引
CREATE INDEX idx_services_tenant_id ON services(tenant_id);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_services_display_order ON services(display_order);

-- 步驟 6: 啟用 RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- 步驟 7: 創建 RLS 策略
CREATE POLICY "Authenticated users can manage services"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can view services"
  ON services FOR SELECT
  TO anon
  USING (true);

-- 步驟 8: 創建觸發器
CREATE OR REPLACE FUNCTION update_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_services_updated_at();

-- 步驟 9: 插入默認數據
INSERT INTO services (tenant_id, name_zh, name_en, category, icon, color, base_price, case_count, badge, display_order, is_active)
SELECT 
  t.id, '債務糾紛', 'Debt Disputes', 'debt', 'Scale', 'from-amber-400 to-amber-500', 150, 2850, 'hot', 1, true
FROM tenants t WHERE t.status = 'active' LIMIT 1;

INSERT INTO services (tenant_id, name_zh, name_en, category, icon, color, base_price, case_count, display_order, is_active)
SELECT 
  t.id, '家庭法律', 'Family Law', 'family', 'Users', 'from-blue-400 to-blue-500', 150, 2340, 2, true
FROM tenants t WHERE t.status = 'active' LIMIT 1;

INSERT INTO services (tenant_id, name_zh, name_en, category, icon, color, base_price, case_count, badge, display_order, is_active)
SELECT 
  t.id, '商業法律', 'Business Law', 'business', 'Briefcase', 'from-purple-400 to-purple-500', 200, 1890, 'recommended', 3, true
FROM tenants t WHERE t.status = 'active' LIMIT 1;

INSERT INTO services (tenant_id, name_zh, name_en, category, icon, color, base_price, case_count, badge, display_order, is_active)
SELECT 
  t.id, '房產法律', 'Property Law', 'property', 'Home', 'from-green-400 to-green-500', 150, 3120, 'hot', 4, true
FROM tenants t WHERE t.status = 'active' LIMIT 1;

INSERT INTO services (tenant_id, name_zh, name_en, category, icon, color, base_price, case_count, display_order, is_active)
SELECT 
  t.id, '刑事辯護', 'Criminal Defense', 'criminal', 'Shield', 'from-red-400 to-red-500', 500, 980, 5, true
FROM tenants t WHERE t.status = 'active' LIMIT 1;

INSERT INTO services (tenant_id, name_zh, name_en, category, icon, color, base_price, case_count, display_order, is_active)
SELECT 
  t.id, '勞動法律', 'Employment Law', 'employment', 'TrendingUp', 'from-orange-400 to-orange-500', 180, 1560, 6, true
FROM tenants t WHERE t.status = 'active' LIMIT 1;

INSERT INTO services (tenant_id, name_zh, name_en, category, icon, color, base_price, case_count, badge, display_order, is_active)
SELECT 
  t.id, '知識產權', 'Intellectual Property', 'ip', 'Briefcase', 'from-indigo-400 to-indigo-500', 250, 890, 'new', 7, true
FROM tenants t WHERE t.status = 'active' LIMIT 1;

-- 步驟 10: 驗證數據
SELECT COUNT(*) as total_services FROM services;
SELECT * FROM services ORDER BY display_order;
