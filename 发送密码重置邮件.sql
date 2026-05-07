-- ============================================
-- 通过 Supabase Admin API 发送密码重置邮件
-- ============================================

-- 注意：这个需要在 Supabase Dashboard 的 SQL Editor 中执行
-- 或者使用 Supabase CLI

-- 查看用户信息
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at
FROM auth.users
WHERE email = '403940124@qq.com';

-- ============================================
-- 如果您想手动设置密码，需要使用 Supabase Admin API
-- 以下是使用 curl 的示例（在终端中执行）：
-- ============================================

/*
curl -X PUT 'https://YOUR_PROJECT_REF.supabase.co/auth/v1/admin/users/USER_ID' \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "YOUR_NEW_PASSWORD"
  }'
*/

-- ============================================
-- 或者在 Supabase Dashboard 中：
-- 1. Authentication → Users
-- 2. 找到用户 403940124@qq.com
-- 3. 点击右侧的 "..." 菜单
-- 4. 选择 "Reset Password" 或 "Edit User"
-- 5. 设置新密码
-- ============================================
