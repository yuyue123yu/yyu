-- 检查当前登录用户的状态
-- 请将 'admin@example.com' 替换为您实际登录的邮箱

-- 1. 查看用户的 profile 信息
SELECT 
  '用户 Profile 信息' as check_name,
  id,
  email,
  full_name,
  user_type,
  tenant_id,
  super_admin,
  created_at
FROM profiles
WHERE email = 'admin@example.com';  -- 替换为您的邮箱

-- 2. 如果有 tenant_id，查看租户信息
SELECT 
  '租户信息' as check_name,
  t.id,
  t.name,
  t.subdomain,
  t.status,
  t.created_at
FROM tenants t
WHERE t.id = (
  SELECT tenant_id 
  FROM profiles 
  WHERE email = 'admin@example.com'  -- 替换为您的邮箱
);

-- 3. 检查该租户是否有配置数据
SELECT 
  '租户配置数据' as check_name,
  setting_key,
  created_at,
  updated_at
FROM tenant_settings
WHERE tenant_id = (
  SELECT tenant_id 
  FROM profiles 
  WHERE email = 'admin@example.com'  -- 替换为您的邮箱
);

-- 4. 诊断问题
DO $$
DECLARE
  v_profile RECORD;
BEGIN
  -- 获取用户信息
  SELECT * INTO v_profile
  FROM profiles
  WHERE email = 'admin@example.com';  -- 替换为您的邮箱
  
  IF NOT FOUND THEN
    RAISE NOTICE '✗ 用户不存在: admin@example.com';
    RAISE NOTICE '  → 请检查邮箱是否正确';
    RETURN;
  END IF;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '用户状态诊断';
  RAISE NOTICE '========================================';
  RAISE NOTICE '邮箱: %', v_profile.email;
  RAISE NOTICE '用户类型: %', v_profile.user_type;
  RAISE NOTICE '租户ID: %', COALESCE(v_profile.tenant_id::text, '无');
  RAISE NOTICE '超级管理员: %', v_profile.super_admin;
  RAISE NOTICE '========================================';
  
  IF v_profile.tenant_id IS NULL THEN
    RAISE NOTICE '✗ 问题: 用户未关联租户';
    RAISE NOTICE '  → API 会返回 400 错误: "用户未关联租户"';
    RAISE NOTICE '  → 需要为用户分配租户ID';
    RAISE NOTICE '';
    RAISE NOTICE '解决方案:';
    RAISE NOTICE '1. 通过 Super Admin 系统创建租户';
    RAISE NOTICE '2. 将用户关联到租户:';
    RAISE NOTICE '   UPDATE profiles SET tenant_id = ''租户ID'' WHERE email = ''admin@example.com'';';
  ELSE
    RAISE NOTICE '✓ 用户已关联租户';
    
    IF v_profile.user_type NOT IN ('admin', 'owner') THEN
      RAISE NOTICE '⚠ 警告: 用户类型不是 admin 或 owner';
      RAISE NOTICE '  → 当前类型: %', v_profile.user_type;
      RAISE NOTICE '  → 可能没有权限修改配置';
    ELSE
      RAISE NOTICE '✓ 用户权限正常';
    END IF;
  END IF;
  
  RAISE NOTICE '========================================';
END $$;
