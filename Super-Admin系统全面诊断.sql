-- ============================================
-- Super Admin 系统全面诊断
-- 执行日期: 2026-05-07
-- ============================================

-- 1. 检查所有核心表是否存在
-- ============================================
SELECT 
    '1. 核心表检查' as 检查项目,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tenants') THEN '✅'
        ELSE '❌'
    END as tenants表,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tenant_settings') THEN '✅'
        ELSE '❌'
    END as tenant_settings表,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN '✅'
        ELSE '❌'
    END as profiles表,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs') THEN '✅'
        ELSE '❌'
    END as audit_logs表,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'system_settings') THEN '✅'
        ELSE '❌'
    END as system_settings表,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'password_reset_tokens') THEN '✅'
        ELSE '❌'
    END as password_reset_tokens表,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'services') THEN '✅'
        ELSE '❌'
    END as services表;

-- 2. 检查 profiles 表结构
-- ============================================
SELECT 
    '2. Profiles表字段检查' as 检查项目,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' AND column_name = 'tenant_id'
        ) THEN '✅'
        ELSE '❌'
    END as tenant_id字段,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' AND column_name = 'super_admin'
        ) THEN '✅'
        ELSE '❌'
    END as super_admin字段;

-- 3. 检查租户数据
-- ============================================
SELECT 
    '3. 租户数据统计' as 检查项目,
    COUNT(*) as 租户总数,
    COUNT(*) FILTER (WHERE status = 'active') as 活跃租户,
    COUNT(*) FILTER (WHERE status = 'inactive') as 停用租户,
    COUNT(*) FILTER (WHERE status = 'suspended') as 暂停租户
FROM tenants;

-- 4. 显示所有租户详情
-- ============================================
SELECT 
    '4. 租户列表' as 检查项目,
    id as 租户ID,
    name as 租户名称,
    subdomain as 子域名,
    primary_domain as 自定义域名,
    status as 状态,
    user_count as 用户数,
    created_at as 创建时间
FROM tenants
ORDER BY created_at DESC;

-- 5. 检查 Super Admin 账号
-- ============================================
SELECT 
    '5. Super Admin账号' as 检查项目,
    COUNT(*) as Super_Admin总数,
    COUNT(*) FILTER (WHERE super_admin = true) as 已启用数量
FROM profiles;

-- 6. 显示 Super Admin 账号详情
-- ============================================
SELECT 
    '6. Super Admin详情' as 检查项目,
    id as 用户ID,
    email as 邮箱,
    full_name as 姓名,
    super_admin as 是否Super_Admin,
    tenant_id as 租户ID,
    user_type as 用户类型,
    created_at as 创建时间
FROM profiles
WHERE super_admin = true
ORDER BY created_at DESC;

-- 7. 检查用户租户关联
-- ============================================
SELECT 
    '7. 用户租户关联统计' as 检查项目,
    COUNT(*) as 总用户数,
    COUNT(*) FILTER (WHERE tenant_id IS NOT NULL) as 已关联租户,
    COUNT(*) FILTER (WHERE tenant_id IS NULL) as 未关联租户,
    COUNT(DISTINCT tenant_id) as 涉及租户数
FROM profiles;

-- 8. 按租户统计用户数
-- ============================================
SELECT 
    '8. 各租户用户统计' as 检查项目,
    t.name as 租户名称,
    t.user_count as 表中记录的用户数,
    COUNT(p.id) as 实际用户数,
    CASE 
        WHEN t.user_count = COUNT(p.id) THEN '✅ 一致'
        ELSE '❌ 不一致'
    END as 数据一致性
FROM tenants t
LEFT JOIN profiles p ON p.tenant_id = t.id
GROUP BY t.id, t.name, t.user_count
ORDER BY t.name;

-- 9. 检查租户配置
-- ============================================
SELECT 
    '9. 租户配置统计' as 检查项目,
    COUNT(DISTINCT tenant_id) as 已配置租户数,
    COUNT(*) as 配置项总数
FROM tenant_settings;

-- 10. 显示租户配置详情
-- ============================================
SELECT 
    '10. 租户配置详情' as 检查项目,
    t.name as 租户名称,
    ts.setting_key as 配置键,
    ts.setting_value as 配置值,
    ts.updated_at as 更新时间
FROM tenant_settings ts
JOIN tenants t ON t.id = ts.tenant_id
ORDER BY t.name, ts.setting_key;

-- 11. 检查审计日志
-- ============================================
SELECT 
    '11. 审计日志统计' as 检查项目,
    COUNT(*) as 日志总数,
    COUNT(DISTINCT super_admin_id) as 涉及管理员数,
    COUNT(DISTINCT action_type) as 操作类型数,
    MIN(created_at) as 最早记录,
    MAX(created_at) as 最新记录
FROM audit_logs;

-- 12. 最近的审计日志
-- ============================================
SELECT 
    '12. 最近审计日志' as 检查项目,
    al.action_type as 操作类型,
    al.target_entity as 目标实体,
    al.target_id as 目标ID,
    p.email as 操作者邮箱,
    al.created_at as 操作时间
FROM audit_logs al
LEFT JOIN profiles p ON p.id = al.super_admin_id
ORDER BY al.created_at DESC
LIMIT 10;

-- 13. 检查服务表
-- ============================================
SELECT 
    '13. 服务数据统计' as 检查项目,
    COUNT(*) as 服务总数,
    COUNT(*) FILTER (WHERE is_active = true) as 活跃服务,
    COUNT(DISTINCT tenant_id) as 涉及租户数
FROM services;

-- 14. 按租户统计服务
-- ============================================
SELECT 
    '14. 各租户服务统计' as 检查项目,
    t.name as 租户名称,
    COUNT(s.id) as 服务数量,
    COUNT(s.id) FILTER (WHERE s.is_active = true) as 活跃服务数
FROM tenants t
LEFT JOIN services s ON s.tenant_id = t.id
GROUP BY t.id, t.name
ORDER BY t.name;

-- 15. 检查 RLS 策略
-- ============================================
SELECT 
    '15. RLS策略检查' as 检查项目,
    schemaname as 模式,
    tablename as 表名,
    policyname as 策略名称,
    permissive as 许可类型,
    roles as 角色,
    cmd as 命令类型
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 16. 检查数据库函数
-- ============================================
SELECT 
    '16. 数据库函数检查' as 检查项目,
    routine_name as 函数名称,
    routine_type as 类型,
    data_type as 返回类型
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
    'set_config',
    'get_tenant_id',
    'is_super_admin',
    'log_audit_event',
    'update_tenant_user_count'
)
ORDER BY routine_name;

-- 17. 检查索引
-- ============================================
SELECT 
    '17. 关键索引检查' as 检查项目,
    tablename as 表名,
    indexname as 索引名称,
    indexdef as 索引定义
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('tenants', 'profiles', 'tenant_settings', 'audit_logs', 'services')
ORDER BY tablename, indexname;

-- 18. 检查密码重置令牌
-- ============================================
SELECT 
    '18. 密码重置令牌统计' as 检查项目,
    COUNT(*) as 令牌总数,
    COUNT(*) FILTER (WHERE used_at IS NULL) as 未使用,
    COUNT(*) FILTER (WHERE used_at IS NOT NULL) as 已使用,
    COUNT(*) FILTER (WHERE expires_at > NOW()) as 未过期,
    COUNT(*) FILTER (WHERE expires_at <= NOW()) as 已过期
FROM password_reset_tokens;

-- 19. 检查系统设置
-- ============================================
SELECT 
    '19. 系统设置' as 检查项目,
    setting_key as 设置键,
    setting_value as 设置值,
    description as 描述,
    updated_at as 更新时间
FROM system_settings
ORDER BY setting_key;

-- 20. 数据完整性检查
-- ============================================
SELECT 
    '20. 数据完整性检查' as 检查项目,
    '孤立的用户（无租户）' as 检查内容,
    COUNT(*) as 数量
FROM profiles
WHERE tenant_id IS NULL AND super_admin = false
UNION ALL
SELECT 
    '20. 数据完整性检查',
    '孤立的服务（无租户）',
    COUNT(*)
FROM services
WHERE tenant_id NOT IN (SELECT id FROM tenants)
UNION ALL
SELECT 
    '20. 数据完整性检查',
    '孤立的配置（无租户）',
    COUNT(*)
FROM tenant_settings
WHERE tenant_id NOT IN (SELECT id FROM tenants);

-- 21. 性能指标
-- ============================================
SELECT 
    '21. 表大小统计' as 检查项目,
    schemaname as 模式,
    tablename as 表名,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as 总大小,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as 表大小,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as 索引大小
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('tenants', 'profiles', 'tenant_settings', 'audit_logs', 'services')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 22. 最终总结
-- ============================================
SELECT 
    '22. 系统健康度总结' as 检查项目,
    '核心表' as 检查维度,
    CASE 
        WHEN (
            SELECT COUNT(*) FROM information_schema.tables 
            WHERE table_name IN ('tenants', 'tenant_settings', 'profiles', 'audit_logs', 'system_settings', 'password_reset_tokens', 'services')
        ) = 7 THEN '✅ 完整'
        ELSE '❌ 缺失'
    END as 状态
UNION ALL
SELECT 
    '22. 系统健康度总结',
    'Super Admin账号',
    CASE 
        WHEN EXISTS (SELECT 1 FROM profiles WHERE super_admin = true) THEN '✅ 存在'
        ELSE '❌ 不存在'
    END
UNION ALL
SELECT 
    '22. 系统健康度总结',
    '租户数据',
    CASE 
        WHEN EXISTS (SELECT 1 FROM tenants) THEN '✅ 有数据'
        ELSE '⚠️ 无数据'
    END
UNION ALL
SELECT 
    '22. 系统健康度总结',
    'RLS策略',
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public') THEN '✅ 已配置'
        ELSE '❌ 未配置'
    END
UNION ALL
SELECT 
    '22. 系统健康度总结',
    '数据库函数',
    CASE 
        WHEN (
            SELECT COUNT(*) FROM information_schema.routines 
            WHERE routine_schema = 'public'
            AND routine_name IN ('get_tenant_id', 'is_super_admin')
        ) >= 2 THEN '✅ 已创建'
        ELSE '❌ 缺失'
    END;

-- ============================================
-- 诊断完成
-- ============================================
SELECT '🎉 诊断完成！请查看上述所有检查结果。' as 提示;
