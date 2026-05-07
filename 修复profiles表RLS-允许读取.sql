-- 修复 profiles 表的 RLS 策略
-- 问题：Server Component 无法读取 profiles 表

-- 1. 删除旧的 SELECT 策略
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to read profiles" ON profiles;

-- 2. 创建新的 SELECT 策略 - 允许已认证用户读取自己的 profile
CREATE POLICY "authenticated_users_select_own_profile" ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 3. 允许 Super Admin 读取所有 profiles
CREATE POLICY "super_admin_select_all_profiles" ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND super_admin = true
    )
  );

-- 4. 允许 Admin 读取同租户的 profiles
CREATE POLICY "admin_select_tenant_profiles" ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.user_type = 'admin'
      AND (p.tenant_id = profiles.tenant_id OR p.super_admin = true)
    )
  );

-- 验证策略
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;
