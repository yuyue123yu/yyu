# 🔧 网站名称前端更新问题修复

## 问题分析

您在系统设置中修改了网站名称从 "LegalMY" 改为 "东南亚法律平台"，但前端页面没有更新。

### 根本原因

Header 组件只在页面加载时读取一次数据库，之后不会自动刷新。当您在系统设置页面保存新名称后，Header 组件不知道数据已更改。

---

## 解决方案

### 方案 1：手动刷新页面（临时方案）✅

**最简单的方法**：保存设置后，刷新浏览器页面

1. 进入系统设置：http://localhost:3000/admin/settings
2. 修改网站名称为 "东南亚法律平台"
3. 点击"保存设置"
4. **刷新浏览器页面**（F5 或 Ctrl+R）
5. 查看 Header 是否显示新名称

### 方案 2：自动刷新页面（推荐）✅

修改系统设置页面，保存成功后自动刷新页面：

```typescript
// 在 handleSave 函数中添加
const handleSave = async () => {
  // ... 保存逻辑 ...
  
  alert("设置保存成功！");
  
  // 添加这一行：刷新页面
  window.location.reload();
};
```

### 方案 3：使用全局状态管理（最佳方案）🚀

创建全局 Context 来管理设置，所有组件都能实时获取最新设置。

---

## 测试步骤

### 步骤 1：验证数据库中的数据

1. 访问 Supabase Dashboard：
   https://supabase.com/dashboard/project/ovtrvzbftinsfwytzgwy/editor

2. 打开 `settings` 表

3. 查看 `key = 'site'` 的记录，确认 `value` 字段中的 `siteName` 是什么

**预期结果**：
- 如果您已经保存过，应该看到 `"siteName": "东南亚法律平台"`
- 如果还是 `"LegalMY"`，说明保存没有成功

### 步骤 2：测试保存功能

1. 打开浏览器开发者工具（F12）
2. 切换到 Console 标签
3. 访问：http://localhost:3000/admin/settings
4. 修改网站名称为 "东南亚法律平台"
5. 点击"保存设置"
6. 查看 Console 是否有错误信息

**可能的错误**：
- `permission denied` - 测试用户不是管理员
- `relation "settings" does not exist` - settings 表未创建
- 其他数据库错误

### 步骤 3：测试前端加载

1. 打开浏览器开发者工具（F12）
2. 切换到 Console 标签
3. 访问首页：http://localhost:3000
4. 查看 Console 是否有 "Error loading site name" 错误
5. 查看 Network 标签，确认是否有请求到 Supabase

---

## 常见问题排查

### 问题 1：保存后没有变化

**可能原因**：
- 数据没有真正保存到数据库
- 浏览器缓存了旧数据
- Header 组件没有重新加载

**解决方法**：
1. 硬刷新浏览器（Ctrl + Shift + R）
2. 清除浏览器缓存
3. 检查 Supabase 数据库中的实际数据

### 问题 2：Console 显示 "permission denied"

**原因**：测试用户不是管理员

**解决方法**：
```sql
-- 在 Supabase SQL Editor 执行
UPDATE profiles 
SET user_type = 'admin' 
WHERE email = 'test@example.com';
```

### 问题 3：Console 显示 "relation settings does not exist"

**原因**：settings 表未创建

**解决方法**：
在 Supabase SQL Editor 执行 `supabase/create-settings-table.sql` 中的 SQL

### 问题 4：保存成功但 Header 不更新

**原因**：Header 组件只在页面加载时读取一次

**解决方法**：
- 方案 1：手动刷新页面
- 方案 2：实现自动刷新（见下方代码）

---

## 立即修复：添加自动刷新

我现在可以修改代码，让保存设置后自动刷新页面。这样您就不需要手动刷新了。

是否需要我实现这个功能？

---

## 调试信息收集

如果问题仍然存在，请提供以下信息：

1. **浏览器 Console 的错误信息**（如果有）
2. **Supabase settings 表的截图**
3. **保存设置时的 Network 请求详情**

这样我可以更准确地定位问题。

---

## 总结

✅ **已实现功能**：
- Header 从数据库加载网站名称
- 系统设置页面保存到数据库

⚠️ **当前限制**：
- Header 不会自动刷新
- 需要手动刷新页面才能看到更新

🚀 **推荐操作**：
1. 先测试手动刷新是否有效
2. 如果有效，我可以添加自动刷新功能
3. 如果无效，需要检查数据库和权限

---

**下一步：请告诉我您想要哪个解决方案？**
1. 手动刷新（现在就可以测试）
2. 自动刷新（我来修改代码）
3. 全局状态管理（最完善的方案）
