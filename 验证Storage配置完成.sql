-- =====================================================
-- 验证 Storage 配置完成
-- =====================================================

-- 1. 检查 Bucket
SELECT 
  '✅ Bucket 状态' AS "检查项",
  id,
  name,
  public AS "公开访问",
  file_size_limit / 1024 / 1024 AS "大小限制(MB)"
FROM storage.buckets
WHERE id = 'tenant-assets';

-- 2. 检查所有 Storage 策略
SELECT 
  '✅ Storage 策略' AS "检查项",
  policyname AS "策略名称",
  cmd AS "操作类型"
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND (policyname ILIKE '%tenant%' OR policyname ILIKE '%public%' OR policyname ILIKE '%authenticated%')
ORDER BY cmd;

-- 3. 统计策略数量
SELECT 
  '✅ 策略统计' AS "检查项",
  COUNT(*) AS "策略数量"
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND bucket_id = 'tenant-assets';

-- =====================================================
-- 预期结果
-- =====================================================
-- Bucket: 1 条记录
-- 策略: 至少 2 条记录（Public Access + Authenticated users can upload）
-- 如果策略数量 >= 2，说明配置成功，可以测试上传了！
-- =====================================================
