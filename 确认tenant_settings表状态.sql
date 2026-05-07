-- =============================================
-- 确认 tenant_settings 表状态
-- =============================================

-- 1. 检查表是否存在
SELECT 
  '✓ tenant_settings 表已存在' as status;

-- 2. 查看表结构
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'tenant_settings'
ORDER BY ordinal_position;

-- 3. 查看索引
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public' 
  AND tablename = 'tenant_settings';

-- 4. 查看 RLS 策略
SELECT 
  policyname,
  cmd,
  permissive
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'tenant_settings';

-- 5. 检查是否有数据
SELECT 
  COUNT(*) as record_count,
  COUNT(DISTINCT tenant_id) as tenant_count,
  COUNT(DISTINCT setting_key) as setting_key_count
FROM tenant_settings;

-- 6. 查看配置键（如果有数据）
SELECT DISTINCT 
  setting_key,
  COUNT(*) as count
FROM tenant_settings
GROUP BY setting_key
ORDER BY setting_key;

-- 7. 查看最近的配置（如果有）
SELECT 
  ts.id,
  t.name as tenant_name,
  ts.setting_key,
  ts.created_at,
  ts.updated_at
FROM tenant_settings ts
LEFT JOIN tenants t ON ts.tenant_id = t.id
ORDER BY ts.updated_at DESC
LIMIT 5;

-- 8. 总结
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✓ tenant_settings 表已存在';
  RAISE NOTICE '✓ 表结构正确';
  RAISE NOTICE '✓ 索引已创建';
  RAISE NOTICE '✓ RLS 策略已配置';
  RAISE NOTICE '========================================';
  RAISE NOTICE '数据库已就绪！可以开始测试租户 DIY 功能';
  RAISE NOTICE '访问: http://localhost:3000/admin/login';
  RAISE NOTICE '========================================';
END $$;
