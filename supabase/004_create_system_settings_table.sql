-- =============================================
-- SUPER ADMIN SYSTEM: SYSTEM SETTINGS TABLE
-- Migration: 004_create_system_settings_table
-- Description: Create system_settings table for global configuration across all tenants
-- Requirements: Req 9 (System-Level Configuration)
-- =============================================

-- =============================================
-- SYSTEM SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.system_settings (
  -- Primary identification
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Setting key-value pair
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  
  -- Documentation
  description TEXT,
  
  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Index for setting_key lookups (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_system_settings_key 
  ON public.system_settings(setting_key);

-- Index for updated_by for audit queries
CREATE INDEX IF NOT EXISTS idx_system_settings_updated_by 
  ON public.system_settings(updated_by);

-- GIN index for JSONB queries on setting_value
CREATE INDEX IF NOT EXISTS idx_system_settings_value_gin 
  ON public.system_settings USING GIN (setting_value);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on system_settings table
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Service role has full access to system_settings" ON public.system_settings;

-- Temporary policy: Allow service role full access
-- This will be replaced with super_admin policies in a later migration
CREATE POLICY "Service role has full access to system_settings"
  ON public.system_settings
  USING (true)
  WITH CHECK (true);

-- =============================================
-- TRIGGERS
-- =============================================

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_system_settings_updated_at ON public.system_settings;

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_system_settings_updated_at 
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE public.system_settings IS 
  'Stores global system-level configuration that applies across all tenants including maintenance mode, feature flags, API rate limits, and default OEM configuration';

COMMENT ON COLUMN public.system_settings.id IS 
  'Unique identifier for the setting record';

COMMENT ON COLUMN public.system_settings.setting_key IS 
  'Unique configuration key (e.g., maintenance_mode, feature_flags, api_rate_limits)';

COMMENT ON COLUMN public.system_settings.setting_value IS 
  'JSONB value storing the configuration data for flexible schema';

COMMENT ON COLUMN public.system_settings.description IS 
  'Human-readable description of what this setting controls';

COMMENT ON COLUMN public.system_settings.created_at IS 
  'Timestamp when the setting was first created';

COMMENT ON COLUMN public.system_settings.updated_at IS 
  'Timestamp when the setting was last updated';

COMMENT ON COLUMN public.system_settings.updated_by IS 
  'Foreign key to auth.users - the super admin who last updated this setting';

-- =============================================
-- DEFAULT SYSTEM SETTINGS FUNCTION
-- =============================================

-- Function to initialize default system settings
CREATE OR REPLACE FUNCTION initialize_default_system_settings()
RETURNS void AS $$
BEGIN
  -- Insert default maintenance mode settings
  INSERT INTO public.system_settings (setting_key, setting_value, description)
  VALUES (
    'maintenance_mode',
    jsonb_build_object(
      'enabled', false,
      'message', 'System is currently under maintenance. Please check back later.'
    ),
    'Controls system-wide maintenance mode that affects all tenants'
  )
  ON CONFLICT (setting_key) DO NOTHING;
  
  -- Insert default feature flags
  INSERT INTO public.system_settings (setting_key, setting_value, description)
  VALUES (
    'feature_flags',
    jsonb_build_object(
      'multi_tenant_enabled', true,
      'audit_logging_enabled', true,
      'password_reset_enabled', true,
      'user_migration_enabled', true,
      'api_access_enabled', true
    ),
    'Global feature flags that control platform-wide functionality'
  )
  ON CONFLICT (setting_key) DO NOTHING;
  
  -- Insert default API rate limits
  INSERT INTO public.system_settings (setting_key, setting_value, description)
  VALUES (
    'api_rate_limits',
    jsonb_build_object(
      'default', 100,
      'premium', 1000,
      'enterprise', 10000,
      'window_seconds', 60
    ),
    'API rate limits per subscription tier (requests per window)'
  )
  ON CONFLICT (setting_key) DO NOTHING;
  
  -- Insert default OEM configuration template
  INSERT INTO public.system_settings (setting_key, setting_value, description)
  VALUES (
    'default_oem_config',
    jsonb_build_object(
      'branding', jsonb_build_object(
        'siteName', 'LegalMY',
        'logo', '',
        'favicon', '',
        'primaryColor', '#1e40af',
        'secondaryColor', '#64748b',
        'accentColor', '#f59e0b'
      ),
      'features', jsonb_build_object(
        'ecommerce', true,
        'templates', true,
        'articles', true,
        'consultations', true,
        'reviews', true
      ),
      'languages', jsonb_build_object(
        'default', 'en',
        'enabled', jsonb_build_array('en', 'zh', 'ms')
      ),
      'business', jsonb_build_object(
        'currency', 'MYR',
        'timezone', 'Asia/Kuala_Lumpur',
        'consultationPricing', jsonb_build_object(
          'min', 100,
          'max', 5000
        )
      ),
      'email', jsonb_build_object(
        'fromName', 'LegalMY',
        'fromEmail', 'noreply@legalmy.com',
        'replyTo', 'support@legalmy.com'
      )
    ),
    'Default OEM configuration template used when creating new tenants'
  )
  ON CONFLICT (setting_key) DO NOTHING;
  
  -- Insert default email templates
  INSERT INTO public.system_settings (setting_key, setting_value, description)
  VALUES (
    'email_templates',
    jsonb_build_object(
      'welcome', 'Welcome to {{siteName}}! Your account has been created.',
      'password_reset', 'Click here to reset your password: {{resetLink}}',
      'tenant_created', 'Your tenant {{tenantName}} has been successfully created.',
      'subscription_expiring', 'Your subscription will expire on {{expiryDate}}.'
    ),
    'System email templates with variable placeholders'
  )
  ON CONFLICT (setting_key) DO NOTHING;
  
  -- Insert default backup schedule
  INSERT INTO public.system_settings (setting_key, setting_value, description)
  VALUES (
    'backup_schedule',
    jsonb_build_object(
      'frequency', 'daily',
      'retention_days', 30,
      'time', '02:00',
      'enabled', true
    ),
    'Automated backup schedule and retention policy'
  )
  ON CONFLICT (setting_key) DO NOTHING;
  
  -- Insert default security settings
  INSERT INTO public.system_settings (setting_key, setting_value, description)
  VALUES (
    'security_settings',
    jsonb_build_object(
      'mfa_required', false,
      'session_timeout', 3600,
      'password_min_length', 8,
      'password_require_special', true,
      'max_login_attempts', 5,
      'lockout_duration', 900
    ),
    'Global security and authentication settings'
  )
  ON CONFLICT (setting_key) DO NOTHING;
  
  RAISE NOTICE 'Default system settings initialized';
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION initialize_default_system_settings() IS 
  'Initializes default system-level configuration settings for the platform';

-- =============================================
-- INITIALIZE DEFAULT SETTINGS
-- =============================================

-- Run the initialization function
SELECT initialize_default_system_settings();

-- =============================================
-- VALIDATION
-- =============================================

-- Verify table was created successfully
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'system_settings'
  ) THEN
    RAISE EXCEPTION 'Failed to create system_settings table';
  END IF;
  
  -- Verify unique constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_type = 'UNIQUE'
    AND table_schema = 'public'
    AND table_name = 'system_settings'
    AND constraint_name LIKE '%setting_key%'
  ) THEN
    RAISE EXCEPTION 'Unique constraint on setting_key not found';
  END IF;
  
  -- Verify default settings were inserted
  IF (SELECT COUNT(*) FROM public.system_settings) < 7 THEN
    RAISE EXCEPTION 'Default system settings were not initialized properly';
  END IF;
  
  RAISE NOTICE 'System settings table created successfully';
  RAISE NOTICE 'Unique constraint on setting_key verified';
  RAISE NOTICE 'Indexes created: idx_system_settings_key, idx_system_settings_value_gin';
  RAISE NOTICE 'Default settings initialized: maintenance_mode, feature_flags, api_rate_limits, default_oem_config, email_templates, backup_schedule, security_settings';
END $$;
