-- 为新账号 admin@legalmy.com 设置密码
-- 用户ID: f7c0cfa1-6b96-4dd3-a0e2-b8bd745ad469

-- 方法1: 在Supabase Dashboard中手动重置
-- 1. 进入 Authentication > Users
-- 2. 找到 admin@legalmy.com
-- 3. 点击右侧的 "..." 菜单
-- 4. 选择 "Reset Password"
-- 5. 输入新密码: Admin123456
-- 6. 点击 "Update user"

-- 方法2: 发送密码重置邮件（如果邮件服务已配置）
SELECT auth.send_password_reset_email('admin@legalmy.com');

-- 验证账号状态
SELECT 
  au.id,
  au.email,
  au.email_confirmed_at,
  au.last_sign_in_at,
  p.user_type,
  p.super_admin,
  p.tenant_id
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE au.email = 'admin@legalmy.com';
