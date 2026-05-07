# 📋 模板管理 - URL方式快速设置

## 当前状态

✅ 模板管理功能已完整实现
✅ 可以使用URL方式添加模板
✅ 所有CRUD功能正常工作

---

## 使用方法

### 添加模板

1. **登录管理后台**
   - 访问：http://localhost:3000/admin/login
   - 邮箱：test@example.com
   - 密码：Test123456

2. **进入模板管理**
   - 点击左侧菜单"模板管理"
   - 或访问：http://localhost:3000/admin/templates

3. **点击"添加模板"按钮**

4. **填写表单**
   - **分类**：例如 "合同模板"
   - **语言**：选择 Bahasa Malaysia / 中文 / English
   - **标题（中文）**：例如 "租赁合同模板"
   - **标题（English）**：例如 "Tenancy Agreement Template"
   - **标题（Bahasa Malaysia）**：例如 "Templat Perjanjian Sewa"
   - **描述（中文）**：简短描述模板用途
   - **文件URL**：输入文件的公开链接
   - **文件大小**：例如 "2.5 MB"
   - **免费模板**：勾选或取消勾选
   - **价格**：如果是付费模板，输入价格（RM）

5. **点击"添加模板"**

---

## 获取文件URL的方法

### 方法 1：使用 Google Drive

1. 上传文件到 Google Drive
2. 右键点击文件 → "获取链接"
3. 设置为"任何人都可以查看"
4. 复制链接
5. 修改链接格式：
   - 原始：`https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
   - 修改为：`https://drive.google.com/uc?export=download&id=FILE_ID`

### 方法 2：使用 Dropbox

1. 上传文件到 Dropbox
2. 点击"共享"
3. 创建链接
4. 复制链接
5. 将链接末尾的 `?dl=0` 改为 `?dl=1`

### 方法 3：使用免费文件托管服务

**推荐服务：**
- **Cloudinary** - https://cloudinary.com (免费 25GB)
- **ImgBB** - https://imgbb.com (免费，支持PDF)
- **File.io** - https://www.file.io (临时文件)

### 方法 4：使用 GitHub

1. 创建 GitHub 仓库
2. 上传文件到仓库
3. 点击文件
4. 点击"Raw"按钮
5. 复制URL

---

## 示例模板数据

### 示例 1：租赁合同模板

```
分类：合同模板
语言：Bahasa Malaysia
标题（中文）：标准租赁合同模板
标题（English）：Standard Tenancy Agreement Template
标题（Bahasa Malaysia）：Templat Perjanjian Sewa Standard
描述（中文）：适用于马来西亚住宅租赁的标准合同模板，包含所有必要条款
文件URL：https://example.com/templates/tenancy-agreement.pdf
文件大小：2.5 MB
免费模板：✓
```

### 示例 2：雇佣合同模板

```
分类：合同模板
语言：English
标题（中文）：雇佣合同模板
标题（English）：Employment Contract Template
标题（Bahasa Malaysia）：Templat Kontrak Pekerjaan
描述（中文）：标准雇佣合同模板，符合马来西亚劳动法规定
文件URL：https://example.com/templates/employment-contract.pdf
文件大小：1.8 MB
免费模板：✗
价格：RM 29.90
```

### 示例 3：授权委托书

```
分类：法律文书
语言：中文
标题（中文）：授权委托书模板
标题（English）：Power of Attorney Template
标题（Bahasa Malaysia）：Templat Surat Kuasa Wakil
描述（中文）：用于授权他人代理法律事务的标准委托书
文件URL：https://example.com/templates/power-of-attorney.pdf
文件大小：1.2 MB
免费模板：✓
```

---

## 测试清单

### ✅ 基础功能测试

- [ ] 添加免费模板
- [ ] 添加付费模板
- [ ] 编辑模板信息
- [ ] 删除模板
- [ ] 搜索模板
- [ ] 查看模板统计

### ✅ 数据验证测试

- [ ] 必填字段验证
- [ ] URL格式验证
- [ ] 价格数字验证
- [ ] 三语标题都已填写

### ✅ 显示测试

- [ ] 模板卡片显示正确
- [ ] 免费/付费标签显示
- [ ] 下载次数显示
- [ ] 文件大小显示
- [ ] 语言标签显示

---

## 常见问题

### Q1: 文件URL无法访问怎么办？

**A:** 确保：
- URL是公开可访问的
- 没有需要登录才能访问
- URL格式正确（以 http:// 或 https:// 开头）

### Q2: 可以使用本地文件路径吗？

**A:** 不可以。必须使用网络URL。本地文件路径（如 C:\files\template.pdf）无法在网页中访问。

### Q3: 支持哪些文件格式？

**A:** 虽然当前使用URL方式，但建议使用：
- PDF (.pdf)
- Word (.doc, .docx)
- Excel (.xls, .xlsx)

### Q4: 文件大小有限制吗？

**A:** URL方式没有限制，但建议：
- 保持文件在 10MB 以内
- 确保下载速度合理

### Q5: 如何修改已添加的模板？

**A:** 
1. 点击模板卡片上的"编辑"按钮
2. 修改信息
3. 点击"保存更改"

---

## 下一步计划

### 短期（当前可用）

- ✅ 使用URL方式管理模板
- ✅ 测试所有CRUD功能
- ✅ 添加示例模板数据

### 中期（未来实现）

- ⏳ 添加文件上传UI
- ⏳ 集成 Supabase Storage
- ⏳ 支持拖拽上传

### 长期（功能增强）

- ⏳ 文件预览功能
- ⏳ 批量上传
- ⏳ 版本管理
- ⏳ 下载统计分析

---

## 技术说明

### 当前实现

```typescript
// 模板数据结构
interface Template {
  id: string;
  category: string;
  title_zh: string;
  title_en: string;
  title_ms: string;
  description_zh: string;
  file_url: string;        // 文件URL
  file_size: string;       // 文件大小
  language: string;        // 语言
  downloads: number;       // 下载次数
  is_free: boolean;        // 是否免费
  price: number;           // 价格
  created_at: string;      // 创建时间
}
```

### 数据库表

```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY,
  category TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_ms TEXT NOT NULL,
  description_zh TEXT,
  description_en TEXT,
  description_ms TEXT,
  file_url TEXT NOT NULL,
  file_size TEXT,
  language TEXT DEFAULT 'ms',
  downloads INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT true,
  price DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 总结

✅ **模板管理功能完整可用！**

使用URL方式可以：
- 立即开始使用
- 测试所有功能
- 添加真实模板数据
- 无需等待文件上传功能

**开始使用：**
1. 登录管理后台
2. 进入模板管理
3. 点击"添加模板"
4. 填写表单并提交

祝使用愉快！🎉
