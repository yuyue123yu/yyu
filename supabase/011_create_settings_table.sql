-- =============================================
-- SETTINGS TABLE (系统设置表)
-- 用于存储网站全局设置，供公共网站和管理系统使用
-- =============================================

-- 创建settings表
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_settings_key ON public.settings(key);

-- 启用RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- RLS策略：允许所有人读取设置（包括未登录用户）
DROP POLICY IF EXISTS "Settings are viewable by everyone" ON public.settings;
CREATE POLICY "Settings are viewable by everyone"
  ON public.settings FOR SELECT
  USING (true);

-- RLS策略：允许所有认证用户更新设置（简化权限，后续可以改为只允许管理员）
DROP POLICY IF EXISTS "Authenticated users can update settings" ON public.settings;
CREATE POLICY "Authenticated users can update settings"
  ON public.settings FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- RLS策略：允许所有认证用户插入设置
DROP POLICY IF EXISTS "Authenticated users can insert settings" ON public.settings;
CREATE POLICY "Authenticated users can insert settings"
  ON public.settings FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 插入默认设置
INSERT INTO public.settings (key, value) VALUES
  ('site', '{"siteName": "马来西亚法律网", "siteDescription": "专业法律咨询平台", "contactEmail": "support@legalmy.com", "contactPhone": "+60 3-1234 5678", "defaultLanguage": "zh"}'::jsonb),
  ('email', '{"emailNotifications": true, "emailNewConsultation": true, "emailNewOrder": true}'::jsonb),
  ('notification', '{"pushNotifications": true, "smsNotifications": false}'::jsonb),
  ('security', '{"requireEmailVerification": false, "twoFactorAuth": false, "sessionTimeout": 30}'::jsonb),
  ('system', '{"maintenanceMode": false, "allowRegistration": true}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 验证
DO $$
BEGIN
  RAISE NOTICE '✅ Settings表创建完成';
  RAISE NOTICE '📊 默认设置已插入';
END $$;
