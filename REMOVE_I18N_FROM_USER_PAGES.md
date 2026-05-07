# 移除普通用户页面的国际化

## 需要修改的文件列表

### 用户页面（需要移除 useLanguage）
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

## 修改方案

### 方案 1：移除 useLanguage，使用硬编码文本（推荐）
- 从这些文件中删除 `import { useLanguage } from "@/contexts/LanguageContext";`
- 删除 `const { t, language } = useLanguage();`
- 将所有 `t('key')` 替换为实际的文本

### 方案 2：创建一个空的翻译函数
创建一个简单的 fallback 函数，当翻译键不存在时返回键本身。

## 快速修复

最快的方法是修改 `LanguageContext.tsx`，让它在找不到翻译键时返回键本身，而不是报错。
