---
name: Next.js + Supabase 认证系统调试技能
description: 解决 Next.js 13+ App Router 与 Supabase 认证系统的复杂问题，包括无限重定向、RLS 循环依赖、Session 管理等
tags: [nextjs, supabase, authentication, debugging, rls, server-components]
version: 1.0.0
created: 2026-05-05
---

# Next.js + Supabase 认证系统调试技能

## 📋 技能概述

本技能总结了在 Next.js 13+ App Router 环境下，使用 Supabase 构建认证系统时遇到的常见问题和解决方案。

---

## 🎯 核心问题类型

### 1. 无限重定向循环

**症状**：
- 访问受保护页面时出现 `ERR_TOO_MANY_REDIRECTS`
- 浏览器不断刷新
- 控制台显示大量重定向日志

**常见原因**：
- Layout 覆盖了登录页路径
- 权限检查逻辑错误
- Session 检查在错误的位置

**解决方案**：使用 Route Groups
```typescript
// 目录结构
src/app/super-admin/
├── (auth)/                    ← Route Group（带权限检查）
│   ├── layout.tsx             ← 权限检查 Layout
│   └── dashboard/
│       └── page.tsx           ← 受保护页面
└── login/
    └── page.tsx               ← 独立登录页（不受 Layout 保护）
```

**关键代码**：
```typescript
// src/app/super-admin/(auth)/layout.tsx
export default async function ProtectedLayout({ children }) {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/super-admin/login'); // 只重定向一次
  }
  
  return <>{children}</>;
}
```

---

### 2. RLS 策略循环依赖

**症状**：
- Session 存在但 Profile 无法读取
- 数据库查询返回 NULL
- 权限检查失败

**常见原因**：
```sql
-- ❌ 错误的 RLS 策略（循环依赖）
CREATE POLICY "super_admin_select_all" ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles  -- ❌ 这里又查询 profiles 表！
      WHERE id = auth.uid()
      AND super_admin = true
    )
  );
```

**执行流程**：
1. 查询 profiles 表
2. RLS 检查策略，需要查询 profiles 表确认 super_admin
3. 又触发 RLS 检查... **无限循环！**

**解决方案**：简化 RLS 策略
```sql
-- ✅ 正确的 RLS 策略（无循环依赖）
CREATE POLICY "simple_select_own" ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
```

**权限检查在应用层完成**：
```typescript
// Layout 中检查权限
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', session.user.id)
  .maybeSingle();

if (!profile?.super_admin) {
  redirect('/login');
}
```

---

### 3. Session 管理问题

**症状**：
- 登录成功但无法访问受保护页面
- 账号切换后权限混乱
- Cookie 写入失败

**核心原因**：
- Client Component 和 Server Component 的 Session 不同步
- Cookie 写入后 Server Component 读取不到
- 账号切换时旧 Session 未清理

**完整解决方案**：

#### 3.1 登录流程
```typescript
// src/app/super-admin/login/page.tsx
'use client';

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  const supabase = createClient();

  // 步骤1: 登录前先登出，清理旧 session
  await supabase.auth.signOut();

  // 步骤2: 登录新账号
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    setError(error?.message || '登录失败');
    return;
  }

  // 步骤3: 将 session 写入 HTTP-only Cookie
  await fetch('/api/auth/callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    }),
  });

  // 步骤4: 等待 Cookie 生效
  await new Promise(resolve => setTimeout(resolve, 100));

  // 步骤5: 硬刷新跳转（确保 Server Component 读取最新 Cookie）
  window.location.href = '/super-admin/dashboard';
};
```

#### 3.2 Cookie 写入 API
```typescript
// src/app/api/auth/callback/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { access_token, refresh_token } = await request.json();
  const cookieStore = await cookies();

  // 写入 HTTP-only Cookie
  cookieStore.set('sb-access-token', access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  cookieStore.set('sb-refresh-token', refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ success: true });
}
```

#### 3.3 Server-side Supabase Client
```typescript
// src/lib/supabase/server.ts
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // 优先读取自定义 cookie
          if (name === 'sb-access-token') {
            return cookieStore.get('sb-access-token')?.value;
          }
          if (name === 'sb-refresh-token') {
            return cookieStore.get('sb-refresh-token')?.value;
          }
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Server Component 中可能无法设置 cookie
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {}
        },
      },
    }
  );
}

// 别名导出，兼容旧代码
export const createClient = createServerClient;
```

---

## 🔍 调试技巧

### 1. 创建诊断页面
```typescript
// src/app/super-admin/debug-session/page.tsx
import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export default async function DebugSessionPage() {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  
  let profile = null;
  if (session) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();
    profile = data;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Session 诊断</h1>
      
      {/* Session 信息 */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Session</h2>
        {session ? (
          <pre>{JSON.stringify(session, null, 2)}</pre>
        ) : (
          <p className="text-red-600">❌ 没有 Session</p>
        )}
      </div>

      {/* Profile 信息 */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Profile</h2>
        {profile ? (
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        ) : (
          <p className="text-red-600">❌ 没有 Profile</p>
        )}
      </div>

      {/* Cookies 信息 */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Cookies</h2>
        <pre>{JSON.stringify(allCookies, null, 2)}</pre>
      </div>

      {/* 权限检查结果 */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">权限检查</h2>
        <p>Session 存在: {session ? '✅' : '❌'}</p>
        <p>Profile 存在: {profile ? '✅' : '❌'}</p>
        <p>Super Admin: {profile?.super_admin ? '✅' : '❌'}</p>
      </div>
    </div>
  );
}
```

### 2. 添加详细日志
```typescript
// 在关键步骤添加日志
console.log('🔄 开始登出...');
await supabase.auth.signOut();
console.log('✅ 登出成功');

console.log('🔐 开始登录...');
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
console.log('✅ 登录成功:', data.session.user.email);

console.log('📝 写入 Cookie...');
await fetch('/api/auth/callback', { ... });
console.log('✅ Cookie 写入成功');
```

### 3. 使用浏览器开发工具
- **Application 标签**：查看 Cookies 和 LocalStorage
- **Network 标签**：查看 API 请求和响应
- **Console 标签**：查看日志和错误

---

## 🎯 最佳实践

### 1. 权限检查
- ✅ 使用 Server Component 进行权限检查（更安全）
- ✅ 使用 Route Groups 分离登录页和受保护页面
- ✅ 在 Layout 中统一进行权限检查

### 2. Session 管理
- ✅ 登录前先 signOut（避免 session 混淆）
- ✅ 使用 HTTP-only Cookies（防止 XSS 攻击）
- ✅ 使用 window.location.href 硬刷新跳转（确保 Server Component 读取最新 Cookie）

### 3. RLS 策略
- ✅ 避免循环依赖（不要在 RLS 策略中查询同一张表）
- ✅ 使用简单的策略（auth.uid() = id）
- ✅ 权限检查在应用层完成

### 4. 错误处理
- ✅ 添加详细的错误日志
- ✅ 创建诊断页面
- ✅ 提供友好的错误提示

---

## 🚨 常见陷阱

### 1. 不要混用 Client 和 Server Session
```typescript
// ❌ 错误：在 Server Component 中使用 Client Session
'use client';
const { data: { session } } = await supabase.auth.getSession(); // Client Session

// ✅ 正确：在 Server Component 中使用 Server Session
const supabase = await createServerClient(); // Server Client
const { data: { session } } = await supabase.auth.getSession(); // Server Session
```

### 2. 不要忘记等待 Cookie 生效
```typescript
// ❌ 错误：立即跳转
await fetch('/api/auth/callback', { ... });
router.push('/dashboard'); // Cookie 可能还没生效

// ✅ 正确：等待 Cookie 生效
await fetch('/api/auth/callback', { ... });
await new Promise(resolve => setTimeout(resolve, 100));
window.location.href = '/dashboard'; // 硬刷新
```

### 3. 不要在 RLS 策略中查询同一张表
```typescript
// ❌ 错误：循环依赖
CREATE POLICY "check_admin" ON profiles
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

// ✅ 正确：简单策略
CREATE POLICY "select_own" ON profiles
  USING (auth.uid() = id);
```

---

## 📚 相关资源

### 官方文档
- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)

### 工具
- [Supabase Studio](https://supabase.com/dashboard) - 数据库管理
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - 浏览器调试

---

## 🎓 学到的经验

### 1. 系统性排查问题
- 从现象到原因，逐步缩小范围
- 使用诊断工具确认每个环节
- 不要猜测，要验证

### 2. 理解底层原理
- Server Component vs Client Component
- Cookie vs LocalStorage
- RLS 策略执行流程

### 3. 保持耐心和坚持
- 复杂问题需要时间
- 每个小进展都是成功
- 不要放弃，总有解决方案

---

## 🚀 未来优化方向

### 1. 使用 JWT 自定义声明
```sql
-- 在 RLS 策略中使用 JWT
CREATE POLICY "jwt_based_admin" ON profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id 
    OR (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );
```

### 2. 添加 Session 刷新机制
```typescript
// 自动刷新 Session
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        // 更新 Cookie
        await fetch('/api/auth/callback', {
          method: 'POST',
          body: JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          }),
        });
      }
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

### 3. 添加 2FA（双因素认证）
- 使用 TOTP 或 SMS 验证
- 提高账号安全性

---

**版本**：1.0.0  
**创建日期**：2026-05-05  
**最后更新**：2026-05-05  
**适用场景**：Next.js 13+ App Router + Supabase 认证系统
