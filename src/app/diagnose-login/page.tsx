'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function DiagnoseLoginPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runDiagnosis();
  }, []);

  const runDiagnosis = async () => {
    const supabase = createClient();
    const diagnostics: any = {};

    try {
      // 1. 检查环境变量
      diagnostics.env = {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        urlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
      };

      // 2. 检查Session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      diagnostics.session = {
        exists: !!sessionData.session,
        error: sessionError?.message,
        userId: sessionData.session?.user?.id,
        userEmail: sessionData.session?.user?.email,
        expiresAt: sessionData.session?.expires_at,
      };

      // 3. 检查User
      const { data: userData, error: userError } = await supabase.auth.getUser();
      diagnostics.user = {
        exists: !!userData.user,
        error: userError?.message,
        userId: userData.user?.id,
        userEmail: userData.user?.email,
      };

      // 4. 检查Profile（如果有session）
      if (sessionData.session) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sessionData.session.user.id)
          .maybeSingle();

        diagnostics.profile = {
          exists: !!profile,
          error: profileError?.message,
          data: profile,
        };
      }

      // 5. 检查Cookie
      diagnostics.cookies = {
        all: document.cookie,
        hasSupabaseCookie: document.cookie.includes('sb-'),
      };

      // 6. 检查localStorage
      const storageKeys = Object.keys(localStorage).filter(key => 
        key.includes('supabase') || key.includes('sb-')
      );
      diagnostics.localStorage = {
        keys: storageKeys,
        count: storageKeys.length,
      };

    } catch (error: any) {
      diagnostics.error = error.message;
    }

    setResults(diagnostics);
    setLoading(false);
  };

  const testLogin = async () => {
    const supabase = createClient();
    const email = '403940124@qq.com';
    const password = prompt('请输入密码:');
    
    if (!password) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      alert(error ? `登录失败: ${error.message}` : '登录成功！刷新页面查看结果');
      
      if (!error) {
        setTimeout(() => runDiagnosis(), 1000);
      }
    } catch (error: any) {
      alert(`错误: ${error.message}`);
    }
    setLoading(false);
  };

  const clearAuth = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    localStorage.clear();
    alert('已清除所有认证信息，刷新页面查看结果');
    setTimeout(() => runDiagnosis(), 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 登录系统诊断</h1>

        <div className="mb-6 flex gap-4">
          <button
            onClick={runDiagnosis}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '检查中...' : '重新检查'}
          </button>
          <button
            onClick={testLogin}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            测试登录
          </button>
          <button
            onClick={clearAuth}
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            清除认证
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">诊断中...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 环境变量 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className={results.env?.hasUrl && results.env?.hasAnonKey ? '✅' : '❌'}>
                  {results.env?.hasUrl && results.env?.hasAnonKey ? '✅' : '❌'}
                </span>
                环境变量
              </h2>
              <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-sm">
                {JSON.stringify(results.env, null, 2)}
              </pre>
            </div>

            {/* Session */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>{results.session?.exists ? '✅' : '❌'}</span>
                Session 状态
              </h2>
              <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-sm">
                {JSON.stringify(results.session, null, 2)}
              </pre>
            </div>

            {/* User */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>{results.user?.exists ? '✅' : '❌'}</span>
                User 状态
              </h2>
              <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-sm">
                {JSON.stringify(results.user, null, 2)}
              </pre>
            </div>

            {/* Profile */}
            {results.profile && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>{results.profile?.exists ? '✅' : '❌'}</span>
                  Profile 数据
                </h2>
                <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-sm">
                  {JSON.stringify(results.profile, null, 2)}
                </pre>
              </div>
            )}

            {/* Cookies */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>{results.cookies?.hasSupabaseCookie ? '✅' : '❌'}</span>
                Cookies
              </h2>
              <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-sm">
                {JSON.stringify(results.cookies, null, 2)}
              </pre>
            </div>

            {/* LocalStorage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>{results.localStorage?.count > 0 ? '✅' : '❌'}</span>
                LocalStorage
              </h2>
              <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-sm">
                {JSON.stringify(results.localStorage, null, 2)}
              </pre>
            </div>

            {/* 错误 */}
            {results.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-red-800">❌ 错误</h2>
                <pre className="text-red-600 text-sm">{results.error}</pre>
              </div>
            )}

            {/* 诊断结论 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-blue-800">📋 诊断结论</h2>
              <div className="space-y-2 text-sm">
                {!results.env?.hasUrl && (
                  <p className="text-red-600">❌ 缺少 NEXT_PUBLIC_SUPABASE_URL 环境变量</p>
                )}
                {!results.env?.hasAnonKey && (
                  <p className="text-red-600">❌ 缺少 NEXT_PUBLIC_SUPABASE_ANON_KEY 环境变量</p>
                )}
                {!results.session?.exists && (
                  <p className="text-orange-600">⚠️ 当前没有活动的 Session（未登录）</p>
                )}
                {results.session?.exists && !results.profile?.exists && (
                  <p className="text-red-600">❌ Session 存在但无法查询 Profile（RLS 问题）</p>
                )}
                {results.session?.exists && results.profile?.exists && (
                  <p className="text-green-600">✅ 登录状态正常！</p>
                )}
                {!results.cookies?.hasSupabaseCookie && results.session?.exists && (
                  <p className="text-orange-600">⚠️ Session 存在但没有 Cookie（可能导致刷新后丢失）</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 快速链接 */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">🔗 快速链接</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/super-admin/login" className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-center">
              Super Admin 登录
            </a>
            <a href="/admin/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center">
              Admin 登录
            </a>
            <a href="/super-admin/dashboard-simple" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center">
              Super Admin Dashboard
            </a>
            <a href="/admin" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center">
              Admin Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
