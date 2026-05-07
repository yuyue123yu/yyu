-- ============================================
-- 创建新管理员账号
-- ============================================
-- 
-- 步骤1：在 Supabase Dashboard 的 Authentication > Users 中
--        点击 "Add user" 创建新用户：
--        - Email: admin@legalmy.com
--        - Password: Admin123!@#
--        - 勾选 "Auto Confirm User"
-- 
-- 步骤2：创建后，复制新用户的 ID
-- 
-- 步骤3：将下面的 'NEW_USER_ID_HERE' 替换为实际的用户ID
--        然后执行这个SQL
-- 
-- ============================================

-- 为新用户创建 Profile 并设置为 Super Admin
INSERT INTO profiles (
    id, 
    email, 
    full_name, 
    user_type, 
    super_admin, 
    tenant_id,
    created_at,
    updated_at
)
VALUES (
    'f7c0cfa1-6b96-4dd3-a0e2-b8bd745ad469',  -- 新用户的实际ID
    'admin@legalmy.com',
    'Super Admin',
    'admin',
    true,
    NULL,
    now(),
    now()
)
ON CONFLICT (id) DO UPDATE
SET 
    user_type = 'admin',
    super_admin = true,
    tenant_id = NULL,
    updated_at = now();

-- 验证创建结果
SELECT 
    id,
    email,
    full_name,
    user_type,
    super_admin,
    tenant_id
FROM profiles
WHERE email = 'admin@legalmy.com';
