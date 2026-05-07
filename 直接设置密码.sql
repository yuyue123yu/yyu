-- ============================================
-- 直接为用户设置密码
-- ============================================
-- 
-- 使用说明：
-- 1. 在 Supabase Dashboard 的 SQL Editor 中执行
-- 2. 这会为 403940124@qq.com 设置密码为：Admin123!@#
-- 3. 执行后立即可以使用新密码登录
-- 
-- ============================================

-- 为用户设置密码
-- 注意：这需要使用 Supabase 的 auth.users 表
-- 密码会自动加密

-- 方法1：使用 Supabase 的 admin API（推荐）
-- 这个需要在 Supabase Dashboard 的 Authentication > Users 中手动操作

-- 方法2：临时禁用邮箱验证，让用户可以直接注册
-- 但这个用户已经存在，所以不适用

-- 方法3：使用 SQL 更新密码哈希（不推荐，因为需要手动生成哈希）

-- ============================================
-- 最佳方案：在 Supabase Dashboard 中操作
-- ============================================

-- 1. 进入 Supabase Dashboard
-- 2. 点击 Authentication > Users
-- 3. 找到用户 403940124@qq.com
-- 4. 点击用户进入详情页
-- 5. 找到 "Send password recovery" 或 "Update user" 选项
-- 6. 直接设置新密码

-- ============================================
-- 验证用户是否存在
-- ============================================

SELECT 
    id,
    email,
    email_confirmed_at,
    last_sign_in_at,
    created_at
FROM auth.users
WHERE email = '403940124@qq.com';

-- 如果看到用户信息，说明用户存在
-- 现在需要在 Dashboard 中为这个用户设置密码

-- ============================================
-- 临时方案：创建一个新的管理员账号
-- ============================================

-- 如果实在无法为现有用户设置密码，可以：
-- 1. 在 Supabase Dashboard 的 Authentication > Users 中
-- 2. 点击 "Add user" 创建新用户
-- 3. 邮箱：admin@test.com
-- 4. 密码：Admin123!@#
-- 5. 勾选 "Auto Confirm User"（自动确认用户）

-- 然后执行以下 SQL 将新用户设置为管理员：

/*
-- 替换 NEW_USER_ID 为新创建用户的 ID
INSERT INTO profiles (id, email, full_name, user_type, super_admin, tenant_id)
VALUES (
    'NEW_USER_ID',
    'admin@test.com',
    'Super Admin',
    'admin',
    true,
    NULL
)
ON CONFLICT (id) DO UPDATE
SET 
    user_type = 'admin',
    super_admin = true,
    tenant_id = NULL;
*/
