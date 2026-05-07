'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function TestLoginDirectPage() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const testLogin = async () => {
    if (!password) {
      alert('请输入密码！');
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const supabase = createClient();
      const email = '403940124@qq.com';

      setResult('正在登录...\n');

      // 登录
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setResult(prev => prev + `❌ 登录失败: ${authError.message}\n`);
        setIsLoading(false);
        return;
      }

      setResult(prev => prev + `✅ 登录成功！\n用户: ${authData.user.email}\n\n`);

      // 等待 session
      await new Promise(resolve => setTimeout(resolve, 500));

      // 获取 session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setResult(prev => prev + `❌ Session 获取失败\n`);
        setIsLoading(false);
        return;
      }

      setResult(prev => prev + `✅ Session 存在\n\n`);

      // 查询 profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        setResult(prev => prev + `❌ Profile 查询失败: ${profileError.message}\n`);
        setIsLoading(false);
        return;
      }

      setResult(prev => prev + `✅ Profile 查询成功\n`);
      setResult(prev => prev + `Super Admin: ${profile.super_admin ? '是' : '否'}\n`);
      setResult(prev => prev + `User Type: ${profile.user_type}\n`);
      setResult(prev => prev + `Tenant ID: ${profile.tenant_id || 'NULL'}\n\n`);

      if (profile.super_admin) {
        setResult(prev => prev + `🎉 所有测试通过！\n\n准备跳转到 Dashboard...\n`);
        
        setTimeout(() => {
          window.location.href = '/super-admin';
        }, 2000);
      } else {
        setResult(prev => prev + `❌ 不是 Super Admin\n`);
      }

    } catch (error: any) {
      setResult(prev => prev + `❌ 异常: ${error.message}\n`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 直接测试登录
          </h1>
          <p className="text-gray-600 mb-8">
            最简单的测试方法 - 输入密码，点击测试
          </p>

          <div className="space-y-4">
            {/* 邮箱显示 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱（固定）
              </label>
              <input
                type="text"
                value="403940124@qq.com"
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>

            {/* 密码输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="输入您的密码"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      testLogin();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* 测试按钮 */}
            <button
              onClick={testLogin}
              disabled={isLoading || !password}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {isLoading ? '测试中...' : '🚀 开始测试'}
            </button>

            {/* 结果显示 */}
            {result && (
              <div className="mt-6 bg-gray-900 rounded-lg p-6">
                <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                  {result}
                </pre>
              </div>
            )}
          </div>

          {/* 说明 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>测试步骤：</strong>
            </p>
            <ol className="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside">
              <li>输入您的密码</li>
              <li>点击"开始测试"按钮</li>
              <li>查看测试结果</li>
              <li>如果成功，会自动跳转到 Dashboard</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
