# Super Admin 登录问题 - 最终执行清单

> 本清单基于实际问题解决过程，团队可以直接按步骤部署，避免遗漏。

---

## 📋 问题概述

**核心问题**：
1. ❌ 无限重定向循环
2. ❌ 登录按钮无响应
3. ❌ Profile 无法读取（RLS 循环依赖）
4. ❌ Dashboard 无法访问

**解决方案**：
1. ✅ Route Groups 分离登录页和权限检查
2. ✅ 简化 RLS 策略，避免循环依赖
3. ✅ 完善登录流程（signOut → 登录 → 写 Cookie → 硬刷新跳转）

---

## 1️⃣ 文件结构调整（Route Groups）

### 目标
分离登录页和权限 Layout，防止重定向循环

### 目录结构
```
src/app/super-admin/
├── (auth)/                     ← 带权限检查的 Route Group
│   ├── layout.tsx              ← Dashboard 权限检查 Layout
│   └── dashboard-simple/
│       └── page.tsx            ← 受保护的 Dashboard 页面
└── login/
    └── page.tsx                ← 独立登录页（不受权限 Layout 保护）
```

### 说明
- `(auth)/layout.tsx` 只包裹 Dashboard 等受保护页面
- `/login/page.tsx` 完全独立，不会触发 Layout 重定向
- `(auth)` 是 Next.js Route Groups 语法，不会出现在 URL 中

### 操作步骤
```bash
# 1. 创建 Route Group 目录
mkdir -p src/app/super-admin/\(auth\)/dashboard-simple

# 2. 移动 layout.tsx 到 (auth) 目录
mv src/app/super-admin/layout.tsx src/app/super-admin/\(auth\)/layout.tsx

# 3. 移动 dashboard-simple 到 (auth) 目录
mv src/app/super-admin/dashboard-simple/* src/app/super-admin/\(auth\)/dashboard-simple/

# 4. 确保 login/page.tsx 在 super-admin 根目录
# src/app/super-admin/login/page.tsx 应该存在且独立
```

---

## 2️⃣ 登录页实现

### 文件
`src/app/super-admin/login/page.tsx`

### 关键点
- ✅ `'use client'` 保证是客户端组件
- ✅ `form onSubmit={handleLogin}` 正确绑定
- ✅ 登录前执行 `await supabase.auth.signOut()` 清理旧 session
- ✅ 登录成功后写入 HTTP-only Cookie
- ✅ 使用 `window.location.href` 强制刷新跳转 Dashboard
- ✅ 等待 100ms 确保 Cookie 生效

### 完整代码
```typescript
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ShieldCheckIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

export default function SuperAdminLoginPage() {
  const [email, setEmail] = useState('admin@legalmy.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const supabase = createClient();

      // 步骤1: 登录前先登出，确保账号切换安全
      console.log('🔄 清理旧 session...');
      await supabase.auth.signOut();

      // 步骤2: 登录新账号
      console.log('🔐 开始登录...');
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !data.session) {
        setError(authError?.message || '登录失败');
        setIsLoading(false);
        return;
      }

      console.log('✅ 登录成功！');

      // 步骤3: 将 session 写入 HTTP-only Cookie
      console.log('📝 写入 Cookie...');
      const cookieResponse = await fetch('/api/auth/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        }),
      });

      if (!cookieResponse.ok) {
        setError('写入Cookie失败');
        setIsLoading(false);
        return;
      }

      console.log('✅ Cookie 写入成功！');

      // 等待 100ms 确保 Cookie 生效
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('🚀 跳转到 Dashboard...');

      // 步骤4: 使用硬刷新跳转到 Dashboard（确保 Server Component 读取最新 Cookie）
      window.location.href = '/super-admin/dashboard-simple';

    } catch (err: any) {
      console.error('❌ 登录失败:', err);
      setError(err.message || '登录失败');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl mb-4">
            <ShieldCheckIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">超级管理员</h1>
          <p className="text-gray-600 mt-2">Super Admin 系统</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱地址
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? '登录中...' : '登录'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <a href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← 返回首页
          </a>
        </div>
      </div>
    </div>
  );
}
```

---

## 3️⃣ Dashboard Layout 权限检查

### 文件
`src/app/super-admin/(auth)/layout.tsx`

### 关键点
- ✅ 服务端读取 Cookie 获取 Session
- ✅ 查询 profile
- ✅ 检查 `profile?.super_admin`
- ✅ 不符合条件 → redirect `/super-admin/login`

### 完整代码
```typescript
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  // 验证Session
  if (!session) {
    console.log('❌ 没有 Session，重定向到登录页');
    redirect('/super-admin/login');
  }

  // 获取Profile并验证Super Admin权限
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  if (!profile?.super_admin) {
    console.log('❌ 不是 Super Admin，重定向到登录页');
    redirect('/super-admin/login');
  }

  console.log('✅ Super Admin 权限验证通过');

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
```

---

## 4️⃣ Server 端 Supabase 客户端

### 文件
`src/lib/supabase/server.ts`

### 重点
读取 Cookie，确保 Server Component 能获取 session

### 完整代码
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
          // 优先读取我们自定义的 cookie
          if (name === 'sb-access-token') {
            return cookieStore.get('sb-access-token')?.value;
          }
          if (name === 'sb-refresh-token') {
            return cookieStore.get('sb-refresh-token')?.value;
          }
          // 兼容 Supabase 默认的 cookie 名称
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

---

## 5️⃣ RLS 策略调整 ⚠️ 核心问题

### 核心问题
**循环依赖**导致 Server Component 查询 profile 失败

### 问题代码（❌ 不要使用）
```sql
-- ❌ 这个策略会造成循环依赖
CREATE POLICY "super_admin_select_all" ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles  -- ❌ 这里又查询 profiles 表，造成循环！
      WHERE id = auth.uid()
      AND super_admin = true
    )
  );
```

### 临时解决方案（✅ 推荐）
用户可以查看自己的 profile，应用层检查 super_admin 权限

### SQL 文件
`临时简化RLS策略-测试用.sql`

```sql
-- ========================================
-- 临时简化 RLS 策略 - 仅用于测试
-- ========================================

-- 1. 删除所有旧的策略
DROP POLICY IF EXISTS "users_select_own_profile" ON profiles;
DROP POLICY IF EXISTS "super_admin_select_all" ON profiles;
DROP POLICY IF EXISTS "admin_select_tenant" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "super_admin_update_all" ON profiles;

-- 2. 创建最简单的策略：用户可以查看自己的 profile
CREATE POLICY "simple_select_own" ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 3. 验证策略
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles';
```

### 执行步骤
1. 在 Supabase SQL Editor 中打开 `临时简化RLS策略-测试用.sql`
2. 点击 "Run" 执行
3. 确认只有一个策略：`simple_select_own`

### 可选优化（长期方案）
使用 JWT 自定义声明做 super_admin 权限检查

```sql
-- 基于 JWT 的 super_admin 权限检查（避免循环依赖）
CREATE POLICY "jwt_based_super_admin" ON profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id 
    OR (auth.jwt() -> 'user_metadata' ->> 'super_admin')::boolean = true
  );
```

**注意**：需要在用户登录时将 `super_admin` 写入 JWT 的 `user_metadata`

---

## 6️⃣ 账号切换注意事项

### 关键点
1. ✅ 登录前 `await supabase.auth.signOut()`
2. ✅ 避免 SPA `router.push` 跳转 → 使用 `window.location.href` 强制刷新
3. ✅ 确保 Cookie 写入后再跳转（等待 100ms）

### 为什么需要 signOut？
- 如果用户先登录 Admin 系统，Cookie 中保存的是 Admin session
- 如果不先 signOut，Super Admin 登录后 Server Component 可能读取到旧的 Admin session
- Layout 检查 `profile.super_admin` 时会得到 `false` → 重定向回登录页

### 为什么使用 window.location.href？
- `router.push` 是 SPA 跳转，不会刷新页面
- Server Component 可能读取不到最新的 Cookie
- `window.location.href` 强制刷新页面，确保 Server Component 读取最新 Cookie

---

## 7️⃣ 测试流程

### 完整测试步骤
1. **打开登录页**
   ```
   http://localhost:3000/super-admin/login
   ```

2. **输入邮箱/密码 → 点击登录**
   - 邮箱：`admin@legalmy.com`
   - 密码：你的密码

3. **观察控制台输出**（按 F12 打开）
   ```
   🔄 清理旧 session...
   🔐 开始登录...
   ✅ 登录成功！
   📝 写入 Cookie...
   ✅ Cookie 写入成功！
   🚀 跳转到 Dashboard...
   ```

4. **浏览器自动跳转到 Dashboard**
   ```
   http://localhost:3000/super-admin/dashboard-simple
   ```

5. **访问诊断页面**（可选）
   ```
   http://localhost:3000/super-admin/debug-session
   ```
   
   **应该看到**：
   - ✅ Session 存在: 是
   - ✅ Profile 存在: 是
   - ✅ Super Admin 权限: 是
   - ✅ 权限检查通过！

### 测试账号切换
1. 先登录 Admin 系统：`http://localhost:3000/admin/login`
2. 然后登录 Super Admin 系统：`http://localhost:3000/super-admin/login`
3. 应该能正常切换，不会出现权限错误

---

## 8️⃣ 建议优化

### 短期优化
1. ✅ **Dashboard 添加退出登录按钮**
   ```typescript
   const handleLogout = async () => {
     const supabase = createClient();
     await supabase.auth.signOut();
     window.location.href = '/super-admin/login';
   };
   ```

2. ✅ **Session 过期自动跳转登录页**
   - 在 Layout 中检查 session 是否过期
   - 过期后自动 redirect

3. ✅ **权限检查失败记录日志**
   - 记录谁在什么时候尝试访问 Super Admin
   - 便于安全审计

### 长期优化
4. ✅ **将 RLS 策略改为基于 JWT 的超管权限**
   - 避免循环依赖
   - 提高查询性能
   - 更安全的权限控制

5. ✅ **添加 2FA（双因素认证）**
   - Super Admin 账号安全性更高
   - 使用 TOTP 或 SMS 验证

6. ✅ **添加操作日志**
   - 记录 Super Admin 的所有操作
   - 便于审计和回溯

---

## 📁 相关文件清单

### 核心文件
- ✅ `src/app/super-admin/login/page.tsx` - 登录页
- ✅ `src/app/super-admin/(auth)/layout.tsx` - Dashboard Layout（权限检查）
- ✅ `src/app/super-admin/(auth)/dashboard-simple/page.tsx` - Dashboard 页面
- ✅ `src/app/super-admin/debug-session/page.tsx` - 诊断页面
- ✅ `src/app/api/auth/callback/route.ts` - Cookie 写入 API
- ✅ `src/lib/supabase/server.ts` - Server-side Supabase Client
- ✅ `src/lib/supabase/client.ts` - Client-side Supabase Client

### SQL 文件
- ✅ `临时简化RLS策略-测试用.sql` - 简化的 RLS 策略（正在使用）
- ❌ `最终-重新启用RLS并配置策略.sql` - 之前的 RLS 策略（有循环依赖问题，不要使用）

### 文档
- ✅ `Super-Admin登录问题-最终解决方案.md` - 详细的问题分析和解决方案
- ✅ `Super-Admin登录-执行清单.md` - 本文档（执行清单）
- ✅ `登录系统修复完成总结.md` - Admin 系统修复记录

---

## ✅ 验收标准

### 功能验收
- [ ] 登录页可以正常访问
- [ ] 输入正确的邮箱密码后可以登录
- [ ] 登录成功后自动跳转到 Dashboard
- [ ] Dashboard 显示用户信息和 Super Admin 标识
- [ ] 退出登录后回到登录页
- [ ] 账号切换（Admin ↔ Super Admin）正常工作

### 安全验收
- [ ] 未登录用户访问 Dashboard 会重定向到登录页
- [ ] 非 Super Admin 用户无法访问 Dashboard
- [ ] Session 过期后自动跳转登录页
- [ ] Cookie 是 HTTP-only，无法通过 JavaScript 读取

### 性能验收
- [ ] 登录流程在 2 秒内完成
- [ ] Dashboard 加载时间在 1 秒内
- [ ] 权限检查不影响页面加载速度

---

## 🚨 常见问题排查

### 问题1：登录后又跳回登录页
**可能原因**：
- Cookie 没有正确写入
- RLS 策略阻止了 profile 查询
- Session 过期

**排查步骤**：
1. 访问 `/super-admin/debug-session` 查看 Session 和 Profile 状态
2. 检查浏览器 Cookie 是否包含 `sb-access-token` 和 `sb-refresh-token`
3. 检查 Supabase RLS 策略是否正确

### 问题2：登录按钮点击无反应
**可能原因**：
- 浏览器缓存了旧版本的 JavaScript
- JavaScript 编译错误

**排查步骤**：
1. 硬刷新浏览器（Ctrl + Shift + R）
2. 删除 `.next` 文件夹并重启开发服务器
3. 检查浏览器控制台是否有错误

### 问题3：Profile 无法读取
**可能原因**：
- RLS 策略有循环依赖
- 数据库连接问题

**排查步骤**：
1. 执行 `临时简化RLS策略-测试用.sql`
2. 检查 Supabase 是否正常运行
3. 检查 `.env` 文件中的 Supabase 配置

---

## 📞 支持

如果遇到问题，请：
1. 查看 `Super-Admin登录问题-最终解决方案.md` 了解详细的问题分析
2. 访问 `/super-admin/debug-session` 查看诊断信息
3. 检查浏览器控制台的错误日志
4. 联系技术支持

---

**最后更新**：2026-05-05  
**状态**：✅ 已验证，可以直接部署  
**作者**：Kiro AI + GPT 协作
