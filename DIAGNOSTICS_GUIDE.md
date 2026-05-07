# 系统诊断功能使用指南

## 📋 概述

系统诊断功能是一个全面的健康检查工具,可以快速识别超级管理员系统中的潜在问题。

## 🚀 如何访问

1. 登录超级管理员面板: http://localhost:3001/super-admin/login
2. 在左侧导航菜单中点击 **"Diagnostics"** (诊断)
3. 或直接访问: http://localhost:3001/super-admin/diagnostics

## 🔍 诊断项目

系统诊断会自动检查以下7个关键领域:

### 1. **数据库连接** (Database)
- ✅ 检查 Supabase 数据库连接是否正常
- ✅ 测量响应时间
- ❌ 如果失败,检查环境变量配置

### 2. **RLS 策略** (Row Level Security)
- ✅ 验证 RLS 策略是否正常工作
- ✅ 检查是否存在无限递归问题
- ✅ 测试辅助函数 (`is_super_admin`, `get_user_tenant_id`)
- ❌ 如果失败,需要执行 `010_fix_rls_infinite_recursion_v2.sql`

### 3. **表结构完整性** (Tables)
- ✅ 验证所有必需的数据库表是否存在
- 检查的表包括:
  - `profiles`, `tenants`, `tenant_settings`
  - `audit_logs`, `system_settings`, `password_reset_tokens`
  - `lawyers`, `consultations`, `orders`, `reviews`
  - `templates`, `articles`, `favorites`, `cart`, `services`
- ⚠️ 如果缺少表,显示警告并列出缺少的表名

### 4. **超级管理员权限** (Authentication)
- ✅ 验证当前用户是否已登录
- ✅ 检查用户是否具有超级管理员权限
- ✅ 显示用户ID、邮箱、租户ID
- ❌ 如果失败,需要设置 `super_admin = true`

### 5. **租户管理 API** (API)
- ✅ 测试租户管理 API 端点是否正常
- ✅ 验证 API 响应格式
- ❌ 如果失败,检查 API 路由和权限

### 6. **环境变量** (Configuration)
- ✅ 检查所有必需的环境变量是否已配置
- 必需的变量:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- ❌ 如果缺少,需要在 `.env.local` 中添加

### 7. **辅助函数** (Helper Functions)
- ✅ 验证数据库辅助函数是否已创建
- 检查的函数:
  - `is_super_admin()` - 检查用户是否为超级管理员
  - `get_user_tenant_id()` - 获取用户的租户ID
- ⚠️ 如果缺少,需要执行修复SQL脚本

## 📊 诊断结果

### 状态指示器

- 🟢 **成功 (Success)**: 测试通过,功能正常
- 🟡 **警告 (Warning)**: 功能可用但存在非关键问题
- 🔴 **错误 (Error)**: 测试失败,需要立即修复

### 结果摘要

诊断完成后会显示:
- **总测试数**: 执行的测试总数
- **通过**: 成功的测试数量
- **警告**: 有警告的测试数量
- **错误**: 失败的测试数量

## 🛠️ 常见问题修复

### 问题 1: RLS 无限递归错误

**症状**: 
```
infinite recursion detected in policy for relation 'profiles'
```

**解决方案**:
1. 在 Supabase Dashboard 的 SQL Editor 中执行:
   ```sql
   -- 文件: supabase/010_fix_rls_infinite_recursion_v2.sql
   ```
2. 重新运行诊断验证修复

### 问题 2: 缺少环境变量

**症状**: 
```
Missing environment variables: SUPABASE_SERVICE_ROLE_KEY
```

**解决方案**:
1. 打开 `.env.local` 文件
2. 添加缺少的环境变量:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
3. 重启开发服务器

### 问题 3: 超级管理员权限不足

**症状**: 
```
Current user is not a super admin
```

**解决方案**:
1. 在 Supabase Dashboard 的 SQL Editor 中执行:
   ```sql
   UPDATE public.profiles
   SET super_admin = true
   WHERE id = (SELECT id FROM auth.users WHERE email = 'your_email@example.com');
   ```
2. 退出并重新登录

### 问题 4: 缺少数据库表

**症状**: 
```
Missing tables: tenants, audit_logs
```

**解决方案**:
1. 按顺序执行所有迁移SQL文件 (001-009)
2. 在 Supabase Dashboard 的 SQL Editor 中执行每个文件

## 💡 使用技巧

1. **定期运行诊断**: 建议在每次部署后运行诊断
2. **复制结果**: 点击"复制结果"按钮可以将诊断报告复制到剪贴板
3. **分享给团队**: 将诊断结果分享给开发团队以快速定位问题
4. **监控趋势**: 定期运行诊断可以帮助发现系统退化

## 🔧 技术实现

### API 端点

诊断功能使用以下API端点:

- `/api/super-admin/diagnostics/database` - 数据库连接测试
- `/api/super-admin/diagnostics/rls` - RLS策略测试
- `/api/super-admin/diagnostics/tables` - 表结构检查
- `/api/super-admin/diagnostics/auth` - 认证权限检查
- `/api/super-admin/diagnostics/env` - 环境变量检查
- `/api/super-admin/diagnostics/functions` - 辅助函数检查

### 前端页面

- 页面路径: `src/app/super-admin/diagnostics/page.tsx`
- 导航组件: `src/components/super-admin/SuperAdminNav.tsx`

## 📝 更新日志

### v1.0.0 (2024)
- ✅ 初始版本发布
- ✅ 支持7个核心诊断项目
- ✅ 实时进度显示
- ✅ 结果复制功能
- ✅ 详细的错误信息和修复建议

---

**需要帮助?** 如果诊断发现问题但不确定如何修复,请查看上面的"常见问题修复"部分或联系技术支持。
