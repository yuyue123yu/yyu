# 语言切换快速修复指南

## 🚨 如果语言切换不工作,请按以下步骤操作:

### 方法 1: 硬刷新浏览器 (最简单)

1. **Windows 用户**:
   - 按 `Ctrl + Shift + R`
   - 或 `Ctrl + F5`

2. **Mac 用户**:
   - 按 `Cmd + Shift + R`

3. **或者手动清除缓存**:
   - 按 `F12` 打开开发者工具
   - 右键点击刷新按钮
   - 选择"清空缓存并硬性重新加载"

### 方法 2: 清除 localStorage (推荐)

1. 打开浏览器开发者工具 (按 `F12`)
2. 进入 **Console** 标签
3. 复制粘贴以下命令并按回车:

```javascript
localStorage.clear(); location.reload();
```

4. 页面会自动刷新
5. 再次尝试切换语言

### 方法 3: 手动设置语言

如果上面的方法都不行,在 Console 中运行:

**切换到中文**:
```javascript
localStorage.setItem('superadmin-language', 'zh'); location.reload();
```

**切换到英文**:
```javascript
localStorage.setItem('superadmin-language', 'en'); location.reload();
```

### 方法 4: 重启开发服务器

1. 在终端中按 `Ctrl + C` 停止服务器
2. 运行 `npm run dev` 重新启动
3. 刷新浏览器

## ✅ 验证语言切换是否工作

切换语言后,检查以下内容是否改变:

### 中文 (zh)
- 左侧菜单: **仪表板**、**租户管理**、**用户管理**
- 顶部标题: **超级管理员**
- 右上角: **管理员**、**退出登录**

### 英文 (en)
- 左侧菜单: **Dashboard**、**Tenants**、**Users**
- 顶部标题: **Super Admin**
- 右上角: **Admin**、**Logout**

## 🔍 检查语言切换按钮

语言切换按钮应该在:
- **位置**: 顶部导航栏右侧
- **图标**: 🌐 (地球图标)
- **旁边**: 通知铃铛 (🔔) 的左边

如果看不到语言切换按钮,说明组件可能没有正确加载。

## 📸 截图参考

语言切换按钮应该看起来像这样:

```
┌────────────────────────────────────────────┐
│ 超级管理员  [🌐 🇨🇳] [🔔] [管理员 ▼]    │
│ 系统管理平台                                │
└────────────────────────────────────────────┘
```

点击 🌐 后会弹出菜单:

```
┌──────────────┐
│ 🇨🇳 中文   ✓ │
│ 🇺🇸 English  │
└──────────────┘
```

## 🐛 仍然不工作?

请在浏览器 Console 中运行以下命令并告诉我结果:

```javascript
// 1. 检查当前语言
console.log('Current language:', localStorage.getItem('superadmin-language'));

// 2. 检查 LanguageContext 是否加载
console.log('LanguageContext loaded:', typeof window !== 'undefined');

// 3. 检查是否有错误
console.log('Check for errors above');
```

然后截图发给我,我会帮您诊断问题!

---

**提示**: 大多数情况下,硬刷新浏览器 (Ctrl+Shift+R) 就能解决问题!
