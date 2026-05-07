-- =============================================
-- 快速创建SETTINGS表
-- 复制此SQL到Supabase SQL Editor执行
-- =============================================

-- 1. 创建settings表
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_settings_key ON public.settings(key);

-- 3. 启用RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 4. 删除旧策略（如果存在）
DROP POLICY IF EXISTS "Settings are viewable by everyone" ON public.settings;
DROP POLICY IF EXISTS "Authenticated users can update settings" ON public.settings;
DROP POLICY IF EXISTS "Authenticated users can insert settings" ON public.settings;
DROP POLICY IF EXISTS "Only admins can update settings" ON public.settings;
DROP POLICY IF EXISTS "Only admins can insert settings" ON public.settings;

-- 5. 创建新策略：允许所有人读取
CREATE POLICY "Settings are viewable by everyone"
  ON public.settings FOR SELECT
  USING (true);

-- 6. 创建新策略：允许认证用户更新
CREATE POLICY "Authenticated users can update settings"
  ON public.settings FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- 7. 创建新策略：允许认证用户插入
CREATE POLICY "Authenticated users can insert settings"
  ON public.settings FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 8. 插入默认设置
INSERT INTO public.settings (key, value) VALUES
  ('site', '{"siteName": "马来西亚法律网", "siteDescription": "专业法律咨询平台", "contactEmail": "support@legalmy.com", "contactPhone": "+60 3-1234 5678", "defaultLanguage": "zh"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

INSERT INTO public.settings (key, value) VALUES
  ('email', '{"emailNotifications": true, "emailNewConsultation": true, "emailNewOrder": true}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value) VALUES
  ('notification', '{"pushNotifications": true, "smsNotifications": false}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value) VALUES
  ('security', '{"requireEmailVerification": false, "twoFactorAuth": false, "sessionTimeout": 30}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value) VALUES
  ('system', '{"maintenanceMode": false, "allowRegistration": true}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 9. 验证
SELECT 
  '✅ Settings表创建成功' as status,
  COUNT(*) as record_count
FROM public.settings;

-- 10. 显示所有设置
SELECT * FROM public.settings ORDER BY key;
