-- 租户自助 DIY 系统 - 数据库表测试
-- 检查所有必需的表和字段是否存在

-- 1. 检查 tenant_settings 表
SELECT 
  'tenant_settings 表' as test_name,
  CASE 
    WHEN EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'tenant_settings'
    ) THEN '✓ 存在'
    ELSE '✗ 不存在'
  END as result;

-- 2. 检查 tenant_settings 表的字段
SELECT 
  'tenant_settings 字段' as test_name,
  string_agg(column_name, ', ' ORDER BY ordinal_position) as fields
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'tenant_settings';

-- 3. 检查 tenants 表
SELECT 
  'tenants 表' as test_name,
  CASE 
    WHEN EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'tenants'
    ) THEN '✓ 存在'
    ELSE '✗ 不存在'
  END as result;

-- 4. 检查 profiles 表
SELECT 
  'profiles 表' as test_name,
  CASE 
    WHEN EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles'
    ) THEN '✓ 存在'
    ELSE '✗ 不存在'
  END as result;

-- 5. 检查 audit_logs 表
SELECT 
  'audit_logs 表' as test_name,
  CASE 
    WHEN EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'audit_logs'
    ) THEN '✓ 存在'
    ELSE '✗ 不存在'
  END as result;

-- 6. 检查 tenant_settings 表中是否有数据
SELECT 
  'tenant_settings 数据' as test_name,
  COUNT(*) as record_count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✓ 有数据'
    ELSE '⚠ 无数据（正常，需要租户配置后才有）'
  END as result
FROM tenant_settings;

-- 7. 检查 tenant_settings 表的 RLS 策略
SELECT 
  'tenant_settings RLS 策略' as test_name,
  COUNT(*) as policy_count,
  string_agg(policyname, ', ') as policies
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'tenant_settings';

-- 8. 检查所有租户 DIY 相关的配置键
SELECT 
  'tenant_settings 配置键' as test_name,
  string_agg(DISTINCT key, ', ' ORDER BY key) as config_keys
FROM tenant_settings;

-- 9. 统计信息
SELECT 
  '数据库统计' as test_name,
  json_build_object(
    'tenants_count', (SELECT COUNT(*) FROM tenants),
    'profiles_count', (SELECT COUNT(*) FROM profiles),
    'tenant_settings_count', (SELECT COUNT(*) FROM tenant_settings),
    'audit_logs_count', (SELECT COUNT(*) FROM audit_logs)
  ) as statistics;
