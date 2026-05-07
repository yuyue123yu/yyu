# 修复所有 API 路由的字段名

## 问题
API 路由中使用的字段名与数据库表不匹配：
- API 使用: `key`, `value`, `role`
- 数据库使用: `setting_key`, `setting_value`, `user_type`

## 需要修复的文件

### 已修复 ✅
1. `src/app/api/tenant/branding/route.ts`

### 待修复 ⏳
1. `src/app/api/tenant/branding/upload-logo/route.ts`
2. `src/app/api/tenant/pricing/route.ts`
3. `src/app/api/tenant/features/route.ts`
4. `src/app/api/tenant/content/route.ts`
5. `src/app/api/tenant/domain/route.ts`
6. `src/app/api/tenant/domain/verify/route.ts`
7. `src/app/api/tenant/seo/route.ts`
8. `src/app/api/tenant/seo/upload-favicon/route.ts`
9. `src/app/api/tenant/notifications/route.ts`
10. `src/app/api/tenant/notifications/test/route.ts`

## 修复规则

### 1. profiles 表字段
```typescript
// 错误 ❌
.select('tenant_id, role')

// 正确 ✅
.select('tenant_id, user_type')
```

```typescript
// 错误 ❌
if (profile.role !== 'owner' && profile.role !== 'admin')

// 正确 ✅
if (profile.user_type !== 'owner' && profile.user_type !== 'admin')
```

### 2. tenant_settings 表字段
```typescript
// 错误 ❌
.select('value')
.eq('key', 'branding')

// 正确 ✅
.select('setting_value')
.eq('setting_key', 'branding')
```

```typescript
// 错误 ❌
.upsert({
  tenant_id: profile.tenant_id,
  key: 'branding',
  value: branding,
})

// 正确 ✅
.upsert({
  tenant_id: profile.tenant_id,
  setting_key: 'branding',
  setting_value: branding,
})
```

```typescript
// 错误 ❌
settings?.value

// 正确 ✅
settings?.setting_value
```

## 批量替换命令

在每个文件中执行以下替换：

1. `role` → `user_type` (在 profiles 查询中)
2. `key` → `setting_key` (在 tenant_settings 中)
3. `value` → `setting_value` (在 tenant_settings 中)
4. `onConflict: 'tenant_id,key'` → `onConflict: 'tenant_id,setting_key'`

## 注意事项

- 只替换 tenant_settings 表相关的字段
- 不要替换其他地方的 key/value（如 JSON 对象）
- 确保 onConflict 约束名称也要更新
