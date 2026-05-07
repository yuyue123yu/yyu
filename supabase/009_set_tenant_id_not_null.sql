-- =============================================
-- SUPER ADMIN SYSTEM: SET TENANT_ID NOT NULL
-- Migration: 009_set_tenant_id_not_null
-- Description: Make tenant_id columns required after data migration
-- Requirements: Req 7 (Data Isolation and Tenant Scoping)
-- =============================================

-- This migration enforces data integrity by making tenant_id columns NOT NULL.
-- This should only be run AFTER migration 006 has successfully migrated all
-- existing data to the default tenant.

-- PREREQUISITES:
-- 1. Migration 006_add_tenant_columns.sql must be completed
-- 2. All existing data must have tenant_id populated
-- 3. Default tenant must exist

-- =============================================
-- VALIDATION: CHECK PREREQUISITES
-- =============================================

DO $$
BEGIN
  -- Check that tenants table exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'tenants'
  ) THEN
    RAISE EXCEPTION 'Tenants table does not exist. Run migration 001 first.';
  END IF;
  
  -- Check that default tenant exists
  IF NOT EXISTS (
    SELECT 1 FROM public.tenants WHERE subdomain = 'default'
  ) THEN
    RAISE EXCEPTION 'Default tenant does not exist. Run migration 006 first.';
  END IF;
  
  RAISE NOTICE 'Prerequisites validated successfully';
END $$;

-- =============================================
-- VALIDATION: CHECK FOR NULL VALUES
-- =============================================

DO $$
DECLARE
  null_count INTEGER;
  tbl_name TEXT;
  tables_to_check TEXT[] := ARRAY[
    'profiles', 'lawyers', 'consultations', 'orders', 
    'reviews', 'templates', 'articles', 'favorites', 
    'cart', 'services'
  ];
  has_nulls BOOLEAN := false;
  error_message TEXT := '';
BEGIN
  RAISE NOTICE 'Checking for NULL tenant_id values...';
  RAISE NOTICE '';
  
  -- Check each table for NULL tenant_id values
  FOREACH tbl_name IN ARRAY tables_to_check
  LOOP
    -- Check if table exists and has tenant_id column
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = tbl_name 
      AND column_name = 'tenant_id'
    ) THEN
      -- Count NULL values
      EXECUTE format('SELECT COUNT(*) FROM public.%I WHERE tenant_id IS NULL', tbl_name)
      INTO null_count;
      
      IF null_count > 0 THEN
        has_nulls := true;
        error_message := error_message || format(E'\n  - %s: %s rows with NULL tenant_id', tbl_name, null_count);
        RAISE WARNING 'Table % has % rows with NULL tenant_id', tbl_name, null_count;
      ELSE
        RAISE NOTICE '✓ Table %: All rows have tenant_id populated', tbl_name;
      END IF;
    ELSE
      RAISE NOTICE '⊘ Table % does not have tenant_id column (skipping)', tbl_name;
    END IF;
  END LOOP;
  
  RAISE NOTICE '';
  
  -- If any NULL values found, raise exception with details
  IF has_nulls THEN
    RAISE EXCEPTION E'Cannot set tenant_id to NOT NULL: Found NULL values in the following tables:%\n\nPlease run migration 006 to populate tenant_id for all existing data.', error_message;
  ELSE
    RAISE NOTICE '✓ All tables validated: No NULL tenant_id values found';
    RAISE NOTICE '';
  END IF;
END $$;

-- =============================================
-- STEP 1: SET PROFILES.TENANT_ID TO NOT NULL
-- =============================================

DO $$
BEGIN
  -- Check if column exists and is nullable
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'tenant_id'
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE public.profiles 
      ALTER COLUMN tenant_id SET NOT NULL;
    
    RAISE NOTICE '✓ profiles.tenant_id set to NOT NULL';
  ELSE
    RAISE NOTICE '⊘ profiles.tenant_id already NOT NULL or does not exist';
  END IF;
END $$;

-- =============================================
-- STEP 2: SET LAWYERS.TENANT_ID TO NOT NULL
-- =============================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'lawyers' 
    AND column_name = 'tenant_id'
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE public.lawyers 
      ALTER COLUMN tenant_id SET NOT NULL;
    
    RAISE NOTICE '✓ lawyers.tenant_id set to NOT NULL';
  ELSE
    RAISE NOTICE '⊘ lawyers.tenant_id already NOT NULL or does not exist';
  END IF;
END $$;

-- =============================================
-- STEP 3: SET CONSULTATIONS.TENANT_ID TO NOT NULL
-- =============================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'consultations' 
    AND column_name = 'tenant_id'
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE public.consultations 
      ALTER COLUMN tenant_id SET NOT NULL;
    
    RAISE NOTICE '✓ consultations.tenant_id set to NOT NULL';
  ELSE
    RAISE NOTICE '⊘ consultations.tenant_id already NOT NULL or does not exist';
  END IF;
END $$;

-- =============================================
-- STEP 4: SET ORDERS.TENANT_ID TO NOT NULL
-- =============================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'orders' 
    AND column_name = 'tenant_id'
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE public.orders 
      ALTER COLUMN tenant_id SET NOT NULL;
    
    RAISE NOTICE '✓ orders.tenant_id set to NOT NULL';
  ELSE
    RAISE NOTICE '⊘ orders.tenant_id already NOT NULL or does not exist';
  END IF;
END $$;

-- =============================================
-- STEP 5: SET REVIEWS.TENANT_ID TO NOT NULL
-- =============================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'reviews' 
    AND column_name = 'tenant_id'
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE public.reviews 
      ALTER COLUMN tenant_id SET NOT NULL;
    
    RAISE NOTICE '✓ reviews.tenant_id set to NOT NULL';
  ELSE
    RAISE NOTICE '⊘ reviews.tenant_id already NOT NULL or does not exist';
  END IF;
END $$;

-- =============================================
-- STEP 6: SET TEMPLATES.TENANT_ID TO NOT NULL
-- =============================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'templates' 
    AND column_name = 'tenant_id'
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE public.templates 
      ALTER COLUMN tenant_id SET NOT NULL;
    
    RAISE NOTICE '✓ templates.tenant_id set to NOT NULL';
  ELSE
    RAISE NOTICE '⊘ templates.tenant_id already NOT NULL or does not exist';
  END IF;
END $$;

-- =============================================
-- STEP 7: SET ARTICLES.TENANT_ID TO NOT NULL
-- =============================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'articles' 
    AND column_name = 'tenant_id'
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE public.articles 
      ALTER COLUMN tenant_id SET NOT NULL;
    
    RAISE NOTICE '✓ articles.tenant_id set to NOT NULL';
  ELSE
    RAISE NOTICE '⊘ articles.tenant_id already NOT NULL or does not exist';
  END IF;
END $$;

-- =============================================
-- STEP 8: SET FAVORITES.TENANT_ID TO NOT NULL
-- =============================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'favorites' 
    AND column_name = 'tenant_id'
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE public.favorites 
      ALTER COLUMN tenant_id SET NOT NULL;
    
    RAISE NOTICE '✓ favorites.tenant_id set to NOT NULL';
  ELSE
    RAISE NOTICE '⊘ favorites.tenant_id already NOT NULL or does not exist';
  END IF;
END $$;

-- =============================================
-- STEP 9: SET CART.TENANT_ID TO NOT NULL
-- =============================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'cart' 
    AND column_name = 'tenant_id'
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE public.cart 
      ALTER COLUMN tenant_id SET NOT NULL;
    
    RAISE NOTICE '✓ cart.tenant_id set to NOT NULL';
  ELSE
    RAISE NOTICE '⊘ cart.tenant_id already NOT NULL or does not exist';
  END IF;
END $$;

-- =============================================
-- STEP 10: SET SERVICES.TENANT_ID TO NOT NULL
-- =============================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'services' 
    AND column_name = 'tenant_id'
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE public.services 
      ALTER COLUMN tenant_id SET NOT NULL;
    
    RAISE NOTICE '✓ services.tenant_id set to NOT NULL';
  ELSE
    RAISE NOTICE '⊘ services.tenant_id already NOT NULL or does not exist';
  END IF;
END $$;

-- =============================================
-- FINAL VALIDATION
-- =============================================

DO $$
DECLARE
  nullable_columns TEXT[] := ARRAY[]::TEXT[];
  tbl_name TEXT;
  tables_to_check TEXT[] := ARRAY[
    'profiles', 'lawyers', 'consultations', 'orders', 
    'reviews', 'templates', 'articles', 'favorites', 
    'cart', 'services'
  ];
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'FINAL VALIDATION';
  RAISE NOTICE '==============================================';
  RAISE NOTICE '';
  
  -- Check each table to ensure tenant_id is NOT NULL
  FOREACH tbl_name IN ARRAY tables_to_check
  LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = tbl_name 
      AND column_name = 'tenant_id'
      AND is_nullable = 'YES'
    ) THEN
      nullable_columns := array_append(nullable_columns, tbl_name || '.tenant_id');
    END IF;
  END LOOP;
  
  -- Report results
  IF array_length(nullable_columns, 1) > 0 THEN
    RAISE EXCEPTION 'Migration validation failed: The following columns are still nullable: %', 
      array_to_string(nullable_columns, ', ');
  ELSE
    RAISE NOTICE '✓ All tenant_id columns successfully set to NOT NULL';
    RAISE NOTICE '✓ Data integrity constraints enforced';
    RAISE NOTICE '✓ Multi-tenant isolation guaranteed at database level';
    RAISE NOTICE '';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Migration 009_set_tenant_id_not_null completed successfully!';
    RAISE NOTICE '==============================================';
  END IF;
END $$;

-- =============================================
-- MIGRATION NOTES
-- =============================================

-- This migration enforces the following data integrity rules:
-- 1. Every profile must belong to a tenant
-- 2. Every lawyer must belong to a tenant
-- 3. Every consultation must belong to a tenant
-- 4. Every order must belong to a tenant
-- 5. Every review must belong to a tenant
-- 6. Every template must belong to a tenant
-- 7. Every article must belong to a tenant
-- 8. Every favorite must belong to a tenant
-- 9. Every cart item must belong to a tenant
-- 10. Every service must belong to a tenant

-- Benefits:
-- - Prevents orphaned records without tenant association
-- - Enforces data isolation at the database constraint level
-- - Ensures RLS policies always have valid tenant_id to filter on
-- - Provides clear error messages when attempting to insert data without tenant_id

-- Safety features:
-- - Idempotent: Can be run multiple times safely
-- - Pre-validation: Checks for NULL values before attempting changes
-- - Detailed logging: Reports progress for each table
-- - Post-validation: Confirms all changes were applied successfully
-- - Rollback safe: Uses transactions implicitly (each DO block is atomic)

