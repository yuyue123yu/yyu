-- =============================================
-- 租户自助 DIY 系统 - 数据库同步状态检查
-- =============================================

-- 1. 检查所有必需的表是否存在
SELECT 
  '1. 表存在性检查' as check_name,
  json_build_object(
    'tenants', EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tenants'),
    'profiles', EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles'),
    'tenant_settings', EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tenant_settings'),
    'audit_logs', EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audit_logs'),
    'system_settings', EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'system_settings')
  ) as tables_status;

-- 2. 检查 tenant_settings 表结构
SELECT 
  '2. tenant_settings 表结构' as check_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'tenant_settings'
ORDER BY ordinal_position;

-- 3. 检查 tenant_settings 表的索引
SELECT 
  '3. tenant_settings 索引' as check_name,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public' 
  AND tablename = 'tenant_settings';

-- 4. 检查 tenant_settings 表的约束
SELECT 
  '4. tenant_settings 约束' as check_name,
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public' 
  AND table_name = 'tenant_settings';

-- 5. 检查 tenant_settings 表的 RLS 策略
SELECT 
  '5. tenant_settings RLS 策略' as check_name,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'tenant_settings';

-- 6. 检查是否有租户数据
SELECT 
  '6. 租户数据统计' as check_name,
  json_build_object(
    'tenants_count', (SELECT COUNT(*) FROM tenants),
    'profiles_count', (SELECT COUNT(*) FROM profiles),
    'tenant_settings_count', (SELECT COUNT(*) FROM tenant_settings),
    'audit_logs_count', (SELECT COUNT(*) FROM audit_logs)
  ) as data_statistics;

-- 7. 检查 tenant_settings 中的配置键
SELECT 
  '7. tenant_settings 配置键' as check_name,
  COALESCE(
    (SELECT string_agg(DISTINCT setting_key, ', ' ORDER BY setting_key) 
     FROM tenant_settings),
    '无数据'
  ) as config_keys;

-- 8. 检查是否有测试租户
SELECT 
  '8. 测试租户检查' as check_name,
  id,
  name,
  subdomain,
  status,
  created_at
FROM tenants
ORDER BY created_at DESC
LIMIT 5;

-- 9. 检查是否有 Admin 账号
SELECT 
  '9. Admin 账号检查' as check_name,
  id,
  email,
  full_name,
  user_type,
  super_admin,
  tenant_id,
  created_at
FROM profiles
WHERE user_type IN ('admin', 'owner') OR super_admin = true
ORDER BY created_at DESC
LIMIT 5;

-- 10. 检查 tenant_settings 的示例数据（如果有）
SELECT 
  '10. tenant_settings 示例数据' as check_name,
  ts.id,
  t.name as tenant_name,
  ts.setting_key,
  ts.setting_value,
  ts.created_at,
  ts.updated_at
FROM tenant_settings ts
LEFT JOIN tenants t ON ts.tenant_id = t.id
ORDER BY ts.created_at DESC
LIMIT 10;

-- 11. 检查必需的函数是否存在
SELECT 
  '11. 必需函数检查' as check_name,
  json_build_object(
    'initialize_default_tenant_settings', EXISTS (
      SELECT FROM pg_proc 
      WHERE proname = 'initialize_default_tenant_settings'
    ),
    'update_updated_at_column', EXISTS (
      SELECT FROM pg_proc 
      WHERE proname = 'update_updated_at_column'
    )
  ) as functions_status;

-- 12. 测试 tenant_settings 表的插入权限（使用 service role）
-- 注意：这个测试会实际插入数据，如果不需要可以注释掉
/*
DO $$
DECLARE
  test_tenant_id UUID;
BEGIN
  -- 创建一个测试租户（如果不存在）
  INSERT INTO tenants (name, subdomain, status)
  VALUES ('测试租户-DIY系统', 'test-diy-' || floor(random() * 1000)::text, 'active')
  ON CONFLICT (subdomain) DO NOTHING
  RETURNING id INTO test_tenant_id;
  
  -- 如果成功创建，初始化默认设置
  IF test_tenant_id IS NOT NULL THEN
    PERFORM initialize_default_tenant_settings(test_tenant_id);
    RAISE NOTICE '✓ 成功创建测试租户并初始化默认设置: %', test_tenant_id;
  ELSE
    RAISE NOTICE '⚠ 测试租户已存在，跳过创建';
  END IF;
END $$;
*/

-- 13. 总结报告
SELECT 
  '13. 数据库同步状态总结' as check_name,
  json_build_object(
    'tables_ready', (
      SELECT COUNT(*) = 5 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('tenants', 'profiles', 'tenant_settings', 'audit_logs', 'system_settings')
    ),
    'tenant_settings_structure_ok', (
      SELECT COUNT(*) >= 6 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'tenant_settings'
    ),
    'indexes_created', (
      SELECT COUNT(*) >= 4 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
        AND tablename = 'tenant_settings'
    ),
    'rls_enabled', (
      SELECT COUNT(*) > 0 
      FROM pg_policies 
      WHERE schemaname = 'public' 
        AND tablename = 'tenant_settings'
    ),
    'functions_ready', (
      SELECT COUNT(*) = 2 
      FROM pg_proc 
      WHERE proname IN ('initialize_default_tenant_settings', 'update_updated_at_column')
    ),
    'has_tenants', (SELECT COUNT(*) > 0 FROM tenants),
    'has_admin_users', (
      SELECT COUNT(*) > 0 
      FROM profiles 
      WHERE user_type IN ('admin', 'owner') OR super_admin = true
    )
  ) as summary;

-- 14. 建议的下一步操作
DO $$
DECLARE
  tables_ok BOOLEAN;
  has_tenants BOOLEAN;
  has_admins BOOLEAN;
BEGIN
  -- 检查表是否都存在
  SELECT COUNT(*) = 5 INTO tables_ok
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
    AND table_name IN ('tenants', 'profiles', 'tenant_settings', 'audit_logs', 'system_settings');
  
  -- 检查是否有租户
  SELECT COUNT(*) > 0 INTO has_tenants FROM tenants;
  
  -- 检查是否有管理员
  SELECT COUNT(*) > 0 INTO has_admins 
  FROM profiles 
  WHERE user_type IN ('admin', 'owner') OR super_admin = true;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '数据库同步状态检查完成';
  RAISE NOTICE '========================================';
  
  IF tables_ok THEN
    RAISE NOTICE '✓ 所有必需的表都已创建';
  ELSE
    RAISE NOTICE '✗ 缺少必需的表，请执行迁移脚本';
  END IF;
  
  IF has_tenants THEN
    RAISE NOTICE '✓ 已有租户数据';
  ELSE
    RAISE NOTICE '⚠ 没有租户数据，建议创建测试租户';
  END IF;
  
  IF has_admins THEN
    RAISE NOTICE '✓ 已有管理员账号';
  ELSE
    RAISE NOTICE '⚠ 没有管理员账号，建议创建测试账号';
  END IF;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '建议的下一步操作:';
  RAISE NOTICE '1. 如果表不完整，请在 Supabase SQL Editor 中执行 supabase/ 目录下的迁移脚本';
  RAISE NOTICE '2. 如果没有租户，请通过 Super Admin 系统创建测试租户';
  RAISE NOTICE '3. 如果没有管理员，请创建测试管理员账号';
  RAISE NOTICE '4. 登录 Admin 系统测试租户 DIY 功能';
  RAISE NOTICE '========================================';
END $$;
