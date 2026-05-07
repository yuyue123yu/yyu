-- =============================================
-- 诊断并修复：用户租户关联问题
-- =============================================

-- 步骤 1: 检查这 3 个用户的详细信息
SELECT 
  '未关联用户的详细信息' as info,
  id,
  email,
  user_type,
  tenant_id,
  super_admin,
  created_at
FROM profiles
WHERE email IN ('admin@legalmy.com', 'admin@12qqq.com', 'test@example.com')
ORDER BY created_at DESC;

-- 步骤 2: 检查是否有租户
SELECT 
  '当前租户列表' as info,
  id,
  name,
  subdomain,
  status,
  created_at
FROM tenants
ORDER BY created_at DESC;

-- 步骤 3: 强制更新这 3 个用户的 tenant_id（不管 super_admin 状态）
UPDATE profiles
SET tenant_id = (SELECT id FROM tenants ORDER BY created_at LIMIT 1)
WHERE email IN ('admin@legalmy.com', 'admin@12qqq.com', 'test@example.com')
  AND tenant_id IS NULL
RETURNING email, user_type, tenant_id, super_admin;

-- 步骤 4: 验证修复结果
SELECT 
  '修复后的所有用户状态' as info,
  email,
  user_type,
  tenant_id,
  super_admin,
  CASE 
    WHEN tenant_id IS NOT NULL THEN '✓ 已关联租户'
    ELSE '✗ 未关联租户'
  END as status
FROM profiles
WHERE user_type IN ('admin', 'owner')
ORDER BY created_at DESC;
