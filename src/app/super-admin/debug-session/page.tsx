import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export default async function DebugSessionPage() {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // 获取所有 cookies
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  
  // 获取 profile
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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Session 诊断页面</h1>

        {/* Session 信息 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">📋 Session 信息</h2>
          {session ? (
            <div className="space-y-2">
              <p className="text-green-600 font-bold">✅ Session 存在</p>
              <p><strong>User ID:</strong> {session.user.id}</p>
              <p><strong>Email:</strong> {session.user.email}</p>
              <p><strong>Access Token (前20字符):</strong> {session.access_token.substring(0, 20)}...</p>
              <p><strong>Expires At:</strong> {new Date(session.expires_at! * 1000).toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-red-600 font-bold">❌ 没有 Session</p>
          )}
        </div>

        {/* Profile 信息 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">👤 Profile 信息</h2>
          {profile ? (
            <div className="space-y-2">
              <p className="text-green-600 font-bold">✅ Profile 存在</p>
              <p><strong>ID:</strong> {profile.id}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>User Type:</strong> {profile.user_type}</p>
              <p><strong>Super Admin:</strong> {profile.super_admin ? '✅ true' : '❌ false'}</p>
              <p><strong>Tenant ID:</strong> {profile.tenant_id || 'NULL'}</p>
            </div>
          ) : (
            <p className="text-red-600 font-bold">❌ 没有 Profile</p>
          )}
        </div>

        {/* Cookies 信息 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🍪 Cookies 信息</h2>
          <div className="space-y-2">
            <p><strong>总共 {allCookies.length} 个 Cookies</strong></p>
            {allCookies.map((cookie) => (
              <div key={cookie.name} className="border-l-4 border-blue-500 pl-4 py-2">
                <p><strong>{cookie.name}:</strong></p>
                <p className="text-sm text-gray-600 break-all">
                  {cookie.value.substring(0, 50)}...
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 权限检查结果 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🔐 权限检查结果</h2>
          <div className="space-y-2">
            <p>
              <strong>Session 存在:</strong>{' '}
              {session ? '✅ 是' : '❌ 否'}
            </p>
            <p>
              <strong>Profile 存在:</strong>{' '}
              {profile ? '✅ 是' : '❌ 否'}
            </p>
            <p>
              <strong>Super Admin 权限:</strong>{' '}
              {profile?.super_admin ? '✅ 是' : '❌ 否'}
            </p>
            <p className="mt-4 p-4 rounded" style={{
              backgroundColor: session && profile?.super_admin ? '#d4edda' : '#f8d7da',
              color: session && profile?.super_admin ? '#155724' : '#721c24'
            }}>
              {session && profile?.super_admin
                ? '✅ 权限检查通过！可以访问 Super Admin Dashboard'
                : '❌ 权限检查失败！无法访问 Super Admin Dashboard'}
            </p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4">
          <a
            href="/super-admin/login"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            返回登录页
          </a>
          <a
            href="/super-admin/dashboard-simple"
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
          >
            尝试访问 Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
