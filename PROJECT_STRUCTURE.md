# 项目结构说明

## 目录结构

```
malaysia-legal-consultation/
├── app/                      # Next.js 应用目录（App Router）
│   ├── layout.tsx           # 根布局组件
│   ├── page.tsx             # 首页
│   ├── globals.css          # 全局样式
│   ├── lawyers/             # 律师相关页面（待开发）
│   ├── booking/             # 预约相关页面（待开发）
│   └── dashboard/           # 用户面板（待开发）
│
├── components/              # 可复用的 React 组件
│   ├── Header.tsx          # 网站头部导航
│   ├── Footer.tsx          # 网站底部
│   ├── Hero.tsx            # 首页英雄区块
│   ├── Features.tsx        # 功能特性展示
│   ├── HowItWorks.tsx      # 使用流程说明
│   ├── TopLawyers.tsx      # 顶尖律师展示
│   ├── Testimonials.tsx    # 客户评价
│   └── CTA.tsx             # 行动号召区块
│
├── lib/                     # 工具函数和配置
│   ├── utils.ts            # 通用工具函数
│   └── constants.ts        # 常量定义
│
├── types/                   # TypeScript 类型定义
│   └── index.ts            # 主要类型接口
│
├── public/                  # 静态资源
│   └── favicon.ico         # 网站图标
│
├── .env.example            # 环境变量示例
├── .gitignore              # Git 忽略文件配置
├── next.config.mjs         # Next.js 配置
├── tailwind.config.ts      # Tailwind CSS 配置
├── tsconfig.json           # TypeScript 配置
├── postcss.config.mjs      # PostCSS 配置
├── package.json            # 项目依赖和脚本
├── README.md               # 项目说明文档
├── INSTALLATION.md         # 安装指南
└── PROJECT_STRUCTURE.md    # 本文件
```

## 核心文件说明

### 配置文件

- **package.json**: 定义项目依赖、脚本命令和元数据
- **tsconfig.json**: TypeScript 编译器配置
- **tailwind.config.ts**: Tailwind CSS 自定义配置（颜色、主题等）
- **next.config.mjs**: Next.js 框架配置（图片域名、环境变量等）

### 应用目录 (app/)

采用 Next.js 14 的 App Router 架构：
- **layout.tsx**: 定义整个应用的布局结构（Header + 内容 + Footer）
- **page.tsx**: 首页路由，组合各个组件形成完整页面
- **globals.css**: 全局样式，包含 Tailwind 指令和自定义 CSS 类

### 组件目录 (components/)

所有可复用的 UI 组件：
- **Header.tsx**: 响应式导航栏，包含移动端菜单
- **Footer.tsx**: 网站底部，包含链接和社交媒体
- **Hero.tsx**: 首页主视觉区，包含搜索功能
- **Features.tsx**: 展示平台的 6 大核心特性
- **HowItWorks.tsx**: 4 步使用流程说明
- **TopLawyers.tsx**: 展示推荐律师卡片
- **Testimonials.tsx**: 客户评价展示
- **CTA.tsx**: 引导用户注册的行动号召

### 工具库 (lib/)

- **utils.ts**: 通用工具函数
  - 货币格式化
  - 日期时间处理
  - 文本截断
  - 时间段生成等

- **constants.ts**: 应用常量
  - 专业领域列表
  - 支持的语言
  - 马来西亚州属
  - 咨询类型
  - 支付方式

### 类型定义 (types/)

- **index.ts**: TypeScript 接口定义
  - Lawyer: 律师信息
  - User: 用户信息
  - Booking: 预约信息
  - Review: 评价信息
  - PracticeArea: 专业领域

## 技术栈

### 前端框架
- **Next.js 14**: React 框架，支持 SSR 和 SSG
- **React 18**: UI 库
- **TypeScript**: 类型安全的 JavaScript

### 样式方案
- **Tailwind CSS**: 实用优先的 CSS 框架
- **自定义 CSS 类**: 在 globals.css 中定义的可复用样式

### 图标库
- **React Icons**: 包含多种图标集的 React 组件

### 工具库
- **clsx**: 条件类名组合
- **date-fns**: 日期处理

## 开发规范

### 组件命名
- 使用 PascalCase（如 `TopLawyers.tsx`）
- 一个文件一个组件
- 组件名与文件名保持一致

### 样式规范
- 优先使用 Tailwind 实用类
- 复杂样式使用 `@layer components` 定义
- 响应式设计使用 Tailwind 断点（sm, md, lg, xl）

### TypeScript 规范
- 所有组件使用 TypeScript
- 定义清晰的接口和类型
- 避免使用 `any` 类型

## 待开发功能

### 第一阶段（当前）
- [x] 项目初始化
- [x] 首页设计
- [x] 基础组件开发

### 第二阶段
- [ ] 律师列表页面
- [ ] 律师详情页面
- [ ] 搜索和筛选功能
- [ ] 用户认证系统

### 第三阶段
- [ ] 预约系统
- [ ] 支付集成
- [ ] 用户面板
- [ ] 律师面板

### 第四阶段
- [ ] 在线咨询功能
- [ ] 评价系统
- [ ] 管理后台
- [ ] 移动端优化

## 扩展建议

### 添加新页面
在 `app/` 目录下创建新文件夹，例如：
```
app/
└── lawyers/
    ├── page.tsx          # /lawyers 路由
    └── [id]/
        └── page.tsx      # /lawyers/[id] 动态路由
```

### 添加新组件
在 `components/` 目录下创建新文件：
```typescript
export default function MyComponent() {
  return <div>My Component</div>;
}
```

### 添加 API 路由
在 `app/api/` 目录下创建路由处理器：
```typescript
// app/api/lawyers/route.ts
export async function GET() {
  return Response.json({ lawyers: [] });
}
```

## 性能优化建议

1. **图片优化**: 使用 Next.js `Image` 组件
2. **代码分割**: 使用动态导入 `dynamic()`
3. **缓存策略**: 配置适当的缓存头
4. **懒加载**: 非关键组件延迟加载

## 部署建议

### Vercel（推荐）
- 最简单的部署方式
- 自动 CI/CD
- 全球 CDN

### 其他平台
- Netlify
- AWS Amplify
- 自托管（Docker + Nginx）

## 资源链接

- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [TypeScript 文档](https://www.typescriptlang.org/docs)
