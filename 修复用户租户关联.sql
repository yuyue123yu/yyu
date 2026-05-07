-- =============================================
-- 修复用户租户关联问题
-- =============================================

-- 步骤 1: 查看当前所有用户和租户
SELECT 
  '当前用户列表' as info,
  p.id,
  p.email,
  p.user_type,
  p.tenant_id,
  t.name as tenant_name
FROM profiles p
LEFT JOIN tenants t ON p.tenant_id = t.id
ORDER BY p.created_at DESC;

-- 步骤 2: 查看所有租户
SELECT 
  '当前租户列表' as info,
  id,
  name,
  subdomain,
  status,
  created_at
FROM tenants
ORDER BY created_at DESC;

-- 步骤 3: 如果没有租户，创建一个测试租户
INSERT INTO tenants (name, subdomain, status)
VALUES ('测试律所', 'test-law-firm', 'active')
ON CONFLICT (subdomain) DO NOTHING
RETURNING id, name, subdomain;

-- 步骤 4: 将所有没有 tenant_id 的 admin 用户关联到第一个租户
-- 注意：这会将所有未关联的管理员用户关联到第一个租户
UPDATE profiles
SET tenant_id = (SELECT id FROM tenants ORDER BY created_at LIMIT 1)
WHERE tenant_id IS NULL
  AND user_type IN ('admin', 'owner')
  AND super_admin = false
RETURNING email, user_type, tenant_id;

-- 步骤 5: 验证修复结果
SELECT 
  '修复后的用户状态' as info,
  p.email,
  p.user_type,
  p.tenant_id,
  t.name as tenant_name,
  CASE 
    WHEN p.tenant_id IS NOT NULL THEN '✓ 已关联租户'
    ELSE '✗ 未关联租户'
  END as status
FROM profiles p
LEFT JOIN tenants t ON p.tenant_id = t.id
WHERE p.user_type IN ('admin', 'owner')
ORDER BY p.created_at DESC;

-- 步骤 6: 显示结果
DO $$
DECLARE
  v_tenant_count INTEGER;
  v_unlinked_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_tenant_count FROM tenants;
  SELECT COUNT(*) INTO v_unlinked_count 
  FROM profiles 
  WHERE tenant_id IS NULL 
    AND user_type IN ('admin', 'owner')
    AND super_admin = false;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '修复完成';
  RAISE NOTICE '========================================';
  RAISE NOTICE '租户总数: %', v_tenant_count;
  RAISE NOTICE '未关联的管理员: %', v_unlinked_count;
  
  IF v_unlinked_count = 0 THEN
    RAISE NOTICE '✓ 所有管理员都已关联租户';
    RAISE NOTICE '';
    RAISE NOTICE '下一步:';
    RAISE NOTICE '1. 刷新浏览器页面';
    RAISE NOTICE '2. 重新登录（如果需要）';
    RAISE NOTICE '3. 访问: http://localhost:3000/admin/branding';
  ELSE
    RAISE NOTICE '⚠ 还有 % 个管理员未关联租户', v_unlinked_count;
    RAISE NOTICE '请手动关联或检查是否需要创建租户';
  END IF;
  
  RAISE NOTICE '========================================';
END $$;
