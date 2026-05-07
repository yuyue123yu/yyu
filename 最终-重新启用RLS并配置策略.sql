-- ========================================
-- 重新启用 RLS 并配置正确的策略
-- ========================================

-- 1. 重新启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. 删除所有旧的策略
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to read profiles" ON profiles;
DROP POLICY IF EXISTS "authenticated_users_select_own_profile" ON profiles;
DROP POLICY IF EXISTS "super_admin_select_all_profiles" ON profiles;
DROP POLICY IF EXISTS "admin_select_tenant_profiles" ON profiles;

-- 3. 创建新的 SELECT 策略
-- 策略1: 用户可以查看自己的 profile
CREATE POLICY "users_select_own_profile" ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 策略2: Super Admin 可以查看所有 profiles
CREATE POLICY "super_admin_select_all" ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND super_admin = true
    )
  );

-- 策略3: Admin 可以查看同租户的 profiles
CREATE POLICY "admin_select_tenant" ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.user_type = 'admin'
      AND (
        p.tenant_id = profiles.tenant_id 
        OR p.super_admin = true
        OR profiles.tenant_id IS NULL
      )
    )
  );

-- 4. 创建 UPDATE 策略
-- 用户可以更新自己的 profile
CREATE POLICY "users_update_own_profile" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Super Admin 可以更新所有 profiles
CREATE POLICY "super_admin_update_all" ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND super_admin = true
    )
  );

-- 5. 验证策略
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 6. 验证 RLS 状态
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';
