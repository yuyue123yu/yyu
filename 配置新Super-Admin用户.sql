-- ============================================
-- 配置新创建的 Super Admin 用户
-- ============================================

-- 1. 查看新用户的信息
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    last_sign_in_at
FROM auth.users
WHERE email = '403940124@qq.com';

-- 2. 检查该用户的 Profile 是否存在
SELECT 
    id,
    email,
    full_name,
    user_type,
    super_admin,
    tenant_id,
    created_at
FROM profiles
WHERE email = '403940124@qq.com';

-- 3. 如果 Profile 不存在，创建它
-- 注意：请先运行上面的查询，获取用户的 UUID，然后替换下面的 'USER_UUID'
/*
INSERT INTO profiles (
    id,
    email,
    full_name,
    user_type,
    super_admin,
    tenant_id
) VALUES (
    'USER_UUID',  -- 替换为实际的用户 UUID
    '403940124@qq.com',
    'Super Admin',
    'super_admin',
    true,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    user_type = 'super_admin',
    super_admin = true,
    tenant_id = NULL;
*/

-- 4. 或者使用动态方式（如果用户已存在）
DO $$
DECLARE
    v_user_id uuid;
BEGIN
    -- 获取用户 ID
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = '403940124@qq.com';

    IF v_user_id IS NOT NULL THEN
        -- 插入或更新 Profile
        INSERT INTO profiles (
            id,
            email,
            full_name,
            user_type,
            super_admin,
            tenant_id
        ) VALUES (
            v_user_id,
            '403940124@qq.com',
            'Super Admin',
            'super_admin',
            true,
            NULL
        )
        ON CONFLICT (id) DO UPDATE SET
            user_type = 'super_admin',
            super_admin = true,
            tenant_id = NULL,
            email = '403940124@qq.com';

        RAISE NOTICE 'Super Admin profile 已配置: %', v_user_id;
    ELSE
        RAISE NOTICE '未找到用户: 403940124@qq.com';
    END IF;
END $$;

-- 5. 验证配置结果
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.user_type,
    p.super_admin,
    p.tenant_id,
    u.email_confirmed_at,
    u.last_sign_in_at
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email = '403940124@qq.com';

-- 6. 检查是否有其他 Super Admin 用户（应该只有一个）
SELECT 
    id,
    email,
    full_name,
    user_type,
    super_admin,
    tenant_id
FROM profiles
WHERE super_admin = true
ORDER BY created_at;

-- ============================================
-- 预期结果：
-- - user_type = 'super_admin'
-- - super_admin = true
-- - tenant_id = NULL
-- ============================================
