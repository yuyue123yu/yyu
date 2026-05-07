-- =============================================
-- 修复 profiles 表并创建 Super Admin
-- 在 Supabase SQL Editor 中执行此脚本
-- =============================================

-- 步骤 1：修复 profiles 表结构
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '开始修复 profiles 表...';
  RAISE NOTICE '========================================';
  
  -- 1.1 将 tenant_id 设置为可空
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'tenant_id'
  ) THEN
    RAISE NOTICE '正在修改 tenant_id 字段为可空...';
    ALTER TABLE profiles ALTER COLUMN tenant_id DROP NOT NULL;
    RAISE NOTICE '✅ tenant_id 字段已设置为可空';
  ELSE
    RAISE NOTICE '⚠️  tenant_id 字段不存在，跳过';
  END IF;
  
  -- 1.2 确保 super_admin 字段存在
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'super_admin'
  ) THEN
    RAISE NOTICE '正在添加 super_admin 字段...';
    ALTER TABLE profiles ADD COLUMN super_admin BOOLEAN DEFAULT false;
    RAISE NOTICE '✅ super_admin 字段已添加';
  ELSE
    RAISE NOTICE '✅ super_admin 字段已存在';
  END IF;
  
  -- 1.3 确保 user_type 字段存在
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'user_type'
  ) THEN
    RAISE NOTICE '正在添加 user_type 字段...';
    ALTER TABLE profiles ADD COLUMN user_type TEXT DEFAULT 'user';
    RAISE NOTICE '✅ user_type 字段已添加';
  ELSE
    RAISE NOTICE '✅ user_type 字段已存在';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ profiles 表结构修复完成';
  RAISE NOTICE '';
  
END $$;

-- 步骤 2：创建 Super Admin 用户
DO $$
DECLARE
  user_id UUID;
  user_email TEXT := '403940124@qq.com';  -- 您的邮箱
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '开始创建 Super Admin...';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  
  -- 2.1 查找用户
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RAISE NOTICE '❌ 错误：用户不存在';
    RAISE NOTICE '   邮箱: %', user_email;
    RAISE NOTICE '';
    RAISE NOTICE '请先在 Supabase Dashboard 创建用户：';
    RAISE NOTICE '1. Authentication → Users → Add user';
    RAISE NOTICE '2. Email: %', user_email;
    RAISE NOTICE '3. 设置密码';
    RAISE NOTICE '4. 勾选 "Auto Confirm User"';
    RAISE NOTICE '';
    RAISE EXCEPTION '请先创建用户';
  END IF;
  
  RAISE NOTICE '✅ 找到用户: %', user_email;
  RAISE NOTICE '   用户ID: %', user_id;
  RAISE NOTICE '';
  
  -- 2.2 创建或更新 profile（tenant_id 为 NULL）
  RAISE NOTICE '正在设置 Super Admin 权限...';
  
  INSERT INTO profiles (
    id,
    email,
    super_admin,
    user_type,
    tenant_id,  -- 设置为 NULL
    created_at,
    updated_at
  )
  VALUES (
    user_id,
    user_email,
    true,
    'super_admin',
    NULL,  -- Super Admin 不属于任何租户
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE 
  SET 
    super_admin = true,
    user_type = 'super_admin',
    tenant_id = NULL,
    updated_at = NOW();
  
  RAISE NOTICE '✅ Super Admin 权限已设置';
  RAISE NOTICE '';
  
  -- 2.3 验证
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND super_admin = true
  ) THEN
    RAISE NOTICE '========================================';
    RAISE NOTICE '🎉 创建成功！';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '登录信息：';
    RAISE NOTICE '  邮箱: %', user_email;
    RAISE NOTICE '  密码: (您在 Authentication 中设置的密码)';
    RAISE NOTICE '';
    RAISE NOTICE '登录地址：';
    RAISE NOTICE '  http://localhost:3000/super-admin/login';
    RAISE NOTICE '';
  ELSE
    RAISE EXCEPTION '❌ 验证失败';
  END IF;
  
END $$;

-- 步骤 3：显示最终状态
SELECT 
  '========================================' as separator,
  '最终状态' as title;

SELECT 
  u.id as user_id,
  u.email,
  u.email_confirmed_at as email_confirmed,
  p.super_admin,
  p.user_type,
  p.tenant_id,
  p.created_at as profile_created,
  CASE 
    WHEN p.super_admin = true THEN '✅ 可以登录'
    ELSE '❌ 无权限'
  END as login_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = '403940124@qq.com';
