-- ============================================
-- 验证 Supabase 配置和数据库状态
-- ============================================

-- 1. 检查 profiles 表结构
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. 检查管理员账号
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

-- 3. 检查 auth.users 表
SELECT 
    id,
    email,
    email_confirmed_at,
    last_sign_in_at,
    created_at
FROM auth.users
WHERE email = '403940124@qq.com';

-- 4. 检查 RLS 辅助函数是否存在
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('is_super_admin', 'get_user_tenant_id');

-- 5. 检查 profiles 表的 RLS 策略
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- 6. 测试 RLS 辅助函数（需要替换 USER_ID）
-- 注意：执行前需要先获取用户ID
-- SELECT public.is_super_admin('USER_ID_HERE');
-- SELECT public.get_user_tenant_id('USER_ID_HERE');

-- 7. 检查是否有其他管理员账号
SELECT 
    email,
    user_type,
    super_admin,
    tenant_id
FROM profiles
WHERE user_type = 'admin' OR super_admin = true;

-- 8. 检查 tenant_id 约束
SELECT
    con.conname AS constraint_name,
    con.contype AS constraint_type,
    pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'profiles'
AND con.conname LIKE '%tenant%';

-- ============================================
-- 如果发现问题，执行以下修复
-- ============================================

-- 修复1：确保 tenant_id 可以为 NULL
-- ALTER TABLE profiles ALTER COLUMN tenant_id DROP NOT NULL;

-- 修复2：确保用户类型约束包含 super_admin
-- ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;
-- ALTER TABLE profiles ADD CONSTRAINT profiles_user_type_check 
--   CHECK (user_type IN ('user', 'lawyer', 'admin', 'super_admin'));

-- 修复3：设置用户为管理员
-- UPDATE profiles 
-- SET user_type = 'admin', super_admin = true, tenant_id = NULL
-- WHERE email = '403940124@qq.com';

-- 修复4：创建 RLS 辅助函数（如果不存在）
/*
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

CREATE OR REPLACE FUNCTION public.get_user_tenant_id(user_id uuid)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT tenant_id FROM profiles WHERE id = user_id;
$$;
*/
