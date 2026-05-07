# 🚀 Supabase 设置指南

## 📋 **第 1 步：创建 Supabase 项目**

1. 访问 [Supabase](https://supabase.com)
2. 点击 "Start your project"
3. 使用 GitHub 账号登录
4. 点击 "New Project"
5. 填写项目信息：
   - **Name**: `legalmy` 或您喜欢的名称
   - **Database Password**: 设置一个强密码（请保存好）
   - **Region**: 选择 `Southeast Asia (Singapore)` 最接近马来西亚
6. 点击 "Create new project"
7. 等待 2-3 分钟项目创建完成

---

## 🔑 **第 2 步：获取 API 密钥**

1. 项目创建完成后，进入项目仪表板
2. 点击左侧菜单的 **Settings** (齿轮图标)
3. 点击 **API**
4. 复制以下信息：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (点击 "Reveal" 显示)

---

## 📝 **第 3 步：配置环境变量**

1. 打开项目根目录的 `.env.local` 文件
2. 替换以下内容：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon_key
SUPABASE_SERVICE_ROLE_KEY=你的service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. 保存文件

⚠️ **重要**: 不要将 `.env.local` 提交到 Git！它已经在 `.gitignore` 中。

---

## 🗄️ **第 4 步：创建数据库表**

1. 在 Supabase 仪表板，点击左侧的 **SQL Editor**
2. 点击 **New query**
3. 打开项目中的 `supabase/schema.sql` 文件
4. 复制所有内容
5. 粘贴到 Supabase SQL Editor
6. 点击 **Run** 执行 SQL
7. 等待执行完成，应该看到 "Success. No rows returned"

---

## ✅ **第 5 步：验证设置**

### 检查表是否创建成功：

1. 点击左侧的 **Table Editor**
2. 应该看到以下表：
   - ✅ profiles
   - ✅ lawyers
   - ✅ services
   - ✅ consultations
   - ✅ orders
   - ✅ reviews
   - ✅ templates
   - ✅ articles
   - ✅ favorites
   - ✅ cart

### 检查认证设置：

1. 点击左侧的 **Authentication**
2. 点击 **Providers**
3. 确保 **Email** 已启用
4. （可选）配置 **Email Templates** 自定义邮件模板

---

## 🔄 **第 6 步：重启开发服务器**

```bash
# 停止当前服务器 (Ctrl+C)
# 重新启动
npm run dev
```

---

## 🧪 **第 7 步：测试用户注册**

1. 访问 http://localhost:3000/register
2. 填写注册表单
3. 提交注册
4. 检查 Supabase 仪表板：
   - **Authentication** → **Users** 应该看到新用户
   - **Table Editor** → **profiles** 应该看到用户资料

---

## 📊 **数据库结构说明**

### **核心表：**

1. **profiles** - 用户资料
   - 存储用户基本信息
   - 关联 Supabase Auth

2. **lawyers** - 律师信息
   - 律师详细资料
   - 专业领域、经验、评分等

3. **consultations** - 咨询记录
   - 用户咨询请求
   - 状态跟踪

4. **orders** - 订单
   - 支付记录
   - 订单状态

5. **reviews** - 评价
   - 用户对律师的评价
   - 评分和评论

6. **favorites** - 收藏
   - 用户收藏的律师

7. **cart** - 购物车
   - 临时购物车数据

8. **templates** - 文档模板
   - 法律文档模板库

9. **articles** - 法律文章
   - 知识库文章

10. **services** - 服务类型
    - 法律服务分类

---

## 🔐 **安全设置 (Row Level Security)**

所有表都已启用 RLS (Row Level Security)：

- ✅ 用户只能查看/修改自己的数据
- ✅ 公开数据（律师、文章）所有人可见
- ✅ 防止未授权访问

---

## 🎯 **下一步**

设置完成后，您可以：

1. ✅ 用户注册/登录
2. ✅ 查看律师列表（需要添加数据）
3. ✅ 提交咨询请求
4. ⏳ 添加支付功能
5. ⏳ 开发管理后台

---

## 🆘 **常见问题**

### Q: 注册后没有收到确认邮件？
A: 在开发环境，Supabase 会自动确认邮箱。生产环境需要配置 SMTP。

### Q: 登录失败？
A: 检查 `.env.local` 文件是否正确配置，并重启开发服务器。

### Q: 数据库连接错误？
A: 确认 Supabase 项目 URL 和 API 密钥正确。

### Q: 如何查看错误日志？
A: 打开浏览器开发者工具 (F12) → Console 查看错误信息。

---

## 📚 **相关文档**

- [Supabase 官方文档](https://supabase.com/docs)
- [Next.js + Supabase 指南](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**需要帮助？** 随时询问！ 🚀
