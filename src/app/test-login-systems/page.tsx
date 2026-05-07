'use client';

export default function TestLoginSystems() {
  const systems = [
    {
      name: 'Super Admin 系统',
      loginUrl: '/super-admin/login',
      dashboardUrl: '/super-admin/dashboard-simple',
      description: '超级管理员系统 - 管理所有租户',
      credentials: {
        email: '403940124@qq.com',
        password: '您设置的密码',
      },
    },
    {
      name: '管理后台系统',
      loginUrl: '/admin/login',
      dashboardUrl: '/admin',
      description: '租户管理后台 - 管理单个租户',
      credentials: {
        email: '403940124@qq.com',
        password: '您设置的密码',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            登录系统测试
          </h1>
          <p className="text-gray-600">
            测试两个管理系统的登录功能
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {systems.map((system, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {system.name}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {system.description}
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">登录信息：</p>
                <p className="text-sm text-gray-600">
                  邮箱: <code className="bg-white px-2 py-1 rounded">{system.credentials.email}</code>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  密码: <code className="bg-white px-2 py-1 rounded">{system.credentials.password}</code>
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={system.loginUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-medium hover:bg-blue-700"
                >
                  打开登录页面
                </a>
                <a
                  href={system.dashboardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-medium hover:bg-green-700"
                >
                  直接访问 Dashboard
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">📋 测试步骤</h3>
          <ol className="text-sm text-blue-800 space-y-2">
            <li><strong>1. Super Admin 系统：</strong></li>
            <li className="ml-4">• 点击"打开登录页面"</li>
            <li className="ml-4">• 输入邮箱和密码</li>
            <li className="ml-4">• 点击登录</li>
            <li className="ml-4">• 应该跳转到 /super-admin/dashboard-simple</li>
            
            <li className="mt-4"><strong>2. 管理后台系统：</strong></li>
            <li className="ml-4">• 点击"打开登录页面"</li>
            <li className="ml-4">• 输入邮箱和密码</li>
            <li className="ml-4">• 点击登录</li>
            <li className="ml-4">• 应该跳转到 /admin</li>
          </ol>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-3">⚠️ 注意事项</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• 两个系统使用相同的账号（403940124@qq.com）</li>
            <li>• 确保已在 Supabase 中设置了密码</li>
            <li>• 如果登录失败，检查浏览器控制台的错误信息</li>
            <li>• 使用无痕模式测试可以避免缓存问题</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
