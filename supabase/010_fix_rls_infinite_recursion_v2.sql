-- =============================================
-- FIX: INFINITE RECURSION IN RLS POLICIES
-- Migration: 010_fix_rls_infinite_recursion
-- Description: Fix infinite recursion by using helper functions
-- =============================================

-- =============================================
-- STEP 1: CREATE HELPER FUNCTIONS
-- =============================================

-- Function to check if current user is super admin
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

-- =============================================
-- STEP 2: RECREATE PROFILES TABLE RLS POLICIES
-- =============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view profiles in their tenant" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can delete profiles" ON public.profiles;

-- SELECT policy
CREATE POLICY "Users can view profiles in their tenant"
  ON public.profiles FOR SELECT
  USING (
    public.is_super_admin()
    OR tenant_id = public.get_user_tenant_id()
  );

-- INSERT policy
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (
    public.is_super_admin()
    OR auth.uid() = id
  );

-- UPDATE policy
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (
    public.is_super_admin()
    OR (auth.uid() = id AND tenant_id = public.get_user_tenant_id())
  );

-- DELETE policy
CREATE POLICY "Super admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (
    public.is_super_admin()
  );

-- =============================================
-- STEP 3: RECREATE LAWYERS TABLE RLS POLICIES (if exists)
-- =============================================

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

-- =============================================
-- STEP 4: RECREATE CONSULTATIONS TABLE RLS POLICIES (if exists)
-- =============================================

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

-- =============================================
-- STEP 5: RECREATE ORDERS TABLE RLS POLICIES (if exists)
-- =============================================

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

-- =============================================
-- STEP 6: RECREATE REVIEWS TABLE RLS POLICIES (if exists)
-- =============================================

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

-- =============================================
-- STEP 7: RECREATE TEMPLATES TABLE RLS POLICIES (if exists)
-- =============================================

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

-- =============================================
-- STEP 8: RECREATE ARTICLES TABLE RLS POLICIES (if exists)
-- =============================================

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

-- =============================================
-- STEP 9: RECREATE FAVORITES TABLE RLS POLICIES (if exists)
-- =============================================

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

-- =============================================
-- STEP 10: RECREATE CART TABLE RLS POLICIES (if exists)
-- =============================================

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

-- =============================================
-- STEP 11: RECREATE SERVICES TABLE RLS POLICIES (if exists)
-- =============================================

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
