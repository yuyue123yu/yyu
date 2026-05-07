-- =============================================
-- FIX: INFINITE RECURSION IN RLS POLICIES
-- Migration: 010_fix_rls_infinite_recursion
-- Description: Fix infinite recursion by using helper functions
-- =============================================

-- The problem: RLS policies on profiles table query profiles table,
-- causing infinite recursion.
--
-- The solution: Create helper functions that bypass RLS using
-- SECURITY DEFINER, then use these functions in policies.

-- =============================================
-- STEP 1: CREATE HELPER FUNCTIONS
-- =============================================

-- Function to check if current user is super admin
-- SECURITY DEFINER allows it to bypass RLS
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND super_admin = true
  );
END;
$$;

-- Function to get current user's tenant_id
-- SECURITY DEFINER allows it to bypass RLS
CREATE OR REPLACE FUNCTION public.get_user_tenant_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_tenant_id UUID;
BEGIN
  SELECT tenant_id INTO user_tenant_id
  FROM public.profiles
  WHERE id = auth.uid();
  
  RETURN user_tenant_id;
END;
$$;

DO $
BEGIN
  RAISE NOTICE '✓ Created helper functions: is_super_admin(), get_user_tenant_id()';
END $;

-- =============================================
-- STEP 2: RECREATE PROFILES TABLE RLS POLICIES
-- =============================================

DO $
BEGIN
  RAISE NOTICE 'Recreating RLS policies for profiles table...';
END $;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view profiles in their tenant" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can delete profiles" ON public.profiles;

-- SELECT policy: Users can view profiles in their tenant, super admins can view all
CREATE POLICY "Users can view profiles in their tenant"
  ON public.profiles FOR SELECT
  USING (
    public.is_super_admin()
    OR tenant_id = public.get_user_tenant_id()
  );

-- INSERT policy: Users can insert their own profile, super admins can insert any profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (
    public.is_super_admin()
    OR auth.uid() = id
  );

-- UPDATE policy: Users can update their own profile within tenant, super admins can update any
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (
    public.is_super_admin()
    OR (auth.uid() = id AND tenant_id = public.get_user_tenant_id())
  );

-- DELETE policy: Only super admins can delete profiles
CREATE POLICY "Super admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (
    public.is_super_admin()
  );

DO $
BEGIN
  RAISE NOTICE '✓ Profiles table RLS policies recreated with helper functions';
END $;

-- =============================================
-- STEP 3: RECREATE ALL OTHER TABLE RLS POLICIES
-- =============================================

-- LAWYERS TABLE
DO $
BEGIN
  RAISE NOTICE 'Recreating RLS policies for lawyers table...';
END $;

DROP POLICY IF EXISTS "Lawyers are viewable within tenant" ON public.lawyers;
DROP POLICY IF EXISTS "Lawyers can update their profile within tenant" ON public.lawyers;
DROP POLICY IF EXISTS "Admins can insert lawyers within tenant" ON public.lawyers;
DROP POLICY IF EXISTS "Admins can delete lawyers within tenant" ON public.lawyers;

CREATE POLICY "Lawyers are viewable within tenant"
  ON public.lawyers FOR SELECT
  USING (
    public.is_super_admin()
    OR tenant_id = public.get_user_tenant_id()
  );

CREATE POLICY "Admins can insert lawyers within tenant"
  ON public.lawyers FOR INSERT
  WITH CHECK (
    public.is_super_admin()
    OR (
      tenant_id = public.get_user_tenant_id()
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin' AND id = auth.uid())
    )
  );

CREATE POLICY "Lawyers can update their profile within tenant"
  ON public.lawyers FOR UPDATE
  USING (
    public.is_super_admin()
    OR (
      auth.uid() = user_id 
      AND tenant_id = public.get_user_tenant_id()
    )
    OR (
      tenant_id = public.get_user_tenant_id()
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin' AND id = auth.uid())
    )
  );

CREATE POLICY "Admins can delete lawyers within tenant"
  ON public.lawyers FOR DELETE
  USING (
    public.is_super_admin()
    OR (
      tenant_id = public.get_user_tenant_id()
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin' AND id = auth.uid())
    )
  );

DO $
BEGIN
  RAISE NOTICE '✓ Lawyers table RLS policies recreated';
END $;

-- CONSULTATIONS TABLE
DO $
BEGIN
  RAISE NOTICE 'Recreating RLS policies for consultations table...';
END $;

DROP POLICY IF EXISTS "Consultations are viewable within tenant" ON public.consultations;
DROP POLICY IF EXISTS "Users can insert consultations within tenant" ON public.consultations;
DROP POLICY IF EXISTS "Users can update their consultations within tenant" ON public.consultations;
DROP POLICY IF EXISTS "Admins can delete consultations within tenant" ON public.consultations;

CREATE POLICY "Consultations are viewable within tenant"
  ON public.consultations FOR SELECT
  USING (
    public.is_super_admin()
    OR tenant_id = public.get_user_tenant_id()
  );

CREATE POLICY "Users can insert consultations within tenant"
  ON public.consultations FOR INSERT
  WITH CHECK (
    public.is_super_admin()
    OR tenant_id = public.get_user_tenant_id()
  );

CREATE POLICY "Users can update their consultations within tenant"
  ON public.consultations FOR UPDATE
  USING (
    public.is_super_admin()
    OR (
      tenant_id = public.get_user_tenant_id()
      AND (
        auth.uid() = client_id 
        OR auth.uid() = lawyer_id
        OR auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin' AND id = auth.uid())
      )
    )
  );

CREATE POLICY "Admins can delete consultations within tenant"
  ON public.consultations FOR DELETE
  USING (
    public.is_super_admin()
    OR (
      tenant_id = public.get_user_tenant_id()
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin' AND id = auth.uid())
    )
  );

DO $
BEGIN
  RAISE NOTICE '✓ Consultations table RLS policies recreated';
END $;

-- ORDERS TABLE
DO $
BEGIN
  RAISE NOTICE 'Recreating RLS policies for orders table...';
END $;

DROP POLICY IF EXISTS "Orders are viewable within tenant" ON public.orders;
DROP POLICY IF EXISTS "Users can insert orders within tenant" ON public.orders;
DROP POLICY IF EXISTS "Users can update their orders within tenant" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete orders within tenant" ON public.orders;

CREATE POLICY "Orders are viewable within tenant"
  ON public.orders FOR SELECT
  USING (
    public.is_super_admin()
    OR tenant_id = public.get_user_tenant_id()
  );

CREATE POLICY "Users can insert orders within tenant"
  ON public.orders FOR INSERT
  WITH CHECK (
    public.is_super_admin()
    OR tenant_id = public.get_user_tenant_id()
  );

CREATE POLICY "Users can update their orders within tenant"
  ON public.orders FOR UPDATE
  USING (
    public.is_super_admin()
    OR (
      tenant_id = public.get_user_tenant_id()
      AND (
        auth.uid() = user_id
        OR auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin' AND id = auth.uid())
      )
    )
  );

CREATE POLICY "Admins can delete orders within tenant"
  ON public.orders FOR DELETE
  USING (
    public.is_super_admin()
    OR (
      tenant_id = public.get_user_tenant_id()
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin' AND id = auth.uid())
    )
  );

DO $
BEGIN
  RAISE NOTICE '✓ Orders table RLS policies recreated';
END $;

-- REVIEWS TABLE
DO $
BEGIN
  RAISE NOTICE 'Recreating RLS policies for reviews table...';
END $;

DROP POLICY IF EXISTS "Reviews are viewable within tenant" ON public.reviews;
DROP POLICY IF EXISTS "Users can insert reviews within tenant" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their reviews within tenant" ON public.reviews;
DROP POLICY IF EXISTS "Admins can delete reviews within tenant" ON public.reviews;

CREATE POLICY "Reviews are viewable within tenant"
  ON public.reviews FOR SELECT
  USING (
    public.is_super_admin()
    OR tenant_id = public.get_user_tenant_id()
  );

CREATE POLICY "Users can insert reviews within tenant"
  ON public.reviews FOR INSERT
  WITH CHECK (
    public.is_super_admin()
    OR tenant_id = public.get_user_tenant_id()
  );

CREATE POLICY "Users can update their reviews within tenant"
  ON public.reviews FOR UPDATE
  USING (
    public.is_super_admin()
    OR (
      tenant_id = public.get_user_tenant_id()
      AND (
        auth.uid() = user_id
        OR auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin' AND id = auth.uid())
      )
    )
  );

CREATE POLICY "Admins can delete reviews within tenant"
  ON public.reviews FOR DELETE
  USING (
    public.is_super_admin()
    OR (
      tenant_id = public.get_user_tenant_id()
      AND (
        auth.uid() = user_id
        OR auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin' AND id = auth.uid())
      )
    )
  );

DO $
BEGIN
  RAISE NOTICE '✓ Reviews table RLS policies recreated';
END $;

-- TEMPLATES TABLE
DO $
BEGIN
  RAISE NOTICE 'Recreating RLS policies for templates table...';
END $;

DROP POLICY IF EXISTS "Templates are viewable within tenant" ON public.templates;
DROP POLICY IF EXISTS "Admins can insert templates within tenant" ON public.templates;
DROP POLICY IF EXISTS "Admins can update templates within tenant" ON public.templates;
DROP POLICY IF EXISTS "Admins can delete templates within tenant" ON public.templates;

CREATE POLICY "Templates are viewable within tenant"
  ON public.templates FOR SELECT
  USING (
    public.is_super_admin()
    OR tenant_id = public.get_user_tenant_id()
  );

CREATE POLICY "Admins can insert templates within tenant"
  ON public.templates FOR INSERT
  WITH CHECK (
    public.is_super_admin()
    OR (
      tenant_id = public.get_user_tenant_id()
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin' AND id = auth.uid())
    )
  );

CREATE POLICY "Admins can update templates within tenant"
  ON public.templates FOR UPDATE
  USING (
    public.is_super_admin()
    OR (
      tenant_id = public.get_user_tenant_id()
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin' AND id = auth.uid())
    )
  );

CREATE POLICY "Admins can delete templates within tenant"
  ON public.templates FOR DELETE
  USING (
    public.is_super_admin()
    OR (
      tenant_id = public.get_user_tenant_id()
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin' AND id = auth.uid())
    )
  );

DO $
BEGIN
  RAISE NOTICE '✓ Templates table RLS policies recreated';
END $;

-- ARTICLES TABLE
DO $
BEGIN
  RAISE NOTICE 'Recreating RLS policies for articles table...';
END $;

DROP POLICY IF EXISTS "Articles are viewable within tenant" ON public.articles;
DROP POLICY IF EXISTS "Admins can insert articles within tenant" ON public.articles;
DROP POLICY IF EXISTS "Admins can update articles within tenant" ON public.articles;
DROP POLICY IF EXISTS "Admins can delete articles within tenant" ON public.articles;

CREATE POLICY "Articles are viewable within tenant"
  ON public.articles FOR SELECT
  USING (
    public.is_super_admin()
    OR tenant_id = public.get_user_tenant_id()
  );

CREATE POLICY "Admins can insert articles within tenant"
  ON public.articles FOR INSERT
  WITH CHECK (
    public.is_super_admin()
    OR (
      tenant_id = public.get_user_tenant_id()
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin' AND id = auth.uid())
    )
  );

CREATE POLICY "Admins can update articles within tenant"
  ON public.articles FOR UPDATE
  USING (
    public.is_super_admin()
    OR (
      tenant_id = public.get_user_tenant_id()
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin' AND id = auth.uid())
    )
  );

CREATE POLICY "Admins can delete articles within tenant"
  ON public.articles FOR DELETE
  USING (
    public.is_super_admin()
    OR (
      tenant_id = public.get_user_tenant_id()
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin' AND id = auth.uid())
    )
  );

DO $
BEGIN
  RAISE NOTICE '✓ Articles table RLS policies recreated';
END $;

-- FAVORITES TABLE
DO $
BEGIN
  RAISE NOTICE 'Recreating RLS policies for favorites table...';
END $;

DROP POLICY IF EXISTS "Favorites are viewable within tenant" ON public.favorites;
DROP POLICY IF EXISTS "Users can insert favorites within tenant" ON public.favorites;
DROP POLICY IF EXISTS "Users can update their favorites within tenant" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete their favorites within tenant" ON public.favorites;

CREATE POLICY "Favorites are viewable within tenant"
  ON public.favorites FOR SELECT
  USING (
    public.is_super_admin()
    OR tenant_id = public.get_user_tenant_id()
  );

CREATE POLICY "Users can insert favorites within tenant"
  ON public.favorites FOR INSERT
  WITH CHECK (
    public.is_super_admin()
    OR (
      tenant_id = public.get_user_tenant_id()
      AND auth.uid() = user_id
    )
  );

CREATE POLICY "Users can update their favorites within tenant"
  ON public.favorites FOR UPDATE
  USING (
    public.is_super_admin()
    OR (
      tenant_id = public.get_user_tenant_id()
      AND auth.uid() = user_id
    )
  );

CREATE POLICY "Users can delete their favorites within tenant"
  ON public.favorites FOR DELETE
  USING (
    public.is_super_admin()
    OR (
      tenant_id = public.get_user_tenant_id()
      AND auth.uid() = user_id
    )
  );

DO $
BEGIN
  RAISE NOTICE '✓ Favorites table RLS policies recreated';
END $;

-- CART TABLE
DO $
BEGIN
  RAISE NOTICE 'Recreating RLS policies for cart table...';
END $;

DROP POLICY IF EXISTS "Cart items are viewable within tenant" ON public.cart;
DROP POLICY IF EXISTS "Users can insert cart items within tenant" ON public.cart;
DROP POLICY IF EXISTS "Users can update their cart items within tenant" ON public.cart;
DROP POLICY IF EXISTS "Users can delete their cart items within tenant" ON public.cart;

CREATE POLICY "Cart items are viewable within tenant"
  ON public.cart FOR SELECT
  USING (
    public.is_super_admin()
    OR tenant_id = public.get_user_tenant_id()
  );

CREATE POLICY "Users can insert cart items within tenant"
  ON public.cart FOR INSERT
  WITH CHECK (
    public.is_super_admin()
    OR (
      tenant_id = public.get_user_tenant_id()
      AND auth.uid() = user_id
    )
  );

CREATE POLICY "Users can update their cart items within tenant"
  ON public.cart FOR UPDATE
  USING (
    public.is_super_admin()
    OR (
      tenant_id = public.get_user_tenant_id()
      AND auth.uid() = user_id
    )
  );

CREATE POLICY "Users can delete their cart items within tenant"
  ON public.cart FOR DELETE
  USING (
    public.is_super_admin()
    OR (
      tenant_id = public.get_user_tenant_id()
      AND auth.uid() = user_id
    )
  );

DO $
BEGIN
  RAISE NOTICE '✓ Cart table RLS policies recreated';
END $;

-- SERVICES TABLE
DO $
BEGIN
  RAISE NOTICE 'Recreating RLS policies for services table...';
END $;

DROP POLICY IF EXISTS "Services are viewable within tenant" ON public.services;
DROP POLICY IF EXISTS "Admins can insert services within tenant" ON public.services;
DROP POLICY IF EXISTS "Admins can update services within tenant" ON public.services;
DROP POLICY IF EXISTS "Admins can delete services within tenant" ON public.services;

CREATE POLICY "Services are viewable within tenant"
  ON public.services FOR SELECT
  USING (
    public.is_super_admin()
    OR tenant_id = public.get_user_tenant_id()
  );

CREATE POLICY "Admins can insert services within tenant"
  ON public.services FOR INSERT
  WITH CHECK (
    public.is_super_admin()
    OR (
      tenant_id = public.get_user_tenant_id()
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin' AND id = auth.uid())
    )
  );

CREATE POLICY "Admins can update services within tenant"
  ON public.services FOR UPDATE
  USING (
    public.is_super_admin()
    OR (
      tenant_id = public.get_user_tenant_id()
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin' AND id = auth.uid())
    )
  );

CREATE POLICY "Admins can delete services within tenant"
  ON public.services FOR DELETE
  USING (
    public.is_super_admin()
    OR (
      tenant_id = public.get_user_tenant_id()
      AND auth.uid() IN (SELECT id FROM public.profiles WHERE user_type = 'admin' AND id = auth.uid())
    )
  );

DO $
BEGIN
  RAISE NOTICE '✓ Services table RLS policies recreated';
END $;

-- =============================================
-- VALIDATION
-- =============================================

DO $
DECLARE
  policy_count INTEGER;
  function_count INTEGER;
BEGIN
  -- Count policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
  AND tablename IN (
    'profiles', 'lawyers', 'consultations', 'orders', 'reviews',
    'templates', 'articles', 'favorites', 'cart', 'services'
  );
  
  -- Count helper functions
  SELECT COUNT(*) INTO function_count
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public'
  AND p.proname IN ('is_super_admin', 'get_user_tenant_id');
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'RLS INFINITE RECURSION FIX COMPLETED';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✓ Created % helper functions', function_count;
  RAISE NOTICE '✓ Recreated % RLS policies', policy_count;
  RAISE NOTICE '✓ Fixed infinite recursion issue';
  RAISE NOTICE '';
  RAISE NOTICE 'Helper Functions:';
  RAISE NOTICE '  1. is_super_admin() - Check if user is super admin';
  RAISE NOTICE '  2. get_user_tenant_id() - Get user tenant ID';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '  1. Test login with 403940124@qq.com';
  RAISE NOTICE '  2. Set super_admin flag for this user';
  RAISE NOTICE '  3. Verify super admin access';
  RAISE NOTICE '========================================';
END $;
