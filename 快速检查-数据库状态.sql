-- =============================================
-- 快速检查 - 数据库状态
-- =============================================

-- 1. 检查关键表是否存在
SELECT 
  'tenant_settings 表' as item,
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tenant_settings')
    THEN '✓ 存在'
    ELSE '✗ 不存在 - 需要执行 002_create_tenant_settings_table.sql'
  END as status;

SELECT 
  'tenants 表' as item,
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tenants')
    THEN '✓ 存在'
    ELSE '✗ 不存在 - 需要执行 001_create_tenants_table.sql'
  END as status;

SELECT 
  'profiles 表' as item,
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles')
    THEN '✓ 存在'
    ELSE '✗ 不存在 - 需要创建 profiles 表'
  END as status;

-- 2. 检查数据
SELECT 
  '租户数量' as item,
  COUNT(*)::text || ' 个' as status
FROM tenants;

SELECT 
  '管理员数量' as item,
  COUNT(*)::text || ' 个' as status
FROM profiles
WHERE user_type IN ('admin', 'owner') OR super_admin = true;

SELECT 
  'tenant_settings 配置数量' as item,
  COUNT(*)::text || ' 条' as status
FROM tenant_settings;

-- 3. 检查是否有测试租户和管理员
SELECT 
  '测试租户' as item,
  CASE 
    WHEN COUNT(*) > 0 THEN '✓ 已有 ' || COUNT(*)::text || ' 个租户'
    ELSE '⚠ 没有租户 - 建议通过 Super Admin 创建'
  END as status
FROM tenants;

SELECT 
  '测试管理员' as item,
  CASE 
    WHEN COUNT(*) > 0 THEN '✓ 已有 ' || COUNT(*)::text || ' 个管理员'
    ELSE '⚠ 没有管理员 - 建议创建测试账号'
  END as status
FROM profiles
WHERE user_type IN ('admin', 'owner') OR super_admin = true;

-- 4. 显示最近的租户（如果有）
SELECT 
  '最近的租户' as info,
  name,
  subdomain,
  status,
  created_at
FROM tenants
ORDER BY created_at DESC
LIMIT 3;

-- 5. 显示最近的管理员（如果有）
SELECT 
  '最近的管理员' as info,
  email,
  full_name,
  user_type,
  super_admin,
  created_at
FROM profiles
WHERE user_type IN ('admin', 'owner') OR super_admin = true
ORDER BY created_at DESC
LIMIT 3;

-- 6. 总结
DO $$
DECLARE
  has_tenant_settings BOOLEAN;
  has_tenants BOOLEAN;
  has_admins BOOLEAN;
BEGIN
  SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tenant_settings') INTO has_tenant_settings;
  SELECT COUNT(*) > 0 INTO has_tenants FROM tenants;
  SELECT COUNT(*) > 0 INTO has_admins FROM profiles WHERE user_type IN ('admin', 'owner') OR super_admin = true;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '数据库状态快速检查';
  RAISE NOTICE '========================================';
  
  IF has_tenant_settings THEN
    RAISE NOTICE '✓ tenant_settings 表已创建';
  ELSE
    RAISE NOTICE '✗ tenant_settings 表不存在';
    RAISE NOTICE '  → 请在 Supabase SQL Editor 执行: supabase/002_create_tenant_settings_table.sql';
  END IF;
  
  IF has_tenants THEN
    RAISE NOTICE '✓ 已有租户数据';
  ELSE
    RAISE NOTICE '⚠ 没有租户数据';
    RAISE NOTICE '  → 建议通过 Super Admin 系统创建测试租户';
  END IF;
  
  IF has_admins THEN
    RAISE NOTICE '✓ 已有管理员账号';
  ELSE
    RAISE NOTICE '⚠ 没有管理员账号';
    RAISE NOTICE '  → 建议创建测试管理员账号';
  END IF;
  
  RAISE NOTICE '========================================';
  
  IF has_tenant_settings AND has_tenants AND has_admins THEN
    RAISE NOTICE '🎉 数据库已就绪！可以开始测试租户 DIY 功能';
    RAISE NOTICE '   访问: http://localhost:3000/admin/login';
  ELSE
    RAISE NOTICE '⚠ 数据库未完全就绪，请按照上述提示完成配置';
  END IF;
  
  RAISE NOTICE '========================================';
END $$;
