-- =============================================
-- Super Admin 系统全面诊断
-- 在 Supabase SQL Editor 中执行此脚本
-- =============================================

SELECT '========================================' as "诊断开始";
SELECT 'Super Admin 系统全面诊断' as "标题";
SELECT '========================================' as "分隔线";

-- =============================================
-- 1. 检查用户账号
-- =============================================
SELECT '1️⃣ 用户账号检查' as "步骤";

SELECT 
  id as "用户ID",
  email as "邮箱",
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ 已确认'
    ELSE '❌ 未确认'
  END as "邮箱状态",
  created_at as "创建时间",
  last_sign_in_at as "最后登录时间"
FROM auth.users 
WHERE email = '403940124@qq.com';

-- =============================================
-- 2. 检查 Profile 数据
-- =============================================
SELECT '2️⃣ Profile 数据检查' as "步骤";

SELECT 
  id as "用户ID",
  email as "邮箱",
  super_admin as "super_admin",
  user_type as "user_type",
  tenant_id as "tenant_id",
  CASE 
    WHEN super_admin = true AND user_type = 'super_admin' AND tenant_id IS NULL 
    THEN '✅ 配置正确'
    ELSE '❌ 配置错误'
  END as "配置状态"
FROM profiles 
WHERE email = '403940124@qq.com';

-- =============================================
-- 3. 检查 RLS 策略
-- =============================================
SELECT '3️⃣ RLS 策略检查' as "步骤";

SELECT 
  schemaname as "Schema",
  tablename as "表名",
  policyname as "策略名",
  permissive as "类型",
  roles as "角色",
  cmd as "命令"
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- =============================================
-- 4. 检查辅助函数
-- =============================================
SELECT '4️⃣ 辅助函数检查' as "步骤";

SELECT 
  routine_name as "函数名",
  routine_type as "类型",
  security_type as "安全类型"
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('is_super_admin', 'get_user_tenant_id');

-- =============================================
-- 5. 测试辅助函数
-- =============================================
SELECT '5️⃣ 辅助函数测试' as "步骤";

-- 测试 is_super_admin 函数
SELECT 
  'is_super_admin' as "函数",
  public.is_super_admin(
    (SELECT id FROM auth.users WHERE email = '403940124@qq.com')
  ) as "返回值",
  CASE 
    WHEN public.is_super_admin(
      (SELECT id FROM auth.users WHERE email = '403940124@qq.com')
    ) = true 
    THEN '✅ 正常'
    ELSE '❌ 异常'
  END as "状态";

-- 测试 get_user_tenant_id 函数
SELECT 
  'get_user_tenant_id' as "函数",
  public.get_user_tenant_id(
    (SELECT id FROM auth.users WHERE email = '403940124@qq.com')
  ) as "返回值",
  CASE 
    WHEN public.get_user_tenant_id(
      (SELECT id FROM auth.users WHERE email = '403940124@qq.com')
    ) IS NULL 
    THEN '✅ 正常 (NULL)'
    ELSE '❌ 异常'
  END as "状态";

-- =============================================
-- 6. 测试 RLS 查询（简化版）
-- =============================================
SELECT '6️⃣ RLS 查询测试' as "步骤";

-- 直接测试查询（使用 service role 权限）
SELECT 
  'SELECT 查询测试' as "测试类型",
  COUNT(*) as "返回行数",
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ 数据存在'
    ELSE '❌ 数据不存在'
  END as "状态"
FROM profiles 
WHERE id = (SELECT id FROM auth.users WHERE email = '403940124@qq.com');

-- =============================================
-- 7. 检查表字段
-- =============================================
SELECT '7️⃣ 表字段检查' as "步骤";

SELECT 
  column_name as "字段名",
  data_type as "数据类型",
  is_nullable as "可空",
  column_default as "默认值"
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN ('id', 'email', 'super_admin', 'user_type', 'tenant_id')
ORDER BY ordinal_position;

-- =============================================
-- 8. 检查约束
-- =============================================
SELECT '8️⃣ 表约束检查' as "步骤";

SELECT 
  constraint_name as "约束名",
  constraint_type as "约束类型"
FROM information_schema.table_constraints 
WHERE table_name = 'profiles'
ORDER BY constraint_type, constraint_name;

-- =============================================
-- 9. 检查外键
-- =============================================
SELECT '9️⃣ 外键检查' as "步骤";

SELECT 
  tc.constraint_name as "约束名",
  tc.table_name as "表名",
  kcu.column_name as "列名",
  ccu.table_name as "引用表",
  ccu.column_name as "引用列"
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'profiles';

-- =============================================
-- 10. 最终诊断结果
-- =============================================
SELECT '🔟 最终诊断结果' as "步骤";

SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM auth.users u
      JOIN profiles p ON u.id = p.id
      WHERE u.email = '403940124@qq.com'
        AND u.email_confirmed_at IS NOT NULL
        AND p.super_admin = true
        AND p.user_type = 'super_admin'
        AND p.tenant_id IS NULL
    ) THEN '✅ 数据库配置正确'
    ELSE '❌ 数据库配置有问题'
  END as "数据库状态",
  
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.routines 
      WHERE routine_name = 'is_super_admin'
    ) THEN '✅ 辅助函数存在'
    ELSE '❌ 辅助函数缺失'
  END as "函数状态",
  
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'profiles'
    ) THEN '✅ RLS 策略存在'
    ELSE '❌ RLS 策略缺失'
  END as "RLS状态";

-- =============================================
-- 完成
-- =============================================
SELECT '========================================' as "诊断结束";
SELECT '诊断完成！请查看上面的结果' as "提示";
SELECT '========================================' as "分隔线";
