# 电商风格重设计 - 快速参考

## 📦 新增组件

### 1. Promotions.tsx
**位置**: `src/components/home/Promotions.tsx`

**功能**:
- 闪购专场（5折优惠）
- 新用户礼包（¥100优惠券）
- 满减活动（满¥500减¥50）
- 积分商城
- 热销律师排行榜

**使用**:
```tsx
import Promotions from "@/components/home/Promotions";

<Promotions />
```

---

### 2. SearchFilters.tsx
**位置**: `src/components/home/SearchFilters.tsx`

**功能**:
- 搜索框（粘性顶部）
- 5 维度筛选（价格、评分、响应时间、地区、专业领域）
- 5 种排序方式
- 清除筛选快捷按钮

**使用**:
```tsx
import SearchFilters from "@/components/home/SearchFilters";

<SearchFilters />
```

---

### 3. UserReviews.tsx
**位置**: `src/components/home/UserReviews.tsx`

**功能**:
- 用户评价卡片网格（3列）
- 律师信息 + 评分 + 评价内容
- 已验证标签
- 有用投票
- 平均评分统计

**使用**:
```tsx
import UserReviews from "@/components/home/UserReviews";

<UserReviews />
```

---

### 4. ShoppingCart.tsx
**位置**: `src/components/home/ShoppingCart.tsx`

**功能**:
- 待咨询列表（购物车）
- 收藏夹
- 订单总结
- 优惠提示

**使用**:
```tsx
import ShoppingCart from "@/components/home/ShoppingCart";

<ShoppingCart />
```

---

## 🎨 优化的组件

### 1. Hero.tsx
**改进**:
- ✅ 添加购物车和收藏夹按钮
- ✅ 3 个轮播 Banner（促销）
- ✅ 6 个分类导航网格
- ✅ 信任指标展示

---

### 2. Services.tsx
**改进**:
- ✅ 6 列网格布局
- ✅ 添加热销/推荐/新徽章
- ✅ 显示案例数和价格
- ✅ 更紧凑的电商风格

---

### 3. FeaturedLawyers.tsx
**改进**:
- ✅ 6 列网格布局（电商卡片风格）
- ✅ 添加已服务客户数（销量）
- ✅ 添加价格区间
- ✅ 添加收藏按钮
- ✅ 添加热销/推荐徽章
- ✅ 改进的快速操作按钮

---

## 🎯 电商特性总结

| 特性 | 组件 | 说明 |
|------|------|------|
| 轮播 Banner | Hero | 3-5 个促销活动 |
| 分类导航 | Hero | 6-8 个主要服务 |
| 闪购 | Promotions | 限时优惠 |
| 新用户优惠 | Promotions | ¥100 优惠券 |
| 满减活动 | Promotions | 满¥500减¥50 |
| 积分系统 | Promotions | 每次咨询赚积分 |
| 热销排行 | Promotions | 周销量排行 |
| 搜索 | SearchFilters | 快速查询 |
| 筛选 | SearchFilters | 5 维度筛选 |
| 排序 | SearchFilters | 5 种排序方式 |
| 销量展示 | FeaturedLawyers | 已服务客户数 |
| 评分展示 | FeaturedLawyers | 5 星评分 |
| 用户评价 | UserReviews | 真实用户评价 |
| 购物车 | ShoppingCart | 待咨询列表 |
| 收藏夹 | ShoppingCart | 收藏律师 |
| 订单总结 | ShoppingCart | 价格计算 |

---

## 🎨 配色方案

```css
/* 主色 - 深蓝色 */
primary-600: #1e40af

/* 辅色 - 金色 */
accent-500: #f59e0b

/* 中性色 */
neutral-50: #fafafa
neutral-900: #18181b
```

---

## 📱 响应式布局

### 网格列数
| 设备 | Services | FeaturedLawyers | UserReviews |
|------|----------|-----------------|-------------|
| 移动端 | 2 列 | 2 列 | 1 列 |
| 平板端 | 3 列 | 3 列 | 2 列 |
| 桌面端 | 6 列 | 6 列 | 3 列 |

---

## 🔧 快速修改

### 修改促销内容
编辑 `src/components/home/Promotions.tsx` 中的数据：
```tsx
{/* 闪购 */}
<div className="...">
  <h3 className="...">闪购专场</h3>
  <p className="...">首次咨询 <span className="...">5折</span></p>
</div>
```

### 修改律师数据
编辑 `src/components/home/FeaturedLawyers.tsx` 中的 `lawyers` 数组：
```tsx
const lawyers = [
  {
    id: 1,
    name: "律师名字",
    specialty: "专业领域",
    rating: 4.9,
    // ... 其他字段
  },
  // ...
];
```

### 修改筛选选项
编辑 `src/components/home/SearchFilters.tsx` 中的筛选数据：
```tsx
{[
  { label: "全部", value: "all" },
  { label: "¥0-500", value: "0-500" },
  // ... 其他选项
].map(option => (
  // ...
))}
```

---

## 📊 页面结构

```
首页 (page.tsx)
├── Header
├── Hero (轮播 + 分类)
├── Promotions (闪购 + 优惠)
├── SearchFilters (搜索 + 筛选)
├── Services (服务分类)
├── FeaturedLawyers (热销律师)
├── UserReviews (用户评价) ⭐ 新增
├── Testimonials (客户评价)
├── BlogSection
├── FAQ
├── CTA
└── Footer
```

---

## 🚀 部署检查清单

- [ ] 所有组件无编译错误
- [ ] 响应式设计在各设备上正常显示
- [ ] 所有链接正确指向
- [ ] 图标正确显示
- [ ] 颜色方案一致
- [ ] 文本内容准确
- [ ] 按钮功能正常
- [ ] 性能优化完成

---

## 💡 最佳实践

1. **保持一致性**: 所有卡片使用相同的设计语言
2. **信息层级**: 重要信息优先显示
3. **视觉反馈**: 悬停、点击等交互反馈
4. **移动优先**: 先设计移动端，再扩展到桌面端
5. **性能优化**: 使用 Next.js 图片优化、代码分割等

---

## 📞 常见问题

**Q: 如何修改颜色方案？**
A: 编辑 `tailwind.config.ts` 中的 `colors` 配置。

**Q: 如何添加更多律师？**
A: 在 `FeaturedLawyers.tsx` 中的 `lawyers` 数组添加新对象。

**Q: 如何修改促销内容？**
A: 编辑 `Promotions.tsx` 中的相应部分。

**Q: 如何实现购物车功能？**
A: 需要添加状态管理（Context/Redux）和后端 API。

---

## 📈 下一步

1. 集成状态管理（Context API 或 Redux）
2. 连接后端 API
3. 实现用户认证
4. 添加支付集成
5. 性能监控和优化

---

**版本**: 1.0
**最后更新**: 2024-01-15
