-- =============================================
-- 修复 Profiles 表 RLS 无限递归问题
-- 在 Supabase SQL Editor 中执行此脚本
-- =============================================

-- 问题：当前的 RLS 策略在检查权限时会查询 profiles 表，
-- 而查询 profiles 表又会触发 RLS 策略，导致无限递归

-- 解决方案：使用 security definer 函数来绕过 RLS

-- 步骤 1：创建辅助函数（绕过 RLS）
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND super_admin = true
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_tenant_id(user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT tenant_id FROM public.profiles
    WHERE id = user_id
  );
END;
$$;

-- 步骤 2：删除旧的 RLS 策略
DROP POLICY IF EXISTS "Users can view profiles in their tenant" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can delete profiles" ON public.profiles;

-- 步骤 3：创建新的 RLS 策略（使用辅助函数）

-- SELECT policy
CREATE POLICY "Users can view profiles in their tenant"
  ON public.profiles FOR SELECT
  USING (
    public.is_super_admin(auth.uid())
    OR tenant_id = public.get_user_tenant_id(auth.uid())
    OR id = auth.uid()  -- 用户可以查看自己的 profile
  );

-- INSERT policy
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (
    public.is_super_admin(auth.uid())
    OR auth.uid() = id
  );

-- UPDATE policy
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (
    public.is_super_admin(auth.uid())
    OR (auth.uid() = id AND tenant_id = public.get_user_tenant_id(auth.uid()))
  );

-- DELETE policy
CREATE POLICY "Super admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (
    public.is_super_admin(auth.uid())
  );

-- 步骤 4：验证
SELECT '========================================' as info;
SELECT '修复完成！' as title;
SELECT '========================================' as info;

-- 测试查询（应该能正常返回结果）
SELECT 
  id,
  email,
  super_admin,
  user_type,
  tenant_id
FROM profiles
WHERE email = '403940124@qq.com';
