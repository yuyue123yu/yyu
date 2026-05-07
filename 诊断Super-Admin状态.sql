-- =============================================
-- Super Admin 状态诊断脚本
-- 在 Supabase SQL Editor 中执行此脚本
-- =============================================

-- 显示标题
SELECT '========================================' as info;
SELECT 'Super Admin 状态诊断' as title;
SELECT '========================================' as info;
SELECT '' as info;

-- =============================================
-- 1. 检查用户是否存在
-- =============================================
SELECT '1️⃣ 检查用户是否存在' as step;
SELECT '' as info;

SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ 用户存在'
    ELSE '❌ 用户不存在 - 需要在 Authentication → Users 中创建'
  END as user_status,
  COUNT(*) as user_count
FROM auth.users 
WHERE email = '403940124@qq.com';

SELECT 
  id as user_id,
  email,
  created_at as user_created,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ 已确认'
    ELSE '❌ 未确认 - 需要确认邮箱'
  END as email_status,
  email_confirmed_at
FROM auth.users 
WHERE email = '403940124@qq.com';

SELECT '' as info;

-- =============================================
-- 2. 检查 profiles 表结构
-- =============================================
SELECT '2️⃣ 检查 profiles 表结构' as step;
SELECT '' as info;

-- 检查 tenant_id 是否可空
SELECT 
  column_name,
  data_type,
  CASE 
    WHEN is_nullable = 'YES' THEN '✅ 可空 (正确)'
    ELSE '❌ NOT NULL (需要修复)'
  END as nullable_status,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles' 
  AND column_name = 'tenant_id';

-- 检查 super_admin 字段
SELECT 
  column_name,
  data_type,
  CASE 
    WHEN column_name IS NOT NULL THEN '✅ 字段存在'
    ELSE '❌ 字段不存在'
  END as field_status,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles' 
  AND column_name = 'super_admin';

-- 检查 user_type 字段
SELECT 
  column_name,
  data_type,
  CASE 
    WHEN column_name IS NOT NULL THEN '✅ 字段存在'
    ELSE '❌ 字段不存在'
  END as field_status,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles' 
  AND column_name = 'user_type';

SELECT '' as info;

-- =============================================
-- 3. 检查约束
-- =============================================
SELECT '3️⃣ 检查表约束' as step;
SELECT '' as info;

SELECT 
  constraint_name,
  constraint_type,
  CASE 
    WHEN constraint_name = 'profiles_user_type_check' THEN '❌ 需要删除此约束'
    ELSE '✅ 正常约束'
  END as constraint_status
FROM information_schema.table_constraints 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY constraint_type, constraint_name;

SELECT '' as info;

-- =============================================
-- 4. 检查 Super Admin Profile
-- =============================================
SELECT '4️⃣ 检查 Super Admin Profile' as step;
SELECT '' as info;

-- 检查 profile 是否存在
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Profile 存在'
    ELSE '❌ Profile 不存在 - 需要创建'
  END as profile_status,
  COUNT(*) as profile_count
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = '403940124@qq.com';

-- 显示详细信息
SELECT 
  p.id,
  p.email,
  CASE 
    WHEN p.super_admin = true THEN '✅ true (正确)'
    WHEN p.super_admin = false THEN '❌ false (需要修复)'
    ELSE '❌ NULL (需要修复)'
  END as super_admin_status,
  CASE 
    WHEN p.user_type = 'super_admin' THEN '✅ super_admin (正确)'
    ELSE '❌ ' || COALESCE(p.user_type, 'NULL') || ' (需要修复)'
  END as user_type_status,
  CASE 
    WHEN p.tenant_id IS NULL THEN '✅ NULL (正确)'
    ELSE '❌ ' || p.tenant_id::TEXT || ' (需要修复)'
  END as tenant_id_status,
  p.created_at as profile_created
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = '403940124@qq.com';

SELECT '' as info;

-- =============================================
-- 5. 综合诊断结果
-- =============================================
SELECT '5️⃣ 综合诊断结果' as step;
SELECT '' as info;

DO $
DECLARE
  user_exists BOOLEAN;
  email_confirmed BOOLEAN;
  profile_exists BOOLEAN;
  is_super_admin BOOLEAN;
  correct_user_type BOOLEAN;
  tenant_id_null BOOLEAN;
  tenant_id_nullable BOOLEAN;
  has_bad_constraint BOOLEAN;
  
  issues_count INTEGER := 0;
  can_login BOOLEAN := false;
BEGIN
  -- 检查用户
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = '403940124@qq.com')
  INTO user_exists;
  
  SELECT EXISTS(
    SELECT 1 FROM auth.users 
    WHERE email = '403940124@qq.com' 
    AND email_confirmed_at IS NOT NULL
  ) INTO email_confirmed;
  
  -- 检查 profile
  SELECT EXISTS(
    SELECT 1 FROM profiles p
    JOIN auth.users u ON p.id = u.id
    WHERE u.email = '403940124@qq.com'
  ) INTO profile_exists;
  
  IF profile_exists THEN
    SELECT 
      COALESCE(p.super_admin, false),
      p.user_type = 'super_admin',
      p.tenant_id IS NULL
    INTO is_super_admin, correct_user_type, tenant_id_null
    FROM profiles p
    JOIN auth.users u ON p.id = u.id
    WHERE u.email = '403940124@qq.com';
  ELSE
    is_super_admin := false;
    correct_user_type := false;
    tenant_id_null := false;
  END IF;
  
  -- 检查表结构
  SELECT is_nullable = 'YES'
  INTO tenant_id_nullable
  FROM information_schema.columns 
  WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'tenant_id';
  
  SELECT EXISTS(
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_user_type_check' 
    AND table_name = 'profiles'
  ) INTO has_bad_constraint;
  
  -- 统计问题
  IF NOT user_exists THEN issues_count := issues_count + 1; END IF;
  IF NOT email_confirmed THEN issues_count := issues_count + 1; END IF;
  IF NOT profile_exists THEN issues_count := issues_count + 1; END IF;
  IF NOT is_super_admin THEN issues_count := issues_count + 1; END IF;
  IF NOT correct_user_type THEN issues_count := issues_count + 1; END IF;
  IF NOT tenant_id_null THEN issues_count := issues_count + 1; END IF;
  IF NOT tenant_id_nullable THEN issues_count := issues_count + 1; END IF;
  IF has_bad_constraint THEN issues_count := issues_count + 1; END IF;
  
  -- 判断是否可以登录
  can_login := user_exists AND email_confirmed AND profile_exists 
               AND is_super_admin AND correct_user_type AND tenant_id_null;
  
  -- 显示结果
  RAISE NOTICE '========================================';
  RAISE NOTICE '诊断结果汇总';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  
  IF user_exists THEN
    RAISE NOTICE '✅ 用户存在';
  ELSE
    RAISE NOTICE '❌ 用户不存在';
  END IF;
  
  IF email_confirmed THEN
    RAISE NOTICE '✅ 邮箱已确认';
  ELSE
    RAISE NOTICE '❌ 邮箱未确认';
  END IF;
  
  IF profile_exists THEN
    RAISE NOTICE '✅ Profile 存在';
  ELSE
    RAISE NOTICE '❌ Profile 不存在';
  END IF;
  
  IF is_super_admin THEN
    RAISE NOTICE '✅ super_admin = true';
  ELSE
    RAISE NOTICE '❌ super_admin 不是 true';
  END IF;
  
  IF correct_user_type THEN
    RAISE NOTICE '✅ user_type = super_admin';
  ELSE
    RAISE NOTICE '❌ user_type 不是 super_admin';
  END IF;
  
  IF tenant_id_null THEN
    RAISE NOTICE '✅ tenant_id = NULL';
  ELSE
    RAISE NOTICE '❌ tenant_id 不是 NULL';
  END IF;
  
  IF tenant_id_nullable THEN
    RAISE NOTICE '✅ tenant_id 字段可空';
  ELSE
    RAISE NOTICE '❌ tenant_id 字段是 NOT NULL';
  END IF;
  
  IF NOT has_bad_constraint THEN
    RAISE NOTICE '✅ 没有问题约束';
  ELSE
    RAISE NOTICE '❌ 存在 profiles_user_type_check 约束';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  
  IF can_login THEN
    RAISE NOTICE '🎉 状态正常！可以登录！';
    RAISE NOTICE '';
    RAISE NOTICE '登录地址：http://localhost:3000/super-admin/login';
    RAISE NOTICE '邮箱：403940124@qq.com';
  ELSE
    RAISE NOTICE '❌ 发现 % 个问题，无法登录', issues_count;
    RAISE NOTICE '';
    RAISE NOTICE '解决方案：';
    RAISE NOTICE '1. 执行修复脚本：最终修复Super-Admin.sql';
    RAISE NOTICE '2. 查看详细指南：Super-Admin登录修复指南.md';
  END IF;
  
  RAISE NOTICE '========================================';
END $;

-- =============================================
-- 6. 显示所有 Super Admin 用户
-- =============================================
SELECT '' as info;
SELECT '6️⃣ 所有 Super Admin 用户' as step;
SELECT '' as info;

SELECT 
  u.email,
  p.super_admin,
  p.user_type,
  p.tenant_id,
  CASE 
    WHEN p.super_admin = true 
         AND p.user_type = 'super_admin' 
         AND p.tenant_id IS NULL 
    THEN '✅ 配置正确'
    ELSE '❌ 配置有误'
  END as status
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.super_admin = true
ORDER BY p.created_at DESC;

-- =============================================
-- 完成
-- =============================================
SELECT '' as info;
SELECT '========================================' as info;
SELECT '诊断完成！' as title;
SELECT '========================================' as info;
