# 🔧 Supabase 配置助手

## 📝 **请按照以下步骤操作**

---

## ✅ **第 1 步：创建 Supabase 项目**

### **1.1 访问并登录**
- 网址：https://supabase.com
- 使用 GitHub 账号登录（推荐）或邮箱注册

### **1.2 创建项目**
点击 "New Project" 并填写：

```
Organization: [选择或创建]
Name: legalmy
Database Password: [设置强密码并记住！]
Region: Southeast Asia (Singapore)
Plan: Free
```

⏰ **等待 2-3 分钟项目创建...**

---

## ✅ **第 2 步：获取 API 密钥**

### **2.1 进入设置**
左侧菜单 → ⚙️ Settings → API

### **2.2 复制以下三个值**

#### **① Project URL**
```
复制这里 → 
```

#### **② anon public key**
```
复制这里 → 
```

#### **③ service_role key**（点击 "Reveal" 显示）
```
复制这里 → 
```

---

## ✅ **第 3 步：填写到 .env.local**

打开项目中的 `.env.local` 文件，替换为：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=【粘贴 Project URL】
NEXT_PUBLIC_SUPABASE_ANON_KEY=【粘贴 anon public key】
SUPABASE_SERVICE_ROLE_KEY=【粘贴 service_role key】

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**保存文件！**（Ctrl+S）

---

## ✅ **第 4 步：创建数据库表**

### **4.1 打开 SQL Editor**
Supabase 左侧菜单 → 🔧 SQL Editor → New query

### **4.2 复制并执行 SQL**
1. 打开项目中的 `supabase/schema.sql` 文件
2. 全选（Ctrl+A）并复制（Ctrl+C）
3. 粘贴到 Supabase SQL Editor
4. 点击 "Run" 按钮
5. 看到 "Success. No rows returned" 就成功了！

### **4.3 验证**
左侧菜单 → 📊 Table Editor

应该看到 10 个表：
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

---

## ✅ **第 5 步：告诉我完成了**

完成上述步骤后，在聊天中输入：**"配置完成"**

我会帮您重启服务器并测试系统！

---

## 🆘 **遇到问题？**

随时告诉我遇到的问题，我会帮您解决！

---

**当前进度**：⬜⬜⬜⬜⬜ 0%

开始第 1 步吧！访问 https://supabase.com 🚀
