-- =============================================
-- 快速诊断 Super Admin 状态
-- =============================================

-- 1. 检查用户是否存在
SELECT 
  '1. 用户检查' as step,
  COUNT(*) as user_count,
  CASE 
    WHEN COUNT(*) > 0 THEN 'YES - 用户存在'
    ELSE 'NO - 用户不存在'
  END as status
FROM auth.users 
WHERE email = '403940124@qq.com';

-- 2. 显示用户详情
SELECT 
  '2. 用户详情' as step,
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email = '403940124@qq.com';

-- 3. 检查 Profile 是否存在
SELECT 
  '3. Profile检查' as step,
  COUNT(*) as profile_count,
  CASE 
    WHEN COUNT(*) > 0 THEN 'YES - Profile存在'
    ELSE 'NO - Profile不存在'
  END as status
FROM profiles p
WHERE p.email = '403940124@qq.com';

-- 4. 显示 Profile 详情
SELECT 
  '4. Profile详情' as step,
  id,
  email,
  super_admin,
  user_type,
  tenant_id,
  created_at
FROM profiles
WHERE email = '403940124@qq.com';

-- 5. 检查 tenant_id 字段是否可空
SELECT 
  '5. tenant_id字段检查' as step,
  column_name,
  is_nullable,
  CASE 
    WHEN is_nullable = 'YES' THEN 'OK - 可空'
    ELSE 'ERROR - NOT NULL'
  END as status
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name = 'tenant_id';

-- 6. 检查是否有问题约束
SELECT 
  '6. 约束检查' as step,
  constraint_name,
  constraint_type
FROM information_schema.table_constraints 
WHERE table_name = 'profiles'
  AND constraint_name LIKE '%user_type%';

-- 7. 最终判断
SELECT 
  '7. 最终结论' as step,
  CASE 
    WHEN EXISTS (
      SELECT 1 
      FROM auth.users u
      JOIN profiles p ON u.id = p.id
      WHERE u.email = '403940124@qq.com'
        AND u.email_confirmed_at IS NOT NULL
        AND p.super_admin = true
        AND p.user_type = 'super_admin'
        AND p.tenant_id IS NULL
    ) THEN '✅ 可以登录'
    ELSE '❌ 需要修复'
  END as result,
  CASE 
    WHEN EXISTS (
      SELECT 1 
      FROM auth.users u
      JOIN profiles p ON u.id = p.id
      WHERE u.email = '403940124@qq.com'
        AND u.email_confirmed_at IS NOT NULL
        AND p.super_admin = true
        AND p.user_type = 'super_admin'
        AND p.tenant_id IS NULL
    ) THEN 'http://localhost:3000/super-admin/login'
    ELSE '执行: 最终修复Super-Admin.sql'
  END as next_action;
