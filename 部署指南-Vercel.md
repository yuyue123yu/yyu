# 🚀 Vercel 部署指南

## 📋 部署前准备

### 1. 确保所有代码已提交到 Git

```bash
git add .
git commit -m "准备上线：完成服务管理系统"
git push origin main
```

### 2. 准备环境变量

需要在 Vercel 中配置以下环境变量：

```env
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase Anon Key
```

---

## 🌐 Vercel 部署步骤

### 方法 1：通过 Vercel Dashboard（推荐）

1. **登录 Vercel**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击「Add New」→「Project」
   - 选择您的 GitHub 仓库
   - 点击「Import」

3. **配置项目**
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`（默认）
   - **Build Command**: `npm run build`（默认）
   - **Output Directory**: `.next`（默认）

4. **添加环境变量**
   - 点击「Environment Variables」
   - 添加：
     ```
     NEXT_PUBLIC_SUPABASE_URL = 你的URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY = 你的Key
     ```

5. **部署**
   - 点击「Deploy」
   - 等待 2-3 分钟
   - 部署完成！

---

### 方法 2：通过 Vercel CLI

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel

# 4. 添加环境变量
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# 5. 重新部署
vercel --prod
```

---

## 🔧 部署后配置

### 1. 配置自定义域名（可选）

1. 在 Vercel Dashboard 中打开项目
2. 点击「Settings」→「Domains」
3. 添加您的域名
4. 按照提示配置 DNS 记录

### 2. 配置 Supabase 允许的域名

1. 登录 Supabase Dashboard
2. 进入「Authentication」→「URL Configuration」
3. 添加您的 Vercel 域名到「Site URL」
4. 添加到「Redirect URLs」：
   ```
   https://your-domain.vercel.app/api/auth/callback
   https://your-domain.vercel.app/admin
   ```

### 3. 更新 Cookie 设置（生产环境）

确保 `src/app/api/auth/callback/route.ts` 中的 Cookie 设置正确：

```typescript
res.cookies.set('sb-access-token', access_token, {
  httpOnly: true,
  path: '/',
  sameSite: 'lax',
  secure: true, // 生产环境必须为 true
  maxAge: 60 * 60 * 24 * 7,
});
```

---

## ✅ 部署后验证

### 1. 访问前台网站
```
https://your-domain.vercel.app
```

**检查项**：
- [ ] 首页正常加载
- [ ] 服务卡片显示正确
- [ ] Logo 显示正确
- [ ] 语言切换正常

### 2. 访问 Admin 后台
```
https://your-domain.vercel.app/admin/login
```

**检查项**：
- [ ] 登录页面正常
- [ ] 能够成功登录
- [ ] 仪表板正常显示
- [ ] 服务管理页面正常
- [ ] 服务编辑功能正常

### 3. 测试账号切换

**步骤**：
1. 使用账号 A 登录
2. 查看服务列表
3. 退出登录
4. 使用账号 B 登录
5. 再次查看服务列表

**预期**：
- [ ] 账号 B 能正常登录
- [ ] 看到账号 B 的数据
- [ ] 没有账号 A 的数据残留

---

## 🐛 常见问题

### 问题 1：部署后 500 错误

**原因**：环境变量未配置

**解决**：
1. 检查 Vercel Dashboard 中的环境变量
2. 确保变量名正确（包括 `NEXT_PUBLIC_` 前缀）
3. 重新部署

### 问题 2：登录后重定向失败

**原因**：Supabase 未配置允许的域名

**解决**：
1. 在 Supabase Dashboard 中添加 Vercel 域名
2. 更新「Redirect URLs」
3. 清除浏览器缓存重试

### 问题 3：Cookie 无法写入

**原因**：生产环境未启用 HTTPS

**解决**：
1. 确保使用 Vercel 提供的 HTTPS 域名
2. 检查 Cookie 设置中 `secure: true`
3. 不要使用 HTTP 访问

### 问题 4：图片无法加载

**原因**：Supabase Storage 权限问题

**解决**：
1. 检查 Storage Bucket 的公开访问权限
2. 确认 RLS 策略允许公开读取
3. 验证图片 URL 是否正确

---

## 📊 性能优化

### 1. 启用 Vercel Analytics

```bash
npm install @vercel/analytics
```

```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. 启用图片优化

Next.js 自动优化图片，确保使用 `next/image`：

```typescript
import Image from 'next/image';

<Image 
  src={logoUrl} 
  alt="Logo" 
  width={150} 
  height={40}
  priority
/>
```

### 3. 启用缓存

API 路由添加缓存头：

```typescript
return NextResponse.json(data, {
  headers: {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  },
});
```

---

## 🔐 安全检查清单

- [ ] 环境变量不包含在代码中
- [ ] 生产环境使用 HTTPS
- [ ] Cookie 设置 `httpOnly: true`
- [ ] Cookie 设置 `secure: true`
- [ ] Supabase RLS 已启用
- [ ] API 路由有权限验证
- [ ] 敏感数据不在前端暴露

---

## 📈 监控和维护

### 1. Vercel 监控

- 访问 Vercel Dashboard 查看：
  - 部署状态
  - 访问量
  - 错误日志
  - 性能指标

### 2. Supabase 监控

- 访问 Supabase Dashboard 查看：
  - 数据库连接数
  - API 请求量
  - Storage 使用量
  - 错误日志

### 3. 定期备份

```sql
-- 定期导出重要数据
-- 在 Supabase SQL Editor 中执行

-- 备份服务数据
COPY (SELECT * FROM services) TO '/tmp/services_backup.csv' CSV HEADER;

-- 备份租户设置
COPY (SELECT * FROM tenant_settings) TO '/tmp/settings_backup.csv' CSV HEADER;
```

---

## 🎉 部署完成！

您的网站现在已经上线了！

**访问地址**：
- 前台：`https://your-domain.vercel.app`
- 后台：`https://your-domain.vercel.app/admin`

**下一步**：
1. 测试所有功能
2. 配置自定义域名
3. 设置监控和告警
4. 准备用户培训文档

祝您的项目成功！ 🚀
