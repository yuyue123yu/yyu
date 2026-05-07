# 🚀 Supabase 快速开始指南

## ⏱️ 5分钟完成设置

### **步骤 1: 创建 Supabase 账号** (1分钟)

1. 访问 https://supabase.com
2. 点击 "Start your project"
3. 使用 GitHub 登录

### **步骤 2: 创建项目** (2分钟)

1. 点击 "New Project"
2. 填写：
   - **Name**: `legalmy`
   - **Password**: 设置数据库密码（保存好！）
   - **Region**: `Southeast Asia (Singapore)`
3. 点击 "Create new project"
4. 等待 2-3 分钟

### **步骤 3: 获取密钥** (30秒)

1. 项目创建完成后
2. 左侧菜单 → **Settings** → **API**
3. 复制：
   - **Project URL**
   - **anon public** key
   - **service_role** key (点击 Reveal)

### **步骤 4: 配置项目** (30秒)

编辑 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=你的Project_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon_key
SUPABASE_SERVICE_ROLE_KEY=你的service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **步骤 5: 创建数据库** (1分钟)

1. Supabase 仪表板 → **SQL Editor**
2. 点击 "New query"
3. 复制 `supabase/schema.sql` 的全部内容
4. 粘贴并点击 **Run**

### **步骤 6: 重启服务器** (10秒)

```bash
# 停止当前服务器 (Ctrl+C)
npm run dev
```

### **步骤 7: 测试** (1分钟)

1. 访问 http://localhost:3000/register
2. 注册一个测试账号
3. 检查 Supabase → **Authentication** → **Users**
4. 应该看到新用户！

---

## ✅ 完成！

现在您可以：
- ✅ 用户注册
- ✅ 用户登录
- ✅ 用户登出
- ✅ 密码重置

---

## 🎯 下一步

查看 `USER_MANAGEMENT_IMPLEMENTATION.md` 了解：
- 完整功能列表
- 后续开发计划
- API 使用说明

---

## 🆘 遇到问题？

**常见问题：**

1. **注册失败？**
   - 检查 `.env.local` 配置
   - 重启开发服务器
   - 查看浏览器控制台

2. **数据库错误？**
   - 确认 SQL 执行成功
   - 检查 Supabase → Table Editor

3. **密钥错误？**
   - 确认复制了正确的密钥
   - 注意不要有多余空格

---

**需要详细说明？** 查看 `SUPABASE_SETUP.md` 📚
