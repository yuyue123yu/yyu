-- =============================================
-- 快速修复：将未关联的 admin 用户关联到租户
-- 请在 Supabase SQL Editor 中执行此脚本
-- =============================================

-- 步骤 1: 查看当前租户
SELECT 
  '当前租户列表' as info,
  id,
  name,
  subdomain,
  status
FROM tenants
ORDER BY created_at DESC;

-- 步骤 2: 如果没有租户，创建一个
INSERT INTO tenants (name, subdomain, status)
VALUES ('默认律所', 'default-law-firm', 'active')
ON CONFLICT (subdomain) DO NOTHING;

-- 步骤 3: 将所有未关联的 admin 用户关联到第一个租户
UPDATE profiles
SET tenant_id = (SELECT id FROM tenants ORDER BY created_at LIMIT 1)
WHERE tenant_id IS NULL
  AND user_type IN ('admin', 'owner')
  AND super_admin = false;

-- 步骤 4: 验证修复结果
SELECT 
  '修复后的用户状态' as info,
  email,
  user_type,
  tenant_id,
  CASE 
    WHEN tenant_id IS NOT NULL THEN '✓ 已关联租户'
    ELSE '✗ 未关联租户'
  END as status
FROM profiles
WHERE user_type IN ('admin', 'owner')
ORDER BY created_at DESC;
