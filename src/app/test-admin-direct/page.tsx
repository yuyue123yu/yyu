'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function TestAdminDirectPage() {
  const [status, setStatus] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkEverything();
  }, []);

  const checkEverything = async () => {
    const supabase = createClient();
    const results: any = {};

    try {
      // 1. 检查Session
      const { data: sessionData } = await supabase.auth.getSession();
      results.session = {
        exists: !!sessionData.session,
        userId: sessionData.session?.user?.id,
        email: sessionData.session?.user?.email,
      };

      // 2. 检查User
      const { data: userData } = await supabase.auth.getUser();
      results.user = {
        exists: !!userData.user,
        userId: userData.user?.id,
        email: userData.user?.email,
      };

      // 3. 检查Profile
      if (userData.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userData.user.id)
          .maybeSingle();

        results.profile = {
          exists: !!profile,
          error: profileError?.message,
          data: profile,
        };
      }

      // 4. 统计数据
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      results.stats = {
        totalUsers: usersCount || 0,
      };

    } catch (error: any) {
      results.error = error.message;
    }

    setStatus(results);
    setLoading(false);
  };

  const handleLogin = async () => {
    const email = prompt('Email:');
    const password = prompt('Password:');
    
    if (!email || !password) return;

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(`登录失败: ${error.message}`);
    } else {
      alert('登录成功！刷新页面查看结果');
      window.location.reload();
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    alert('已退出登录');
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">检查中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔧 管理后台测试页面（无权限检查）</h1>

        {/* 操作按钮 */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={handleLogin}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            登录
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            退出登录
          </button>
          <button
            onClick={checkEverything}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            重新检查
          </button>
        </div>

        {/* 状态显示 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Session */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>{status.session?.exists ? '✅' : '❌'}</span>
              Session 状态
            </h2>
            <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify(status.session, null, 2)}
            </pre>
          </div>

          {/* User */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>{status.user?.exists ? '✅' : '❌'}</span>
              User 状态
            </h2>
            <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify(status.user, null, 2)}
            </pre>
          </div>

          {/* Profile */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>{status.profile?.exists ? '✅' : '❌'}</span>
              Profile 数据
            </h2>
            <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify(status.profile, null, 2)}
            </pre>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>📊</span>
              统计数据
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded">
                <div className="text-3xl font-bold text-blue-600">
                  {status.stats?.totalUsers || 0}
                </div>
                <div className="text-sm text-blue-800">总用户数</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard 内容 */}
        {status.session?.exists && status.profile?.exists && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">🎉 Dashboard 内容</h2>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  ✅ 登录成功！您已经可以访问管理后台了！
                </p>
                <p className="text-green-700 text-sm mt-2">
                  用户: {status.profile.data.email} ({status.profile.data.user_type})
                </p>
                {status.profile.data.super_admin && (
                  <p className="text-green-700 text-sm">
                    🔑 Super Admin 权限已启用
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {status.stats?.totalUsers || 0}
                  </div>
                  <div className="text-sm text-blue-800">用户管理</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-purple-800">租户管理</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">0</div>
                  <div className="text-sm text-orange-800">系统设置</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 错误信息 */}
        {status.error && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-800 mb-2">❌ 错误</h2>
            <pre className="text-red-600 text-sm">{status.error}</pre>
          </div>
        )}

        {/* 快速链接 */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">🔗 快速链接</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/super-admin/login"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-center"
            >
              Super Admin 登录
            </a>
            <a
              href="/admin/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
            >
              Admin 登录
            </a>
            <a
              href="/diagnose-login"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center"
            >
              诊断页面
            </a>
            <a
              href="/"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-center"
            >
              返回首页
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
