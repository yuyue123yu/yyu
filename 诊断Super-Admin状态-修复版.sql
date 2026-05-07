-- =============================================
-- Super Admin 状态诊断脚本（修复版）
-- 在 Supabase SQL Editor 中执行此脚本
-- =============================================

-- =============================================
-- 1. 检查用户是否存在
-- =============================================
SELECT '========================================' as "检查项";
SELECT '1️⃣ 检查用户是否存在' as "步骤";
SELECT '========================================' as "分隔线";

SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ 用户存在'
    ELSE '❌ 用户不存在 - 需要在 Authentication → Users 中创建'
  END as "用户状态",
  COUNT(*) as "用户数量"
FROM auth.users 
WHERE email = '403940124@qq.com';

SELECT 
  id as "用户ID",
  email as "邮箱",
  created_at as "创建时间",
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ 已确认'
    ELSE '❌ 未确认 - 需要确认邮箱'
  END as "邮箱状态",
  email_confirmed_at as "确认时间"
FROM auth.users 
WHERE email = '403940124@qq.com';

-- =============================================
-- 2. 检查 profiles 表结构
-- =============================================
SELECT '========================================' as "检查项";
SELECT '2️⃣ 检查 profiles 表结构' as "步骤";
SELECT '========================================' as "分隔线";

-- 检查 tenant_id 是否可空
SELECT 
  column_name as "字段名",
  data_type as "数据类型",
  CASE 
    WHEN is_nullable = 'YES' THEN '✅ 可空 (正确)'
    ELSE '❌ NOT NULL (需要修复)'
  END as "可空状态",
  column_default as "默认值"
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles' 
  AND column_name = 'tenant_id';

-- 检查 super_admin 字段
SELECT 
  column_name as "字段名",
  data_type as "数据类型",
  CASE 
    WHEN column_name IS NOT NULL THEN '✅ 字段存在'
    ELSE '❌ 字段不存在'
  END as "字段状态",
  column_default as "默认值"
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles' 
  AND column_name = 'super_admin';

-- 检查 user_type 字段
SELECT 
  column_name as "字段名",
  data_type as "数据类型",
  CASE 
    WHEN column_name IS NOT NULL THEN '✅ 字段存在'
    ELSE '❌ 字段不存在'
  END as "字段状态",
  column_default as "默认值"
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles' 
  AND column_name = 'user_type';

-- =============================================
-- 3. 检查约束
-- =============================================
SELECT '========================================' as "检查项";
SELECT '3️⃣ 检查表约束' as "步骤";
SELECT '========================================' as "分隔线";

SELECT 
  constraint_name as "约束名称",
  constraint_type as "约束类型",
  CASE 
    WHEN constraint_name = 'profiles_user_type_check' THEN '❌ 需要删除此约束'
    ELSE '✅ 正常约束'
  END as "约束状态"
FROM information_schema.table_constraints 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY constraint_type, constraint_name;

-- =============================================
-- 4. 检查 Super Admin Profile
-- =============================================
SELECT '========================================' as "检查项";
SELECT '4️⃣ 检查 Super Admin Profile' as "步骤";
SELECT '========================================' as "分隔线";

-- 检查 profile 是否存在
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Profile 存在'
    ELSE '❌ Profile 不存在 - 需要创建'
  END as "Profile状态",
  COUNT(*) as "Profile数量"
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = '403940124@qq.com';

-- 显示详细信息
SELECT 
  p.id as "用户ID",
  p.email as "邮箱",
  p.super_admin as "super_admin值",
  CASE 
    WHEN p.super_admin = true THEN '✅ true (正确)'
    WHEN p.super_admin = false THEN '❌ false (需要修复)'
    ELSE '❌ NULL (需要修复)'
  END as "super_admin状态",
  p.user_type as "user_type值",
  CASE 
    WHEN p.user_type = 'super_admin' THEN '✅ super_admin (正确)'
    ELSE '❌ ' || COALESCE(p.user_type, 'NULL') || ' (需要修复)'
  END as "user_type状态",
  p.tenant_id as "tenant_id值",
  CASE 
    WHEN p.tenant_id IS NULL THEN '✅ NULL (正确)'
    ELSE '❌ ' || p.tenant_id::TEXT || ' (需要修复)'
  END as "tenant_id状态",
  p.created_at as "创建时间"
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = '403940124@qq.com';

-- =============================================
-- 5. 显示所有 Super Admin 用户
-- =============================================
SELECT '========================================' as "检查项";
SELECT '5️⃣ 所有 Super Admin 用户' as "步骤";
SELECT '========================================' as "分隔线";

SELECT 
  u.email as "邮箱",
  p.super_admin as "super_admin",
  p.user_type as "user_type",
  p.tenant_id as "tenant_id",
  CASE 
    WHEN p.super_admin = true 
         AND p.user_type = 'super_admin' 
         AND p.tenant_id IS NULL 
    THEN '✅ 配置正确'
    ELSE '❌ 配置有误'
  END as "状态"
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.super_admin = true
ORDER BY p.created_at DESC;

-- =============================================
-- 6. 综合诊断结果
-- =============================================
SELECT '========================================' as "检查项";
SELECT '6️⃣ 综合诊断结果' as "步骤";
SELECT '========================================' as "分隔线";

-- 用户检查
SELECT 
  '用户检查' as "检查类型",
  CASE 
    WHEN EXISTS(SELECT 1 FROM auth.users WHERE email = '403940124@qq.com')
    THEN '✅ 用户存在'
    ELSE '❌ 用户不存在'
  END as "结果";

-- 邮箱确认检查
SELECT 
  '邮箱确认' as "检查类型",
  CASE 
    WHEN EXISTS(
      SELECT 1 FROM auth.users 
      WHERE email = '403940124@qq.com' 
      AND email_confirmed_at IS NOT NULL
    )
    THEN '✅ 邮箱已确认'
    ELSE '❌ 邮箱未确认'
  END as "结果";

-- Profile 检查
SELECT 
  'Profile检查' as "检查类型",
  CASE 
    WHEN EXISTS(
      SELECT 1 FROM profiles p
      JOIN auth.users u ON p.id = u.id
      WHERE u.email = '403940124@qq.com'
    )
    THEN '✅ Profile 存在'
    ELSE '❌ Profile 不存在'
  END as "结果";

-- super_admin 检查
SELECT 
  'super_admin检查' as "检查类型",
  CASE 
    WHEN EXISTS(
      SELECT 1 FROM profiles p
      JOIN auth.users u ON p.id = u.id
      WHERE u.email = '403940124@qq.com'
      AND p.super_admin = true
    )
    THEN '✅ super_admin = true'
    ELSE '❌ super_admin 不是 true'
  END as "结果";

-- user_type 检查
SELECT 
  'user_type检查' as "检查类型",
  CASE 
    WHEN EXISTS(
      SELECT 1 FROM profiles p
      JOIN auth.users u ON p.id = u.id
      WHERE u.email = '403940124@qq.com'
      AND p.user_type = 'super_admin'
    )
    THEN '✅ user_type = super_admin'
    ELSE '❌ user_type 不是 super_admin'
  END as "结果";

-- tenant_id 检查
SELECT 
  'tenant_id检查' as "检查类型",
  CASE 
    WHEN EXISTS(
      SELECT 1 FROM profiles p
      JOIN auth.users u ON p.id = u.id
      WHERE u.email = '403940124@qq.com'
      AND p.tenant_id IS NULL
    )
    THEN '✅ tenant_id = NULL'
    ELSE '❌ tenant_id 不是 NULL'
  END as "结果";

-- tenant_id 字段可空检查
SELECT 
  'tenant_id字段' as "检查类型",
  CASE 
    WHEN EXISTS(
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'tenant_id'
      AND is_nullable = 'YES'
    )
    THEN '✅ tenant_id 字段可空'
    ELSE '❌ tenant_id 字段是 NOT NULL'
  END as "结果";

-- 约束检查
SELECT 
  '约束检查' as "检查类型",
  CASE 
    WHEN EXISTS(
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'profiles_user_type_check' 
      AND table_name = 'profiles'
    )
    THEN '❌ 存在 profiles_user_type_check 约束'
    ELSE '✅ 没有问题约束'
  END as "结果";

-- =============================================
-- 7. 最终结论
-- =============================================
SELECT '========================================' as "检查项";
SELECT '7️⃣ 最终结论' as "步骤";
SELECT '========================================' as "分隔线";

SELECT 
  CASE 
    WHEN EXISTS(
      SELECT 1 
      FROM auth.users u
      JOIN profiles p ON u.id = p.id
      WHERE u.email = '403940124@qq.com'
      AND u.email_confirmed_at IS NOT NULL
      AND p.super_admin = true
      AND p.user_type = 'super_admin'
      AND p.tenant_id IS NULL
    )
    THEN '🎉 状态正常！可以登录！'
    ELSE '❌ 存在问题，需要执行修复脚本'
  END as "最终结论",
  CASE 
    WHEN EXISTS(
      SELECT 1 
      FROM auth.users u
      JOIN profiles p ON u.id = p.id
      WHERE u.email = '403940124@qq.com'
      AND u.email_confirmed_at IS NOT NULL
      AND p.super_admin = true
      AND p.user_type = 'super_admin'
      AND p.tenant_id IS NULL
    )
    THEN 'http://localhost:3000/super-admin/login'
    ELSE '请执行：最终修复Super-Admin.sql'
  END as "下一步操作";

SELECT '========================================' as "检查项";
SELECT '诊断完成！' as "完成";
SELECT '========================================' as "分隔线";
