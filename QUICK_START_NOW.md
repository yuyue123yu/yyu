# 🚀 立即开始 - 数据库迁移快速清单

**预计时间**: 20 分钟  
**当前状态**: 准备就绪 ✅

---

## ✅ 执行清单

### 步骤 1: 打开 Supabase Dashboard

```
□ 打开浏览器
□ 访问: https://supabase.com/dashboard
□ 登录账户
□ 选择项目: ovtrvzbftinsfwytzgwy
□ 点击左侧 "SQL Editor"
□ 点击 "New Query"
```

---

### 步骤 2: 执行 SQL 文件（按顺序）

#### □ 文件 1: `001_create_tenants_table.sql`
```
1. 在 VS Code 中打开文件
2. 全选 (Ctrl+A) 并复制 (Ctrl+C)
3. 粘贴到 Supabase SQL Editor (Ctrl+V)
4. 点击 "Run" 或按 Ctrl+Enter
5. 等待 "Success. No rows returned" 消息
```
**预期结果**: ✅ tenants 表已创建

---

#### □ 文件 2: `002_create_tenant_settings_table.sql`
```
重复上面的步骤
```
**预期结果**: ✅ tenant_settings 表已创建

---

#### □ 文件 3: `003_create_audit_logs_table.sql`
```
重复上面的步骤
```
**预期结果**: ✅ audit_logs 表已创建（带不可变策略）

---

#### □ 文件 4: `004_create_system_settings_table.sql`
```
重复上面的步骤
```
**预期结果**: ✅ system_settings 表已创建

---

#### □ 文件 5: `005_create_password_reset_tokens_table.sql`
```
重复上面的步骤
```
**预期结果**: ✅ password_reset_tokens 表已创建

---

#### □ 文件 6: `006_add_tenant_columns.sql`
```
重复上面的步骤
⚠️ 这个文件会修改现有表，可能需要几秒钟
```
**预期结果**: ✅ 所有表添加了 tenant_id 列

---

#### □ 文件 7: `007_create_rls_policies.sql`
```
重复上面的步骤
⚠️ 这个文件较大，可能需要 10-20 秒
```
**预期结果**: ✅ 40+ RLS 策略已创建

---

#### □ 文件 8: `008_create_helper_functions.sql`
```
重复上面的步骤
```
**预期结果**: ✅ 5 个辅助函数已创建

---

#### □ 文件 9: `009_set_tenant_id_not_null.sql` ⭐ 最重要
```
重复上面的步骤
⚠️ 这个文件会迁移所有现有数据，可能需要几秒到几分钟
```
**预期结果**: 
- ✅ 默认租户已创建
- ✅ 所有现有数据已迁移
- ✅ tenant_id 列设置为 NOT NULL

---

### 步骤 3: 验证迁移

在 Supabase SQL Editor 中运行以下查询：

#### □ 验证 1: 检查默认租户
```sql
SELECT * FROM public.tenants 
WHERE id = '00000000-0000-0000-0000-000000000001';
```
**预期结果**: 返回 1 行，name = "Default Tenant"

---

#### □ 验证 2: 检查表是否存在
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'tenants', 
    'tenant_settings', 
    'audit_logs', 
    'system_settings', 
    'password_reset_tokens'
  );
```
**预期结果**: 返回 5 行

---

#### □ 验证 3: 检查 RLS 策略
```sql
SELECT COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public';
```
**预期结果**: policy_count >= 40

---

#### □ 验证 4: 检查数据迁移
```sql
SELECT 
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN tenant_id IS NOT NULL THEN 1 END) as profiles_with_tenant
FROM public.profiles;
```
**预期结果**: total_profiles = profiles_with_tenant

---

### 步骤 4: 创建超级管理员

#### 选项 A: 使用现有用户（推荐）

□ 在 Supabase SQL Editor 中运行：
```sql
-- 替换为你的邮箱
UPDATE public.profiles 
SET super_admin = true 
WHERE email = 'your-email@example.com';

-- 验证
SELECT id, email, super_admin 
FROM public.profiles 
WHERE super_admin = true;
```
**预期结果**: 返回 1 行，super_admin = true

---

#### 选项 B: 创建新用户

□ 步骤：
```
1. 在 Supabase Dashboard 点击 "Authentication"
2. 点击 "Users"
3. 点击 "Add user" > "Create new user"
4. 输入邮箱和密码
5. 点击 "Create user"
6. 复制用户的 UUID
7. 运行上面的 SQL（使用邮箱或 UUID）
```

---

### 步骤 5: 测试登录

#### □ 启动开发服务器
```bash
# 在项目根目录打开终端
npm run dev
```
**预期结果**: 
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

---

#### □ 访问超级管理员登录页面
```
1. 打开浏览器
2. 访问: http://localhost:3000/super-admin/login
3. 输入超级管理员邮箱和密码
4. 点击 "登录"
```
**预期结果**: 
- ✅ 成功登录
- ✅ 重定向到仪表板
- ✅ 看到租户、用户等统计数据

---

## 🎉 完成！

如果所有步骤都成功，恭喜你！超级管理员系统现在已经完全运行了！

---

## 🐛 遇到问题？

### 问题 1: SQL 执行失败
**解决方案**: 
- 检查错误消息
- 确保按顺序执行
- 查看 `EXECUTE_SQL_MIGRATIONS.md` 的故障排除部分

### 问题 2: 登录失败
**解决方案**:
- 检查邮箱和密码是否正确
- 验证 super_admin 标志是否为 true
- 检查浏览器控制台的错误

### 问题 3: 数据不显示
**解决方案**:
- 检查浏览器控制台
- 检查网络请求
- 验证 RLS 策略是否正确

---

## 📞 需要帮助

如果遇到任何问题，告诉我：
1. 在哪一步遇到问题
2. 错误消息是什么
3. 截图（如果可能）

我会立即帮你解决！

---

## 🎯 下一步

完成后，你可以：
1. ✅ 创建第一个测试租户
2. ✅ 设置 MFA（多因素认证）
3. ✅ 探索所有功能
4. ✅ 运行完整的测试（参考 `SUPER_ADMIN_TEST_GUIDE.md`）

---

**开始时间**: __________  
**完成时间**: __________  
**总耗时**: __________

祝你顺利！🚀
