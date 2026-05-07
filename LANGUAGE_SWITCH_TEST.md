# 语言切换功能测试指南

## 🔍 问题诊断

如果语言切换后没有变化,可能的原因:

### 1. **浏览器缓存问题**
- 解决方案: 硬刷新页面
  - Windows: `Ctrl + Shift + R` 或 `Ctrl + F5`
  - Mac: `Cmd + Shift + R`

### 2. **localStorage 未生效**
- 打开浏览器开发者工具 (F12)
- 进入 Console 标签
- 输入以下命令检查:
  ```javascript
  localStorage.getItem('superadmin-language')
  ```
- 应该返回 `"zh"` 或 `"en"`

### 3. **组件未重新渲染**
- 刷新整个页面 (F5)
- 或者导航到其他页面再返回

## ✅ 测试步骤

### 步骤 1: 清除缓存
1. 打开开发者工具 (F12)
2. 在 Console 中执行:
   ```javascript
   localStorage.clear()
   location.reload()
   ```

### 步骤 2: 测试语言切换
1. 登录超级管理员面板
2. 查看顶部导航栏右侧
3. 找到语言切换按钮 (🌐 图标)
4. 点击按钮,选择语言
5. 观察页面文本是否改变

### 步骤 3: 验证持久化
1. 切换到英文
2. 刷新页面 (F5)
3. 确认页面仍然是英文
4. 切换回中文
5. 刷新页面
6. 确认页面是中文

## 🐛 调试命令

在浏览器 Console 中运行这些命令来调试:

### 检查当前语言
```javascript
localStorage.getItem('superadmin-language')
```

### 手动设置语言为中文
```javascript
localStorage.setItem('superadmin-language', 'zh')
location.reload()
```

### 手动设置语言为英文
```javascript
localStorage.setItem('superadmin-language', 'en')
location.reload()
```

### 清除语言设置
```javascript
localStorage.removeItem('superadmin-language')
location.reload()
```

## 📋 已翻译的页面检查清单

访问以下页面并验证语言切换:

- [ ] 登录页面 (`/super-admin/login`)
- [ ] 仪表板 (`/super-admin`)
- [ ] 租户管理 (`/super-admin/tenants`)
- [ ] 用户管理 (`/super-admin/users`)
- [ ] 管理员 (`/super-admin/admins`)
- [ ] 审计日志 (`/super-admin/audit-logs`)
- [ ] 系统诊断 (`/super-admin/diagnostics`)
- [ ] 系统设置 (`/super-admin/settings`)

## 🔧 如果仍然不工作

### 检查 1: 确认文件已保存
确保以下文件已正确保存:
- `src/contexts/LanguageContext.tsx`
- `src/components/super-admin/LanguageSwitcher.tsx`
- `src/app/super-admin/layout.tsx`
- `src/components/super-admin/SuperAdminHeader.tsx`
- `src/components/super-admin/SuperAdminNav.tsx`
- `src/app/super-admin/page.tsx`

### 检查 2: 开发服务器是否重启
有时需要重启开发服务器:
```bash
# 停止服务器 (Ctrl+C)
# 然后重新启动
npm run dev
```

### 检查 3: 查看浏览器 Console 错误
1. 打开开发者工具 (F12)
2. 查看 Console 标签
3. 检查是否有红色错误信息
4. 如果有错误,记录错误信息

### 检查 4: 验证 React Context
在 Console 中运行:
```javascript
// 这应该不会报错
document.querySelector('[data-language]')
```

## 💡 预期行为

### 中文模式 (zh)
- 导航菜单: 仪表板、租户管理、用户管理...
- 顶部标题: 超级管理员
- 按钮: 登录、保存、取消...

### 英文模式 (en)
- 导航菜单: Dashboard, Tenants, Users...
- 顶部标题: Super Admin
- 按钮: Sign In, Save, Cancel...

## 📞 需要帮助?

如果按照以上步骤仍然无法解决问题,请提供:
1. 浏览器 Console 的截图
2. 当前语言设置 (`localStorage.getItem('superadmin-language')`)
3. 是否看到语言切换按钮
4. 点击语言切换按钮后是否有反应

---

**更新时间**: 2024
**版本**: v1.0.0
