-- 检查 admin@legalmy.com 的完整信息
SELECT 
  p.id,
  p.email,
  p.user_type,
  p.super_admin,
  p.tenant_id,
  p.full_name,
  au.email as auth_email,
  au.email_confirmed_at,
  au.last_sign_in_at
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id
WHERE p.email = 'admin@legalmy.com' OR au.email = 'admin@legalmy.com';

-- 如果没有找到，检查所有用户
SELECT 
  p.id,
  p.email,
  p.user_type,
  p.super_admin,
  p.tenant_id
FROM profiles p
ORDER BY p.created_at DESC
LIMIT 10;
