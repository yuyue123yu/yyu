'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { 
  HomeIcon, 
  UsersIcon, 
  BuildingOfficeIcon, 
  UserGroupIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface DashboardClientProps {
  profile: any;
  session: any;
}

export default function DashboardClient({ profile, session }: DashboardClientProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      
      // 调用 API 清除服务端 cookies
      await fetch('/api/auth/signout', { method: 'POST' });
      
      // 硬刷新跳转到登录页
      window.location.href = '/super-admin/login';
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  // 导航菜单项
  const menuItems = [
    {
      name: '租户管理',
      href: '/super-admin/tenants',
      icon: BuildingOfficeIcon,
      description: '管理所有租户',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: '用户管理',
      href: '/super-admin/users',
      icon: UsersIcon,
      description: '管理所有用户',
      color: 'from-green-500 to-green-600'
    },
    {
      name: '管理员管理',
      href: '/super-admin/admins',
      icon: UserGroupIcon,
      description: '管理系统管理员',
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: '系统设置',
      href: '/super-admin/settings',
      icon: Cog6ToothIcon,
      description: '系统配置管理',
      color: 'from-gray-500 to-gray-600'
    },
    {
      name: '数据分析',
      href: '/super-admin/analytics',
      icon: ChartBarIcon,
      description: '查看系统数据',
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: '审计日志',
      href: '/super-admin/audit-logs',
      icon: DocumentTextIcon,
      description: '查看操作日志',
      color: 'from-red-500 to-red-600'
    },
    {
      name: 'Session 诊断',
      href: '/super-admin/debug-session',
      icon: ShieldCheckIcon,
      description: '诊断 Session 状态',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  超级管理员 Dashboard
                </h1>
                <p className="text-sm text-gray-600">Super Admin 系统</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoggingOut ? '退出中...' : '退出登录'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-2">
            欢迎回来，Super Admin！
          </h2>
          <p className="text-orange-100">
            您已成功登录超级管理员系统，可以管理所有租户、用户和系统设置
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">租户总数</p>
                <p className="text-3xl font-bold text-gray-900">5</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">用户总数</p>
                <p className="text-3xl font-bold text-gray-900">150</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">系统状态</p>
                <p className="text-lg font-semibold text-green-600">正常运行</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">快速操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 group"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">当前用户信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">邮箱</p>
              <p className="font-medium text-gray-900">{profile?.email || session?.user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">用户 ID</p>
              <p className="font-medium text-gray-900 text-xs">{profile?.id || session?.user?.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">用户类型</p>
              <p className="font-medium text-gray-900">{profile?.user_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Super Admin 权限</p>
              <p className="font-medium">
                {profile?.super_admin ? (
                  <span className="text-green-600">✅ 是</span>
                ) : (
                  <span className="text-red-600">❌ 否</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tenant ID</p>
              <p className="font-medium text-gray-900">{profile?.tenant_id || 'NULL (正确)'}</p>
            </div>
          </div>
        </div>

        {/* Debug Info (可选，生产环境可以移除) */}
        <details className="bg-white rounded-lg shadow p-6">
          <summary className="text-lg font-semibold text-gray-900 cursor-pointer">
            Profile 详情（调试信息）
          </summary>
          <pre className="mt-4 bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </details>
      </main>
    </div>
  );
}
