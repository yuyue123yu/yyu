# 🚀 快速实现文件上传功能

## 最简单的方法

由于当前代码已经包含了文件上传的核心逻辑，您只需要：

### 步骤 1：在 Supabase 创建 Storage Bucket（5分钟）

1. 访问：https://supabase.com/dashboard/project/ovtrvzbftinsfwytzgwy/storage/buckets
2. 点击 "New bucket"
3. 名称输入：`templates`
4. 选择 "Public bucket"
5. 点击 "Create bucket"

### 步骤 2：设置访问策略（2分钟）

1. 点击刚创建的 `templates` bucket
2. 点击 "Policies" 标签
3. 点击 "New Policy"
4. 选择 "For full customization"
5. 粘贴以下策略：

**策略 1 - 公开读取：**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'templates');
```

**策略 2 - 认证用户上传：**
```sql
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'templates' AND auth.role() = 'authenticated');
```

**策略 3 - 认证用户删除：**
```sql
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'templates' AND auth.role() = 'authenticated');
```

### 步骤 3：测试上传功能

代码已经准备好了！现在可以直接测试：

1. 刷新浏览器
2. 进入模板管理
3. 点击"添加模板"
4. 填写表单
5. 在"文件URL"输入框下方，我们需要添加文件选择按钮

---

## 临时解决方案（立即可用）

如果您想立即测试，可以先使用URL方式：

1. 将文件上传到任何公开的文件托管服务（如 Google Drive, Dropbox）
2. 获取公开链接
3. 在"文件URL"输入框中粘贴链接
4. 手动输入文件大小（如 "2.5 MB"）
5. 提交表单

这样可以先测试其他功能，文件上传UI可以稍后添加。

---

## 完整的文件上传UI（需要修改代码）

如果您想要完整的文件上传功能，需要修改 `src/app/admin/templates/page.tsx` 文件。

由于文件较大，建议使用以下方法：

### 方法 1：使用 VS Code 搜索替换

1. 打开 `src/app/admin/templates/page.tsx`
2. 按 `Ctrl+F` 打开搜索
3. 搜索：`文件URL`
4. 找到添加模态框中的那一处（大约在第 670 行）
5. 手动添加文件上传组件

### 方法 2：等待我创建完整的新文件

我可以创建一个全新的模板管理页面文件，包含完整的文件上传UI。

---

## 当前功能状态

✅ **已实现（后端逻辑）：**
- 文件选择处理
- 文件类型验证（PDF, Word, Excel）
- 文件大小验证（最大 10MB）
- 文件上传到 Supabase Storage
- 获取公共 URL
- 保存到数据库

⏳ **待完成（前端UI）：**
- 文件选择按钮
- 文件信息显示
- 上传进度条
- 拖拽上传

---

## 建议

**选项 A：先使用URL方式**
- 优点：立即可用，无需修改代码
- 缺点：需要手动上传文件到其他地方

**选项 B：完成文件上传UI**
- 优点：用户体验好，功能完整
- 缺点：需要修改代码

**我的建议：**
1. 先完成 Supabase Storage Bucket 创建（步骤1和2）
2. 使用URL方式测试其他功能
3. 稍后我帮您完成文件上传UI

您想选择哪个方案？
