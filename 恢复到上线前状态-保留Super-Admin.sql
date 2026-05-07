-- ============================================
-- 恢复数据库到上线前状态（保留 Super Admin 用户）
-- ============================================

-- 这个脚本会：
-- 1. 删除辅助函数
-- 2. 恢复原始的 RLS 策略
-- 3. 保持 tenant_id 可以为 NULL（保留 Super Admin）

-- ============================================
-- 步骤 1: 删除辅助函数
-- ============================================

DROP FUNCTION IF EXISTS public.is_super_admin(UUID);
DROP FUNCTION IF EXISTS public.get_user_tenant_id(UUID);

RAISE NOTICE '✓ 辅助函数已删除';

-- ============================================
-- 步骤 2: 恢复原始的 RLS 策略（使用子查询）
-- ============================================

-- 删除当前的策略
DROP POLICY IF EXISTS "Users can view profiles in their tenant" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can delete profiles" ON public.profiles;

-- 创建原始的策略（带子查询 - 这会导致无限递归）
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

RAISE NOTICE '✓ RLS 策略已恢复（原始版本，带子查询）';

-- ============================================
-- 步骤 3: 确保 tenant_id 允许 NULL
-- ============================================

ALTER TABLE public.profiles 
  ALTER COLUMN tenant_id DROP NOT NULL;

RAISE NOTICE '✓ tenant_id 约束已设置为允许 NULL';

-- ============================================
-- 步骤 4: 验证 Super Admin 配置
-- ============================================

SELECT 
    id,
    email,
    user_type,
    super_admin,
    tenant_id
FROM public.profiles
WHERE super_admin = true OR user_type = 'super_admin';

-- ============================================
-- 完成提示
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '数据库已恢复到上线前状态';
    RAISE NOTICE '========================================';
    RAISE NOTICE '已完成:';
    RAISE NOTICE '  ✓ 删除辅助函数';
    RAISE NOTICE '  ✓ 恢复原始 RLS 策略（带子查询）';
    RAISE NOTICE '  ✓ tenant_id 允许 NULL';
    RAISE NOTICE '  ✓ Super Admin 用户已保留';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  警告:';
    RAISE NOTICE '  - RLS 策略使用子查询，可能导致无限递归';
    RAISE NOTICE '  - Super Admin 登录可能会失败';
    RAISE NOTICE '  - 这是上线前的原始状态';
    RAISE NOTICE '';
    RAISE NOTICE '如需修复 Super Admin 登录:';
    RAISE NOTICE '  1. 执行 修复RLS无限递归.sql';
    RAISE NOTICE '  2. 重新创建辅助函数';
    RAISE NOTICE '========================================';
END $$;
