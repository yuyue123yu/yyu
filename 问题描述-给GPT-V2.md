# Next.js 14 + Supabase 管理员登录问题 - 第二次咨询

## 🔴 核心问题
使用 Next.js 14 App Router + Supabase Auth，管理员登录后**无法进入Dashboard**，总是被重定向回登录页。

---

## 📊 当前状态

### ✅ 已确认正常的部分
1. **Supabase Auth登录成功** - `signInWithPassword()` 返回成功，无错误
2. **数据库数据正确**：
   ```sql
   -- admin@legalmy.com 用户信息
   id: f7c0cfa1-6b96-4dd3-a0e2-b8bd745ad469
   email: admin@legalmy.com
   user_type: admin
   super_admin: true
   tenant_id: NULL
   ```
3. **RLS已禁用** - 执行了 `ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;`
4. **密码正确** - 在Supabase Dashboard手动设置的密码

### ❌ 问题现象
1. 在 `/admin/login-v2` 输入正确的邮箱密码
2. 点击登录，控制台显示"登录成功！跳转到 /admin-v2"
3. 页面跳转到 `/admin/login`（旧版登录页，不是 `/admin-v2`）
4. **即使禁用了RLS，问题依然存在**

---

## 🏗️ 技术架构

### 技术栈
- **Next.js**: 14.2.35 (App Router)
- **Supabase**: @supabase/supabase-js ^2.105.1, @supabase/ssr ^0.10.2
- **React**: 18.3.0

### 文件结构
```
src/
├── lib/
│   └── supabase/
│       ├── client.ts          # 客户端 Supabase
│       └── server.ts          # 服务端 Supabase (新建)
├── app/
│   ├── admin/
│   │   ├── login/page.tsx     # 旧版登录页
│   │   └── page.tsx           # 旧版Dashboard (Client Component)
│   ├── admin-v2/              # 新版 Server Component
│   │   ├── layout.tsx         # Server Component Layout
│   │   ├── AdminLayoutClient.tsx  # Client Component
│   │   └── page.tsx           # Server Component Dashboard
│   └── admin/login-v2/page.tsx    # 新版登录页
└── contexts/
    └── AuthContext.tsx        # 客户端Auth Context
```

---

## 📝 代码实现

### 1. 服务端 Supabase 客户端 (`src/lib/supabase/server.ts`)
```typescript
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
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // 在Server Component中可能无法设置cookie
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // 在Server Component中可能无法删除cookie
          }
        },
      },
    }
  );
}
```

### 2. 登录页面 (`src/app/admin/login-v2/page.tsx`)
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginV2Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: 'admin@legalmy.com',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const supabase = createClient();

    // 登录前先登出，确保账号切换安全
    await supabase.auth.signOut();

    // 登录
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      setError(authError.message);
      return;
    }

    // 登录成功，跳转到 Server Component 版本的 Dashboard
    console.log('登录成功！跳转到 /admin-v2');
    router.replace('/admin-v2');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 表单UI */}
    </form>
  );
}
```

### 3. Server Component Layout (`src/app/admin-v2/layout.tsx`)
```typescript
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminLayoutClient from './AdminLayoutClient';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  console.log('=== Admin-V2 Layout 权限检查 ===');
  console.log('Session:', session ? '存在' : '不存在');
  console.log('Session Error:', sessionError);
  
  // 服务端权限检查 - 无 race condition
  if (!session) {
    console.log('❌ 无Session，重定向到登录页');
    redirect('/admin/login-v2');
  }

  console.log('✅ Session存在，用户ID:', session.user.id);

  // 获取用户profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  console.log('Profile查询结果:', profile);
  console.log('Profile Error:', profileError);

  if (!profile) {
    console.log('❌ 未找到Profile，重定向到登录页');
    redirect('/admin/login-v2');
  }

  // 检查是否是管理员
  if (profile.user_type !== 'admin' && !profile.super_admin) {
    console.log('❌ 权限不足');
    redirect('/admin/login-v2');
  }

  console.log('✅ 权限验证通过！');

  return (
    <AdminLayoutClient user={session.user} profile={profile}>
      {children}
    </AdminLayoutClient>
  );
}
```

### 4. Server Component Dashboard (`src/app/admin-v2/page.tsx`)
```typescript
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login-v2');
  }

  // 服务端获取统计数据
  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  return (
    <div>
      <h1>仪表板</h1>
      <p>总用户数: {usersCount}</p>
    </div>
  );
}
```

---

## 🔍 已尝试的解决方案

### 方案1: 客户端改进（GPT第一次建议）
- ✅ 在Layout中等待 `loading` 完成再检查权限
- ✅ 登录前先 `signOut()` 确保账号切换安全
- ✅ 使用 `router.replace()` 而不是 `router.push()`
- ❌ **结果：失败，还是跳转回登录页**

### 方案2: Server Components（GPT第一次建议）
- ✅ 创建了 `src/lib/supabase/server.ts`
- ✅ 将 Layout 和 Dashboard 改为 Server Component
- ✅ 使用服务端 Session 验证，避免客户端 race condition
- ❌ **结果：失败，还是跳转回登录页**

### 方案3: 禁用RLS测试
- ✅ 执行了 `ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;`
- ✅ 确认 `rowsecurity = false`
- ❌ **结果：失败，还是跳转回登录页**

---

## 🤔 疑问点

1. **为什么登录成功后，`router.replace('/admin-v2')` 会跳转到 `/admin/login`？**
   - 控制台显示"跳转到 /admin-v2"
   - 但实际URL变成了 `/admin/login`（不是 `/admin-v2`）

2. **Server Component的Layout是否真的执行了？**
   - 添加了 `console.log` 但看不到服务端日志
   - 不确定Layout的权限检查是否被触发

3. **是否有其他中间件或重定向逻辑？**
   - 项目中是否有 `middleware.ts`？
   - 是否有其他全局的Auth检查？

4. **Supabase Cookie是否正确设置？**
   - 登录后Cookie是否存在？
   - Server Component能否读取到Cookie？

---

## ❓ 请GPT帮助

1. **诊断问题根源**：为什么登录成功后无法进入Dashboard？
2. **检查代码**：Server Component的实现是否有问题？
3. **提供解决方案**：如何修复这个登录跳转问题？

---

## 📌 补充信息

- **开发环境**: Windows, Node.js, npm run dev
- **浏览器**: Chrome (已尝试无痕模式)
- **Supabase项目**: 已确认连接正常，其他功能正常
- **之前的问题**: 曾经遇到过客户端 race condition 问题，GPT建议使用Server Components

---

## 🎯 期望结果

用户在 `/admin/login-v2` 登录成功后：
1. 能够成功跳转到 `/admin-v2`
2. 看到Dashboard界面
3. 不会被重定向回登录页
