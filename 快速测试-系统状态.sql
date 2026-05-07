-- =============================================
-- 快速测试 - 系统状态检查
-- =============================================

-- 1. 检查 profiles 表是否有新字段
SELECT 
  '1. profiles 表新字段检查' AS test_name,
  COUNT(*) AS found_columns,
  CASE 
    WHEN COUNT(*) = 5 THEN '✅ 通过'
    ELSE '❌ 失败 - 应该有5个新字段'
  END AS status
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('parent_user_id', 'role', 'permissions', 'is_active', 'last_login_at');

-- 2. 列出 profiles 表的新字段详情
SELECT 
  '2. profiles 新字段详情' AS test_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('parent_user_id', 'role', 'permissions', 'is_active', 'last_login_at')
ORDER BY column_name;

-- 3. 检查 password_reset_history 表是否存在
SELECT 
  '3. password_reset_history 表检查' AS test_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_name = 'password_reset_history'
    ) THEN '✅ 表存在'
    ELSE '❌ 表不存在'
  END AS status;

-- 4. 检查 password_reset_history 表的 RLS 策略
SELECT 
  '4. password_reset_history RLS 策略' AS test_name,
  COUNT(*) AS policy_count,
  CASE 
    WHEN COUNT(*) >= 4 THEN '✅ 通过'
    ELSE '❌ 失败 - 应该有4个策略'
  END AS status
FROM pg_policies 
WHERE tablename = 'password_reset_history';

-- 5. 列出所有 RLS 策略
SELECT 
  '5. RLS 策略详情' AS test_name,
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'password_reset_history'
ORDER BY policyname;

-- 6. 检查现有用户的角色分配
SELECT 
  '6. 用户角色分配' AS test_name,
  COUNT(*) AS total_users,
  COUNT(*) FILTER (WHERE role = 'owner') AS owners,
  COUNT(*) FILTER (WHERE role = 'admin') AS admins,
  COUNT(*) FILTER (WHERE role = 'manager') AS managers,
  COUNT(*) FILTER (WHERE role = 'user') AS users,
  COUNT(*) FILTER (WHERE role IS NULL) AS no_role
FROM profiles;

-- 7. 检查 Super Admin 账号
SELECT 
  '7. Super Admin 账号' AS test_name,
  email,
  full_name,
  role,
  super_admin,
  is_active,
  CASE 
    WHEN is_active THEN '✅ 激活'
    ELSE '❌ 未激活'
  END AS status
FROM profiles
WHERE super_admin = true;

-- 8. 检查辅助函数
SELECT 
  '8. 辅助函数检查' AS test_name,
  routine_name,
  routine_type,
  CASE 
    WHEN routine_name = 'check_password_reset_rate_limit' THEN '✅ 存在'
    ELSE '❌ 不存在'
  END AS status
FROM information_schema.routines
WHERE routine_name = 'check_password_reset_rate_limit';

-- 9. 测试频率限制函数
SELECT 
  '9. 频率限制函数测试' AS test_name,
  check_password_reset_rate_limit(
    (SELECT id FROM profiles LIMIT 1),
    '1 hour'::interval,
    3
  ) AS can_reset,
  CASE 
    WHEN check_password_reset_rate_limit(
      (SELECT id FROM profiles LIMIT 1),
      '1 hour'::interval,
      3
    ) THEN '✅ 函数正常工作'
    ELSE '⚠️ 函数返回 false（可能已达到限制）'
  END AS status;

-- 10. 检查索引
SELECT 
  '10. 索引检查' AS test_name,
  COUNT(*) AS index_count,
  CASE 
    WHEN COUNT(*) >= 3 THEN '✅ 通过'
    ELSE '❌ 失败 - 应该有至少3个新索引'
  END AS status
FROM pg_indexes
WHERE tablename = 'profiles'
AND indexname IN ('idx_profiles_parent_user_id', 'idx_profiles_tenant_role', 'idx_profiles_is_active');

-- 11. 列出所有新索引
SELECT 
  '11. 新索引详情' AS test_name,
  indexname,
  tablename
FROM pg_indexes
WHERE tablename IN ('profiles', 'password_reset_history')
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- 12. 最终总结
DO $$
DECLARE
  v_profiles_fields INTEGER;
  v_history_exists BOOLEAN;
  v_rls_policies INTEGER;
  v_function_exists BOOLEAN;
  v_indexes INTEGER;
BEGIN
  -- 统计
  SELECT COUNT(*) INTO v_profiles_fields
  FROM information_schema.columns 
  WHERE table_name = 'profiles' 
  AND column_name IN ('parent_user_id', 'role', 'permissions', 'is_active', 'last_login_at');
  
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'password_reset_history'
  ) INTO v_history_exists;
  
  SELECT COUNT(*) INTO v_rls_policies
  FROM pg_policies 
  WHERE tablename = 'password_reset_history';
  
  SELECT EXISTS (
    SELECT 1 FROM information_schema.routines
    WHERE routine_name = 'check_password_reset_rate_limit'
  ) INTO v_function_exists;
  
  SELECT COUNT(*) INTO v_indexes
  FROM pg_indexes
  WHERE tablename = 'profiles'
  AND indexname IN ('idx_profiles_parent_user_id', 'idx_profiles_tenant_role', 'idx_profiles_is_active');
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '系统状态检查结果';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'profiles 表:';
  RAISE NOTICE '  新字段: % / 5 %', v_profiles_fields, CASE WHEN v_profiles_fields = 5 THEN '✅' ELSE '❌' END;
  RAISE NOTICE '  新索引: % / 3 %', v_indexes, CASE WHEN v_indexes = 3 THEN '✅' ELSE '❌' END;
  RAISE NOTICE '';
  RAISE NOTICE 'password_reset_history 表:';
  RAISE NOTICE '  表存在: %', CASE WHEN v_history_exists THEN '✅' ELSE '❌' END;
  RAISE NOTICE '  RLS 策略: % / 4 %', v_rls_policies, CASE WHEN v_rls_policies = 4 THEN '✅' ELSE '❌' END;
  RAISE NOTICE '';
  RAISE NOTICE '辅助函数:';
  RAISE NOTICE '  频率限制函数: %', CASE WHEN v_function_exists THEN '✅' ELSE '❌' END;
  RAISE NOTICE '';
  
  IF v_profiles_fields = 5 AND v_history_exists AND 
     v_rls_policies = 4 AND v_function_exists AND v_indexes = 3 THEN
    RAISE NOTICE '✅✅✅ 所有检查通过！系统已准备就绪！';
    RAISE NOTICE '';
    RAISE NOTICE '下一步:';
    RAISE NOTICE '1. 访问 http://localhost:3000/settings/security 测试密码修改';
    RAISE NOTICE '2. 访问 http://localhost:3000/admin/users/sub-accounts 测试子账号管理';
  ELSE
    RAISE NOTICE '❌❌❌ 部分检查失败！';
    RAISE NOTICE '';
    RAISE NOTICE '需要执行:';
    IF v_profiles_fields < 5 OR v_indexes < 3 THEN
      RAISE NOTICE '- 执行 supabase/011_enhance_profiles_for_sub_accounts.sql';
    END IF;
    IF NOT v_history_exists OR v_rls_policies < 4 OR NOT v_function_exists THEN
      RAISE NOTICE '- 执行 supabase/012_create_password_reset_history.sql';
    END IF;
  END IF;
  
  RAISE NOTICE '========================================';
END $$;
