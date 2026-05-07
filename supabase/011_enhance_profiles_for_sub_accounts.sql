-- =============================================
-- 增强 profiles 表以支持子账号管理
-- Migration: 011_enhance_profiles_for_sub_accounts
-- =============================================

-- 1. 添加子账号管理相关字段
-- =============================================

-- 父账号ID（用于子账号管理）
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'parent_user_id'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN parent_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 用户角色
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN role TEXT DEFAULT 'user' 
    CHECK (role IN ('owner', 'admin', 'manager', 'user'));
  END IF;
END $$;

-- 权限配置
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'permissions'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN permissions JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- 账号激活状态
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

-- 最后登录时间
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'last_login_at'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN last_login_at TIMESTAMPTZ;
  END IF;
END $$;

-- 2. 添加索引
-- =============================================

CREATE INDEX IF NOT EXISTS idx_profiles_parent_user_id 
  ON public.profiles(parent_user_id);

CREATE INDEX IF NOT EXISTS idx_profiles_tenant_role 
  ON public.profiles(tenant_id, role);

CREATE INDEX IF NOT EXISTS idx_profiles_is_active 
  ON public.profiles(is_active);

-- 3. 添加注释
-- =============================================

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

-- 4. 更新现有数据
-- =============================================

-- 将现有的 admin 用户设置为 owner 角色
UPDATE public.profiles 
SET role = 'owner' 
WHERE user_type = 'admin' AND role IS NULL;

-- 将现有的普通用户设置为 user 角色
UPDATE public.profiles 
SET role = 'user' 
WHERE user_type = 'user' AND role IS NULL;

-- 将所有现有用户设置为激活状态
UPDATE public.profiles 
SET is_active = true 
WHERE is_active IS NULL;

-- 5. 验证
-- =============================================

DO $
BEGIN
  -- 验证所有字段都已添加
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name IN ('parent_user_id', 'role', 'permissions', 'is_active', 'last_login_at')
    GROUP BY table_name
    HAVING COUNT(*) = 5
  ) THEN
    RAISE EXCEPTION 'Failed to add all required columns to profiles table';
  END IF;
  
  RAISE NOTICE 'Profiles table enhanced successfully for sub-account management';
END $;
