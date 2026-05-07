# 🔍 Kiro账号切换导致的登录问题诊断

## 📋 问题背景

**关键信息**：用户在开发过程中切换了Kiro账号，这可能导致：
1. Supabase项目连接不匹配
2. 环境变量指向错误的项目
3. 数据库修改应用到了错误的项目

## 🎯 核心问题

### 问题1：Supabase项目不匹配

**症状**：
- 登录成功但无法访问Dashboard
- 数据库查询失败
- Profile数据无法读取

**原因**：
- `.env.local` 中的 Supabase URL 和 Key 可能指向旧项目
- 所有的SQL修复都应用到了旧项目的数据库
- 新项目的数据库可能没有正确的表结构和数据

### 问题2：Session持久化失败

**症状**：
- 登录显示成功
- 跳转后被重定向回登录页
- 刷新页面后Session丢失

**原因**：
- Cookie域名不匹配
- LocalStorage被清除
- Session没有正确保存

## 🔧 诊断步骤

### 步骤1：访问诊断页面

```
http://localhost:3000/diagnose-login
```

这个页面会检查：
- ✅ 环境变量是否正确
- ✅ Session是否存在
- ✅ User是否存在
- ✅ Profile是否可以查询
- ✅ Cookie是否正确设置
- ✅ LocalStorage是否有数据

### 步骤2：验证Supabase项目

1. **打开 Supabase Dashboard**
   - 访问：https://supabase.com/dashboard
   - 确认当前使用的项目

2. **检查项目URL**
   - 在 Supabase Dashboard 中找到项目URL
   - 对比 `.env.local` 中的 `NEXT_PUBLIC_SUPABASE_URL`
   - **如果不匹配，这就是问题所在！**

3. **检查API Keys**
   - 在 Supabase Dashboard 的 Settings > API 中找到 Keys
   - 对比 `.env.local` 中的 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 步骤3：验证数据库状态

在 Supabase Dashboard 的 SQL Editor 中执行：

```sql
-- 检查管理员账号
SELECT * FROM profiles WHERE email = '403940124@qq.com';

-- 检查 RLS 函数
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('is_super_admin', 'get_user_tenant_id');
```

## 💡 解决方案

### 方案A：更新环境变量（推荐）

如果Supabase项目URL不匹配：

1. **获取正确的项目信息**
   - 登录 Supabase Dashboard
   - 进入正确的项目
   - 复制 Project URL 和 API Keys

2. **更新 `.env.local`**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
   ```

3. **重启开发服务器**
   ```bash
   # 停止当前服务器 (Ctrl+C)
   # 清除缓存
   rm -rf .next
   # 重新启动
   npm run dev
   ```

4. **重新执行数据库修复**
   - 在正确的项目中执行所有SQL修复脚本
   - 特别是：`最终修复Super-Admin.sql` 和 `修复RLS无限递归.sql`

### 方案B：在Supabase中重置密码

如果环境变量正确但仍无法登录：

1. **在 Supabase Dashboard 中**
   - 进入 Authentication > Users
   - 找到 `403940124@qq.com`
   - 点击用户 > Reset Password
   - 设置新密码（例如：`Admin123!@#`）

2. **测试登录**
   - 访问 `/diagnose-login`
   - 点击"测试登录"
   - 输入新密码

### 方案C：创建新的管理员账号

如果以上方案都不行：

1. **在 Supabase Dashboard 中创建新用户**
   ```sql
   -- 在 SQL Editor 中执行
   
   -- 1. 在 auth.users 中创建用户（需要在 Dashboard 的 Authentication > Users 中手动创建）
   -- 或者使用 Supabase Dashboard 的 UI 创建
   
   -- 2. 创建 Profile
   INSERT INTO profiles (id, email, full_name, user_type, super_admin, tenant_id)
   VALUES (
     'USER_ID_FROM_AUTH_USERS',
     'new-admin@example.com',
     'New Admin',
     'admin',
     true,
     NULL
   );
   ```

2. **设置密码**
   - 在 Authentication > Users 中设置密码

3. **测试登录**

### 方案D：临时禁用权限检查

如果需要紧急访问Dashboard：

1. **修改 `src/app/admin/layout.tsx`**
   ```typescript
   // 注释掉这段代码
   /*
   useEffect(() => {
     if (!loading && !user) {
       router.push("/admin/login");
     }
   }, [user, loading, router]);
   */
   
   // 改为
   useEffect(() => {
     // 临时禁用权限检查
     console.log('Auth check disabled for debugging');
   }, []);
   ```

2. **直接访问Dashboard**
   - 访问 `/admin` 或 `/super-admin/dashboard-simple`

## 📊 诊断检查清单

使用以下清单逐项检查：

- [ ] 访问 `/diagnose-login` 页面
- [ ] 确认环境变量存在且正确
- [ ] 确认 Supabase 项目 URL 匹配
- [ ] 确认 API Keys 正确
- [ ] 在 Supabase Dashboard 中确认用户存在
- [ ] 在 Supabase Dashboard 中确认 Profile 存在
- [ ] 确认 Profile 的 `user_type='admin'` 和 `super_admin=true`
- [ ] 确认 Profile 的 `tenant_id` 为 NULL
- [ ] 确认 RLS 辅助函数存在
- [ ] 测试登录功能
- [ ] 检查浏览器控制台错误
- [ ] 检查 Network 标签的请求

## 🚨 常见错误和解决方法

### 错误1：Invalid API key

**原因**：API Key 不匹配或过期

**解决**：
1. 在 Supabase Dashboard 中获取新的 API Key
2. 更新 `.env.local`
3. 重启服务器

### 错误2：relation "profiles" does not exist

**原因**：连接到了错误的数据库或表未创建

**解决**：
1. 确认 Supabase 项目 URL
2. 在正确的项目中执行建表SQL

### 错误3：Row Level Security policy violation

**原因**：RLS 策略阻止查询

**解决**：
1. 确认 RLS 辅助函数已创建
2. 执行 `修复RLS无限递归.sql`

### 错误4：User not found

**原因**：用户不存在或在错误的项目中

**解决**：
1. 在 Supabase Dashboard 中确认用户存在
2. 如果不存在，重新创建用户

## 📝 下一步行动

### 立即执行：

1. **访问诊断页面**
   ```
   http://localhost:3000/diagnose-login
   ```

2. **检查诊断结果**
   - 查看所有检查项
   - 记录任何错误信息

3. **验证 Supabase 项目**
   - 打开 Supabase Dashboard
   - 确认项目 URL
   - 对比 `.env.local`

4. **根据诊断结果选择方案**
   - 如果项目不匹配 → 方案A
   - 如果密码错误 → 方案B
   - 如果用户不存在 → 方案C
   - 如果需要紧急访问 → 方案D

### 需要提供的信息：

为了进一步帮助，请提供：

1. **诊断页面的完整截图**
2. **`.env.local` 中的 Supabase URL（前30个字符）**
3. **Supabase Dashboard 中的项目 URL**
4. **浏览器控制台的错误信息**
5. **是否能在 Supabase Dashboard 中看到用户和 Profile**

## 🎯 预期结果

修复后，诊断页面应该显示：

- ✅ 环境变量：有 URL 和 Key
- ✅ Session：存在且有效
- ✅ User：存在且有 ID 和 Email
- ✅ Profile：存在且有完整数据
- ✅ Cookies：有 Supabase Cookie
- ✅ LocalStorage：有 Supabase 数据
- ✅ 诊断结论：登录状态正常！

## 📞 紧急联系

如果以上方案都无法解决，建议：

1. **导出当前数据库**
   - 在 Supabase Dashboard 中导出数据

2. **创建新项目**
   - 创建全新的 Supabase 项目
   - 重新执行所有建表和配置SQL

3. **导入数据**
   - 将数据导入新项目

4. **更新环境变量**
   - 使用新项目的 URL 和 Keys
