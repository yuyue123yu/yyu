-- ========================================
-- 临时简化 RLS 策略 - 仅用于测试
-- ========================================

-- 1. 删除所有旧的策略
DROP POLICY IF EXISTS "users_select_own_profile" ON profiles;
DROP POLICY IF EXISTS "super_admin_select_all" ON profiles;
DROP POLICY IF EXISTS "admin_select_tenant" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "super_admin_update_all" ON profiles;

-- 2. 创建最简单的策略：用户可以查看自己的 profile
CREATE POLICY "simple_select_own" ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 3. 验证策略
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles';

-- 4. 测试查询
SELECT 
  id,
  email,
  user_type,
  super_admin,
  tenant_id
FROM profiles
WHERE id = auth.uid();
