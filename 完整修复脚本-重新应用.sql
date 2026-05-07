-- ============================================
-- 完整修复脚本 - 在正确的Supabase项目中重新应用
-- ============================================
-- 
-- 使用说明：
-- 1. 确认已连接到正确的 Supabase 项目
-- 2. 在 Supabase Dashboard 的 SQL Editor 中执行此脚本
-- 3. 按顺序执行，不要跳过任何步骤
-- 
-- ============================================

-- ============================================
-- 第1步：修复 profiles 表结构
-- ============================================

-- 1.1 允许 tenant_id 为 NULL（Super Admin 需要）
ALTER TABLE profiles ALTER COLUMN tenant_id DROP NOT NULL;

-- 1.2 修复 user_type 约束，包含 super_admin
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_user_type_check 
  CHECK (user_type IN ('user', 'lawyer', 'admin', 'super_admin'));

-- 1.3 确保 super_admin 列存在
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'super_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN super_admin BOOLEAN DEFAULT false;
  END IF;
END $$;

-- ============================================
-- 第2步：创建 RLS 辅助函数
-- ============================================

-- 2.1 创建 is_super_admin 函数
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id AND super_admin = true
  );
$$;

-- 2.2 创建 get_user_tenant_id 函数
CREATE OR REPLACE FUNCTION public.get_user_tenant_id(user_id uuid)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT tenant_id FROM profiles WHERE id = user_id;
$$;

-- ============================================
-- 第3步：重建 RLS 策略
-- ============================================

-- 3.1 删除旧的 RLS 策略
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view tenant profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update tenant profiles" ON profiles;

-- 3.2 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3.3 创建新的 RLS 策略

-- 用户可以查看自己的 Profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- 用户可以更新自己的 Profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Super Admin 可以查看所有 Profile
CREATE POLICY "Super admins can view all profiles"
ON profiles FOR SELECT
USING (public.is_super_admin(auth.uid()));

-- Super Admin 可以更新所有 Profile
CREATE POLICY "Super admins can update all profiles"
ON profiles FOR UPDATE
USING (public.is_super_admin(auth.uid()));

-- Super Admin 可以插入 Profile
CREATE POLICY "Super admins can insert profiles"
ON profiles FOR INSERT
WITH CHECK (public.is_super_admin(auth.uid()));

-- Super Admin 可以删除 Profile
CREATE POLICY "Super admins can delete profiles"
ON profiles FOR DELETE
USING (public.is_super_admin(auth.uid()));

-- 管理员可以查看同租户的 Profile
CREATE POLICY "Admins can view tenant profiles"
ON profiles FOR SELECT
USING (
  user_type = 'admin' 
  AND tenant_id = public.get_user_tenant_id(auth.uid())
  AND tenant_id IS NOT NULL
);

-- 管理员可以更新同租户的 Profile
CREATE POLICY "Admins can update tenant profiles"
ON profiles FOR UPDATE
USING (
  user_type = 'admin' 
  AND tenant_id = public.get_user_tenant_id(auth.uid())
  AND tenant_id IS NOT NULL
);

-- ============================================
-- 第4步：创建或更新管理员账号
-- ============================================

-- 4.1 检查用户是否存在
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- 从 auth.users 获取用户ID
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = '403940124@qq.com';

  IF v_user_id IS NOT NULL THEN
    -- 用户存在，更新 Profile
    UPDATE profiles
    SET 
      user_type = 'admin',
      super_admin = true,
      tenant_id = NULL,
      updated_at = now()
    WHERE id = v_user_id;

    RAISE NOTICE '已更新用户 % 为 Super Admin', v_user_id;
  ELSE
    RAISE NOTICE '用户不存在，请先在 Authentication > Users 中创建用户';
  END IF;
END $$;

-- ============================================
-- 第5步：验证修复结果
-- ============================================

-- 5.1 检查表结构
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('tenant_id', 'user_type', 'super_admin')
ORDER BY ordinal_position;

-- 5.2 检查 RLS 函数
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('is_super_admin', 'get_user_tenant_id');

-- 5.3 检查 RLS 策略
SELECT 
    policyname,
    cmd,
    permissive
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 5.4 检查管理员账号
SELECT 
    id,
    email,
    full_name,
    user_type,
    super_admin,
    tenant_id,
    created_at
FROM profiles
WHERE email = '403940124@qq.com';

-- 5.5 检查 auth.users
SELECT 
    id,
    email,
    email_confirmed_at,
    last_sign_in_at
FROM auth.users
WHERE email = '403940124@qq.com';

-- ============================================
-- 完成！
-- ============================================

-- 如果所有检查都通过，应该看到：
-- ✅ tenant_id 列允许 NULL
-- ✅ user_type 约束包含 'super_admin'
-- ✅ super_admin 列存在
-- ✅ 两个 RLS 辅助函数存在
-- ✅ 多个 RLS 策略存在
-- ✅ 管理员账号存在且配置正确

-- 下一步：
-- 1. 在 Supabase Dashboard 的 Authentication > Users 中为用户设置密码
-- 2. 访问 http://localhost:3000/diagnose-login 进行诊断
-- 3. 测试登录功能
