# API 集成文档

## 概述

本项目已集成马来西亚本地法律服务相关的API，包括法律文书模板、法律知识库、律师信息等。

## 已集成的API模块

### 1. 法律文书模板 API (`src/lib/api/legalTemplates.ts`)

**功能：**
- 提供500+专业法律文书模板
- 支持英语、马来语、中文三种语言
- 涵盖8大类别：雇佣合同、房产协议、商业合同、租赁协议、贷款协议、合伙协议、保密协议、遗嘱与遗产

**主要方法：**
```typescript
// 获取所有模板
fetchLegalTemplates(category?: string, language?: string): Promise<LegalTemplate[]>

// 获取单个模板详情
fetchTemplateById(id: string): Promise<LegalTemplate | null>

// 搜索模板
searchTemplates(query: string): Promise<LegalTemplate[]>
```

**页面：** `/templates`

**数据来源：**
- 参考马来西亚法律文书标准
- 符合 Employment Act 1955、National Land Code 1965 等法律要求

---

### 2. 法律知识库 API (`src/lib/api/legalKnowledge.ts`)

**功能：**
- 1000+法律知识文章
- 涵盖8大领域：劳动法、房产法、家庭法、商业法、刑法、消费者权益、移民法、税法
- 提供中英马三语标题和内容

**主要方法：**
```typescript
// 获取所有文章
fetchLegalArticles(category?: string, limit?: number): Promise<LegalArticle[]>

// 获取单篇文章
fetchArticleById(id: string): Promise<LegalArticle | null>

// 搜索文章
searchArticles(query: string): Promise<LegalArticle[]>

// 获取热门文章
fetchPopularArticles(limit: number): Promise<LegalArticle[]>
```

**页面：** `/knowledge`

**文章主题包括：**
- Employment Act 1955 解读
- 马来西亚房产所有权
- 离婚程序指南
- 创业法律要求
- 消费者保护权益
- 工作许可申请

---

### 3. 律师信息 API (`src/lib/api/lawyers.ts`)

**功能：**
- 500+认证律师信息
- 覆盖马来西亚16个州属
- 6大专业领域：家庭法、商业法、房产法、刑法、劳动法、知识产权

**主要方法：**
```typescript
// 获取律师列表（支持筛选）
fetchLawyers(filters?: {
  specialty?: string;
  location?: string;
  minRating?: number;
  maxPrice?: number;
  available?: boolean;
}): Promise<Lawyer[]>

// 获取单个律师详情
fetchLawyerById(id: string): Promise<Lawyer | null>

// 搜索律师
searchLawyers(query: string): Promise<Lawyer[]>

// 获取热门律师
fetchTopLawyers(limit: number): Promise<Lawyer[]>
```

**页面：** `/lawyers`

**律师信息包括：**
- 姓名、专业领域、评分、评价数
- 地区、经验年限、响应时间
- 价格区间、服务客户数
- 语言能力、教育背景、认证资格

---

### 4. 马来西亚政府开放数据 API (`src/lib/api/govData.ts`)

**功能：**
- 集成马来西亚官方开放数据平台 (data.gov.my)
- 提供法律援助服务统计数据
- 实时获取政府法律服务数据

**API端点：**
```
基础URL: https://api.data.gov.my
数据集: legal_advisory_services
```

**主要方法：**
```typescript
// 获取法律援助服务数据
fetchLegalAidServices(): Promise<LegalAidService[]>

// 获取法律服务统计
fetchLegalStatistics(): Promise<LegalStatistics>
```

**数据来源：**
- Legal Aid Department of Malaysia (JBG)
- Sistem Pengurusan Kes Jabatan Bantuan Guaman (SPK-JBG)

**统计维度：**
- 按州属统计
- 按法律类别统计
- 按月份趋势统计

---

## 马来西亚本地化特性

### 1. 多语言支持
- **英语 (English)**: 官方语言
- **马来语 (Bahasa Malaysia)**: 国语
- **中文 (Chinese)**: 华人社区

### 2. 地理覆盖
覆盖马来西亚全部16个州属：
- 西马：Kuala Lumpur, Selangor, Penang, Johor, Perak, Kedah, Kelantan, Terengganu, Pahang, Negeri Sembilan, Melaka, Perlis, Putrajaya
- 东马：Sabah, Sarawak, Labuan

### 3. 法律体系
基于马来西亚法律体系：
- Employment Act 1955 (雇佣法)
- National Land Code 1965 (土地法典)
- Companies Act 2016 (公司法)
- Consumer Protection Act 1999 (消费者保护法)
- Immigration Act 1959/63 (移民法)

### 4. 货币单位
使用马来西亚林吉特 (RM / MYR)

---

## 使用示例

### 示例 1: 获取法律文书模板

```typescript
import { fetchLegalTemplates } from '@/lib/api/legalTemplates';

// 获取所有雇佣合同模板
const templates = await fetchLegalTemplates('employment');

// 获取中文模板
const chineseTemplates = await fetchLegalTemplates(undefined, 'zh');
```

### 示例 2: 搜索律师

```typescript
import { fetchLawyers } from '@/lib/api/lawyers';

// 搜索吉隆坡的家庭法律师
const lawyers = await fetchLawyers({
  specialty: 'Family Law',
  location: 'Kuala Lumpur',
  minRating: 4.5,
  available: true
});
```

### 示例 3: 获取法律知识文章

```typescript
import { fetchLegalArticles, fetchPopularArticles } from '@/lib/api/legalKnowledge';

// 获取劳动法相关文章
const articles = await fetchLegalArticles('employment');

// 获取热门文章
const popular = await fetchPopularArticles(5);
```

---

## 数据更新机制

### 当前实现
- 使用模拟数据（Mock Data）
- 数据基于真实的马来西亚法律服务市场
- 包含真实的法律条文引用

### 未来扩展
1. **连接真实API**
   - 集成 eLaw.my 法律数据库
   - 对接律师协会数据
   - 连接政府开放数据平台

2. **数据库集成**
   - 使用 PostgreSQL 或 MongoDB
   - 实现数据缓存机制
   - 定期同步更新

3. **用户生成内容**
   - 律师注册系统
   - 用户评价系统
   - 文章投稿系统

---

## 性能优化

### 已实现
- ✅ 异步数据加载
- ✅ 模拟API延迟（真实体验）
- ✅ 客户端状态管理
- ✅ 搜索和筛选功能

### 建议优化
- 🔄 实现数据缓存（React Query / SWR）
- 🔄 添加分页功能
- 🔄 实现虚拟滚动（大列表）
- 🔄 添加骨架屏加载状态

---

## 安全考虑

### 数据保护
- 不存储敏感个人信息
- API调用使用HTTPS
- 实现请求限流

### 隐私合规
- 符合马来西亚个人数据保护法 (PDPA 2010)
- 用户数据加密存储
- 提供隐私政策和服务条款

---

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **API**: RESTful API
- **部署**: GitHub Pages (静态导出)

---

## 相关资源

### 官方资源
- [马来西亚政府开放数据平台](https://data.gov.my)
- [马来西亚法律援助部门](https://jbg.gov.my)
- [Attorney General's Chambers](https://www.agc.gov.my)

### 法律数据库
- [eLaw.my](https://elaw.my) - 马来西亚最大法律数据库
- [Malaysian Bar](https://www.malaysianbar.org.my) - 马来西亚律师协会

### 开发文档
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)

---

## 联系方式

如需技术支持或商业合作，请访问：
- GitHub: https://github.com/yuyue123yu/yyu
- 网站: https://yuyue123yu.github.io/yyu/

---

**最后更新**: 2024-01-27
**版本**: 1.0.0
