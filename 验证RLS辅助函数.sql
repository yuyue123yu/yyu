-- ============================================
-- 验证 RLS 辅助函数是否存在
-- ============================================

-- 1. 检查辅助函数是否存在
SELECT 
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('is_super_admin', 'get_user_tenant_id');

-- 2. 如果不存在，创建它们
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

-- 3. 测试函数
DO $$
DECLARE
    test_user_id UUID;
    is_admin BOOLEAN;
    user_tenant UUID;
BEGIN
    -- 获取测试用户 ID
    SELECT id INTO test_user_id
    FROM auth.users
    WHERE email = '403940124@qq.com';

    IF test_user_id IS NOT NULL THEN
        -- 测试 is_super_admin 函数
        SELECT public.is_super_admin(test_user_id) INTO is_admin;
        RAISE NOTICE 'is_super_admin(%): %', test_user_id, is_admin;

        -- 测试 get_user_tenant_id 函数
        SELECT public.get_user_tenant_id(test_user_id) INTO user_tenant;
        RAISE NOTICE 'get_user_tenant_id(%): %', test_user_id, user_tenant;
    ELSE
        RAISE NOTICE '未找到用户: 403940124@qq.com';
    END IF;
END $$;

-- 4. 查看当前的 RLS 策略
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'profiles'
ORDER BY policyname;
