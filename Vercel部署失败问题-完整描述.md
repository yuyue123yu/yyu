# Vercel 部署失败问题 - 完整描述

## 📋 项目信息

- **项目类型**：Next.js 14.2.35 + Supabase
- **部署平台**：Vercel
- **GitHub 仓库**：yuyue123yu/yyu
- **分支**：main

---

## ❌ 主要错误

### 1. 静态页面生成超时（核心问题）

**错误信息：**
```
Error: Static page generation for /_not-found is still timing out after 3 attempts.
⚠ Restarted static page generation for [页面] because it took more than 60 seconds
```

**影响范围：**
- 所有页面（149 个页面）都超时
- 包括：主页、admin 页面、super-admin 页面、API 路由等

---

### 2. 动态服务器使用错误

**错误信息：**
```
Error: Dynamic server usage: Route /api/public/services couldn't be rendered statically because it used `cookies`.
```

**受影响的 API 路由：**
- `/api/public/services`
- `/api/public/tenant-config`
- `/api/tenant/branding`
- `/api/tenant/content`
- `/api/tenant/domain`
- `/api/tenant/features`
- `/api/tenant/notifications`
- `/api/tenant/pricing`
- `/api/tenant/seo`
- `/api/tenant/users`

**原因：**
这些 API 路由使用了 `cookies()`，但 Next.js 试图静态生成它们。

---

### 3. 事件处理器传递错误

**错误信息：**
```
Error: Event handlers cannot be passed to Client Component props.
{onClick: function onClick, className: ..., children: ...}
            ^^^^^^^^^^^^^^^^
If you need interactivity, consider converting part of this to a Client Component.
```

**影响：**
某些组件将事件处理器传递给了客户端组件。

---

## 🔧 已尝试的修复

### 修复 1：移除 standalone 输出模式

**修改文件：** `next.config.mjs`

**修改前：**
```javascript
const nextConfig = {
  output: 'standalone',  // Docker 专用
  // ...
};
```

**修改后：**
```javascript
const nextConfig = {
  // 移除了 output: 'standalone'
  // Vercel 不需要这个配置
  // ...
};
```

---

### 修复 2：增加静态页面生成超时时间

**修改文件：** `next.config.mjs`

**添加：**
```javascript
const nextConfig = {
  experimental: {
    staticPageGenerationTimeout: 180,  // 从 60 秒增加到 180 秒
  },
  // ...
};
```

---

### 修复 3：创建 API 路由配置文件

**新建文件：** `src/app/api/route-config.ts`

```typescript
// 全局 API 路由配置
// 强制所有 API 路由为动态渲染
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
```

**注意：** 这个文件创建了，但可能没有被正确应用到所有 API 路由。

---

## 📊 完整的构建日志（关键部分）

### 构建开始
```
22:59:05.777 Running build in Washington, D.C., USA (East) – iad1
22:59:06.777 Running "vercel build"
22:59:08.213 Running "install" command: `npm install`...
22:59:30.564 added 499 packages, and audited 500 packages in 22s
22:59:30.744 Detected Next.js version: 14.2.35
22:59:30.745 Running "npm run build"
22:59:31.496    Creating an optimized production build ...
23:00:06.601  ✓ Compiled successfully
23:00:06.603    Linting and checking validity of types ...
23:00:19.949    Collecting page data ...
23:00:22.043    Generating static pages (0/149) ...
```

### 动态服务器错误
```
23:00:24.832 獲取服務列表失敗: n [Error]: Dynamic server usage: Route /api/public/services couldn't be rendered statically because it used `cookies`.
23:00:24.864 获取租户配置失败: n [Error]: Dynamic server usage: Route /api/public/tenant-config couldn't be rendered statically because it used `cookies`.
23:00:25.709 Error in GET /api/tenant/branding: n [Error]: Dynamic server usage...
23:00:26.023 Error in GET /api/tenant/content: n [Error]: Dynamic server usage...
23:00:26.088 Error in GET /api/tenant/domain: n [Error]: Dynamic server usage...
23:00:26.225 Error in GET /api/tenant/features: n [Error]: Dynamic server usage...
23:00:26.265 Error in GET /api/tenant/notifications: n [Error]: Dynamic server usage...
23:00:26.337 Error in GET /api/tenant/pricing: n [Error]: Dynamic server usage...
23:00:26.364 Error in GET /api/tenant/seo: n [Error]: Dynamic server usage...
23:00:26.699 Error fetching users: n [Error]: Dynamic server usage: Route /api/tenant/users...
```

### 事件处理器错误
```
23:00:26.784 Error: Event handlers cannot be passed to Client Component props.
  {onClick: function onClick, className: ..., children: ...}
            ^^^^^^^^^^^^^^^^
If you need interactivity, consider converting part of this to a Client Component.
```

### 超时警告（60 秒后）
```
23:01:26.754  ⚠ Sending SIGTERM signal to Next.js build worker due to timeout of 60 seconds.
23:01:26.770  ⚠ Restarted static page generation for /_not-found because it took more than 60 seconds
23:01:26.771  ⚠ Restarted static page generation for /admin/users/sub-accounts because it took more than 60 seconds
23:01:26.772  ⚠ Restarted static page generation for /settings/security because it took more than 60 seconds
... (所有 149 个页面都超时)
```

### 最终失败
```
23:03:26.806  ⚠ Sending SIGTERM signal to Next.js build worker due to timeout of 60 seconds. (第 3 次)
23:03:26.825 > Build error occurred
23:03:26.826 Error: Static page generation for /_not-found is still timing out after 3 attempts.
23:03:26.869 Error: Command "npm run build" exited with 1
```

---

## 🔍 问题分析

### 根本原因

1. **API 路由配置问题**
   - 多个 API 路由使用了 `cookies()`
   - 但没有配置 `export const dynamic = 'force-dynamic'`
   - Next.js 试图静态生成这些动态路由

2. **页面生成超时**
   - 由于 API 路由错误，导致页面数据获取失败
   - 页面生成卡住，超过 60 秒超时
   - 重试 3 次后最终失败

3. **组件架构问题**
   - 某些组件将事件处理器传递给客户端组件
   - 违反了 Next.js 的服务端/客户端组件规则

---

## 💡 建议的解决方案

### 方案 1：为所有 API 路由添加动态配置（推荐）

在每个使用 `cookies()` 的 API 路由文件顶部添加：

```typescript
// 例如：src/app/api/public/services/route.ts
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  // ... 现有代码
}
```

**需要修改的文件列表：**
- `src/app/api/public/services/route.ts`
- `src/app/api/public/tenant-config/route.ts`
- `src/app/api/tenant/branding/route.ts`
- `src/app/api/tenant/content/route.ts`
- `src/app/api/tenant/domain/route.ts`
- `src/app/api/tenant/features/route.ts`
- `src/app/api/tenant/notifications/route.ts`
- `src/app/api/tenant/pricing/route.ts`
- `src/app/api/tenant/seo/route.ts`
- `src/app/api/tenant/users/route.ts`
- 以及所有其他使用 `cookies()` 的 API 路由

---

### 方案 2：全局配置动态路由

在 `next.config.mjs` 中添加：

```javascript
const nextConfig = {
  // ... 现有配置
  
  // 强制所有 /api 路由为动态
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};
```

**注意：** 这个方法可能不够，仍然需要在路由文件中添加 `export const dynamic = 'force-dynamic'`。

---

### 方案 3：修复事件处理器问题

找到传递 `onClick` 等事件处理器给客户端组件的地方，确保：

1. 父组件是客户端组件（添加 `'use client'`）
2. 或者将事件处理逻辑移到客户端组件内部

---

## 📁 当前配置文件

### next.config.mjs（当前版本）

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel 部署配置
  reactStrictMode: true,
  
  // 图片优化配置
  images: {
    unoptimized: true,
  },
  
  // 实验性功能
  experimental: {
    // 跳过静态生成错误
    staticPageGenerationTimeout: 180,
  },
  
  // TypeScript 和 ESLint 配置
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // 本地开发时注释掉 basePath
  // basePath: '/yyu',
  // assetPrefix: '/yyu/',
  
  // 安全 Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "img-src 'self' https: data: blob:",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
              "frame-ancestors 'none'",
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### package.json

```json
{
  "name": "malaysia-legal-consultation",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@heroicons/react": "^2.2.0",
    "@supabase/ssr": "^0.10.2",
    "@supabase/supabase-js": "^2.105.1",
    "@types/node": "^20.12.0",
    "@types/qrcode": "^1.5.6",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.0",
    "clsx": "^2.1.0",
    "jspdf": "^4.2.1",
    "lucide-react": "^0.378.0",
    "next": "^14.2.0",
    "otpauth": "^9.5.1",
    "postcss": "^8.4.0",
    "qrcode": "^1.5.4",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-icons": "^5.6.0",
    "recharts": "^3.8.1",
    "resend": "^6.12.2",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.4.0"
  }
}
```

---

## 🎯 优先级建议

### 高优先级（必须修复）
1. ✅ 为所有使用 `cookies()` 的 API 路由添加 `export const dynamic = 'force-dynamic'`
2. ✅ 确保超时时间足够（已设置为 180 秒）

### 中优先级（建议修复）
3. 🔶 修复事件处理器传递问题
4. 🔶 优化页面生成性能

### 低优先级（可选）
5. 🔹 添加更详细的错误日志
6. 🔹 优化构建配置

---

## 📞 环境信息

- **Node.js 版本**：（从构建日志看应该是 20.x）
- **Next.js 版本**：14.2.35
- **Vercel 区域**：Washington, D.C., USA (East) – iad1
- **构建时间**：约 4 分钟后超时失败

---

## 🔗 相关链接

- **Next.js 动态路由文档**：https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-functions
- **Vercel 部署文档**：https://vercel.com/docs/deployments/overview
- **静态生成超时文档**：https://nextjs.org/docs/messages/static-page-generation-timeout

---

## ❓ 需要帮助的问题

1. **如何批量为所有 API 路由添加动态配置？**
   - 是否有全局配置方法？
   - 或者需要逐个文件修改？

2. **事件处理器错误的具体位置？**
   - 错误日志没有指出具体的文件和行号
   - 如何快速定位问题组件？

3. **为什么本地构建成功，Vercel 失败？**
   - 本地 `npm run build` 可以成功
   - 但 Vercel 上会超时

---

**创建时间**：2026-05-08
**最后更新**：2026-05-08
