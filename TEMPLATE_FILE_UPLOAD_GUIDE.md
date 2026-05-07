# 📤 模板文件上传功能实现指南

## 当前状态

模板管理页面已经添加了文件上传的基础代码，包括：
- ✅ 文件选择处理函数 `handleFileSelect`
- ✅ 文件上传函数 `uploadFile`
- ✅ 上传状态管理 (`uploading`, `uploadProgress`, `selectedFile`)
- ✅ 修改了提交函数支持文件上传

## 需要完成的步骤

### 步骤 1：在 Supabase 创建 Storage Bucket

1. 登录 Supabase Dashboard: https://supabase.com/dashboard
2. 选择项目 "malaifalv"
3. 点击左侧菜单 "Storage"
4. 点击 "Create a new bucket"
5. 输入 Bucket 名称: `templates`
6. 选择 "Public bucket" (公开访问)
7. 点击 "Create bucket"

### 步骤 2：设置 Storage 策略

在 Supabase SQL Editor 中执行以下 SQL：

```sql
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

-- 允许认证用户更新文件
CREATE POLICY "Users can update templates"
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
```

### 步骤 3：修改添加模板模态框UI

需要将添加模板模态框中的"文件URL"输入框替换为文件上传组件。

在 `src/app/admin/templates/page.tsx` 的添加模态框中，找到这部分代码：

```tsx
<div className="grid grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium text-neutral-700 mb-2">
      文件URL
    </label>
    <input
      type="url"
      required
      value={formData.file_url}
      onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
      className="w-full px-4 py-2 border border-neutral-300 rounded-lg..."
      placeholder="https://..."
    />
  </div>
  <div>
    <label className="block text-sm font-medium text-neutral-700 mb-2">
      文件大小
    </label>
    <input
      type="text"
      value={formData.file_size}
      onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
      className="w-full px-4 py-2 border border-neutral-300 rounded-lg..."
      placeholder="例如：2.5 MB"
    />
  </div>
</div>
```

替换为：

```tsx
{/* 文件上传区域 */}
<div>
  <label className="block text-sm font-medium text-neutral-700 mb-2">
    上传文件 *
  </label>
  <div className="space-y-3">
    {/* 文件选择按钮 */}
    <div className="flex items-center gap-3">
      <label className="flex-1 cursor-pointer">
        <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
          <Upload className="h-5 w-5 text-neutral-600" />
          <span className="text-sm font-medium text-neutral-700">
            {selectedFile ? selectedFile.name : '选择文件或拖拽到此处'}
          </span>
        </div>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          onChange={handleFileSelect}
          className="hidden"
        />
      </label>
      {selectedFile && (
        <button
          type="button"
          onClick={() => {
            setSelectedFile(null);
            setFormData({ ...formData, file_size: '' });
          }}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>

    {/* 文件信息显示 */}
    {selectedFile && (
      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-green-700">
          <FileText className="h-4 w-4" />
          <span className="font-medium">{selectedFile.name}</span>
          <span className="text-green-600">({formData.file_size})</span>
        </div>
      </div>
    )}

    {/* 上传进度 */}
    {uploading && (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">上传中...</span>
          <span className="text-primary-600 font-medium">{uploadProgress}%</span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      </div>
    )}

    {/* 或者输入URL */}
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-neutral-300"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-white text-neutral-500">或者输入文件URL</span>
      </div>
    </div>

    <input
      type="url"
      value={formData.file_url}
      onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
      placeholder="https://example.com/template.pdf"
      disabled={!!selectedFile}
    />

    <p className="text-xs text-neutral-500">
      支持格式：PDF、Word (.doc, .docx)、Excel (.xls, .xlsx)，最大 10MB
    </p>
  </div>
</div>
```

### 步骤 4：同样修改编辑模态框

在编辑模态框中也添加相同的文件上传组件。

---

## 功能说明

### 文件验证

- **支持格式**: PDF, Word (.doc, .docx), Excel (.xls, .xlsx)
- **最大大小**: 10MB
- **自动计算**: 文件大小自动计算并显示

### 上传流程

1. 用户选择文件
2. 验证文件类型和大小
3. 显示文件信息
4. 点击"添加模板"或"保存更改"
5. 自动上传文件到 Supabase Storage
6. 获取公共 URL
7. 保存到数据库

### 上传进度

- 显示上传进度条
- 显示百分比
- 上传完成后自动隐藏

### 灵活性

- 可以上传文件
- 也可以直接输入文件URL
- 两者选其一即可

---

## 测试步骤

### 1. 测试文件上传

1. 登录管理后台
2. 进入模板管理
3. 点击"添加模板"
4. 填写基本信息
5. 点击文件上传区域
6. 选择一个 PDF 文件
7. 查看文件信息显示
8. 点击"添加模板"
9. 等待上传完成
10. 检查模板列表

### 2. 测试文件类型验证

1. 尝试上传图片文件 (.jpg)
2. 应该显示错误提示："只支持 PDF、Word、Excel 文件格式"

### 3. 测试文件大小验证

1. 尝试上传超过 10MB 的文件
2. 应该显示错误提示："文件大小不能超过 10MB"

### 4. 测试URL输入

1. 不选择文件
2. 直接在URL输入框输入文件链接
3. 应该可以正常提交

### 5. 测试编辑功能

1. 编辑现有模板
2. 上传新文件替换旧文件
3. 检查是否更新成功

---

## 故障排除

### 问题 1: 上传失败 "Bucket not found"

**解决方案**: 
- 确认已在 Supabase 创建 `templates` bucket
- 检查 bucket 名称是否正确

### 问题 2: 上传失败 "Row level security policy"

**解决方案**:
- 确认已执行 Storage 策略 SQL
- 确认用户已登录

### 问题 3: 文件上传后无法访问

**解决方案**:
- 确认 bucket 设置为 Public
- 检查 Storage 策略中的 SELECT 权限

### 问题 4: 上传进度一直是 0%

**解决方案**:
- Supabase Storage 上传不支持实时进度
- 可以改为显示"上传中..."状态

---

## 下一步优化

### 1. 拖拽上传

添加拖拽文件上传功能：

```tsx
const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) {
    handleFileSelect({ target: { files: [file] } } as any);
  }
};

<div
  onDrop={handleDrop}
  onDragOver={(e) => e.preventDefault()}
  className="..."
>
  ...
</div>
```

### 2. 文件预览

添加 PDF 预览功能

### 3. 批量上传

支持一次上传多个文件

### 4. 上传历史

记录上传历史和失败原因

### 5. 文件管理

- 查看所有上传的文件
- 删除未使用的文件
- 文件重命名

---

## 总结

✅ **文件上传功能已基本实现！**

只需要：
1. 在 Supabase 创建 Storage Bucket
2. 设置访问策略
3. 修改UI添加文件上传组件

就可以开始使用文件上传功能了！🎉
