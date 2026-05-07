# 超级管理员系统 - 快速参考指南

## 🚀 快速开始

### 测试页面
- Phase 2 测试: http://localhost:3000/super-admin/test
- Phase 3 测试: http://localhost:3000/super-admin/tenants-test
- Phase 4 测试: http://localhost:3000/super-admin/users-test
- Phase 5 测试: http://localhost:3000/super-admin/system-test

### 测试账号
- Email: test@example.com
- Password: Test123456

### Supabase 项目
- Project ID: ovtrvzbftinsfwytzgwy
- URL: https://ovtrvzbftinsfwytzgwy.supabase.co

---

## 📁 文件结构

### 数据库迁移
```
supabase/
├── 001_create_tenants_table.sql
├── 002_create_tenant_settings_table.sql
├── 003_create_audit_logs_table.sql
├── 004_create_system_settings_table.sql
├── 005_create_password_reset_tokens_table.sql
├── 006_add_tenant_columns.sql
├── 007_create_rls_policies.sql
├── 008_create_helper_functions.sql
└── 009_set_tenant_id_not_null.sql
```

### 后端 API
```
src/app/api/super-admin/
├── tenants/                    # 租户管理
│   ├── route.ts               # POST, GET
│   ├── [id]/route.ts          # GET, PATCH, DELETE
│   ├── [id]/activate/route.ts
│   ├── [id]/deactivate/route.ts
│   └── [id]/settings/
│       ├── route.ts           # GET, POST (bulk)
│       └── [key]/route.ts     # PUT
├── users/                      # 用户管理
│   ├── route.ts               # GET
│   └── [id]/
│       ├── route.ts           # GET, PATCH
│       ├── migrate/route.ts   # POST
│       └── deactivate/route.ts # POST
├── admins/                     # 管理员管理
│   ├── route.ts               # GET, POST
│   └── [id]/
│       ├── route.ts           # DELETE
│       └── reassign/route.ts  # PATCH
├── password-reset/             # 密码重置
│   ├── route.ts               # POST
│   └── history/route.ts       # GET
├── audit-logs/                 # 审计日志
│   ├── route.ts               # GET
│   └── export/route.ts        # GET
├── system-settings/            # 系统设置
│   ├── route.ts               # GET
│   ├── [key]/route.ts         # PUT
│   └── maintenance-mode/route.ts # POST
└── analytics/                  # 分析统计
    ├── tenants/[id]/route.ts  # GET
    ├── compare/route.ts       # GET
    └── export/route.ts        # POST
```

### 中间件和工具
```
src/lib/
├── middleware/
│   ├── super-admin.ts         # 超级管理员认证
│   └── tenant-context.ts      # 租户上下文
├── audit/
│   └── index.ts               # 审计日志
└── auth/
    └── password-reset.ts      # 密码重置工具
```

---

## 🔑 核心概念

### 1. 超级管理员认证
```typescript
import { requireSuperAdmin } from '@/lib/middleware/super-admin';

export async function GET(request: NextRequest) {
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult; // 认证失败
  }
  
  const { user, supabase } = authResult;
  // 继续处理...
}
```

### 2. 审计日志
```typescript
import { logAuditEvent } from '@/lib/audit';

await logAuditEvent(
  {
    action_type: 'tenant.create',
    target_entity: 'tenants',
    target_id: tenantId,
    changes: { name: 'New Tenant' },
  },
  request
);
```

### 3. 密码重置
```typescript
import { createPasswordResetToken } from '@/lib/auth/password-reset';

const { token, reset_link } = await createPasswordResetToken(
  userId,
  createdBy
);
```

---

## 📊 数据库表

### 核心表
| 表名 | 用途 | 关键字段 |
|------|------|----------|
| tenants | 租户信息 | id, name, subdomain, status |
| tenant_settings | 租户配置 | tenant_id, key, value |
| audit_logs | 审计日志 | action_type, target_entity, user_id |
| system_settings | 系统设置 | key, value |
| password_reset_tokens | 密码重置令牌 | token, user_id, expires_at |

### 修改的表（添加 tenant_id）
- profiles
- lawyers
- consultations
- orders
- reviews
- templates
- articles
- favorites
- cart
- services

---

## 🔐 安全机制

### RLS 策略
- 所有表都有 RLS 策略
- 超级管理员可以绕过 RLS（通过 `is_super_admin()` 函数）
- 普通用户只能访问自己租户的数据

### 密码要求
- **普通用户**: 8+ 字符，包含大小写字母和数字
- **超级管理员**: 16+ 字符，包含大小写字母、数字和特殊字符

### 令牌安全
- 256位加密令牌
- 24小时过期
- 单次使用

---

## 🎯 API 端点速查

### 租户管理
```bash
# 创建租户
POST /api/super-admin/tenants
Body: { name, subdomain, domain?, status }

# 列出租户
GET /api/super-admin/tenants?page=1&limit=10&status=active

# 获取租户详情
GET /api/super-admin/tenants/:id

# 更新租户
PATCH /api/super-admin/tenants/:id
Body: { name?, subdomain?, domain?, status? }

# 激活/停用租户
POST /api/super-admin/tenants/:id/activate
POST /api/super-admin/tenants/:id/deactivate

# 删除租户
DELETE /api/super-admin/tenants/:id

# OEM 配置
GET /api/super-admin/tenants/:id/settings
PUT /api/super-admin/tenants/:id/settings/:key
Body: { value }
POST /api/super-admin/tenants/:id/settings/bulk
Body: { settings: { key: value } }
```

### 用户管理
```bash
# 列出用户
GET /api/super-admin/users?tenant_id=xxx&page=1&limit=10

# 获取用户详情
GET /api/super-admin/users/:id

# 更新用户
PATCH /api/super-admin/users/:id
Body: { full_name?, email?, phone? }

# 迁移用户
POST /api/super-admin/users/:id/migrate
Body: { target_tenant_id }

# 停用/激活用户
POST /api/super-admin/users/:id/deactivate
```

### 管理员管理
```bash
# 创建管理员
POST /api/super-admin/admins
Body: { email, tenant_id, full_name }

# 列出管理员
GET /api/super-admin/admins?tenant_id=xxx

# 重新分配管理员
PATCH /api/super-admin/admins/:id/reassign
Body: { new_tenant_id }

# 撤销管理员权限
DELETE /api/super-admin/admins/:id
```

### 密码重置
```bash
# 发起密码重置
POST /api/super-admin/password-reset
Body: { user_id }

# 查看重置历史
GET /api/super-admin/password-reset/history?user_id=xxx

# 完成密码重置（公共端点）
POST /api/reset-password
Body: { token, new_password }
```

### 审计日志
```bash
# 查询审计日志
GET /api/super-admin/audit-logs?action_type=xxx&start_date=xxx&end_date=xxx

# 导出审计日志
GET /api/super-admin/audit-logs/export?format=csv
```

### 系统设置
```bash
# 获取所有设置
GET /api/super-admin/system-settings

# 更新设置
PUT /api/super-admin/system-settings/:key
Body: { value }

# 切换维护模式
POST /api/super-admin/system-settings/maintenance-mode
Body: { enabled: true, message: "System maintenance" }
```

### 分析统计
```bash
# 获取租户指标
GET /api/super-admin/analytics/tenants/:id

# 比较多个租户
GET /api/super-admin/analytics/compare?tenant_ids=id1,id2,id3

# 导出分析报告
POST /api/super-admin/analytics/export
Body: { format: "csv", tenant_ids?: [...] }
```

---

## 🛠️ 常用命令

### 开发服务器
```bash
npm run dev
```

### 数据库迁移
在 Supabase Dashboard SQL Editor 中执行：
```sql
-- 按顺序执行 001-009 的 SQL 文件
```

### 创建超级管理员
```sql
-- 在 Supabase SQL Editor 中执行
UPDATE profiles 
SET super_admin = true 
WHERE email = 'your-email@example.com';
```

---

## 📝 代码示例

### 创建新的超级管理员端点
```typescript
// src/app/api/super-admin/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { logAuditEvent } from '@/lib/audit';

export async function POST(request: NextRequest) {
  // 1. 验证超级管理员身份
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user, supabase } = authResult;

  try {
    // 2. 获取请求数据
    const body = await request.json();
    
    // 3. 执行业务逻辑
    const { data, error } = await supabase
      .from('your_table')
      .insert(body)
      .select()
      .single();

    if (error) throw error;

    // 4. 记录审计日志
    await logAuditEvent(
      {
        action_type: 'example.create',
        target_entity: 'your_table',
        target_id: data.id,
        changes: body,
      },
      request
    );

    // 5. 返回响应
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Operation failed' },
      { status: 500 }
    );
  }
}
```

---

## 🐛 常见问题

### 1. 认证失败
**问题**: API 返回 401 Unauthorized  
**解决**: 确保用户的 `super_admin` 字段为 `true`

```sql
UPDATE profiles SET super_admin = true WHERE email = 'your-email@example.com';
```

### 2. RLS 策略阻止访问
**问题**: 无法访问其他租户的数据  
**解决**: 确保调用了 `requireSuperAdmin()` 中间件，它会设置 RLS 绕过

### 3. 密码重置令牌无效
**问题**: 令牌验证失败  
**解决**: 检查令牌是否过期（24小时）或已使用

### 4. 审计日志未记录
**问题**: 操作没有出现在审计日志中  
**解决**: 确保调用了 `logAuditEvent()` 函数

---

## 📚 相关文档

- [PHASE_2_COMPLETE.md](./PHASE_2_COMPLETE.md) - Phase 2 完成总结
- [PHASE_3_COMPLETE.md](./PHASE_3_COMPLETE.md) - Phase 3 完成总结
- [PHASE_4_COMPLETE.md](./PHASE_4_COMPLETE.md) - Phase 4 完成总结
- [PHASE_5_COMPLETE.md](./PHASE_5_COMPLETE.md) - Phase 5 完成总结
- [BACKEND_API_COMPLETE.md](./BACKEND_API_COMPLETE.md) - 后端 API 完整总结
- [SUPER_ADMIN_PROGRESS.md](./SUPER_ADMIN_PROGRESS.md) - 总体进度跟踪

---

## 🎉 下一步

### 准备开始 Phase 6
1. 阅读 `.kiro/specs/super-admin-system/tasks.md` 中的 Phase 6 任务
2. 创建超级管理员布局组件
3. 实现登录页面
4. 创建仪表板

### 需要帮助？
- 查看测试页面了解 API 使用方式
- 查看现有端点代码作为参考
- 参考 Phase 完成文档了解详细信息

---

**最后更新**: Phase 5 完成后
