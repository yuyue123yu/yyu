-- =============================================
-- SUPER ADMIN SYSTEM: ADD TENANT COLUMNS
-- Migration: 006_add_tenant_columns
-- Description: Add tenant_id and super_admin columns to existing tables
-- Requirements: Req 7 (Data Isolation and Tenant Scoping)
-- =============================================

-- This migration adds multi-tenant support to existing tables by:
-- 1. Adding tenant_id column to profiles table
-- 2. Adding super_admin column to profiles table
-- 3. Adding tenant_id to all tenant-scoped tables
-- 4. Creating indexes on all tenant_id columns
-- 5. Adding foreign key constraints

-- =============================================
-- PREREQUISITE: Ensure tenants table exists
-- =============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'tenants'
  ) THEN
    RAISE EXCEPTION 'Tenants table must exist before running this migration. Run 001_create_tenants_table.sql first.';
  END IF;
END $$;

-- =============================================
-- STEP 1: CREATE DEFAULT TENANT (if not exists)
-- =============================================
-- This ensures existing data can be migrated to a default tenant
DO $$
DECLARE
  default_tenant_id UUID;
BEGIN
  -- Check if a default tenant already exists
  SELECT id INTO default_tenant_id 
  FROM public.tenants 
  WHERE subdomain = 'default' 
  LIMIT 1;
  
  -- Create default tenant if it doesn't exist
  IF default_tenant_id IS NULL THEN
    INSERT INTO public.tenants (
      name,
      subdomain,
      status,
      subscription_plan,
      metadata
    ) VALUES (
      'Default Tenant',
      'default',
      'active',
      'enterprise',
      '{"is_default": true, "created_by_migration": true}'::jsonb
    )
    RETURNING id INTO default_tenant_id;
    
    RAISE NOTICE 'Created default tenant with id: %', default_tenant_id;
  ELSE
    RAISE NOTICE 'Default tenant already exists with id: %', default_tenant_id;
  END IF;
END $$;

-- =============================================
-- STEP 2: MODIFY PROFILES TABLE
-- =============================================
-- Add tenant_id and super_admin columns to profiles table

-- 2.1: Add tenant_id column
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS tenant_id UUID;

-- 2.2: Add super_admin column
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS super_admin BOOLEAN DEFAULT false;

-- 2.3: Set default tenant_id for existing profiles (if any)
DO $$
DECLARE
  default_tenant_id UUID;
BEGIN
  SELECT id INTO default_tenant_id 
  FROM public.tenants 
  WHERE subdomain = 'default' 
  LIMIT 1;
  
  IF default_tenant_id IS NOT NULL THEN
    UPDATE public.profiles 
    SET tenant_id = default_tenant_id 
    WHERE tenant_id IS NULL;
    
    RAISE NOTICE 'Updated existing profiles with default tenant_id';
  END IF;
END $$;

-- 2.4: Add foreign key constraint for tenant_id
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_tenant_id_fkey;

ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_tenant_id_fkey 
  FOREIGN KEY (tenant_id) 
  REFERENCES public.tenants(id) 
  ON DELETE CASCADE;

-- 2.5: Create indexes on profiles
DROP INDEX IF EXISTS idx_profiles_tenant;
CREATE INDEX idx_profiles_tenant ON public.profiles(tenant_id);

DROP INDEX IF EXISTS idx_profiles_super_admin;
CREATE INDEX idx_profiles_super_admin ON public.profiles(super_admin) 
  WHERE super_admin = true;

-- Add comments
COMMENT ON COLUMN public.profiles.tenant_id IS 
  'Foreign key to tenants table - isolates user data by tenant';

COMMENT ON COLUMN public.profiles.super_admin IS 
  'Flag indicating if user has super admin privileges across all tenants';

DO $$
BEGIN
  RAISE NOTICE 'Profiles table updated with tenant_id and super_admin columns';
END $$;

-- =============================================
-- STEP 3: ADD TENANT_ID TO LAWYERS TABLE
-- =============================================

-- 3.1: Add tenant_id column
ALTER TABLE public.lawyers 
  ADD COLUMN IF NOT EXISTS tenant_id UUID;

-- 3.2: Set default tenant_id for existing lawyers
DO $$
DECLARE
  default_tenant_id UUID;
BEGIN
  SELECT id INTO default_tenant_id 
  FROM public.tenants 
  WHERE subdomain = 'default' 
  LIMIT 1;
  
  IF default_tenant_id IS NOT NULL THEN
    UPDATE public.lawyers 
    SET tenant_id = default_tenant_id 
    WHERE tenant_id IS NULL;
    
    RAISE NOTICE 'Updated existing lawyers with default tenant_id';
  END IF;
END $$;

-- 3.3: Add foreign key constraint
ALTER TABLE public.lawyers 
  DROP CONSTRAINT IF EXISTS lawyers_tenant_id_fkey;

ALTER TABLE public.lawyers 
  ADD CONSTRAINT lawyers_tenant_id_fkey 
  FOREIGN KEY (tenant_id) 
  REFERENCES public.tenants(id) 
  ON DELETE CASCADE;

-- 3.4: Create index
DROP INDEX IF EXISTS idx_lawyers_tenant;
CREATE INDEX idx_lawyers_tenant ON public.lawyers(tenant_id);

COMMENT ON COLUMN public.lawyers.tenant_id IS 
  'Foreign key to tenants table - isolates lawyer data by tenant';

DO $$
BEGIN
  RAISE NOTICE 'Lawyers table updated with tenant_id column';
END $$;

-- =============================================
-- STEP 4: ADD TENANT_ID TO CONSULTATIONS TABLE
-- =============================================

-- 4.1: Add tenant_id column
ALTER TABLE public.consultations 
  ADD COLUMN IF NOT EXISTS tenant_id UUID;

-- 4.2: Set default tenant_id for existing consultations
DO $$
DECLARE
  default_tenant_id UUID;
BEGIN
  SELECT id INTO default_tenant_id 
  FROM public.tenants 
  WHERE subdomain = 'default' 
  LIMIT 1;
  
  IF default_tenant_id IS NOT NULL THEN
    UPDATE public.consultations 
    SET tenant_id = default_tenant_id 
    WHERE tenant_id IS NULL;
    
    RAISE NOTICE 'Updated existing consultations with default tenant_id';
  END IF;
END $$;

-- 4.3: Add foreign key constraint
ALTER TABLE public.consultations 
  DROP CONSTRAINT IF EXISTS consultations_tenant_id_fkey;

ALTER TABLE public.consultations 
  ADD CONSTRAINT consultations_tenant_id_fkey 
  FOREIGN KEY (tenant_id) 
  REFERENCES public.tenants(id) 
  ON DELETE CASCADE;

-- 4.4: Create index
DROP INDEX IF EXISTS idx_consultations_tenant;
CREATE INDEX idx_consultations_tenant ON public.consultations(tenant_id);

COMMENT ON COLUMN public.consultations.tenant_id IS 
  'Foreign key to tenants table - isolates consultation data by tenant';

DO $$
BEGIN
  RAISE NOTICE 'Consultations table updated with tenant_id column';
END $$;

-- =============================================
-- STEP 5: ADD TENANT_ID TO ORDERS TABLE
-- =============================================

-- 5.1: Add tenant_id column
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS tenant_id UUID;

-- 5.2: Set default tenant_id for existing orders
DO $$
DECLARE
  default_tenant_id UUID;
BEGIN
  SELECT id INTO default_tenant_id 
  FROM public.tenants 
  WHERE subdomain = 'default' 
  LIMIT 1;
  
  IF default_tenant_id IS NOT NULL THEN
    UPDATE public.orders 
    SET tenant_id = default_tenant_id 
    WHERE tenant_id IS NULL;
    
    RAISE NOTICE 'Updated existing orders with default tenant_id';
  END IF;
END $$;

-- 5.3: Add foreign key constraint
ALTER TABLE public.orders 
  DROP CONSTRAINT IF EXISTS orders_tenant_id_fkey;

ALTER TABLE public.orders 
  ADD CONSTRAINT orders_tenant_id_fkey 
  FOREIGN KEY (tenant_id) 
  REFERENCES public.tenants(id) 
  ON DELETE CASCADE;

-- 5.4: Create index
DROP INDEX IF EXISTS idx_orders_tenant;
CREATE INDEX idx_orders_tenant ON public.orders(tenant_id);

COMMENT ON COLUMN public.orders.tenant_id IS 
  'Foreign key to tenants table - isolates order data by tenant';

DO $$
BEGIN
  RAISE NOTICE 'Orders table updated with tenant_id column';
END $$;

-- =============================================
-- STEP 6: ADD TENANT_ID TO REVIEWS TABLE
-- =============================================

-- 6.1: Add tenant_id column
ALTER TABLE public.reviews 
  ADD COLUMN IF NOT EXISTS tenant_id UUID;

-- 6.2: Set default tenant_id for existing reviews
DO $$
DECLARE
  default_tenant_id UUID;
BEGIN
  SELECT id INTO default_tenant_id 
  FROM public.tenants 
  WHERE subdomain = 'default' 
  LIMIT 1;
  
  IF default_tenant_id IS NOT NULL THEN
    UPDATE public.reviews 
    SET tenant_id = default_tenant_id 
    WHERE tenant_id IS NULL;
    
    RAISE NOTICE 'Updated existing reviews with default tenant_id';
  END IF;
END $$;

-- 6.3: Add foreign key constraint
ALTER TABLE public.reviews 
  DROP CONSTRAINT IF EXISTS reviews_tenant_id_fkey;

ALTER TABLE public.reviews 
  ADD CONSTRAINT reviews_tenant_id_fkey 
  FOREIGN KEY (tenant_id) 
  REFERENCES public.tenants(id) 
  ON DELETE CASCADE;

-- 6.4: Create index
DROP INDEX IF EXISTS idx_reviews_tenant;
CREATE INDEX idx_reviews_tenant ON public.reviews(tenant_id);

COMMENT ON COLUMN public.reviews.tenant_id IS 
  'Foreign key to tenants table - isolates review data by tenant';

DO $$
BEGIN
  RAISE NOTICE 'Reviews table updated with tenant_id column';
END $$;

-- =============================================
-- STEP 7: ADD TENANT_ID TO TEMPLATES TABLE
-- =============================================

-- 7.1: Add tenant_id column
ALTER TABLE public.templates 
  ADD COLUMN IF NOT EXISTS tenant_id UUID;

-- 7.2: Set default tenant_id for existing templates
DO $$
DECLARE
  default_tenant_id UUID;
BEGIN
  SELECT id INTO default_tenant_id 
  FROM public.tenants 
  WHERE subdomain = 'default' 
  LIMIT 1;
  
  IF default_tenant_id IS NOT NULL THEN
    UPDATE public.templates 
    SET tenant_id = default_tenant_id 
    WHERE tenant_id IS NULL;
    
    RAISE NOTICE 'Updated existing templates with default tenant_id';
  END IF;
END $$;

-- 7.3: Add foreign key constraint
ALTER TABLE public.templates 
  DROP CONSTRAINT IF EXISTS templates_tenant_id_fkey;

ALTER TABLE public.templates 
  ADD CONSTRAINT templates_tenant_id_fkey 
  FOREIGN KEY (tenant_id) 
  REFERENCES public.tenants(id) 
  ON DELETE CASCADE;

-- 7.4: Create index
DROP INDEX IF EXISTS idx_templates_tenant;
CREATE INDEX idx_templates_tenant ON public.templates(tenant_id);

COMMENT ON COLUMN public.templates.tenant_id IS 
  'Foreign key to tenants table - isolates template data by tenant';

DO $$
BEGIN
  RAISE NOTICE 'Templates table updated with tenant_id column';
END $$;

-- =============================================
-- STEP 8: ADD TENANT_ID TO ARTICLES TABLE
-- =============================================

-- 8.1: Add tenant_id column
ALTER TABLE public.articles 
  ADD COLUMN IF NOT EXISTS tenant_id UUID;

-- 8.2: Set default tenant_id for existing articles
DO $$
DECLARE
  default_tenant_id UUID;
BEGIN
  SELECT id INTO default_tenant_id 
  FROM public.tenants 
  WHERE subdomain = 'default' 
  LIMIT 1;
  
  IF default_tenant_id IS NOT NULL THEN
    UPDATE public.articles 
    SET tenant_id = default_tenant_id 
    WHERE tenant_id IS NULL;
    
    RAISE NOTICE 'Updated existing articles with default tenant_id';
  END IF;
END $$;

-- 8.3: Add foreign key constraint
ALTER TABLE public.articles 
  DROP CONSTRAINT IF EXISTS articles_tenant_id_fkey;

ALTER TABLE public.articles 
  ADD CONSTRAINT articles_tenant_id_fkey 
  FOREIGN KEY (tenant_id) 
  REFERENCES public.tenants(id) 
  ON DELETE CASCADE;

-- 8.4: Create index
DROP INDEX IF EXISTS idx_articles_tenant;
CREATE INDEX idx_articles_tenant ON public.articles(tenant_id);

COMMENT ON COLUMN public.articles.tenant_id IS 
  'Foreign key to tenants table - isolates article data by tenant';

DO $$
BEGIN
  RAISE NOTICE 'Articles table updated with tenant_id column';
END $$;

-- =============================================
-- STEP 9: ADD TENANT_ID TO FAVORITES TABLE
-- =============================================

-- 9.1: Add tenant_id column
ALTER TABLE public.favorites 
  ADD COLUMN IF NOT EXISTS tenant_id UUID;

-- 9.2: Set default tenant_id for existing favorites
DO $$
DECLARE
  default_tenant_id UUID;
BEGIN
  SELECT id INTO default_tenant_id 
  FROM public.tenants 
  WHERE subdomain = 'default' 
  LIMIT 1;
  
  IF default_tenant_id IS NOT NULL THEN
    UPDATE public.favorites 
    SET tenant_id = default_tenant_id 
    WHERE tenant_id IS NULL;
    
    RAISE NOTICE 'Updated existing favorites with default tenant_id';
  END IF;
END $$;

-- 9.3: Add foreign key constraint
ALTER TABLE public.favorites 
  DROP CONSTRAINT IF EXISTS favorites_tenant_id_fkey;

ALTER TABLE public.favorites 
  ADD CONSTRAINT favorites_tenant_id_fkey 
  FOREIGN KEY (tenant_id) 
  REFERENCES public.tenants(id) 
  ON DELETE CASCADE;

-- 9.4: Create index
DROP INDEX IF EXISTS idx_favorites_tenant;
CREATE INDEX idx_favorites_tenant ON public.favorites(tenant_id);

COMMENT ON COLUMN public.favorites.tenant_id IS 
  'Foreign key to tenants table - isolates favorite data by tenant';

DO $$
BEGIN
  RAISE NOTICE 'Favorites table updated with tenant_id column';
END $$;

-- =============================================
-- STEP 10: ADD TENANT_ID TO CART TABLE
-- =============================================

-- 10.1: Add tenant_id column
ALTER TABLE public.cart 
  ADD COLUMN IF NOT EXISTS tenant_id UUID;

-- 10.2: Set default tenant_id for existing cart items
DO $$
DECLARE
  default_tenant_id UUID;
BEGIN
  SELECT id INTO default_tenant_id 
  FROM public.tenants 
  WHERE subdomain = 'default' 
  LIMIT 1;
  
  IF default_tenant_id IS NOT NULL THEN
    UPDATE public.cart 
    SET tenant_id = default_tenant_id 
    WHERE tenant_id IS NULL;
    
    RAISE NOTICE 'Updated existing cart items with default tenant_id';
  END IF;
END $$;

-- 10.3: Add foreign key constraint
ALTER TABLE public.cart 
  DROP CONSTRAINT IF EXISTS cart_tenant_id_fkey;

ALTER TABLE public.cart 
  ADD CONSTRAINT cart_tenant_id_fkey 
  FOREIGN KEY (tenant_id) 
  REFERENCES public.tenants(id) 
  ON DELETE CASCADE;

-- 10.4: Create index
DROP INDEX IF EXISTS idx_cart_tenant;
CREATE INDEX idx_cart_tenant ON public.cart(tenant_id);

COMMENT ON COLUMN public.cart.tenant_id IS 
  'Foreign key to tenants table - isolates cart data by tenant';

DO $$
BEGIN
  RAISE NOTICE 'Cart table updated with tenant_id column';
END $$;

-- =============================================
-- STEP 11: ADD TENANT_ID TO SERVICES TABLE
-- =============================================

-- 11.1: Add tenant_id column
ALTER TABLE public.services 
  ADD COLUMN IF NOT EXISTS tenant_id UUID;

-- 11.2: Set default tenant_id for existing services
DO $$
DECLARE
  default_tenant_id UUID;
BEGIN
  SELECT id INTO default_tenant_id 
  FROM public.tenants 
  WHERE subdomain = 'default' 
  LIMIT 1;
  
  IF default_tenant_id IS NOT NULL THEN
    UPDATE public.services 
    SET tenant_id = default_tenant_id 
    WHERE tenant_id IS NULL;
    
    RAISE NOTICE 'Updated existing services with default tenant_id';
  END IF;
END $$;

-- 11.3: Add foreign key constraint
ALTER TABLE public.services 
  DROP CONSTRAINT IF EXISTS services_tenant_id_fkey;

ALTER TABLE public.services 
  ADD CONSTRAINT services_tenant_id_fkey 
  FOREIGN KEY (tenant_id) 
  REFERENCES public.tenants(id) 
  ON DELETE CASCADE;

-- 11.4: Create index
DROP INDEX IF EXISTS idx_services_tenant;
CREATE INDEX idx_services_tenant ON public.services(tenant_id);

COMMENT ON COLUMN public.services.tenant_id IS 
  'Foreign key to tenants table - isolates service data by tenant';

DO $$
BEGIN
  RAISE NOTICE 'Services table updated with tenant_id column';
END $$;

-- =============================================
-- VALIDATION
-- =============================================

-- Verify all columns were added successfully
DO $$
DECLARE
  missing_columns TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- Check profiles.tenant_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'tenant_id'
  ) THEN
    missing_columns := array_append(missing_columns, 'profiles.tenant_id');
  END IF;
  
  -- Check profiles.super_admin
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'super_admin'
  ) THEN
    missing_columns := array_append(missing_columns, 'profiles.super_admin');
  END IF;
  
  -- Check other tables
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'lawyers' 
    AND column_name = 'tenant_id'
  ) THEN
    missing_columns := array_append(missing_columns, 'lawyers.tenant_id');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'consultations' 
    AND column_name = 'tenant_id'
  ) THEN
    missing_columns := array_append(missing_columns, 'consultations.tenant_id');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'orders' 
    AND column_name = 'tenant_id'
  ) THEN
    missing_columns := array_append(missing_columns, 'orders.tenant_id');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'reviews' 
    AND column_name = 'tenant_id'
  ) THEN
    missing_columns := array_append(missing_columns, 'reviews.tenant_id');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'templates' 
    AND column_name = 'tenant_id'
  ) THEN
    missing_columns := array_append(missing_columns, 'templates.tenant_id');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'articles' 
    AND column_name = 'tenant_id'
  ) THEN
    missing_columns := array_append(missing_columns, 'articles.tenant_id');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'favorites' 
    AND column_name = 'tenant_id'
  ) THEN
    missing_columns := array_append(missing_columns, 'favorites.tenant_id');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'cart' 
    AND column_name = 'tenant_id'
  ) THEN
    missing_columns := array_append(missing_columns, 'cart.tenant_id');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'services' 
    AND column_name = 'tenant_id'
  ) THEN
    missing_columns := array_append(missing_columns, 'services.tenant_id');
  END IF;
  
  -- Report results
  IF array_length(missing_columns, 1) > 0 THEN
    RAISE EXCEPTION 'Migration failed: Missing columns: %', array_to_string(missing_columns, ', ');
  ELSE
    RAISE NOTICE '✓ All tenant_id and super_admin columns added successfully';
    RAISE NOTICE '✓ All foreign key constraints created';
    RAISE NOTICE '✓ All indexes created';
    RAISE NOTICE '✓ Existing data migrated to default tenant';
    RAISE NOTICE '';
    RAISE NOTICE 'Migration 006_add_tenant_columns completed successfully!';
  END IF;
END $$;
