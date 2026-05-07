-- 創建服務表
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- 基本信息
  name_zh TEXT NOT NULL,
  name_en TEXT,
  name_ms TEXT,
  description_zh TEXT,
  description_en TEXT,
  description_ms TEXT,
  
  -- 分類和顯示
  category TEXT NOT NULL, -- debt, family, business, property, criminal, employment, ip
  icon TEXT, -- lucide icon name
  color TEXT DEFAULT 'from-blue-400 to-blue-500', -- gradient color
  
  -- 價格設置
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  premium_price DECIMAL(10,2),
  currency TEXT DEFAULT 'MYR',
  duration_minutes INTEGER DEFAULT 30,
  
  -- 顯示設置
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false, -- 是否推薦
  is_hot BOOLEAN DEFAULT false, -- 是否熱門
  is_new BOOLEAN DEFAULT false, -- 是否新品
  display_order INTEGER DEFAULT 0,
  badge TEXT, -- hot, recommended, new
  
  -- 統計數據
  case_count INTEGER DEFAULT 0, -- 案件數量
  view_count INTEGER DEFAULT 0, -- 瀏覽次數
  
  -- SEO 設置
  seo_title_zh TEXT,
  seo_title_en TEXT,
  seo_title_ms TEXT,
  seo_description_zh TEXT,
  seo_description_en TEXT,
  seo_description_ms TEXT,
  seo_keywords TEXT,
  
  -- 時間戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 約束
  CONSTRAINT services_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- 創建索引
CREATE INDEX IF NOT EXISTS idx_services_tenant_id ON services(tenant_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);

-- 啟用 RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- RLS 策略：允許所有認證用戶訪問（簡化版）
CREATE POLICY "Authenticated users can view services"
  ON services FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update services"
  ON services FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete services"
  ON services FOR DELETE
  TO authenticated
  USING (true);

-- 公開訪問策略（前台頁面）- 允許匿名用戶查看所有服務
-- 過濾邏輯在 API 層面處理
CREATE POLICY "Public can view services"
  ON services FOR SELECT
  TO anon
  USING (true);

-- 創建更新時間觸發器
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

-- 插入默認服務數據（基於當前首頁的服務）
INSERT INTO services (tenant_id, name_zh, name_en, category, icon, color, base_price, case_count, badge, display_order, is_active)
SELECT 
  t.id,
  '債務糾紛',
  'Debt Disputes',
  'debt',
  'Scale',
  'from-amber-400 to-amber-500',
  150,
  2850,
  'hot',
  1,
  true
FROM tenants t
WHERE t.status = 'active'
ON CONFLICT DO NOTHING;

INSERT INTO services (tenant_id, name_zh, name_en, category, icon, color, base_price, case_count, display_order, is_active)
SELECT 
  t.id,
  '家庭法律',
  'Family Law',
  'family',
  'Users',
  'from-blue-400 to-blue-500',
  150,
  2340,
  2,
  true
FROM tenants t
WHERE t.status = 'active'
ON CONFLICT DO NOTHING;

INSERT INTO services (tenant_id, name_zh, name_en, category, icon, color, base_price, case_count, badge, display_order, is_active)
SELECT 
  t.id,
  '商業法律',
  'Business Law',
  'business',
  'Briefcase',
  'from-purple-400 to-purple-500',
  200,
  1890,
  'recommended',
  3,
  true
FROM tenants t
WHERE t.status = 'active'
ON CONFLICT DO NOTHING;

INSERT INTO services (tenant_id, name_zh, name_en, category, icon, color, base_price, case_count, badge, display_order, is_active)
SELECT 
  t.id,
  '房產法律',
  'Property Law',
  'property',
  'Home',
  'from-green-400 to-green-500',
  150,
  3120,
  'hot',
  4,
  true
FROM tenants t
WHERE t.status = 'active'
ON CONFLICT DO NOTHING;

INSERT INTO services (tenant_id, name_zh, name_en, category, icon, color, base_price, case_count, display_order, is_active)
SELECT 
  t.id,
  '刑事辯護',
  'Criminal Defense',
  'criminal',
  'Shield',
  'from-red-400 to-red-500',
  500,
  980,
  NULL,
  5,
  true
FROM tenants t
WHERE t.status = 'active'
ON CONFLICT DO NOTHING;

INSERT INTO services (tenant_id, name_zh, name_en, category, icon, color, base_price, case_count, display_order, is_active)
SELECT 
  t.id,
  '勞動法律',
  'Employment Law',
  'employment',
  'TrendingUp',
  'from-orange-400 to-orange-500',
  180,
  1560,
  NULL,
  6,
  true
FROM tenants t
WHERE t.status = 'active'
ON CONFLICT DO NOTHING;

INSERT INTO services (tenant_id, name_zh, name_en, category, icon, color, base_price, case_count, badge, display_order, is_active)
SELECT 
  t.id,
  '知識產權',
  'Intellectual Property',
  'ip',
  'Briefcase',
  'from-indigo-400 to-indigo-500',
  250,
  890,
  'new',
  7,
  true
FROM tenants t
WHERE t.status = 'active'
ON CONFLICT DO NOTHING;

COMMENT ON TABLE services IS '服務管理表 - 存儲所有法律服務的信息、價格和顯示設置';
COMMENT ON COLUMN services.tenant_id IS '租戶ID';
COMMENT ON COLUMN services.name_zh IS '服務名稱（繁體中文）';
COMMENT ON COLUMN services.base_price IS '基礎價格';
COMMENT ON COLUMN services.display_order IS '顯示順序（數字越小越靠前）';
