# Phase 6 测试指南

## 测试环境

### 前置条件
1. ✅ 开发服务器运行中: `npm run dev`
2. ✅ Supabase 数据库已配置
3. ✅ 已安装 @heroicons/react 包
4. ✅ SuperAdminAuthProvider 已配置

### 创建测试账号

在 Supabase SQL Editor 中执行:

```sql
-- 1. 确保有测试用户
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'superadmin@example.com',
  crypt('SuperAdmin123456', gen_salt('bf')),
  now(),
  now(),
  now()
)
ON CONFLICT (email) DO NOTHING;

-- 2. 创建或更新 profile
INSERT INTO profiles (id, email, full_name, super_admin, tenant_id)
SELECT 
  id,
  'superadmin@example.com',
  'Super Administrator',
  true,
  '00000000-0000-0000-0000-000000000001'
FROM auth.users
WHERE email = 'superadmin@example.com'
ON CONFLICT (id) DO UPDATE
SET super_admin = true;
```

或者使用现有用户:

```sql
-- 将现有用户设置为超级管理员
UPDATE profiles 
SET super_admin = true 
WHERE email = 'test@example.com';
```

---

## 测试步骤

### 1. 测试登录页面

#### 访问登录页
```
http://localhost:3000/super-admin/login
```

#### 预期结果
- ✅ 显示渐变背景（橙色到红色）
- ✅ 显示 Shield 图标
- ✅ 显示 "Super Admin" 标题
- ✅ 显示邮箱和密码输入框
- ✅ 显示安全提示

#### 测试登录
**测试账号**:
- Email: `superadmin@example.com` 或 `test@example.com`
- Password: `SuperAdmin123456` 或 `Test123456`

**预期行为**:
1. 输入邮箱和密码
2. 点击 "Sign In"
3. 显示加载状态
4. 成功后跳转到 `/super-admin`

---

### 2. 测试路由保护

#### 测试未登录访问
1. 清除浏览器 cookies
2. 访问: `http://localhost:3000/super-admin`

**预期结果**:
- ✅ 自动重定向到 `/super-admin/login`
- ✅ 显示加载动画

#### 测试非超级管理员访问
1. 使用普通用户登录
2. 访问: `http://localhost:3000/super-admin`

**预期结果**:
- ✅ 重定向到 `/super-admin/login?error=unauthorized`
- ✅ 显示 "Unauthorized access" 错误消息

---

### 3. 测试仪表板

#### 访问仪表板
```
http://localhost:3000/super-admin
```

#### 预期结果

**头部 (Header)**:
- ✅ 橙色到红色渐变背景
- ✅ "Super Admin" Logo 和标题
- ✅ 通知图标（带红点）
- ✅ 用户菜单（点击显示下拉）

**侧边栏 (Sidebar)**:
- ✅ 7 个导航菜单项
- ✅ 当前页面高亮（橙色背景）
- ✅ 悬停效果
- ✅ 底部版本信息

**仪表板内容**:
- ✅ 页面标题 "Dashboard"
- ✅ 4 个统计卡片:
  - Total Tenants (橙色图标)
  - Total Users (蓝色图标)
  - Consultations (绿色图标)
  - Total Revenue (紫色图标)
- ✅ 快速操作区域（3 个按钮）
- ✅ 系统健康状态（3 个指标）
- ✅ 最近活动时间线

---

### 4. 测试导航

#### 点击导航菜单
依次点击每个菜单项:

1. **Dashboard** → `/super-admin`
   - ✅ 显示仪表板页面
   - ✅ 菜单项高亮

2. **Tenants** → `/super-admin/tenants`
   - ⏳ 页面未创建（Phase 7）
   - ✅ URL 正确

3. **Users** → `/super-admin/users`
   - ⏳ 页面未创建（Phase 8）
   - ✅ URL 正确

4. **Admins** → `/super-admin/admins`
   - ⏳ 页面未创建（Phase 8）
   - ✅ URL 正确

5. **Audit Logs** → `/super-admin/audit-logs`
   - ⏳ 页面未创建（Phase 9）
   - ✅ URL 正确

6. **Analytics** → `/super-admin/analytics`
   - ⏳ 页面未创建（Phase 9）
   - ✅ URL 正确

7. **Settings** → `/super-admin/settings`
   - ⏳ 页面未创建（Phase 9）
   - ✅ URL 正确

---

### 5. 测试用户菜单

#### 点击用户头像
1. 点击头部右侧的用户图标
2. 预期显示下拉菜单

**预期内容**:
- ✅ 用户信息（名称和邮箱）
- ✅ Logout 按钮

#### 测试登出
1. 点击 "Logout"
2. 预期行为:
   - ✅ 清除会话
   - ✅ 重定向到 `/super-admin/login`
   - ✅ 记录审计日志

---

### 6. 测试快速操作

#### 点击快速操作按钮

1. **Create New Tenant**
   - 点击按钮
   - ✅ 跳转到 `/super-admin/tenants/new`
   - ⏳ 页面未创建（Phase 7）

2. **Manage Users**
   - 点击按钮
   - ✅ 跳转到 `/super-admin/users`
   - ⏳ 页面未创建（Phase 8）

3. **View Audit Logs**
   - 点击按钮
   - ✅ 跳转到 `/super-admin/audit-logs`
   - ⏳ 页面未创建（Phase 9）

---

### 7. 测试响应式设计

#### 桌面视图 (1920x1080)
- ✅ 侧边栏固定在左侧
- ✅ 内容区域居中，最大宽度限制
- ✅ 统计卡片 4 列布局

#### 平板视图 (768x1024)
- ✅ 侧边栏固定在左侧
- ✅ 统计卡片 2 列布局
- ✅ 内容区域自适应

#### 移动视图 (375x667)
- ⚠️ 侧边栏未优化（待 Phase 7 改进）
- ✅ 统计卡片 1 列布局
- ✅ 内容区域全宽

---

## 测试检查清单

### 功能测试
- [ ] 登录页面显示正常
- [ ] 登录功能正常工作
- [ ] 路由保护正常工作
- [ ] 仪表板显示正常
- [ ] 导航菜单正常工作
- [ ] 用户菜单正常工作
- [ ] 登出功能正常工作
- [ ] 快速操作按钮正常工作

### UI/UX 测试
- [ ] 橙色/红色主题应用正确
- [ ] 图标显示正常
- [ ] 悬停效果正常
- [ ] 加载状态显示正常
- [ ] 错误消息显示正常
- [ ] 响应式布局正常

### 安全测试
- [ ] 未登录用户无法访问
- [ ] 非超级管理员无法访问
- [ ] 会话验证正常工作
- [ ] 登录/登出记录审计日志

---

## 已知问题

### 当前限制
1. ⚠️ **MFA 未实现** - UI 已准备，但 TOTP 验证在 Phase 10
2. ⚠️ **仪表板数据为占位符** - 需要创建专用 API
3. ⚠️ **移动端侧边栏未优化** - 需要折叠菜单
4. ⚠️ **会话超时未实现** - 在 Phase 10 实现

### 预期行为
- 点击未创建的页面链接会显示 404（正常）
- 仪表板数据为静态占位符（正常）
- MFA 输入框存在但不验证（正常）

---

## 故障排除

### 问题: 登录后仍然重定向到登录页
**解决方案**:
1. 检查用户的 `super_admin` 字段是否为 `true`
2. 清除浏览器 cookies 和缓存
3. 检查 Supabase 连接

### 问题: 图标不显示
**解决方案**:
```bash
npm install @heroicons/react
```

### 问题: "useSuperAdminAuth must be used within SuperAdminAuthProvider"
**解决方案**:
- 确保 `src/app/super-admin/layout.tsx` 文件存在
- 重启开发服务器

### 问题: 样式不正确
**解决方案**:
1. 检查 Tailwind CSS 配置
2. 清除 `.next` 缓存: `rm -rf .next`
3. 重启开发服务器

---

## 下一步

### Phase 7: 租户管理 UI
创建以下页面:
1. `/super-admin/tenants` - 租户列表
2. `/super-admin/tenants/new` - 创建租户向导
3. `/super-admin/tenants/[id]` - 租户详情
4. `/super-admin/tenants/[id]/settings` - OEM 配置

### Phase 8: 用户管理 UI
创建以下页面:
1. `/super-admin/users` - 用户列表
2. `/super-admin/users/[id]` - 用户详情
3. `/super-admin/admins` - 管理员管理

### Phase 9: 系统管理 UI
创建以下页面:
1. `/super-admin/audit-logs` - 审计日志查看器
2. `/super-admin/settings` - 系统设置
3. `/super-admin/analytics` - 分析仪表板

---

## 测试报告模板

```
测试日期: ____________________
测试人员: ____________________

功能测试:
[ ] 登录功能 - 通过/失败
[ ] 路由保护 - 通过/失败
[ ] 仪表板显示 - 通过/失败
[ ] 导航功能 - 通过/失败
[ ] 用户菜单 - 通过/失败

UI/UX 测试:
[ ] 视觉主题 - 通过/失败
[ ] 响应式设计 - 通过/失败
[ ] 交互效果 - 通过/失败

安全测试:
[ ] 认证验证 - 通过/失败
[ ] 授权检查 - 通过/失败

发现的问题:
1. ________________________________
2. ________________________________
3. ________________________________

备注:
_____________________________________
_____________________________________
```

---

**测试完成后，请继续 Phase 7 开发！**
