-- =============================================
-- 简化诊断 - 一次性显示所有关键信息
-- =============================================

SELECT 
  '用户账号' as "检查项",
  u.email as "邮箱",
  CASE WHEN u.email_confirmed_at IS NOT NULL THEN '✅' ELSE '❌' END as "邮箱确认",
  CASE WHEN p.id IS NOT NULL THEN '✅' ELSE '❌' END as "Profile存在",
  COALESCE(p.super_admin::text, '❌') as "super_admin",
  COALESCE(p.user_type, '❌') as "user_type",
  CASE WHEN p.tenant_id IS NULL THEN '✅ NULL' ELSE '❌ ' || p.tenant_id::text END as "tenant_id",
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL 
         AND p.super_admin = true 
         AND p.user_type = 'super_admin' 
         AND p.tenant_id IS NULL 
    THEN '✅ 全部正确'
    ELSE '❌ 有问题'
  END as "综合状态"
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = '403940124@qq.com'

UNION ALL

SELECT 
  '辅助函数' as "检查项",
  'is_super_admin' as "邮箱",
  CASE WHEN EXISTS(SELECT 1 FROM information_schema.routines WHERE routine_name = 'is_super_admin') THEN '✅' ELSE '❌' END as "邮箱确认",
  'get_user_tenant_id' as "Profile存在",
  CASE WHEN EXISTS(SELECT 1 FROM information_schema.routines WHERE routine_name = 'get_user_tenant_id') THEN '✅' ELSE '❌' END as "super_admin",
  '' as "user_type",
  '' as "tenant_id",
  CASE 
    WHEN EXISTS(SELECT 1 FROM information_schema.routines WHERE routine_name = 'is_super_admin')
         AND EXISTS(SELECT 1 FROM information_schema.routines WHERE routine_name = 'get_user_tenant_id')
    THEN '✅ 全部存在'
    ELSE '❌ 缺失'
  END as "综合状态"

UNION ALL

SELECT 
  'RLS策略' as "检查项",
  COUNT(*)::text as "邮箱",
  '' as "邮箱确认",
  '' as "Profile存在",
  '' as "super_admin",
  '' as "user_type",
  '' as "tenant_id",
  CASE WHEN COUNT(*) >= 4 THEN '✅ 策略完整' ELSE '❌ 策略不完整' END as "综合状态"
FROM pg_policies 
WHERE tablename = 'profiles';
