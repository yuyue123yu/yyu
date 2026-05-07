-- =============================================
-- 验证账号管理系统数据库迁移
-- =============================================

-- 1. 检查 profiles 表的新字段
SELECT 
  '✓ profiles 表字段检查' AS check_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('parent_user_id', 'role', 'permissions', 'is_active', 'last_login_at')
ORDER BY column_name;

-- 2. 检查 profiles 表的索引
SELECT 
  '✓ profiles 表索引检查' AS check_name,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'profiles'
AND indexname IN ('idx_profiles_parent_user_id', 'idx_profiles_tenant_role', 'idx_profiles_is_active');

-- 3. 检查 password_reset_history 表结构
SELECT 
  '✓ password_reset_history 表结构' AS check_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'password_reset_history'
ORDER BY ordinal_position;

-- 4. 检查 password_reset_history 表的 RLS 策略
SELECT 
  '✓ password_reset_history RLS 策略' AS check_name,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'password_reset_history';

-- 5. 检查现有用户的角色分配
SELECT 
  '✓ 用户角色分配' AS check_name,
  email,
  user_type,
  role,
  is_active,
  super_admin,
  tenant_id IS NOT NULL AS has_tenant
FROM profiles
ORDER BY super_admin DESC, user_type, email;

-- 6. 统计信息
SELECT 
  '✓ 统计信息' AS check_name,
  COUNT(*) AS total_users,
  COUNT(*) FILTER (WHERE super_admin = true) AS super_admins,
  COUNT(*) FILTER (WHERE role = 'owner') AS owners,
  COUNT(*) FILTER (WHERE role = 'admin') AS admins,
  COUNT(*) FILTER (WHERE role = 'user') AS users,
  COUNT(*) FILTER (WHERE is_active = true) AS active_users,
  COUNT(*) FILTER (WHERE parent_user_id IS NOT NULL) AS sub_accounts
FROM profiles;

-- 7. 检查辅助函数
SELECT 
  '✓ 辅助函数检查' AS check_name,
  routine_name,
  routine_type,
  data_type AS return_type
FROM information_schema.routines
WHERE routine_name = 'check_password_reset_rate_limit';

-- 8. 测试频率限制函数
SELECT 
  '✓ 频率限制函数测试' AS check_name,
  check_password_reset_rate_limit(
    (SELECT id FROM profiles LIMIT 1),
    '1 hour'::interval,
    3
  ) AS can_reset_password;

-- 9. 最终摘要
DO $$
DECLARE
  v_profiles_fields INTEGER;
  v_profiles_indexes INTEGER;
  v_history_exists BOOLEAN;
  v_rls_policies INTEGER;
  v_function_exists BOOLEAN;
BEGIN
  -- 统计 profiles 新字段
  SELECT COUNT(*) INTO v_profiles_fields
  FROM information_schema.columns 
  WHERE table_name = 'profiles' 
  AND column_name IN ('parent_user_id', 'role', 'permissions', 'is_active', 'last_login_at');
  
  -- 统计 profiles 新索引
  SELECT COUNT(*) INTO v_profiles_indexes
  FROM pg_indexes
  WHERE tablename = 'profiles'
  AND indexname IN ('idx_profiles_parent_user_id', 'idx_profiles_tenant_role', 'idx_profiles_is_active');
  
  -- 检查历史表
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'password_reset_history'
  ) INTO v_history_exists;
  
  -- 统计 RLS 策略
  SELECT COUNT(*) INTO v_rls_policies
  FROM pg_policies
  WHERE tablename = 'password_reset_history';
  
  -- 检查函数
  SELECT EXISTS (
    SELECT 1 FROM information_schema.routines
    WHERE routine_name = 'check_password_reset_rate_limit'
  ) INTO v_function_exists;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '数据库迁移验证结果';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'profiles 表:';
  RAISE NOTICE '  新字段: % / 5', v_profiles_fields;
  RAISE NOTICE '  新索引: % / 3', v_profiles_indexes;
  RAISE NOTICE '';
  RAISE NOTICE 'password_reset_history 表:';
  RAISE NOTICE '  表存在: %', CASE WHEN v_history_exists THEN '✓' ELSE '✗' END;
  RAISE NOTICE '  RLS 策略: % / 4', v_rls_policies;
  RAISE NOTICE '';
  RAISE NOTICE '辅助函数:';
  RAISE NOTICE '  频率限制函数: %', CASE WHEN v_function_exists THEN '✓' ELSE '✗' END;
  RAISE NOTICE '';
  
  IF v_profiles_fields = 5 AND v_profiles_indexes = 3 AND 
     v_history_exists AND v_rls_policies = 4 AND v_function_exists THEN
    RAISE NOTICE '✓✓✓ 所有检查通过！数据库迁移成功！';
  ELSE
    RAISE NOTICE '✗✗✗ 部分检查失败，请检查上述结果';
  END IF;
  
  RAISE NOTICE '========================================';
END $$;
