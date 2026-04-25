# 马来西亚法律咨询平台 | Malaysia Legal Consultation Platform

现代化的在线法律咨询平台，为马来西亚用户提供便捷的法律服务。

## 功能特性

- 🔍 智能律师匹配系统
- 💬 在线即时咨询
- 📅 预约管理系统
- 📱 响应式设计（移动端优化）
- 🌐 多语言支持（马来语、英语、中文）
- 💳 本地化支付集成
- 🎥 视频咨询功能
- 📄 法律文档管理

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **状态管理**: React Context / Zustand
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **认证**: NextAuth.js
- **支付**: Stripe + iPay88

## 快速开始

### 前置要求

- Node.js 18+ 
- npm 或 yarn
- PostgreSQL 数据库

### 安装步骤

1. 克隆项目
```bash
git clone <repository-url>
cd malaysia-legal-consultation
```

2. 安装依赖
```bash
npm install
# 或
yarn install
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填入你的配置
```

4. 运行开发服务器
```bash
npm run dev
# 或
yarn dev
```

5. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 认证相关页面
│   ├── (main)/            # 主要页面
│   ├── api/               # API路由
│   └── layout.tsx         # 根布局
├── components/            # React组件
│   ├── common/           # 通用组件
│   ├── lawyer/           # 律师相关组件
│   ├── consultation/     # 咨询相关组件
│   └── layout/           # 布局组件
├── lib/                   # 工具函数和配置
├── types/                 # TypeScript类型定义
└── styles/               # 全局样式
```

## 开发指南

- 遵循 TypeScript 严格模式
- 使用 ESLint 进行代码检查
- 组件采用函数式编程
- 使用 Tailwind CSS 进行样式开发

## 部署

```bash
npm run build
npm run start
```

## 许可证

MIT
