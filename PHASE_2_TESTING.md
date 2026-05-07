# Phase 2 测试指南

## 已完成的功能

### Task 2.1: Super Admin Authentication Middleware ✓
- ✓ 2.1.1 创建 requireSuperAdmin() 中间件函数
- ✓ 2.1.2 实现 super_admin 标志验证
- ✓ 2.1.3 实现 RLS bypass 启用
- ✓ 2.1.4 添加未授权访问的错误处理

### Task 2.2: Tenant Context Middleware ✓
- ✓ 2.2.1 创建 setTenantContext() 中间件
- ✓ 2.2.2 从用户 profile 提取 tenant_id
- ✓ 2.2.3 在 session 中设置 tenant context
- ✓ 2.2.4 优雅处理缺失的 tenant context

### Task 2.3: Audit Logging System ✓
- ✓ 2.3.1 创建 logAuditEvent() 函数
- ✓ 2.3.2 从请求中提取 IP 地址和 user agent
- ✓ 2.3.3 创建 withAuditLog() 装饰器
- ✓ 2.3.4 添加审计失败的错误处理

## 创建的文件

```
types/super-admin.ts                      # TypeScript 类型定义
src/lib/middleware/super-admin.ts         # Super Admin 认证中间件
src/lib/middleware/tenant-context.ts      # Tenant Context 中间件
src/lib/audit/index.ts                    # 审计日志系统
src/app/api/super-admin/test/route.ts     # 测试 API 端点
src/app/super-admin/test/page.tsx         # 测试页面
```

## 测试步骤

### 前置条件

1. **确保 Phase 1 已完成**
   - 所有 9 个 SQL 迁移文件必须已在 Supabase 中执行
   - 数据库函数已创建：`set_config()`, `get_tenant_id()`, `is_super_admin()`, `log_audit_event()`

2. **创建 Super Admin 账户**
   
   在 Supabase SQL Editor 中执行：
   ```sql
   -- 将现有用户设置为 super admin
   UPDATE profiles 
   SET super_admin = true 
   WHERE email = 'test@example.com';
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

### 测试方法 1: 使用测试页面（推荐）

1. 使用 super admin 账户登录系统
2. 访问测试页面：http://localhost:3000/super-admin/test
3. 点击 "测试 Super Admin 认证" 按钮
4. 点击 "测试 Tenant Context" 按钮
5. 查看测试结果

**预期结果：**
- ✓ Super Admin 认证成功，显示用户信息和 RLS bypass 状态
- ✓ Tenant Context 设置成功，显示当前 tenant_id
- ✓ 审计日志已记录（可在 Supabase 的 audit_logs 表中查看）

### 测试方法 2: 使用 API 直接测试

使用 curl 或 Postman 测试：

```bash
# 测试 Super Admin 认证
curl -X GET http://localhost:3000/api/super-admin/test \
  -H "Cookie: your-session-cookie"

# 测试 Tenant Context
curl -X POST http://localhost:3000/api/super-admin/test \
  -H "Cookie: your-session-cookie"
```

### 测试方法 3: 在 Supabase 中验证

1. **检查审计日志**
   ```sql
   SELECT * FROM audit_logs 
   ORDER BY created_at DESC 
   LIMIT 10;
   ```
   
   应该能看到 `test.access` 类型的审计记录

2. **验证 RLS bypass 功能**
   ```sql
   -- 查看当前 session 配置
   SELECT current_setting('app.bypass_rls', true);
   ```

3. **验证 Tenant Context**
   ```sql
   -- 查看当前 tenant context
   SELECT current_setting('app.current_tenant_id', true);
   ```

## 常见问题

### 问题 1: "Unauthorized: Authentication required"

**原因：** 未登录或 session 已过期

**解决方法：**
1. 确保已登录系统
2. 检查浏览器 cookies 中是否有 Supabase session
3. 尝试重新登录

### 问题 2: "Forbidden: Super admin access required"

**原因：** 当前用户不是 super admin

**解决方法：**
```sql
-- 在 Supabase SQL Editor 中执行
UPDATE profiles 
SET super_admin = true 
WHERE email = 'your-email@example.com';
```

### 问题 3: "Profile not found"

**原因：** 用户的 profile 记录不存在

**解决方法：**
1. 检查 profiles 表中是否有该用户的记录
2. 如果没有，可能需要先完成用户注册流程

### 问题 4: Database function not found

**原因：** Phase 1 的数据库函数未创建

**解决方法：**
1. 确保已执行 `supabase/008_create_helper_functions.sql`
2. 在 Supabase SQL Editor 中验证函数是否存在：
   ```sql
   SELECT proname FROM pg_proc 
   WHERE proname IN ('set_config', 'get_tenant_id', 'is_super_admin', 'log_audit_event');
   ```

## 验证清单

完成以下检查以确认 Phase 2 功能正常：

- [ ] Super Admin 认证中间件正常工作
  - [ ] 可以验证 super_admin 标志
  - [ ] 可以启用 RLS bypass
  - [ ] 正确处理未授权访问
  
- [ ] Tenant Context 中间件正常工作
  - [ ] 可以从 profile 提取 tenant_id
  - [ ] 可以在 session 中设置 tenant context
  - [ ] 优雅处理缺失的 tenant context
  
- [ ] 审计日志系统正常工作
  - [ ] 可以记录审计事件
  - [ ] 可以提取 IP 地址和 user agent
  - [ ] 审计失败不会中断操作
  - [ ] 可以在 audit_logs 表中查看记录

## 下一步

Phase 2 测试通过后，可以继续执行：
- **Phase 3**: Backend API - Tenant Management
- **Phase 4**: Backend API - User Management
- **Phase 5**: Backend API - System Management

每个阶段完成后都会进行类似的测试验证。
