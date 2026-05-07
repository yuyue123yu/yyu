-- =====================================================
-- 检查 Supabase Storage 状态
-- =====================================================
-- 执行位置: Supabase Dashboard > SQL Editor
-- 用途: 诊断 Storage bucket 和策略配置
-- =====================================================

-- 1. 检查所有 Storage Buckets
SELECT 
  id,
  name,
  public,
  file_size_limit / 1024 / 1024 AS "size_limit_mb",
  allowed_mime_types,
  created_at
FROM storage.buckets
ORDER BY created_at DESC;

-- 2. 检查 tenant-assets bucket 是否存在
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'tenant-assets') 
    THEN '✅ tenant-assets bucket 已存在'
    ELSE '❌ tenant-assets bucket 不存在 - 需要创建'
  END AS "Bucket 状态";

-- 3. 检查 Storage 策略
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
ORDER BY policyname;

-- 4. 检查 tenant-assets 相关的策略
SELECT 
  policyname,
  cmd AS "操作类型",
  CASE 
    WHEN cmd = 'SELECT' THEN '读取'
    WHEN cmd = 'INSERT' THEN '上传'
    WHEN cmd = 'UPDATE' THEN '更新'
    WHEN cmd = 'DELETE' THEN '删除'
    ELSE cmd
  END AS "操作说明"
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND (policyname ILIKE '%tenant%' OR qual::text ILIKE '%tenant-assets%')
ORDER BY cmd;

-- 5. 检查已上传的文件
SELECT 
  name AS "文件路径",
  bucket_id AS "Bucket",
  owner AS "所有者",
  created_at AS "上传时间",
  metadata->>'size' AS "文件大小(bytes)",
  metadata->>'mimetype' AS "文件类型"
FROM storage.objects
WHERE bucket_id = 'tenant-assets'
ORDER BY created_at DESC
LIMIT 10;

-- 6. 统计信息
SELECT 
  bucket_id,
  COUNT(*) AS "文件数量",
  SUM((metadata->>'size')::bigint) / 1024 / 1024 AS "总大小(MB)"
FROM storage.objects
WHERE bucket_id = 'tenant-assets'
GROUP BY bucket_id;

-- =====================================================
-- 诊断结果说明
-- =====================================================
-- 如果 "Bucket 状态" 显示 ❌，请执行 "创建Storage-Bucket.sql"
-- 如果策略列表为空，也需要执行 "创建Storage-Bucket.sql"
-- =====================================================
