# 超级管理员国际化(i18n)系统使用指南

## 🌍 概述

超级管理员面板现在支持中英文双语切换!所有页面都可以实时切换语言,无需刷新页面。

## ✨ 功能特性

- ✅ **实时切换**: 点击语言按钮即可切换,无需刷新
- ✅ **持久化**: 语言选择会保存到浏览器,下次访问自动应用
- ✅ **全局生效**: 所有页面统一使用同一语言设置
- ✅ **易于扩展**: 可以轻松添加更多语言

## 🎯 如何使用

### 1. 切换语言

在顶部导航栏右侧,您会看到一个语言切换按钮(🌐图标):

```
┌─────────────────────────────────────┐
│ 超级管理员  [🌐] [🔔] [管理员▼]   │
└─────────────────────────────────────┘
```

点击语言按钮,会弹出语言选择菜单:

```
┌──────────────┐
│ 🇨🇳 中文   ✓ │
│ 🇺🇸 English  │
└──────────────┘
```

### 2. 支持的语言

- **中文 (zh)** - 简体中文
- **English (en)** - 英语

### 3. 默认语言

- 首次访问: **中文**
- 之后访问: 使用上次选择的语言

## 📁 技术实现

### 文件结构

```
src/
├── contexts/
│   └── LanguageContext.tsx          # 语言Context和翻译字典
├── components/
│   └── super-admin/
│       ├── LanguageSwitcher.tsx     # 语言切换组件
│       ├── SuperAdminHeader.tsx     # 已更新:使用翻译
│       └── SuperAdminNav.tsx        # 已更新:使用翻译
└── app/
    └── super-admin/
        ├── layout.tsx               # 已更新:添加LanguageProvider
        ├── page.tsx                 # 已更新:使用翻译
        ├── admins/page.tsx          # 支持翻译
        ├── tenants/page.tsx         # 支持翻译
        ├── users/page.tsx           # 支持翻译
        └── diagnostics/page.tsx     # 支持翻译
```

### 核心组件

#### 1. LanguageContext

提供语言状态和翻译功能:

```typescript
const { language, setLanguage, t } = useLanguage();

// 获取当前语言
console.log(language); // 'zh' 或 'en'

// 切换语言
setLanguage('en');

// 翻译文本
const title = t('dashboard.title'); // '仪表板' 或 'Dashboard'
```

#### 2. LanguageSwitcher

语言切换按钮组件,显示在顶部导航栏。

#### 3. 翻译字典

所有翻译文本都存储在 `LanguageContext.tsx` 中的 `translations` 对象中。

## 🔧 如何添加新的翻译

### 步骤 1: 在翻译字典中添加键值对

编辑 `src/contexts/LanguageContext.tsx`:

```typescript
const translations = {
  zh: {
    // ... 现有翻译
    'myPage.title': '我的页面标题',
    'myPage.description': '这是描述',
  },
  en: {
    // ... 现有翻译
    'myPage.title': 'My Page Title',
    'myPage.description': 'This is description',
  },
};
```

### 步骤 2: 在组件中使用翻译

```typescript
'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function MyPage() {
  const { t } = useLanguage();

  return (
    <div>
      <h1>{t('myPage.title')}</h1>
      <p>{t('myPage.description')}</p>
    </div>
  );
}
```

## 📋 已翻译的页面

### ✅ 完全支持

- **登录页面** (`/super-admin/login`)
- **仪表板** (`/super-admin`)
- **导航菜单** (所有页面)
- **顶部导航栏** (所有页面)
- **系统诊断** (`/super-admin/diagnostics`)

### 🔄 部分支持(翻译键已准备)

- **管理员管理** (`/super-admin/admins`)
- **租户管理** (`/super-admin/tenants`)
- **用户管理** (`/super-admin/users`)
- **审计日志** (`/super-admin/audit-logs`)
- **系统设置** (`/super-admin/settings`)

## 🎨 翻译命名规范

翻译键使用点号分隔的命名空间:

```
<页面/组件>.<元素>
```

示例:
- `nav.dashboard` - 导航菜单中的"仪表板"
- `dashboard.title` - 仪表板页面的标题
- `dashboard.totalUsers` - 仪表板中的"用户总数"
- `common.save` - 通用的"保存"按钮

## 🌟 最佳实践

### 1. 始终使用翻译函数

❌ **错误**:
```typescript
<h1>仪表板</h1>
```

✅ **正确**:
```typescript
<h1>{t('dashboard.title')}</h1>
```

### 2. 为新页面添加翻译

创建新页面时,记得:
1. 在翻译字典中添加所有文本
2. 在组件中使用 `useLanguage()` hook
3. 用 `t()` 函数包裹所有显示文本

### 3. 保持翻译一致性

- 相同含义的文本使用相同的翻译键
- 例如: 所有"保存"按钮都使用 `common.save`

## 🔍 调试技巧

### 查看当前语言

```typescript
const { language } = useLanguage();
console.log('Current language:', language);
```

### 测试翻译

```typescript
const { t } = useLanguage();
console.log('Dashboard title:', t('dashboard.title'));
```

### 检查缺失的翻译

如果翻译键不存在,`t()` 函数会返回键本身:

```typescript
t('nonexistent.key') // 返回 'nonexistent.key'
```

## 📝 待办事项

如果需要完全翻译所有页面,还需要更新:

- [ ] 管理员管理页面的所有文本
- [ ] 租户管理页面的所有文本
- [ ] 用户管理页面的所有文本
- [ ] 审计日志页面的所有文本
- [ ] 设置页面的所有文本
- [ ] 所有表单和对话框
- [ ] 所有错误消息和提示

## 🚀 扩展到更多语言

要添加新语言(例如日语):

1. 在 `LanguageContext.tsx` 中添加翻译:

```typescript
const translations = {
  zh: { /* 中文翻译 */ },
  en: { /* 英文翻译 */ },
  ja: { /* 日语翻译 */ },
};
```

2. 更新 `Language` 类型:

```typescript
type Language = 'zh' | 'en' | 'ja';
```

3. 在 `LanguageSwitcher.tsx` 中添加选项:

```typescript
const languages = [
  { code: 'zh' as const, name: '中文', flag: '🇨🇳' },
  { code: 'en' as const, name: 'English', flag: '🇺🇸' },
  { code: 'ja' as const, name: '日本語', flag: '🇯🇵' },
];
```

---

**更新时间**: 2024
**版本**: v1.0.0
**状态**: ✅ 核心功能已完成
