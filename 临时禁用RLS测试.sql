-- 临时禁用 profiles 表的 RLS 来测试
-- 注意：这只是测试用，确认问题后需要重新启用并修复策略

-- 禁用 RLS
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 验证 RLS 状态
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';
