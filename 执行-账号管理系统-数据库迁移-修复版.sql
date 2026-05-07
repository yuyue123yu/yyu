-- =============================================
-- 账号管理系统 - 数据库迁移（修复版）
-- 执行日期: 2026-05-05
-- 说明: 增强 profiles 表并创建密码重置历史表
-- =============================================

-- =============================================
-- PART 1: 增强 profiles 表
-- =============================================

-- 1.1 添加父账号ID（用于子账号管理）
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'parent_user_id'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN parent_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
    RAISE NOTICE '✓ 添加 parent_user_id 字段';
  ELSE
    RAISE NOTICE '○ parent_user_id 字段已存在';
  END IF;
END $$;

-- 1.2 添加用户角色
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN role TEXT DEFAULT 'user';
    RAISE NOTICE '✓ 添加 role 字段';
  ELSE
    RAISE NOTICE '○ role 字段已存在';
  END IF;
END $$;

-- 1.2.1 添加角色约束（如果不存在）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_role_check'
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('owner', 'admin', 'manager', 'user'));
    RAISE NOTICE '✓ 添加 role 约束';
  ELSE
    RAISE NOTICE '○ role 约束已存在';
  END IF;
END $$;

-- 1.3 添加权限配置
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'permissions'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN permissions JSONB DEFAULT '{}'::jsonb;
    RAISE NOTICE '✓ 添加 permissions 字段';
  ELSE
    RAISE NOTICE '○ permissions 字段已存在';
  END IF;
END $$;

-- 1.4 添加账号激活状态
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN is_active BOOLEAN DEFAULT true;
    RAISE NOTICE '✓ 添加 is_active 字段';
  ELSE
    RAISE NOTICE '○ is_active 字段已存在';
  END IF;
END $$;

-- 1.5 添加最后登录时间
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'last_login_at'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN last_login_at TIMESTAMPTZ;
    RAISE NOTICE '✓ 添加 last_login_at 字段';
  ELSE
    RAISE NOTICE '○ last_login_at 字段已存在';
  END IF;
END $$;

-- 1.6 添加索引
CREATE INDEX IF NOT EXISTS idx_profiles_parent_user_id 
  ON public.profiles(parent_user_id);

CREATE INDEX IF NOT EXISTS idx_profiles_tenant_role 
  ON public.profiles(tenant_id, role);

CREATE INDEX IF NOT EXISTS idx_profiles_is_active 
  ON public.profiles(is_active);

-- 1.7 添加注释
COMMENT ON COLUMN public.profiles.parent_user_id IS 
  '父账号ID，用于子账号管理（NULL表示主账号）';

COMMENT ON COLUMN public.profiles.role IS 
  '用户角色：owner(所有者), admin(管理员), manager(经理), user(普通用户)';

COMMENT ON COLUMN public.profiles.permissions IS 
  '权限配置：可以细粒度控制功能权限';

COMMENT ON COLUMN public.profiles.is_active IS 
  '账号是否激活（可用于禁用子账号）';

COMMENT ON COLUMN public.profiles.last_login_at IS 
  '最后登录时间';

-- 1.8 更新现有数据
UPDATE public.profiles 
SET role = 'owner' 
WHERE user_type = 'admin' AND (role IS NULL OR role = 'user');

UPDATE public.profiles 
SET role = 'user' 
WHERE user_type = 'user' AND role IS NULL;

UPDATE public.profiles 
SET is_active = true 
WHERE is_active IS NULL;

-- =============================================
-- PART 2: 创建密码重置历史表
-- =============================================

-- 2.1 创建密码重置历史表
CREATE TABLE IF NOT EXISTS public.password_reset_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reset_method TEXT NOT NULL,
  reset_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2.1.1 添加约束
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'password_reset_history_reset_method_check'
  ) THEN
    ALTER TABLE public.password_reset_history 
    ADD CONSTRAINT password_reset_history_reset_method_check 
    CHECK (reset_method IN ('email', 'admin', 'self'));
  END IF;
END $$;

-- 2.2 添加索引
CREATE INDEX IF NOT EXISTS idx_password_reset_history_user_id 
  ON public.password_reset_history(user_id);

CREATE INDEX IF NOT EXISTS idx_password_reset_history_created_at 
  ON public.password_reset_history(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_password_reset_history_reset_method 
  ON public.password_reset_history(reset_method);

CREATE INDEX IF NOT EXISTS idx_password_reset_history_user_time 
  ON public.password_reset_history(user_id, created_at DESC);

-- 2.3 启用 RLS
ALTER TABLE public.password_reset_history ENABLE ROW LEVEL SECURITY;

-- 2.4 删除旧策略（如果存在）
DROP POLICY IF EXISTS "Users can view own password reset history" ON public.password_reset_history;
DROP POLICY IF EXISTS "Super admins can view all password reset history" ON public.password_reset_history;
DROP POLICY IF EXISTS "Tenant admins can view tenant password reset history" ON public.password_reset_history;
DROP POLICY IF EXISTS "Authenticated users can insert password reset history" ON public.password_reset_history;

-- 2.5 创建 RLS 策略
CREATE POLICY "Users can view own password reset history"
  ON public.password_reset_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can view all password reset history"
  ON public.password_reset_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND super_admin = true
    )
  );

CREATE POLICY "Tenant admins can view tenant password reset history"
  ON public.password_reset_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p1
      JOIN public.profiles p2 ON p1.tenant_id = p2.tenant_id
      WHERE p1.id = auth.uid() 
      AND p1.role IN ('owner', 'admin')
      AND p2.id = password_reset_history.user_id
    )
  );

CREATE POLICY "Authenticated users can insert password reset history"
  ON public.password_reset_history
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 2.6 添加注释
COMMENT ON TABLE public.password_reset_history IS 
  '密码重置历史记录，用于安全审计和追踪';

COMMENT ON COLUMN public.password_reset_history.id IS 
  '唯一标识符';

COMMENT ON COLUMN public.password_reset_history.user_id IS 
  '密码被重置的用户ID';

COMMENT ON COLUMN public.password_reset_history.reset_method IS 
  '重置方式：email(邮件重置), admin(管理员重置), self(用户自己修改)';

COMMENT ON COLUMN public.password_reset_history.reset_by IS 
  '执行重置的管理员ID（仅当reset_method=admin时有值）';

COMMENT ON COLUMN public.password_reset_history.ip_address IS 
  '请求来源IP地址';

COMMENT ON COLUMN public.password_reset_history.user_agent IS 
  '请求来源User-Agent';

COMMENT ON COLUMN public.password_reset_history.created_at IS 
  '重置时间';

-- 2.7 创建辅助函数
CREATE OR REPLACE FUNCTION check_password_reset_rate_limit(
  p_user_id UUID,
  p_time_window INTERVAL DEFAULT '1 hour',
  p_max_attempts INTEGER DEFAULT 3
)
RETURNS BOOLEAN AS $$
DECLARE
  v_attempt_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO v_attempt_count
  FROM public.password_reset_history
  WHERE user_id = p_user_id
  AND created_at > NOW() - p_time_window;
  
  RETURN v_attempt_count < p_max_attempts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION check_password_reset_rate_limit IS 
  '检查用户是否超过密码重置频率限制';

-- =============================================
-- 最终验证
-- =============================================

DO $$
DECLARE
  v_profiles_columns INTEGER;
  v_history_table_exists BOOLEAN;
  v_rls_enabled BOOLEAN;
BEGIN
  SELECT COUNT(*)
  INTO v_profiles_columns
  FROM information_schema.columns 
  WHERE table_name = 'profiles' 
  AND column_name IN ('parent_user_id', 'role', 'permissions', 'is_active', 'last_login_at');
  
  IF v_profiles_columns < 5 THEN
    RAISE EXCEPTION '❌ profiles 表字段不完整，只找到 % 个字段', v_profiles_columns;
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'password_reset_history'
  ) INTO v_history_table_exists;
  
  IF NOT v_history_table_exists THEN
    RAISE EXCEPTION '❌ password_reset_history 表不存在';
  END IF;
  
  SELECT rowsecurity
  INTO v_rls_enabled
  FROM pg_tables 
  WHERE schemaname = 'public' 
  AND tablename = 'password_reset_history';
  
  IF NOT v_rls_enabled THEN
    RAISE EXCEPTION '❌ password_reset_history 表的 RLS 未启用';
  END IF;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '✓✓✓ 所有验证通过！';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '数据库迁移完成摘要:';
  RAISE NOTICE '1. profiles 表新增 5 个字段';
  RAISE NOTICE '2. 创建 3 个新索引';
  RAISE NOTICE '3. 创建 password_reset_history 表';
  RAISE NOTICE '4. 配置 4 个 RLS 策略';
  RAISE NOTICE '5. 创建 1 个辅助函数';
  RAISE NOTICE '';
  RAISE NOTICE '✅ 系统已准备就绪！';
  RAISE NOTICE '========================================';
END $$;
