'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  MessageSquare, 
  ShoppingCart, 
  FileText, 
  Newspaper,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface AdminLayoutClientProps {
  user: User;
  profile: any;
  children: React.ReactNode;
}

export default function AdminLayoutClient({ user, profile, children }: AdminLayoutClientProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: '仪表板', href: '/admin-v2' },
    { icon: Users, label: '用户管理', href: '/admin-v2/users' },
    { icon: Briefcase, label: '律师管理', href: '/admin-v2/lawyers' },
    { icon: MessageSquare, label: '咨询管理', href: '/admin-v2/consultations' },
    { icon: ShoppingCart, label: '订单管理', href: '/admin-v2/orders' },
    { icon: FileText, label: '模板管理', href: '/admin-v2/templates' },
    { icon: Newspaper, label: '文章管理', href: '/admin-v2/articles' },
    { icon: Settings, label: '系统设置', href: '/admin-v2/settings' },
  ];

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r border-neutral-200 w-64`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-200">
          <Link href="/admin-v2" className="text-xl font-bold text-primary-600">
            LegalMY Admin
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-neutral-600 hover:text-neutral-900"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-all"
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-neutral-900 truncate">
                {user.email}
              </div>
              <div className="text-xs text-neutral-500">
                {profile.super_admin ? '超级管理员' : '管理员'}
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">退出登录</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'lg:ml-64' : ''} transition-all`}>
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-neutral-600 hover:text-neutral-900"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              访问前台 →
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
