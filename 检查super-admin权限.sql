-- 检查 admin@legalmy.com 的权限
SELECT 
  id,
  email,
  user_type,
  super_admin,
  tenant_id,
  created_at
FROM profiles
WHERE email = 'admin@legalmy.com';
