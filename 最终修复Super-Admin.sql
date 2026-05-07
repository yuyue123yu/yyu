-- =============================================
-- 最终修复 Super Admin 登录
-- 在 Supabase SQL Editor 中执行此脚本
-- =============================================

-- 步骤 1：移除约束并修复表结构
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '开始修复 profiles 表...';
  RAISE NOTICE '========================================';
  
  -- 1.1 删除 user_type 的检查约束（如果存在）
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_user_type_check' 
    AND table_name = 'profiles'
  ) THEN
    RAISE NOTICE '正在删除 user_type 检查约束...';
    ALTER TABLE profiles DROP CONSTRAINT profiles_user_type_check;
    RAISE NOTICE '✅ 约束已删除';
  END IF;
  
  -- 1.2 将 tenant_id 设置为可空
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'tenant_id'
  ) THEN
    RAISE NOTICE '正在修改 tenant_id 字段为可空...';
    ALTER TABLE profiles ALTER COLUMN tenant_id DROP NOT NULL;
    RAISE NOTICE '✅ tenant_id 字段已设置为可空';
  END IF;
  
  -- 1.3 确保 super_admin 字段存在
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
  
  -- 1.4 确保 user_type 字段存在
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
  user_email TEXT := '403940124@qq.com';
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
  
  -- 2.2 删除现有的 profile（如果存在）
  DELETE FROM profiles WHERE id = user_id;
  RAISE NOTICE '清理旧数据...';
  
  -- 2.3 创建新的 Super Admin profile
  RAISE NOTICE '正在创建 Super Admin profile...';
  
  INSERT INTO profiles (
    id,
    email,
    super_admin,
    user_type,
    tenant_id,
    created_at,
    updated_at
  )
  VALUES (
    user_id,
    user_email,
    true,
    'super_admin',
    NULL,
    NOW(),
    NOW()
  );
  
  RAISE NOTICE '✅ Super Admin 已创建';
  RAISE NOTICE '';
  
  -- 2.4 验证
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
  '========================================' as info,
  '最终状态检查' as title
UNION ALL
SELECT 
  '========================================',
  '';

SELECT 
  u.id as user_id,
  u.email,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ 已确认'
    ELSE '❌ 未确认'
  END as email_status,
  COALESCE(p.super_admin::TEXT, '❌') as super_admin,
  COALESCE(p.user_type, '❌') as user_type,
  CASE 
    WHEN p.tenant_id IS NULL THEN '✅ NULL (正确)'
    ELSE '❌ ' || p.tenant_id::TEXT
  END as tenant_id_status,
  CASE 
    WHEN p.super_admin = true THEN '✅ 可以登录'
    ELSE '❌ 无权限'
  END as login_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = '403940124@qq.com';
