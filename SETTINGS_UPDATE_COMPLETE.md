# ✅ 网站名称更新功能已完成

## 修复内容

已修改系统设置页面，保存设置后会自动刷新页面，确保前端立即显示最新的网站名称。

---

## 测试步骤

### 1️⃣ 访问系统设置页面

打开浏览器访问：
```
http://localhost:3000/admin/settings
```

使用测试账号登录：
- 邮箱：test@example.com
- 密码：Test123456

### 2️⃣ 修改网站名称

1. 在"网站设置"部分找到"网站名称"输入框
2. 将名称改为：**东南亚法律平台**
3. 点击页面顶部或底部的"保存设置"按钮

### 3️⃣ 观察自动刷新

- 会弹出提示："设置保存成功！页面将自动刷新以应用更改。"
- 1.5秒后页面会自动刷新
- 刷新后，输入框中应该显示"东南亚法律平台"

### 4️⃣ 验证前端显示

1. 访问首页：http://localhost:3000
2. 查看页面左上角的网站名称
3. **应该显示：东南亚法律平台**（不再是 LegalMY）

---

## 功能说明

### 自动刷新机制

```typescript
// 保存成功后
alert("设置保存成功！页面将自动刷新以应用更改。");

// 1.5秒后自动刷新页面
setTimeout(() => {
  window.location.reload();
}, 1500);
```

### 为什么需要刷新？

1. **Header 组件**在页面加载时从数据库读取网站名称
2. 修改设置后，Header 组件不知道数据已更改
3. 刷新页面会重新加载 Header，从而获取最新的网站名称

### 数据流程

```
系统设置页面
  ↓ 保存
数据库 (settings 表)
  ↓ 刷新页面
Header 组件重新加载
  ↓ 读取数据库
显示新的网站名称
```

---

## 验证数据库

如果前端仍然没有更新，请检查数据库：

### 方法 1：Supabase Dashboard

1. 访问：https://supabase.com/dashboard/project/ovtrvzbftinsfwytzgwy/editor
2. 打开 `settings` 表
3. 找到 `key = 'site'` 的记录
4. 查看 `value` 字段中的 `siteName`

**预期值**：
```json
{
  "siteName": "东南亚法律平台",
  "siteDescription": "专业法律咨询平台",
  "contactEmail": "support@legalmy.com",
  "contactPhone": "+60 3-1234 5678",
  "defaultLanguage": "zh"
}
```

### 方法 2：浏览器开发者工具

1. 打开首页：http://localhost:3000
2. 按 F12 打开开发者工具
3. 切换到 Console 标签
4. 输入以下代码并回车：

```javascript
const { createClient } = await import('./lib/supabase/client');
const supabase = await createClient();
const { data } = await supabase.from('settings').select('*').eq('key', 'site').single();
console.log('Site settings:', data);
```

5. 查看输出的 `value.siteName`

---

## 故障排查

### 问题 1：保存时提示 "permission denied"

**原因**：测试用户不是管理员

**解决方法**：
```sql
-- 在 Supabase SQL Editor 执行
UPDATE profiles 
SET user_type = 'admin' 
WHERE email = 'test@example.com';
```

### 问题 2：保存时提示 "relation settings does not exist"

**原因**：settings 表未创建

**解决方法**：
在 Supabase SQL Editor 执行 `supabase/create-settings-table.sql` 中的 SQL

### 问题 3：刷新后仍显示旧名称

**可能原因**：
1. 浏览器缓存
2. 数据没有真正保存
3. Header 组件读取失败

**解决方法**：
1. 硬刷新浏览器（Ctrl + Shift + R）
2. 清除浏览器缓存
3. 检查浏览器 Console 是否有错误
4. 验证数据库中的数据（见上方"验证数据库"）

### 问题 4：Console 显示 "Error loading site name"

**原因**：Header 组件无法连接数据库

**解决方法**：
1. 检查 `.env.local` 文件中的 Supabase 配置
2. 确认 Supabase 项目正常运行
3. 检查网络连接

---

## 其他可修改的设置

除了网站名称，您还可以修改：

### 网站设置
- ✅ 网站名称
- ✅ 网站描述
- ✅ 联系邮箱
- ✅ 联系电话
- ✅ 默认语言（中文/English/Bahasa Malaysia）

### 邮件设置
- 启用邮件通知
- 新咨询通知
- 新订单通知

### 通知设置
- 推送通知
- 短信通知

### 安全设置
- 邮箱验证
- 双因素认证
- 会话超时时间

### 系统设置
- 维护模式
- 允许注册

**所有设置都会保存到数据库，并在刷新后生效。**

---

## 下一步优化（可选）

如果您希望更好的用户体验，可以考虑：

### 1. 全局状态管理

创建 SettingsContext，让所有组件都能实时获取最新设置，无需刷新页面。

### 2. 实时更新

使用 Supabase Realtime 功能，当设置更改时自动更新所有打开的页面。

### 3. 更友好的提示

使用 Toast 通知代替 alert，提供更好的视觉反馈。

---

## 总结

✅ **已完成**：
1. Header 组件从数据库加载网站名称
2. 系统设置页面保存到数据库
3. 保存后自动刷新页面
4. 前端立即显示最新名称

🎉 **现在可以测试了！**

按照上面的测试步骤操作，应该可以看到网站名称成功更新。

如果遇到任何问题，请查看"故障排查"部分或提供错误信息。
