-- 重新启用 profiles 表的 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 验证 RLS 状态
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';
