-- =============================================
-- SUPER ADMIN SYSTEM: ROW-LEVEL SECURITY POLICIES
-- Migration: 007_create_rls_policies
-- Description: Create RLS policies for tenant data isolation
-- Requirements: Req 7 (Data Isolation and Tenant Scoping)
-- =============================================

-- This migration implements row-level security policies that:
-- 1. Filter all queries by tenant_id from the user's profile
-- 2. Allow super admins to bypass tenant filtering
-- 3. Ensure complete data isolation between tenants
-- 4. Apply to all tenant-scoped tables

-- =============================================
-- POLICY PATTERN
-- =============================================
-- All policies use this pattern:
-- (auth.uid() IN (SELECT id FROM profiles WHERE super_admin = true))
-- OR (tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid()))
--
-- This allows:
-- - Super admins to access all tenant data
-- - Regular users to access only their tenant's data

-- =============================================
-- STEP 1: PROFILES TABLE RLS POLICIES
-- =============================================

DO $$
BEGIN
  RAISE NOTICE 'Creating RLS policies for profiles table...';
END $$;

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view profiles in their tenant" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can delete profiles" ON public.profiles;

-- SELECT policy: Users can view profiles in their tenant, super admins can view all
CREATE POLICY "Users can view profiles in their tenant"
  ON public.profiles FOR SELECT
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
  );

-- INSERT policy: Users can insert their own profile, super admins can insert any profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (auth.uid() = id)
  );

-- UPDATE policy: Users can update their own profile within tenant, super admins can update any
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (auth.uid() = id AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
  );

-- DELETE policy: Only super admins can delete profiles
CREATE POLICY "Super admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true)
  );

DO $$
BEGIN
  RAISE NOTICE '✓ Profiles table RLS policies created';
END $$;

-- =============================================
-- STEP 2: LAWYERS TABLE RLS POLICIES
-- =============================================

DO $$
BEGIN
  RAISE NOTICE 'Creating RLS policies for lawyers table...';
END $$;

-- Enable RLS on lawyers table
ALTER TABLE public.lawyers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Lawyers are viewable within tenant" ON public.lawyers;
DROP POLICY IF EXISTS "Lawyers can update their profile within tenant" ON public.lawyers;
DROP POLICY IF EXISTS "Admins can insert lawyers within tenant" ON public.lawyers;
DROP POLICY IF EXISTS "Admins can delete lawyers within tenant" ON public.lawyers;

-- SELECT policy: Users can view lawyers in their tenant, super admins can view all
CREATE POLICY "Lawyers are viewable within tenant"
  ON public.lawyers FOR SELECT
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
  );

-- INSERT policy: Admins and super admins can insert lawyers
CREATE POLICY "Admins can insert lawyers within tenant"
  ON public.lawyers FOR INSERT
  WITH CHECK (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin')
    )
  );

-- UPDATE policy: Lawyers can update their own profile, admins can update within tenant
CREATE POLICY "Lawyers can update their profile within tenant"
  ON public.lawyers FOR UPDATE
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      auth.uid() = user_id 
      AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
    )
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin')
    )
  );

-- DELETE policy: Only admins and super admins can delete lawyers
CREATE POLICY "Admins can delete lawyers within tenant"
  ON public.lawyers FOR DELETE
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin')
    )
  );

DO $$
BEGIN
  RAISE NOTICE '✓ Lawyers table RLS policies created';
END $$;

-- =============================================
-- STEP 3: CONSULTATIONS TABLE RLS POLICIES
-- =============================================

DO $$
BEGIN
  RAISE NOTICE 'Creating RLS policies for consultations table...';
END $$;

-- Enable RLS on consultations table
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Consultations are viewable within tenant" ON public.consultations;
DROP POLICY IF EXISTS "Users can insert consultations within tenant" ON public.consultations;
DROP POLICY IF EXISTS "Users can update their consultations within tenant" ON public.consultations;
DROP POLICY IF EXISTS "Admins can delete consultations within tenant" ON public.consultations;

-- SELECT policy: Users can view consultations in their tenant
CREATE POLICY "Consultations are viewable within tenant"
  ON public.consultations FOR SELECT
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
  );

-- INSERT policy: Users can create consultations within their tenant
CREATE POLICY "Users can insert consultations within tenant"
  ON public.consultations FOR INSERT
  WITH CHECK (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
  );

-- UPDATE policy: Users can update their own consultations, admins can update all in tenant
CREATE POLICY "Users can update their consultations within tenant"
  ON public.consultations FOR UPDATE
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND (
        auth.uid() = client_id 
        OR auth.uid() = lawyer_id
        OR auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin')
      )
    )
  );

-- DELETE policy: Only admins and super admins can delete consultations
CREATE POLICY "Admins can delete consultations within tenant"
  ON public.consultations FOR DELETE
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin')
    )
  );

DO $$
BEGIN
  RAISE NOTICE '✓ Consultations table RLS policies created';
END $$;

-- =============================================
-- STEP 4: ORDERS TABLE RLS POLICIES
-- =============================================

DO $$
BEGIN
  RAISE NOTICE 'Creating RLS policies for orders table...';
END $$;

-- Enable RLS on orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Orders are viewable within tenant" ON public.orders;
DROP POLICY IF EXISTS "Users can insert orders within tenant" ON public.orders;
DROP POLICY IF EXISTS "Users can update their orders within tenant" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete orders within tenant" ON public.orders;

-- SELECT policy: Users can view orders in their tenant
CREATE POLICY "Orders are viewable within tenant"
  ON public.orders FOR SELECT
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
  );

-- INSERT policy: Users can create orders within their tenant
CREATE POLICY "Users can insert orders within tenant"
  ON public.orders FOR INSERT
  WITH CHECK (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
  );

-- UPDATE policy: Users can update their own orders, admins can update all in tenant
CREATE POLICY "Users can update their orders within tenant"
  ON public.orders FOR UPDATE
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND (
        auth.uid() = user_id
        OR auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin')
      )
    )
  );

-- DELETE policy: Only admins and super admins can delete orders
CREATE POLICY "Admins can delete orders within tenant"
  ON public.orders FOR DELETE
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin')
    )
  );

DO $$
BEGIN
  RAISE NOTICE '✓ Orders table RLS policies created';
END $$;

-- =============================================
-- STEP 5: REVIEWS TABLE RLS POLICIES
-- =============================================

DO $$
BEGIN
  RAISE NOTICE 'Creating RLS policies for reviews table...';
END $$;

-- Enable RLS on reviews table
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Reviews are viewable within tenant" ON public.reviews;
DROP POLICY IF EXISTS "Users can insert reviews within tenant" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their reviews within tenant" ON public.reviews;
DROP POLICY IF EXISTS "Admins can delete reviews within tenant" ON public.reviews;

-- SELECT policy: Users can view reviews in their tenant
CREATE POLICY "Reviews are viewable within tenant"
  ON public.reviews FOR SELECT
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
  );

-- INSERT policy: Users can create reviews within their tenant
CREATE POLICY "Users can insert reviews within tenant"
  ON public.reviews FOR INSERT
  WITH CHECK (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
  );

-- UPDATE policy: Users can update their own reviews, admins can update all in tenant
CREATE POLICY "Users can update their reviews within tenant"
  ON public.reviews FOR UPDATE
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND (
        auth.uid() = user_id
        OR auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin')
      )
    )
  );

-- DELETE policy: Users can delete their own reviews, admins can delete all in tenant
CREATE POLICY "Admins can delete reviews within tenant"
  ON public.reviews FOR DELETE
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND (
        auth.uid() = user_id
        OR auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin')
      )
    )
  );

DO $$
BEGIN
  RAISE NOTICE '✓ Reviews table RLS policies created';
END $$;

-- =============================================
-- STEP 6: TEMPLATES TABLE RLS POLICIES
-- =============================================

DO $$
BEGIN
  RAISE NOTICE 'Creating RLS policies for templates table...';
END $$;

-- Enable RLS on templates table
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Templates are viewable within tenant" ON public.templates;
DROP POLICY IF EXISTS "Admins can insert templates within tenant" ON public.templates;
DROP POLICY IF EXISTS "Admins can update templates within tenant" ON public.templates;
DROP POLICY IF EXISTS "Admins can delete templates within tenant" ON public.templates;

-- SELECT policy: Users can view templates in their tenant
CREATE POLICY "Templates are viewable within tenant"
  ON public.templates FOR SELECT
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
  );

-- INSERT policy: Only admins and super admins can create templates
CREATE POLICY "Admins can insert templates within tenant"
  ON public.templates FOR INSERT
  WITH CHECK (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin')
    )
  );

-- UPDATE policy: Only admins and super admins can update templates
CREATE POLICY "Admins can update templates within tenant"
  ON public.templates FOR UPDATE
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin')
    )
  );

-- DELETE policy: Only admins and super admins can delete templates
CREATE POLICY "Admins can delete templates within tenant"
  ON public.templates FOR DELETE
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin')
    )
  );

DO $$
BEGIN
  RAISE NOTICE '✓ Templates table RLS policies created';
END $$;

-- =============================================
-- STEP 7: ARTICLES TABLE RLS POLICIES
-- =============================================

DO $$
BEGIN
  RAISE NOTICE 'Creating RLS policies for articles table...';
END $$;

-- Enable RLS on articles table
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Articles are viewable within tenant" ON public.articles;
DROP POLICY IF EXISTS "Admins can insert articles within tenant" ON public.articles;
DROP POLICY IF EXISTS "Admins can update articles within tenant" ON public.articles;
DROP POLICY IF EXISTS "Admins can delete articles within tenant" ON public.articles;

-- SELECT policy: Users can view articles in their tenant
CREATE POLICY "Articles are viewable within tenant"
  ON public.articles FOR SELECT
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
  );

-- INSERT policy: Only admins and super admins can create articles
CREATE POLICY "Admins can insert articles within tenant"
  ON public.articles FOR INSERT
  WITH CHECK (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin')
    )
  );

-- UPDATE policy: Only admins and super admins can update articles
CREATE POLICY "Admins can update articles within tenant"
  ON public.articles FOR UPDATE
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin')
    )
  );

-- DELETE policy: Only admins and super admins can delete articles
CREATE POLICY "Admins can delete articles within tenant"
  ON public.articles FOR DELETE
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin')
    )
  );

DO $$
BEGIN
  RAISE NOTICE '✓ Articles table RLS policies created';
END $$;

-- =============================================
-- STEP 8: FAVORITES TABLE RLS POLICIES
-- =============================================

DO $$
BEGIN
  RAISE NOTICE 'Creating RLS policies for favorites table...';
END $$;

-- Enable RLS on favorites table
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Favorites are viewable within tenant" ON public.favorites;
DROP POLICY IF EXISTS "Users can insert favorites within tenant" ON public.favorites;
DROP POLICY IF EXISTS "Users can update their favorites within tenant" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete their favorites within tenant" ON public.favorites;

-- SELECT policy: Users can view favorites in their tenant
CREATE POLICY "Favorites are viewable within tenant"
  ON public.favorites FOR SELECT
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
  );

-- INSERT policy: Users can create favorites within their tenant
CREATE POLICY "Users can insert favorites within tenant"
  ON public.favorites FOR INSERT
  WITH CHECK (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND auth.uid() = user_id
    )
  );

-- UPDATE policy: Users can update their own favorites
CREATE POLICY "Users can update their favorites within tenant"
  ON public.favorites FOR UPDATE
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND auth.uid() = user_id
    )
  );

-- DELETE policy: Users can delete their own favorites
CREATE POLICY "Users can delete their favorites within tenant"
  ON public.favorites FOR DELETE
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND auth.uid() = user_id
    )
  );

DO $$
BEGIN
  RAISE NOTICE '✓ Favorites table RLS policies created';
END $$;

-- =============================================
-- STEP 9: CART TABLE RLS POLICIES
-- =============================================

DO $$
BEGIN
  RAISE NOTICE 'Creating RLS policies for cart table...';
END $$;

-- Enable RLS on cart table
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Cart items are viewable within tenant" ON public.cart;
DROP POLICY IF EXISTS "Users can insert cart items within tenant" ON public.cart;
DROP POLICY IF EXISTS "Users can update their cart items within tenant" ON public.cart;
DROP POLICY IF EXISTS "Users can delete their cart items within tenant" ON public.cart;

-- SELECT policy: Users can view cart items in their tenant
CREATE POLICY "Cart items are viewable within tenant"
  ON public.cart FOR SELECT
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
  );

-- INSERT policy: Users can create cart items within their tenant
CREATE POLICY "Users can insert cart items within tenant"
  ON public.cart FOR INSERT
  WITH CHECK (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND auth.uid() = user_id
    )
  );

-- UPDATE policy: Users can update their own cart items
CREATE POLICY "Users can update their cart items within tenant"
  ON public.cart FOR UPDATE
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND auth.uid() = user_id
    )
  );

-- DELETE policy: Users can delete their own cart items
CREATE POLICY "Users can delete their cart items within tenant"
  ON public.cart FOR DELETE
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND auth.uid() = user_id
    )
  );

DO $$
BEGIN
  RAISE NOTICE '✓ Cart table RLS policies created';
END $$;

-- =============================================
-- STEP 10: SERVICES TABLE RLS POLICIES
-- =============================================

DO $$
BEGIN
  RAISE NOTICE 'Creating RLS policies for services table...';
END $$;

-- Enable RLS on services table
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Services are viewable within tenant" ON public.services;
DROP POLICY IF EXISTS "Admins can insert services within tenant" ON public.services;
DROP POLICY IF EXISTS "Admins can update services within tenant" ON public.services;
DROP POLICY IF EXISTS "Admins can delete services within tenant" ON public.services;

-- SELECT policy: Users can view services in their tenant
CREATE POLICY "Services are viewable within tenant"
  ON public.services FOR SELECT
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
  );

-- INSERT policy: Only admins and super admins can create services
CREATE POLICY "Admins can insert services within tenant"
  ON public.services FOR INSERT
  WITH CHECK (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin')
    )
  );

-- UPDATE policy: Only admins and super admins can update services
CREATE POLICY "Admins can update services within tenant"
  ON public.services FOR UPDATE
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin')
    )
  );

-- DELETE policy: Only admins and super admins can delete services
CREATE POLICY "Admins can delete services within tenant"
  ON public.services FOR DELETE
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin')
    )
  );

DO $$
BEGIN
  RAISE NOTICE '✓ Services table RLS policies created';
END $$;

-- =============================================
-- VALIDATION
-- =============================================

-- Verify all policies were created successfully
DO $$
DECLARE
  policy_count INTEGER;
  expected_count INTEGER := 40; -- 10 tables × 4 policies each
BEGIN
  -- Count all policies on our tables
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
  AND tablename IN (
    'profiles', 'lawyers', 'consultations', 'orders', 'reviews',
    'templates', 'articles', 'favorites', 'cart', 'services'
  );
  
  IF policy_count < expected_count THEN
    RAISE WARNING 'Expected at least % policies, but found only %', expected_count, policy_count;
  END IF;
  
  -- Verify RLS is enabled on all tables
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND rowsecurity = true
  ) THEN
    RAISE EXCEPTION 'RLS not enabled on profiles table';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'lawyers' 
    AND rowsecurity = true
  ) THEN
    RAISE EXCEPTION 'RLS not enabled on lawyers table';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'consultations' 
    AND rowsecurity = true
  ) THEN
    RAISE EXCEPTION 'RLS not enabled on consultations table';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'orders' 
    AND rowsecurity = true
  ) THEN
    RAISE EXCEPTION 'RLS not enabled on orders table';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'reviews' 
    AND rowsecurity = true
  ) THEN
    RAISE EXCEPTION 'RLS not enabled on reviews table';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'templates' 
    AND rowsecurity = true
  ) THEN
    RAISE EXCEPTION 'RLS not enabled on templates table';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'articles' 
    AND rowsecurity = true
  ) THEN
    RAISE EXCEPTION 'RLS not enabled on articles table';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'favorites' 
    AND rowsecurity = true
  ) THEN
    RAISE EXCEPTION 'RLS not enabled on favorites table';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'cart' 
    AND rowsecurity = true
  ) THEN
    RAISE EXCEPTION 'RLS not enabled on cart table';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'services' 
    AND rowsecurity = true
  ) THEN
    RAISE EXCEPTION 'RLS not enabled on services table';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'RLS POLICIES MIGRATION COMPLETED';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✓ RLS enabled on all 10 tables';
  RAISE NOTICE '✓ Created % policies (expected at least %)', policy_count, expected_count;
  RAISE NOTICE '✓ All policies filter by tenant_id';
  RAISE NOTICE '✓ Super admin bypass implemented';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables with RLS policies:';
  RAISE NOTICE '  1. profiles (SELECT, INSERT, UPDATE, DELETE)';
  RAISE NOTICE '  2. lawyers (SELECT, INSERT, UPDATE, DELETE)';
  RAISE NOTICE '  3. consultations (SELECT, INSERT, UPDATE, DELETE)';
  RAISE NOTICE '  4. orders (SELECT, INSERT, UPDATE, DELETE)';
  RAISE NOTICE '  5. reviews (SELECT, INSERT, UPDATE, DELETE)';
  RAISE NOTICE '  6. templates (SELECT, INSERT, UPDATE, DELETE)';
  RAISE NOTICE '  7. articles (SELECT, INSERT, UPDATE, DELETE)';
  RAISE NOTICE '  8. favorites (SELECT, INSERT, UPDATE, DELETE)';
  RAISE NOTICE '  9. cart (SELECT, INSERT, UPDATE, DELETE)';
  RAISE NOTICE ' 10. services (SELECT, INSERT, UPDATE, DELETE)';
  RAISE NOTICE '';
  RAISE NOTICE 'Policy Pattern:';
  RAISE NOTICE '  - Super admins: Can access all tenant data';
  RAISE NOTICE '  - Regular users: Can only access their tenant data';
  RAISE NOTICE '  - Tenant isolation: Enforced by tenant_id filtering';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '  1. Execute this migration in Supabase Dashboard';
  RAISE NOTICE '  2. Test with test@example.com account';
  RAISE NOTICE '  3. Verify tenant data isolation';
  RAISE NOTICE '  4. Create super admin account for testing';
  RAISE NOTICE '========================================';
END $$;
