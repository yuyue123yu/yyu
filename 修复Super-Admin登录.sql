-- =============================================
-- 一键修复 Super Admin 登录问题
-- 在 Supabase SQL Editor 中执行此脚本
-- =============================================

-- 步骤 1：检查用户是否存在
DO $$
DECLARE
  user_id UUID;
  user_email TEXT := '403940124@qq.com';  -- 修改为您的邮箱
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '开始修复 Super Admin 登录...';
  RAISE NOTICE '========================================';
  
  -- 查找用户
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RAISE NOTICE '';
    RAISE NOTICE '❌ 错误：用户不存在';
    RAISE NOTICE '   邮箱: %', user_email;
    RAISE NOTICE '';
    RAISE NOTICE '解决方案：';
    RAISE NOTICE '1. 在 Supabase Dashboard 打开 Authentication → Users';
    RAISE NOTICE '2. 点击 "Add user" 创建用户';
    RAISE NOTICE '3. 填写邮箱: %', user_email;
    RAISE NOTICE '4. 设置密码';
    RAISE NOTICE '5. 勾选 "Auto Confirm User"';
    RAISE NOTICE '6. 创建后重新执行此脚本';
    RAISE NOTICE '';
    RAISE EXCEPTION '请先创建用户';
  END IF;
  
  RAISE NOTICE '✅ 找到用户';
  RAISE NOTICE '   用户ID: %', user_id;
  RAISE NOTICE '   邮箱: %', user_email;
  RAISE NOTICE '';
  
  -- 步骤 2：检查 profiles 表
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    RAISE EXCEPTION '❌ profiles 表不存在。请先执行数据库迁移脚本';
  END IF;
  
  RAISE NOTICE '✅ profiles 表存在';
  RAISE NOTICE '';
  
  -- 步骤 3：检查 super_admin 字段
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'super_admin'
  ) THEN
    RAISE NOTICE '⚠️  super_admin 字段不存在，正在添加...';
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS super_admin BOOLEAN DEFAULT false;
    RAISE NOTICE '✅ super_admin 字段已添加';
  ELSE
    RAISE NOTICE '✅ super_admin 字段存在';
  END IF;
  RAISE NOTICE '';
  
  -- 步骤 4：创建或更新 Super Admin Profile
  RAISE NOTICE '正在设置 Super Admin 权限...';
  
  INSERT INTO profiles (
    id,
    email,
    super_admin,
    user_type,
    created_at,
    updated_at
  )
  VALUES (
    user_id,
    user_email,
    true,
    'super_admin',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE 
  SET 
    super_admin = true,
    user_type = 'super_admin',
    updated_at = NOW();
  
  RAISE NOTICE '✅ Super Admin 权限已设置';
  RAISE NOTICE '';
  
  -- 步骤 5：验证
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND super_admin = true
  ) THEN
    RAISE NOTICE '========================================';
    RAISE NOTICE '🎉 修复成功！';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '登录信息：';
    RAISE NOTICE '  邮箱: %', user_email;
    RAISE NOTICE '  密码: (您设置的密码)';
    RAISE NOTICE '';
    RAISE NOTICE '现在可以登录了：';
    RAISE NOTICE '  http://localhost:3000/super-admin/login';
    RAISE NOTICE '';
  ELSE
    RAISE EXCEPTION '❌ 验证失败';
  END IF;
  
END $$;

-- 显示最终状态
SELECT 
  u.id as user_id,
  u.email,
  u.email_confirmed_at,
  p.super_admin,
  p.user_type,
  p.created_at as profile_created,
  CASE 
    WHEN p.super_admin = true THEN '✅ 可以登录'
    ELSE '❌ 无权限'
  END as login_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = '403940124@qq.com';
