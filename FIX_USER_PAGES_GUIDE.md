# 修复普通用户页面指南

## 问题说明

当前普通用户页面（如联系页面、登录页面等）仍在使用 `useLanguage`，但根布局已经移除了 `LanguageProvider`，导致这些页面会报错。

## 解决方案

### 方案 1：暂时禁用这些页面（最快）

如果这些页面暂时不需要使用，可以：
1. 注释掉相关路由
2. 或者添加一个临时的错误边界

### 方案 2：移除国际化代码（推荐）

从以下文件中移除 `useLanguage` 的使用：

1. `src/app/about/page.tsx`
2. `src/app/careers/page.tsx`
3. `src/app/cart/page.tsx`
4. `src/app/consultation/page.tsx`
5. `src/app/contact/page.tsx`
6. `src/app/favorites/page.tsx`
7. `src/app/help/page.tsx`
8. `src/app/knowledge/page.tsx`
9. `src/app/lawyers/page.tsx`
10. `src/app/lawyers/[id]/page.tsx`
11. `src/app/login/page.tsx`
12. `src/app/privacy/page.tsx`
13. `src/app/register/page.tsx`
14. `src/app/review/page.tsx`
15. `src/app/services/page.tsx`
16. `src/app/services/[category]/page.tsx`
17. `src/app/templates/page.tsx`
18. `src/app/terms/page.tsx`

### 修改步骤（以 contact/page.tsx 为例）

**修改前**：
```typescript
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactPage() {
  const { t, language } = useLanguage();
  
  return (
    <div>
      <h1>{t('contact.title')}</h1>
      <p>{t('contact.description')}</p>
    </div>
  );
}
```

**修改后**：
```typescript
// 移除 import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactPage() {
  // 移除 const { t, language } = useLanguage();
  
  return (
    <div>
      <h1>联系我们</h1>
      <p>如有任何问题，请联系我们</p>
    </div>
  );
}
```

### 方案 3：恢复根布局的 LanguageProvider（临时方案）

如果需要快速让系统恢复正常，可以暂时恢复根布局的 `LanguageProvider`：

```typescript
// src/app/layout.tsx
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function RootLayout({ children }) {
  return (
    <html lang="ms">
      <body>
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
```

**注意**：这样做会让所有页面都有国际化功能，但超级管理员系统仍然是独立的。

## 当前状态

- ✅ 超级管理员系统：完全独立，有自己的 LanguageProvider
- ❌ 普通用户页面：会报错，因为没有 LanguageProvider

## 建议

**如果普通用户页面暂时不需要使用**：
- 采用方案 1 或方案 2

**如果普通用户页面需要继续使用**：
- 采用方案 3（临时恢复 LanguageProvider）
- 然后逐步移除不需要国际化的页面

## 需要您确认

请告诉我您希望如何处理普通用户页面：

1. **暂时禁用**这些页面（如果不需要使用）
2. **移除国际化代码**（需要逐个修改文件）
3. **恢复 LanguageProvider**（让所有页面继续正常工作）

---

**当前推荐**：方案 3（恢复 LanguageProvider），这样可以保证所有页面正常工作，超级管理员系统仍然独立。
