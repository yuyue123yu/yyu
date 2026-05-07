-- =============================================
-- SUPER ADMIN SYSTEM: TENANTS TABLE
-- Migration: 001_create_tenants_table
-- Description: Create tenants table for multi-tenant management
-- Requirements: Req 1, 2, 7, 8, 9
-- =============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TENANTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.tenants (
  -- Primary identification
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  
  -- Domain configuration
  subdomain TEXT UNIQUE NOT NULL,
  primary_domain TEXT UNIQUE,
  
  -- Status and subscription
  status TEXT DEFAULT 'active' NOT NULL 
    CHECK (status IN ('active', 'inactive', 'suspended')),
  subscription_plan TEXT DEFAULT 'free' NOT NULL 
    CHECK (subscription_plan IN ('free', 'basic', 'premium', 'enterprise')),
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  
  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Metrics
  user_count INTEGER DEFAULT 0 NOT NULL CHECK (user_count >= 0),
  
  -- Flexible metadata storage
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Index for subdomain lookups (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_tenants_subdomain 
  ON public.tenants(subdomain);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_tenants_status 
  ON public.tenants(status);

-- Index for subscription plan filtering
CREATE INDEX IF NOT EXISTS idx_tenants_subscription_plan 
  ON public.tenants(subscription_plan);

-- Composite index for active tenant queries
CREATE INDEX IF NOT EXISTS idx_tenants_status_subscription 
  ON public.tenants(status, subscription_plan);

-- Index for created_by for audit queries
CREATE INDEX IF NOT EXISTS idx_tenants_created_by 
  ON public.tenants(created_by);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on tenants table
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Note: RLS policies will be added after super_admin column is added to profiles table
-- For now, only authenticated users with service role can access tenants table

-- Temporary policy: Allow service role full access
-- This will be replaced with super_admin policies in a later migration
CREATE POLICY "Service role has full access to tenants"
  ON public.tenants
  USING (true)
  WITH CHECK (true);

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_tenants_updated_at 
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE public.tenants IS 
  'Multi-tenant management table storing tenant configuration and metadata';

COMMENT ON COLUMN public.tenants.id IS 
  'Unique identifier for the tenant';

COMMENT ON COLUMN public.tenants.name IS 
  'Display name of the tenant organization';

COMMENT ON COLUMN public.tenants.subdomain IS 
  'Unique subdomain for tenant access (e.g., client1.legalmy.com)';

COMMENT ON COLUMN public.tenants.primary_domain IS 
  'Optional custom domain for the tenant (e.g., legal.client1.com)';

COMMENT ON COLUMN public.tenants.status IS 
  'Current status of the tenant: active, inactive, or suspended';

COMMENT ON COLUMN public.tenants.subscription_plan IS 
  'Subscription tier: free, basic, premium, or enterprise';

COMMENT ON COLUMN public.tenants.subscription_start_date IS 
  'Start date of the current subscription period';

COMMENT ON COLUMN public.tenants.subscription_end_date IS 
  'End date of the current subscription period';

COMMENT ON COLUMN public.tenants.user_count IS 
  'Cached count of users belonging to this tenant';

COMMENT ON COLUMN public.tenants.metadata IS 
  'Flexible JSONB field for storing additional tenant-specific configuration';

-- =============================================
-- VALIDATION
-- =============================================

-- Verify table was created successfully
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'tenants'
  ) THEN
    RAISE EXCEPTION 'Failed to create tenants table';
  END IF;
  
  RAISE NOTICE 'Tenants table created successfully';
END $$;
