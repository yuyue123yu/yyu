-- ============================================
-- 确保 Super Admin 的 Profile 存在并配置正确
-- ============================================

-- 1. 查看用户信息
SELECT 
    id,
    email,
    created_at
FROM auth.users
WHERE email = '403940124@qq.com';

-- 2. 查看该用户的 Profile（可能返回多条或没有）
SELECT 
    id,
    email,
    user_type,
    super_admin,
    tenant_id,
    created_at
FROM profiles
WHERE email = '403940124@qq.com';

-- 3. 删除可能存在的重复 Profile
DELETE FROM profiles
WHERE email = '403940124@qq.com';

-- 4. 重新创建正确的 Profile
-- 首先获取用户 ID
DO $$
DECLARE
    v_user_id uuid;
BEGIN
    -- 获取用户 ID
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = '403940124@qq.com';

    IF v_user_id IS NOT NULL THEN
        -- 删除旧的 Profile（如果存在）
        DELETE FROM profiles WHERE id = v_user_id;
        
        -- 创建新的 Profile
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
        );

        RAISE NOTICE 'Profile 已创建: %', v_user_id;
    ELSE
        RAISE NOTICE '未找到用户: 403940124@qq.com';
    END IF;
END $$;

-- 5. 验证结果（应该只返回一条记录）
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.user_type,
    p.super_admin,
    p.tenant_id,
    u.email as auth_email
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email = '403940124@qq.com';

-- 预期结果：
-- - 只有一条记录
-- - user_type = 'super_admin'
-- - super_admin = true
-- - tenant_id = NULL
