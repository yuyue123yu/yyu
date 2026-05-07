# 修复 Logo 上传功能 🔧

## 🐛 问题描述

在品牌设置页面点击"上传 Logo"按钮后，上传失败。

**原因**：Supabase Storage 中缺少 `tenant-assets` bucket，导致上传 API 无法存储文件。

---

## ✅ 解决方案

### 步骤 1：检查 Storage 状态

1. 打开 Supabase Dashboard
2. 进入 **SQL Editor**
3. 复制并执行 `检查Storage状态.sql` 中的 SQL
4. 查看结果：
   - 如果显示 "❌ tenant-assets bucket 不存在"，继续步骤 2
   - 如果显示 "✅ tenant-assets bucket 已存在"，跳到步骤 3

### 步骤 2：创建 Storage Bucket

1. 在 Supabase SQL Editor 中
2. 复制并执行 `创建Storage-Bucket.sql` 中的 SQL
3. 等待执行完成（应该显示成功）
4. 验证结果：
   ```sql
   SELECT * FROM storage.buckets WHERE id = 'tenant-assets';
   ```
   应该返回一条记录

### 步骤 3：测试上传功能

1. 刷新浏览器页面（Ctrl + Shift + R）
2. 访问品牌设置页面：`http://localhost:3000/admin/branding`
3. 点击"上传 Logo"按钮
4. 选择一张图片（JPG、PNG、SVG、WebP 或 GIF）
5. 等待上传完成
6. 应该看到 Logo 预览

---

## 📋 Storage Bucket 配置详情

### Bucket 信息
- **名称**：`tenant-assets`
- **公开访问**：是（允许前台读取）
- **文件大小限制**：5MB
- **允许的文件类型**：
  - `image/jpeg` (JPG)
  - `image/png` (PNG)
  - `image/svg+xml` (SVG)
  - `image/webp` (WebP)
  - `image/gif` (GIF)
  - `image/x-icon` (ICO)
  - `image/vnd.microsoft.icon` (ICO)

### Storage 策略

| 策略名称 | 操作 | 权限 | 说明 |
|---------|------|------|------|
| Public Access | SELECT | 所有人 | 允许公开读取文件 |
| Authenticated users can upload | INSERT | 认证用户 | 允许登录用户上传 |
| Users can update own tenant files | UPDATE | 租户成员 | 只能更新自己租户的文件 |
| Users can delete own tenant files | DELETE | 租户成员 | 只能删除自己租户的文件 |

---

## 🗂️ 文件存储结构

上传的文件会按租户 ID 组织：

```
tenant-assets/
├── {tenant_id_1}/
│   ├── logo-1234567890.png
│   ├── favicon-1234567891.ico
│   └── ...
├── {tenant_id_2}/
│   ├── logo-1234567892.jpg
│   └── ...
└── ...
```

**优点**：
- 每个租户的文件隔离存储
- 便于管理和清理
- 支持多租户架构

---

## 🔍 故障排除

### 问题 1：上传后显示 "上传失败"

**可能原因**：
1. Storage bucket 未创建
2. Storage 策略未配置
3. 文件类型不支持
4. 文件大小超过 5MB

**解决方案**：
1. 执行 `检查Storage状态.sql` 检查配置
2. 如果 bucket 不存在，执行 `创建Storage-Bucket.sql`
3. 检查文件类型和大小
4. 查看浏览器 Console 的错误信息

### 问题 2：上传成功但看不到图片

**可能原因**：
1. Storage bucket 不是公开的
2. 文件路径错误
3. 浏览器缓存问题

**解决方案**：
1. 检查 bucket 的 `public` 字段是否为 `true`
2. 在 Supabase Dashboard > Storage 中查看文件是否存在
3. 强制刷新浏览器（Ctrl + Shift + R）

### 问题 3：权限错误 "权限不足"

**可能原因**：
1. 用户不是 admin 或 owner
2. 用户未关联租户

**解决方案**：
1. 检查用户的 `user_type`：
   ```sql
   SELECT id, email, user_type, tenant_id 
   FROM profiles 
   WHERE email = 'your-email@example.com';
   ```
2. 如果 `user_type` 不是 'admin' 或 'owner'，更新：
   ```sql
   UPDATE profiles 
   SET user_type = 'admin' 
   WHERE email = 'your-email@example.com';
   ```

---

## 🧪 测试清单

- [ ] Storage bucket `tenant-assets` 已创建
- [ ] Storage 策略已配置（4 个策略）
- [ ] 可以上传 JPG 图片
- [ ] 可以上传 PNG 图片
- [ ] 可以上传 SVG 图片
- [ ] 上传后可以看到预览
- [ ] 保存设置后 Logo 保持不变
- [ ] 刷新页面后 Logo 仍然显示

---

## 📊 API 端点

### 上传 Logo
```
POST /api/tenant/branding/upload-logo
Content-Type: multipart/form-data

Body:
- logo: File (图片文件)

Response:
{
  "success": true,
  "logo_url": "https://xxx.supabase.co/storage/v1/object/public/tenant-assets/xxx/logo-xxx.png",
  "message": "Logo 上传成功"
}
```

### 获取品牌设置
```
GET /api/tenant/branding

Response:
{
  "success": true,
  "branding": {
    "logo_url": "https://...",
    "primary_color": "#1E40AF",
    "secondary_color": "#F59E0B",
    ...
  }
}
```

---

## 🎯 下一步

完成 Logo 上传功能后，您可以：

1. **测试其他上传功能**：
   - SEO 设置页面的 Favicon 上传
   - 其他需要上传图片的功能

2. **优化上传体验**：
   - 添加上传进度条
   - 支持拖拽上传
   - 图片裁剪功能

3. **测试前台显示**：
   - 访问前台首页
   - 查看 Logo 是否正确显示
   - 测试不同设备的显示效果

---

## 📝 注意事项

1. **文件大小限制**：
   - 单个文件最大 5MB
   - 建议 Logo 大小：200x60px
   - 建议 Favicon 大小：32x32px 或 64x64px

2. **文件格式**：
   - Logo 推荐：PNG（支持透明背景）或 SVG（矢量图）
   - Favicon 推荐：ICO 或 PNG

3. **性能优化**：
   - 上传前压缩图片
   - 使用 WebP 格式（更小的文件大小）
   - 启用 CDN 加速（Supabase 自带）

4. **安全性**：
   - 文件类型验证（前端 + 后端）
   - 文件大小验证
   - 只允许认证用户上传
   - 租户隔离（只能访问自己租户的文件）

---

## 🚀 总结

**问题**：Logo 上传失败  
**原因**：缺少 Storage bucket  
**解决**：执行 `创建Storage-Bucket.sql`  
**测试**：上传图片并查看预览  

现在请按照步骤操作，然后告诉我结果！✨
