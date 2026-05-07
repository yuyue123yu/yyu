-- =============================================
-- SETTINGS TABLE (系统设置表)
-- =============================================

CREATE TABLE IF NOT EXISTS public.settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id)
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取设置
CREATE POLICY "Settings are viewable by everyone"
  ON public.settings FOR SELECT
  USING (true);

-- 只允许管理员更新设置
CREATE POLICY "Only admins can update settings"
  ON public.settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- 只允许管理员插入设置
CREATE POLICY "Only admins can insert settings"
  ON public.settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- 插入默认设置
INSERT INTO public.settings (key, value) VALUES
  ('site', '{"siteName": "LegalMY", "siteDescription": "专业法律咨询平台", "contactEmail": "support@legalmy.com", "contactPhone": "+60 3-1234 5678", "defaultLanguage": "zh"}'::jsonb),
  ('email', '{"emailNotifications": true, "emailNewConsultation": true, "emailNewOrder": true}'::jsonb),
  ('notification', '{"pushNotifications": true, "smsNotifications": false}'::jsonb),
  ('security', '{"requireEmailVerification": false, "twoFactorAuth": false, "sessionTimeout": 30}'::jsonb),
  ('system', '{"maintenanceMode": false, "allowRegistration": true}'::jsonb)
ON CONFLICT (key) DO NOTHING;
