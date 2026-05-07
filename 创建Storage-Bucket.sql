-- =====================================================
-- 创建 Supabase Storage Bucket 用于租户资源
-- =====================================================
-- 执行位置: Supabase Dashboard > SQL Editor
-- 用途: 创建 tenant-assets bucket 用于存储租户的 Logo、Favicon 等文件
-- =====================================================

-- 1. 创建 tenant-assets bucket（如果不存在）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tenant-assets',
  'tenant-assets',
  true,  -- 公开访问
  5242880,  -- 5MB 限制
  ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp', 'image/gif', 'image/x-icon', 'image/vnd.microsoft.icon']
)
ON CONFLICT (id) DO NOTHING;

-- 2. 删除旧策略（如果存在）
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own tenant files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own tenant files" ON storage.objects;

-- 3. 设置 Storage 策略 - 允许所有人读取
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'tenant-assets');

-- 4. 设置 Storage 策略 - 允许认证用户上传
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'tenant-assets' 
  AND auth.role() = 'authenticated'
);

-- 5. 设置 Storage 策略 - 允许认证用户更新自己租户的文件
CREATE POLICY "Users can update own tenant files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'tenant-assets' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] IN (
    SELECT tenant_id::text 
    FROM profiles 
    WHERE id = auth.uid()
  )
);

-- 6. 设置 Storage 策略 - 允许认证用户删除自己租户的文件
CREATE POLICY "Users can delete own tenant files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'tenant-assets' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] IN (
    SELECT tenant_id::text 
    FROM profiles 
    WHERE id = auth.uid()
  )
);

-- =====================================================
-- 验证 Bucket 是否创建成功
-- =====================================================

SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE id = 'tenant-assets';

-- =====================================================
-- 验证策略是否创建成功
-- =====================================================

SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%tenant%';

-- =====================================================
-- 完成！
-- =====================================================
-- 现在您可以在 Admin 后台上传 Logo 了
-- =====================================================
