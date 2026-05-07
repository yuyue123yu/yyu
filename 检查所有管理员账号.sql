-- 检查所有管理员账号
SELECT 
  id,
  email,
  user_type,
  super_admin,
  tenant_id,
  created_at
FROM profiles
WHERE user_type = 'admin' OR super_admin = true
ORDER BY created_at DESC;

-- 检查auth.users表中的用户
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users
WHERE email LIKE '%@qq.com' OR email LIKE '%@legalmy.com'
ORDER BY created_at DESC;
