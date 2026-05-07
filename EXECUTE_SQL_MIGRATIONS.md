# 🗄️ 数据库迁移执行指南

**重要**: 请按照以下顺序在 Supabase Dashboard 的 SQL Editor 中执行这些 SQL 文件。

---

## 📋 执行前检查清单

在开始之前，请确保：

- [ ] 你有 Supabase 项目的访问权限
- [ ] 你有管理员权限
- [ ] 你已经备份了现有数据（如果有）
- [ ] 你已经阅读了所有 SQL 文件
- [ ] 你理解每个迁移的作用

---

## 🚀 执行步骤

### 访问 Supabase SQL Editor

1. 打开浏览器，访问: https://supabase.com/dashboard
2. 登录你的账户
3. 选择项目: `ovtrvzbftinsfwytzgwy`
4. 点击左侧菜单的 **SQL Editor**
5. 点击 **New Query** 创建新查询

---

## 📝 迁移文件执行顺序

### ⚠️ 重要提示
- **必须按照以下顺序执行**
- **每次只执行一个文件**
- **等待每个文件执行完成后再执行下一个**
- **检查每个文件的执行结果，确保没有错误**

---

### 第 1 步: 创建租户表
**文件**: `supabase/001_create_tenants_table.sql`

**作用**: 创建 `tenants` 表，存储所有租户信息

**执行方法**:
1. 打开文件 `supabase/001_create_tenants_table.sql`
2. 复制所有内容
3. 粘贴到 Supabase SQL Editor
4. 点击 **Run** 或按 `Ctrl+Enter`
5. 等待执行完成
6. 检查结果：应该显示 "Success. No rows returned"

**预期结果**:
- ✅ `tenants` 表已创建
- ✅ 索引已创建
- ✅ 触发器已创建

---

### 第 2 步: 创建租户设置表
**文件**: `supabase/002_create_tenant_settings_table.sql`

**作用**: 创建 `tenant_settings` 表，存储每个租户的 OEM 配置

**执行方法**:
1. 打开文件 `supabase/002_create_tenant_settings_table.sql`
2. 复制所有内容
3. 粘贴到 Supabase SQL Editor
4. 点击 **Run**
5. 等待执行完成

**预期结果**:
- ✅ `tenant_settings` 表已创建
- ✅ 索引已创建
- ✅ 外键约束已创建

---

### 第 3 步: 创建审计日志表
**文件**: `supabase/003_create_audit_logs_table.sql`

**作用**: 创建 `audit_logs` 表，记录所有超级管理员操作

**执行方法**:
1. 打开文件 `supabase/003_create_audit_logs_table.sql`
2. 复制所有内容
3. 粘贴到 Supabase SQL Editor
4. 点击 **Run**
5. 等待执行完成

**预期结果**:
- ✅ `audit_logs` 表已创建
- ✅ 不可变策略已创建（防止更新和删除）
- ✅ 索引已创建

---

### 第 4 步: 创建系统设置表
**文件**: `supabase/004_create_system_settings_table.sql`

**作用**: 创建 `system_settings` 表，存储全局系统配置

**执行方法**:
1. 打开文件 `supabase/004_create_system_settings_table.sql`
2. 复制所有内容
3. 粘贴到 Supabase SQL Editor
4. 点击 **Run**
5. 等待执行完成

**预期结果**:
- ✅ `system_settings` 表已创建
- ✅ 索引已创建

---

### 第 5 步: 创建密码重置令牌表
**文件**: `supabase/005_create_password_reset_tokens_table.sql`

**作用**: 创建 `password_reset_tokens` 表，管理密码重置令牌

**执行方法**:
1. 打开文件 `supabase/005_create_password_reset_tokens_table.sql`
2. 复制所有内容
3. 粘贴到 Supabase SQL Editor
4. 点击 **Run**
5. 等待执行完成

**预期结果**:
- ✅ `password_reset_tokens` 表已创建
- ✅ 索引已创建

---

### 第 6 步: 添加租户列到现有表
**文件**: `supabase/006_add_tenant_columns.sql`

**作用**: 向现有表添加 `tenant_id` 和 `super_admin` 列

**⚠️ 重要**: 这个步骤会修改现有表，请确保已备份数据

**执行方法**:
1. 打开文件 `supabase/006_add_tenant_columns.sql`
2. 复制所有内容
3. 粘贴到 Supabase SQL Editor
4. 点击 **Run**
5. 等待执行完成（可能需要几秒钟）

**预期结果**:
- ✅ `profiles` 表添加了 `tenant_id` 和 `super_admin` 列
- ✅ 所有多租户表添加了 `tenant_id` 列
- ✅ 所有索引已创建

---

### 第 7 步: 创建 RLS 策略
**文件**: `supabase/007_create_rls_policies.sql`

**作用**: 创建行级安全策略，实现租户数据隔离

**⚠️ 重要**: 这是最关键的安全步骤

**执行方法**:
1. 打开文件 `supabase/007_create_rls_policies.sql`
2. 复制所有内容
3. 粘贴到 Supabase SQL Editor
4. 点击 **Run**
5. 等待执行完成（可能需要10-20秒）

**预期结果**:
- ✅ 所有表的 RLS 已启用
- ✅ 40+ RLS 策略已创建
- ✅ 租户隔离已生效

---

### 第 8 步: 创建辅助函数
**文件**: `supabase/008_create_helper_functions.sql`

**作用**: 创建数据库辅助函数（设置配置、获取租户ID等）

**执行方法**:
1. 打开文件 `supabase/008_create_helper_functions.sql`
2. 复制所有内容
3. 粘贴到 Supabase SQL Editor
4. 点击 **Run**
5. 等待执行完成

**预期结果**:
- ✅ `set_config()` 函数已创建
- ✅ `get_tenant_id()` 函数已创建
- ✅ `is_super_admin()` 函数已创建
- ✅ `log_audit_event()` 函数已创建
- ✅ `update_tenant_user_count()` 函数和触发器已创建

---

### 第 9 步: 迁移现有数据并设置 NOT NULL
**文件**: `supabase/009_set_tenant_id_not_null.sql`

**作用**: 
1. 创建默认租户
2. 将所有现有数据迁移到默认租户
3. 设置 `tenant_id` 为 NOT NULL

**⚠️ 重要**: 这是最后一步，执行后无法轻易回滚

**执行方法**:
1. 打开文件 `supabase/009_set_tenant_id_not_null.sql`
2. 复制所有内容
3. 粘贴到 Supabase SQL Editor
4. 点击 **Run**
5. 等待执行完成（可能需要几秒钟到几分钟，取决于数据量）

**预期结果**:
- ✅ 默认租户已创建（ID: 00000000-0000-0000-0000-000000000001）
- ✅ 所有现有数据已分配到默认租户
- ✅ 所有 `tenant_id` 列已设置为 NOT NULL
- ✅ 租户用户计数已更新

---

## ✅ 验证迁移成功

执行完所有 9 个文件后，运行以下查询验证：

### 1. 检查表是否存在
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

**预期结果**: 应该返回 5 行

---

### 2. 检查默认租户
```sql
SELECT * FROM public.tenants 
WHERE id = '00000000-0000-0000-0000-000000000001';
```

**预期结果**: 应该返回 1 行，显示 "Default Tenant"

---

### 3. 检查 RLS 策略
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
```

**预期结果**: 应该返回 40+ 行策略

---

### 4. 检查辅助函数
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN (
    'set_config', 
    'get_tenant_id', 
    'is_super_admin', 
    'log_audit_event', 
    'update_tenant_user_count'
  );
```

**预期结果**: 应该返回 5 行

---

### 5. 检查现有数据迁移
```sql
SELECT 
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN tenant_id IS NOT NULL THEN 1 END) as profiles_with_tenant
FROM public.profiles;
```

**预期结果**: `total_profiles` 应该等于 `profiles_with_tenant`

---

## 🎯 下一步：创建第一个超级管理员

迁移完成后，你需要创建第一个超级管理员账户。

### 方法 1: 通过 Supabase Dashboard

1. 进入 **Authentication** > **Users**
2. 点击 **Add user** > **Create new user**
3. 输入邮箱和密码
4. 点击 **Create user**
5. 记下用户的 UUID

然后在 SQL Editor 中运行：

```sql
-- 将用户设置为超级管理员
UPDATE public.profiles 
SET super_admin = true 
WHERE id = '你的用户UUID';

-- 验证
SELECT id, email, super_admin 
FROM public.profiles 
WHERE super_admin = true;
```

---

### 方法 2: 使用现有用户

如果你已经有一个用户账户，可以直接将其提升为超级管理员：

```sql
-- 使用邮箱查找并设置为超级管理员
UPDATE public.profiles 
SET super_admin = true 
WHERE email = 'your-email@example.com';

-- 验证
SELECT id, email, super_admin 
FROM public.profiles 
WHERE super_admin = true;
```

---

## 🔐 设置 MFA（多因素认证）

创建超级管理员后，立即设置 MFA：

1. 访问: `http://localhost:3000/super-admin/mfa-setup`
2. 使用超级管理员账户登录
3. 扫描 QR 码（使用 Google Authenticator 或 Authy）
4. 保存 8 个备份码到安全的地方
5. 输入 6 位验证码完成设置

---

## 🚨 故障排除

### 问题 1: "relation already exists" 错误

**原因**: 表或策略已经存在

**解决方案**: 
- 检查是否已经执行过该文件
- 如果需要重新执行，先删除相关对象：
  ```sql
  DROP TABLE IF EXISTS table_name CASCADE;
  ```

---

### 问题 2: "column already exists" 错误

**原因**: 列已经存在

**解决方案**: 
- 跳过该步骤，继续下一个文件
- 或者使用 `ALTER TABLE ... DROP COLUMN` 先删除列

---

### 问题 3: "foreign key constraint" 错误

**原因**: 外键约束冲突

**解决方案**: 
- 确保按照正确的顺序执行文件
- 检查引用的表是否存在

---

### 问题 4: RLS 策略导致查询失败

**原因**: RLS 策略阻止了查询

**解决方案**: 
- 确保已设置租户上下文
- 或者使用服务角色密钥（绕过 RLS）

---

## 📞 需要帮助？

如果遇到问题：

1. **检查错误消息**: 仔细阅读 Supabase 返回的错误信息
2. **查看文档**: 参考 `docs/DATABASE_SCHEMA.md`
3. **回滚**: 如果需要，可以删除所有新表重新开始
4. **联系支持**: support@malai.com

---

## 🎉 完成！

如果所有步骤都成功执行，你的数据库现在已经：

- ✅ 支持多租户架构
- ✅ 实现了行级安全
- ✅ 配置了审计日志
- ✅ 准备好超级管理员系统

**下一步**: 启动应用程序并测试超级管理员功能！

```bash
npm run dev
```

然后访问: `http://localhost:3000/super-admin/login`

---

*执行时间: 约 15-20 分钟*  
*难度: 中等*  
*需要权限: Supabase 管理员*
