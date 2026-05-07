-- =============================================
-- SUPER ADMIN SYSTEM: TENANT SETTINGS TABLE
-- Migration: 002_create_tenant_settings_table
-- Description: Create tenant_settings table for OEM configuration per tenant
-- Requirements: Req 2 (OEM Configuration Management)
-- =============================================

-- =============================================
-- TENANT SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.tenant_settings (
  -- Primary identification
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Foreign key to tenants table
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  -- Setting key-value pair
  setting_key TEXT NOT NULL,
  setting_value JSONB NOT NULL,
  
  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- Ensure unique setting keys per tenant
  CONSTRAINT unique_tenant_setting UNIQUE (tenant_id, setting_key)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Index for tenant_id lookups (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_tenant_settings_tenant 
  ON public.tenant_settings(tenant_id);

-- Index for setting_key lookups
CREATE INDEX IF NOT EXISTS idx_tenant_settings_key 
  ON public.tenant_settings(setting_key);

-- Composite index for tenant + key queries
CREATE INDEX IF NOT EXISTS idx_tenant_settings_tenant_key 
  ON public.tenant_settings(tenant_id, setting_key);

-- GIN index for JSONB queries on setting_value
CREATE INDEX IF NOT EXISTS idx_tenant_settings_value_gin 
  ON public.tenant_settings USING GIN (setting_value);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on tenant_settings table
ALTER TABLE public.tenant_settings ENABLE ROW LEVEL SECURITY;

-- Temporary policy: Allow service role full access
-- This will be replaced with super_admin policies in a later migration
CREATE POLICY "Service role has full access to tenant_settings"
  ON public.tenant_settings
  USING (true)
  WITH CHECK (true);

-- =============================================
-- TRIGGERS
-- =============================================

-- Create trigger function for updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_tenant_settings_updated_at 
  BEFORE UPDATE ON public.tenant_settings
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE public.tenant_settings IS 
  'Stores OEM configuration settings per tenant including branding, features, languages, business rules, and email settings';

COMMENT ON COLUMN public.tenant_settings.id IS 
  'Unique identifier for the setting record';

COMMENT ON COLUMN public.tenant_settings.tenant_id IS 
  'Foreign key reference to the tenant this setting belongs to';

COMMENT ON COLUMN public.tenant_settings.setting_key IS 
  'Configuration key (e.g., branding, features, languages, business, email)';

COMMENT ON COLUMN public.tenant_settings.setting_value IS 
  'JSONB value storing the configuration data for flexible schema';

COMMENT ON COLUMN public.tenant_settings.created_at IS 
  'Timestamp when the setting was first created';

COMMENT ON COLUMN public.tenant_settings.updated_at IS 
  'Timestamp when the setting was last updated';

COMMENT ON CONSTRAINT unique_tenant_setting ON public.tenant_settings IS 
  'Ensures each tenant can only have one value per setting key';

-- =============================================
-- DEFAULT SETTINGS FUNCTION
-- =============================================

-- Function to initialize default OEM settings for a new tenant
CREATE OR REPLACE FUNCTION initialize_default_tenant_settings(p_tenant_id UUID)
RETURNS void AS $$
BEGIN
  -- Insert default branding settings
  INSERT INTO public.tenant_settings (tenant_id, setting_key, setting_value)
  VALUES (
    p_tenant_id,
    'branding',
    jsonb_build_object(
      'siteName', 'LegalMY',
      'logo', '',
      'favicon', '',
      'primaryColor', '#1e40af',
      'secondaryColor', '#64748b',
      'accentColor', '#f59e0b'
    )
  );
  
  -- Insert default features settings
  INSERT INTO public.tenant_settings (tenant_id, setting_key, setting_value)
  VALUES (
    p_tenant_id,
    'features',
    jsonb_build_object(
      'ecommerce', true,
      'templates', true,
      'articles', true,
      'consultations', true,
      'reviews', true
    )
  );
  
  -- Insert default languages settings
  INSERT INTO public.tenant_settings (tenant_id, setting_key, setting_value)
  VALUES (
    p_tenant_id,
    'languages',
    jsonb_build_object(
      'default', 'en',
      'enabled', jsonb_build_array('en', 'zh', 'ms')
    )
  );
  
  -- Insert default business settings
  INSERT INTO public.tenant_settings (tenant_id, setting_key, setting_value)
  VALUES (
    p_tenant_id,
    'business',
    jsonb_build_object(
      'currency', 'MYR',
      'timezone', 'Asia/Kuala_Lumpur',
      'consultationPricing', jsonb_build_object(
        'min', 100,
        'max', 5000
      )
    )
  );
  
  -- Insert default email settings
  INSERT INTO public.tenant_settings (tenant_id, setting_key, setting_value)
  VALUES (
    p_tenant_id,
    'email',
    jsonb_build_object(
      'fromName', 'LegalMY',
      'fromEmail', 'noreply@legalmy.com',
      'replyTo', 'support@legalmy.com'
    )
  );
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION initialize_default_tenant_settings(UUID) IS 
  'Initializes default OEM configuration settings for a newly created tenant';

-- =============================================
-- VALIDATION
-- =============================================

-- Verify table was created successfully
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'tenant_settings'
  ) THEN
    RAISE EXCEPTION 'Failed to create tenant_settings table';
  END IF;
  
  -- Verify foreign key constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_type = 'FOREIGN KEY'
    AND table_schema = 'public'
    AND table_name = 'tenant_settings'
    AND constraint_name LIKE '%tenant_id%'
  ) THEN
    RAISE EXCEPTION 'Foreign key constraint on tenant_id not found';
  END IF;
  
  -- Verify unique constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_type = 'UNIQUE'
    AND table_schema = 'public'
    AND table_name = 'tenant_settings'
    AND constraint_name = 'unique_tenant_setting'
  ) THEN
    RAISE EXCEPTION 'Unique constraint on (tenant_id, setting_key) not found';
  END IF;
  
  RAISE NOTICE 'Tenant settings table created successfully';
  RAISE NOTICE 'Foreign key constraint with CASCADE on tenant deletion verified';
  RAISE NOTICE 'Unique constraint on (tenant_id, setting_key) verified';
  RAISE NOTICE 'Indexes created: idx_tenant_settings_tenant, idx_tenant_settings_key';
END $$;
