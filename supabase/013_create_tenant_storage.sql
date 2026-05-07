-- 创建租户资源存储桶
-- 用于存储租户的 Logo、Favicon 等文件

-- 1. 创建存储桶
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tenant-assets',
  'tenant-assets',
  true,  -- 公开访问
  5242880,  -- 5MB 限制
  ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. 设置存储桶策略
-- 允许租户管理员上传文件到自己的文件夹
CREATE POLICY "租户管理员可以上传文件"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'tenant-assets' AND
  -- 检查用户是否是该租户的管理员
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.tenant_id::text = (storage.foldername(name))[1]
    AND profiles.role IN ('owner', 'admin')
  )
);

-- 允许租户管理员更新自己租户的文件
CREATE POLICY "租户管理员可以更新文件"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'tenant-assets' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.tenant_id::text = (storage.foldername(name))[1]
    AND profiles.role IN ('owner', 'admin')
  )
);

-- 允许租户管理员删除自己租户的文件
CREATE POLICY "租户管理员可以删除文件"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'tenant-assets' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.tenant_id::text = (storage.foldername(name))[1]
    AND profiles.role IN ('owner', 'admin')
  )
);

-- 允许所有人读取文件（因为是公开的品牌资源）
CREATE POLICY "所有人可以读取文件"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'tenant-assets');

-- 3. 创建辅助函数：获取文件的公开 URL
CREATE OR REPLACE FUNCTION get_tenant_asset_url(file_path TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN format(
    '%s/storage/v1/object/public/tenant-assets/%s',
    current_setting('app.settings.supabase_url', true),
    file_path
  );
END;
$$;

COMMENT ON FUNCTION get_tenant_asset_url IS '获取租户资源的公开访问 URL';
