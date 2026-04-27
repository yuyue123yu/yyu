# 多语言页面更新 - 待办事项

## 📋 当前状态

✅ **已完成**:
- 首页所有组件 (Hero, Services, Promotions, FeaturedLawyers, UserReviews, Testimonials, BlogSection, FAQ, CTA, SearchFilters)
- Header 组件
- Footer 组件
- 语言切换器
- 翻译字典（已添加所有页面需要的翻译键）

❌ **待更新** (需要添加多语言支持):
1. `/services` - 服务列表页
2. `/services/[category]` - 服务详情页
3. `/lawyers` - 律师列表页
4. `/consultation` - 在线咨询页
5. `/templates` - 法律文书模板页
6. `/knowledge` - 法律知识库页
7. `/knowledge/[id]` - 知识详情页
8. `/login` - 登录页
9. `/register` - 注册页
10. `/cart` - 购物车页
11. `/favorites` - 收藏页
12. `/contact` - 联系我们页
13. `/review` - 文件审核页
14. `/about` - 关于我们页
15. `/careers` - 加入我们页
16. `/help` - 帮助中心页
17. `/privacy` - 隐私政策页
18. `/terms` - 服务条款页

## 🔧 更新步骤

每个页面需要进行以下更新：

### 1. 导入语言钩子
```typescript
"use client";  // 如果还没有的话

import { useLanguage } from "@/contexts/LanguageContext";
```

### 2. 在组件中使用钩子
```typescript
export default function PageName() {
  const { t } = useLanguage();
  
  // ... 组件代码
}
```

### 3. 替换所有硬编码文本
将所有中文硬编码文本替换为翻译函数调用：

**之前:**
```typescript
<h1>专业法律服务</h1>
<p>涵盖7大法律领域</p>
<button>立即咨询</button>
```

**之后:**
```typescript
<h1>{t('pages.servicesTitle')}</h1>
<p>{t('pages.servicesSubtitle')}</p>
<button>{t('home.consultNow')}</button>
```

### 4. 处理动态内容
对于数组中的数据，需要为每个语言创建对应的字段：

**之前:**
```typescript
const services = [
  { title: "家庭法", description: "离婚、监护权..." }
];
```

**之后:**
```typescript
const services = [
  { 
    titleKey: "services.family",
    descKey: "services.familyDesc"
  }
];

// 在渲染时:
<h3>{t(service.titleKey)}</h3>
<p>{t(service.descKey)}</p>
```

## 📝 已添加的翻译键

所有页面需要的翻译键已经添加到 `src/contexts/LanguageContext.tsx` 中：

### 通用键 (common.*)
- viewAll, learnMore, getStarted
- search, filter, sortBy
- price, rating, reviews, cases
- loading, success, error
- hot, recommended, new

### 服务键 (services.*)
- debt, family, business, property
- criminal, employment, ip
- 每个服务的描述 (debtDesc, familyDesc, etc.)

### 页面键 (pages.*)
- servicesTitle, servicesSubtitle
- lawyersTitle, lawyersSubtitle
- consultationTitle, consultationSubtitle
- templatesTitle, templatesSubtitle
- knowledgeTitle, knowledgeSubtitle
- 以及每个页面特定的所有文本

## 🎯 优先级

**高优先级** (用户最常访问):
1. `/services` 和 `/services/[category]`
2. `/lawyers`
3. `/consultation`
4. `/templates`
5. `/knowledge`

**中优先级**:
6. `/login` 和 `/register`
7. `/cart` 和 `/favorites`
8. `/contact`

**低优先级** (静态内容页):
9. `/about`, `/careers`, `/help`
10. `/privacy`, `/terms`

## 💡 示例：服务页面更新

我将在下一步提供一个完整的服务页面更新示例，展示如何正确地添加多语言支持。

## ⚠️ 注意事项

1. **所有页面必须添加 `"use client"`** - 因为使用了 `useLanguage` 钩子
2. **保持现有功能** - 只替换文本，不改变逻辑
3. **测试每个页面** - 切换语言后确保所有文本都正确更新
4. **处理特殊情况** - 如表单验证消息、错误提示等也需要翻译

## 📊 进度追踪

- [ ] 服务列表页
- [ ] 服务详情页
- [ ] 律师列表页
- [ ] 在线咨询页
- [ ] 法律文书模板页
- [ ] 法律知识库页
- [ ] 知识详情页
- [ ] 登录页
- [ ] 注册页
- [ ] 购物车页
- [ ] 收藏页
- [ ] 联系我们页
- [ ] 文件审核页
- [ ] 关于我们页
- [ ] 加入我们页
- [ ] 帮助中心页
- [ ] 隐私政策页
- [ ] 服务条款页

---

**预计完成时间**: 需要逐页更新，每页约5-10分钟
**总计**: 约18个页面 × 7分钟 = ~2小时工作量
