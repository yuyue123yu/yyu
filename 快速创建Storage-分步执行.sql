-- =====================================================
-- 快速创建 Storage Bucket - 分步执行
-- =====================================================
-- 执行位置: Supabase Dashboard > SQL Editor
-- 说明: 请一步一步执行，不要一次性全部执行
-- =====================================================

-- ========== 步骤 1: 创建 Bucket ==========
-- 复制下面这段，单独执行
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tenant-assets',
  'tenant-assets',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp', 'image/gif', 'image/x-icon', 'image/vnd.microsoft.icon']
)
ON CONFLICT (id) DO NOTHING;

-- ========== 步骤 2: 验证 Bucket 创建成功 ==========
-- 复制下面这段，单独执行
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'tenant-assets';
-- 应该返回一条记录

-- ========== 步骤 3: 删除旧策略（如果存在）==========
-- 复制下面这段，单独执行
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own tenant files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own tenant files" ON storage.objects;

-- ========== 步骤 4: 创建公开读取策略 ==========
-- 复制下面这段，单独执行
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'tenant-assets');

-- ========== 步骤 5: 创建上传策略 ==========
-- 复制下面这段，单独执行
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'tenant-assets' 
  AND auth.role() = 'authenticated'
);

-- ========== 步骤 6: 创建更新策略 ==========
-- 复制下面这段，单独执行
CREATE POLICY "Users can update own tenant files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'tenant-assets' 
  AND auth.role() = 'authenticated'
);

-- ========== 步骤 7: 创建删除策略 ==========
-- 复制下面这段，单独执行
CREATE POLICY "Users can delete own tenant files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'tenant-assets' 
  AND auth.role() = 'authenticated'
);

-- ========== 步骤 8: 验证所有策略 ==========
-- 复制下面这段，单独执行
SELECT policyname, cmd
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname IN (
    'Public Access',
    'Authenticated users can upload',
    'Users can update own tenant files',
    'Users can delete own tenant files'
  );
-- 应该返回 4 条记录

-- =====================================================
-- 完成！现在可以测试上传功能了
-- =====================================================
