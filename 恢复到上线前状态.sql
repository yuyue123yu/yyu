-- ============================================
-- 恢复数据库到上线前的状态
-- ============================================

-- 这个脚本会：
-- 1. 删除所有 Super Admin 相关的修改
-- 2. 恢复原始的 RLS 策略
-- 3. 恢复 tenant_id NOT NULL 约束
-- 4. 删除辅助函数

-- ============================================
-- 步骤 1: 删除辅助函数
-- ============================================

DROP FUNCTION IF EXISTS public.is_super_admin(UUID);
DROP FUNCTION IF EXISTS public.get_user_tenant_id(UUID);

-- ============================================
-- 步骤 2: 恢复原始的 RLS 策略（使用子查询）
-- ============================================

-- 删除当前的策略
DROP POLICY IF EXISTS "Users can view profiles in their tenant" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can delete profiles" ON public.profiles;

-- 创建原始的策略（带子查询）
CREATE POLICY "Users can view profiles in their tenant"
  ON public.profiles FOR SELECT
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
  );

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (auth.uid() = id)
  );

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (
    (auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true))
    OR (auth.uid() = id AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
  );

CREATE POLICY "Super admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE super_admin = true)
  );

-- ============================================
-- 步骤 3: 恢复 tenant_id NOT NULL 约束
-- ============================================

-- 注意：这会导致 Super Admin 无法存在（因为 Super Admin 需要 tenant_id = NULL）
-- 如果您想保留 Super Admin 功能，请跳过这一步

-- 先删除所有 tenant_id 为 NULL 的记录（包括 Super Admin）
DELETE FROM public.profiles WHERE tenant_id IS NULL;

-- 然后设置 NOT NULL 约束
ALTER TABLE public.profiles 
  ALTER COLUMN tenant_id SET NOT NULL;

-- ============================================
-- 步骤 4: 验证恢复结果
-- ============================================

-- 检查辅助函数是否已删除
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('is_super_admin', 'get_user_tenant_id');

-- 检查 tenant_id 约束
SELECT 
    column_name,
    is_nullable,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
AND column_name = 'tenant_id';

-- 检查 RLS 策略
SELECT 
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'profiles'
ORDER BY policyname;

-- ============================================
-- 完成提示
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '数据库已恢复到上线前状态';
    RAISE NOTICE '========================================';
    RAISE NOTICE '已完成:';
    RAISE NOTICE '  ✓ 删除辅助函数';
    RAISE NOTICE '  ✓ 恢复原始 RLS 策略';
    RAISE NOTICE '  ✓ 恢复 tenant_id NOT NULL 约束';
    RAISE NOTICE '  ✓ 删除所有 Super Admin 用户';
    RAISE NOTICE '';
    RAISE NOTICE '注意:';
    RAISE NOTICE '  - Super Admin 功能已禁用';
    RAISE NOTICE '  - 所有用户必须有 tenant_id';
    RAISE NOTICE '  - 如需重新启用 Super Admin，请重新执行迁移脚本';
    RAISE NOTICE '========================================';
END $$;
