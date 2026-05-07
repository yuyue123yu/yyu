-- =============================================
-- CREATE STORAGE BUCKET FOR TEMPLATES
-- =============================================

-- 创建模板文件存储桶
INSERT INTO storage.buckets (id, name, public)
VALUES ('templates', 'templates', true)
ON CONFLICT (id) DO NOTHING;

-- 允许所有人查看模板文件
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'templates');

-- 允许认证用户上传模板文件
CREATE POLICY "Authenticated users can upload templates"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'templates' 
  AND auth.role() = 'authenticated'
);

-- 允许认证用户更新自己上传的文件
CREATE POLICY "Users can update their own templates"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'templates' 
  AND auth.role() = 'authenticated'
);

-- 允许认证用户删除文件
CREATE POLICY "Authenticated users can delete templates"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'templates' 
  AND auth.role() = 'authenticated'
);
