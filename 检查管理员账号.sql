-- ============================================
-- 检查管理员账号
-- ============================================

-- 1. 查看所有用户及其角色
SELECT 
    id,
    email,
    user_type,
    super_admin,
    tenant_id,
    created_at
FROM profiles
ORDER BY created_at DESC;

-- 2. 查看管理员用户
SELECT 
    id,
    email,
    user_type,
    super_admin,
    tenant_id
FROM profiles
WHERE user_type = 'admin' OR super_admin = true;

-- 3. 如果没有管理员，创建一个
-- 注意：需要先在 Supabase Auth 中创建用户，然后更新 Profile

-- 4. 将现有用户设置为管理员
-- 替换 'USER_EMAIL' 为实际的邮箱
/*
UPDATE profiles
SET 
    user_type = 'admin',
    super_admin = false,
    tenant_id = (SELECT id FROM tenants WHERE subdomain = 'default' LIMIT 1)
WHERE email = 'USER_EMAIL';
*/

-- 5. 或者将 Super Admin 也设置为普通管理员（可以访问管理后台）
UPDATE profiles
SET user_type = 'admin'
WHERE email = '403940124@qq.com';

-- 6. 验证结果
SELECT 
    id,
    email,
    user_type,
    super_admin,
    tenant_id
FROM profiles
WHERE email = '403940124@qq.com';
