# 设置 Super Admin 账户

## 问题说明

测试页面显示 "Profile not found" 错误，这是因为：
1. 当前登录用户在 `auth.users` 表中存在
2. 但在 `profiles` 表中没有对应的记录

## 解决方法

### 方法 1: 使用 SQL 脚本（推荐）

1. **打开 Supabase SQL Editor**

2. **执行以下 SQL**（将邮箱替换为你的实际邮箱）:

```sql
-- 方法 A: 如果你知道用户的 email
DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'test@example.com'; -- 修改为你的邮箱
BEGIN
  -- 从 auth.users 获取用户 ID
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', v_email;
  END IF;

  -- 创建或更新 profile
  INSERT INTO profiles (
    id,
    email,
    user_type,
    super_admin,
    tenant_id,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    v_email,
    'admin',
    true,
    '00000000-0000-0000-0000-000000000001',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    super_admin = true,
    user_type = 'admin',
    tenant_id = '00000000-0000-0000-0000-000000000001',
    updated_at = NOW();

  RAISE NOTICE 'Super admin profile created/updated for: %', v_email;
END $$;
```

3. **验证设置**:

```sql
-- 查看所有 super admin
SELECT 
  id,
  email,
  user_type,
  super_admin,
  tenant_id
FROM profiles
WHERE super_admin = true;
```

### 方法 2: 查找并设置现有用户

如果你不确定邮箱，先查找所有用户：

```sql
-- 查看所有 auth.users
SELECT id, email, created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;
```

然后使用找到的 user_id：

```sql
-- 使用 user_id 直接设置
INSERT INTO profiles (
  id,
  email,
  user_type,
  super_admin,
  tenant_id,
  created_at,
  updated_at
) 
SELECT 
  id,
  email,
  'admin',
  true,
  '00000000-0000-0000-0000-000000000001',
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'your-email@example.com' -- 修改为你的邮箱
ON CONFLICT (id) DO UPDATE SET
  super_admin = true,
  user_type = 'admin',
  tenant_id = '00000000-0000-0000-0000-000000000001',
  updated_at = NOW();
```

### 方法 3: 为所有现有用户创建 profiles

如果有多个用户需要设置：

```sql
-- 为所有 auth.users 创建 profiles（如果不存在）
INSERT INTO profiles (
  id,
  email,
  user_type,
  super_admin,
  tenant_id,
  created_at,
  updated_at
)
SELECT 
  u.id,
  u.email,
  'client', -- 默认为普通用户
  false,    -- 默认不是 super admin
  '00000000-0000-0000-0000-000000000001',
  NOW(),
  NOW()
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = u.id
);

-- 然后将特定用户设置为 super admin
UPDATE profiles
SET 
  super_admin = true,
  user_type = 'admin'
WHERE email = 'your-email@example.com'; -- 修改为你的邮箱
```

## 验证步骤

1. **检查 profile 是否创建**:
```sql
SELECT * FROM profiles WHERE email = 'your-email@example.com';
```

2. **检查 super_admin 标志**:
```sql
SELECT id, email, super_admin, user_type, tenant_id
FROM profiles
WHERE email = 'your-email@example.com';
```

应该看到：
- `super_admin`: `true`
- `user_type`: `admin`
- `tenant_id`: `00000000-0000-0000-0000-000000000001`

## 重新测试

设置完成后：

1. **刷新浏览器页面**（可能需要重新登录）
2. **访问测试页面**: http://localhost:3000/super-admin/test
3. **点击测试按钮**

应该能看到成功的结果！

## 常见问题

### Q: 为什么需要 profile？
A: 系统使用 `profiles` 表存储用户的额外信息（如 `super_admin` 标志、`tenant_id` 等），而 Supabase Auth 只存储基本的认证信息。

### Q: 可以有多个 super admin 吗？
A: 可以！只需要对多个用户执行相同的设置步骤。

### Q: 如何撤销 super admin 权限？
A: 执行以下 SQL：
```sql
UPDATE profiles
SET super_admin = false
WHERE email = 'user-email@example.com';
```

## 下一步

设置完成后，你可以：
1. 测试 Phase 2 功能（认证和中间件）
2. 测试 Phase 3 功能（租户管理）
3. 继续开发 Phase 4（用户管理）
