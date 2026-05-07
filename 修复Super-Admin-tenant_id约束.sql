-- ============================================
-- 修复 Super Admin tenant_id 约束问题
-- ============================================
-- 问题：profiles.tenant_id 被设置为 NOT NULL
-- 但 Super Admin 需要 tenant_id = NULL
-- ============================================

-- 1. 查看当前约束
SELECT 
    column_name,
    is_nullable,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
AND column_name IN ('tenant_id', 'super_admin', 'user_type');

-- 2. 将 profiles.tenant_id 改回允许 NULL
ALTER TABLE public.profiles 
  ALTER COLUMN tenant_id DROP NOT NULL;

-- 3. 验证修改
SELECT 
    column_name,
    is_nullable,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
AND column_name = 'tenant_id';

-- 4. 确保 Super Admin 的 tenant_id 是 NULL
UPDATE public.profiles
SET tenant_id = NULL
WHERE super_admin = true
OR user_type = 'super_admin';

-- 5. 验证 Super Admin 配置
SELECT 
    id,
    email,
    user_type,
    super_admin,
    tenant_id,
    created_at
FROM public.profiles
WHERE email = '403940124@qq.com';

-- 预期结果：
-- - tenant_id 列应该是 nullable (is_nullable = 'YES')
-- - Super Admin 的 tenant_id 应该是 NULL
-- - super_admin = true
-- - user_type = 'super_admin'

RAISE NOTICE '✅ Super Admin tenant_id 约束已修复';
RAISE NOTICE '✅ profiles.tenant_id 现在允许 NULL';
RAISE NOTICE '✅ Super Admin 的 tenant_id 已设置为 NULL';
