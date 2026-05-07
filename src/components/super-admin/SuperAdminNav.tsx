'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  BuildingOfficeIcon,
  UsersIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SuperAdminNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navigation = [
    {
      name: t('nav.dashboard'),
      href: '/super-admin',
      icon: HomeIcon,
    },
    {
      name: t('nav.tenants'),
      href: '/super-admin/tenants',
      icon: BuildingOfficeIcon,
    },
    {
      name: t('nav.users'),
      href: '/super-admin/users',
      icon: UsersIcon,
    },
    {
      name: '子账号管理',
      href: '/super-admin/sub-accounts',
      icon: UserPlusIcon,
    },
    {
      name: t('nav.admins'),
      href: '/super-admin/admins',
      icon: ShieldCheckIcon,
    },
    {
      name: t('nav.auditLogs'),
      href: '/super-admin/audit-logs',
      icon: DocumentTextIcon,
    },
    {
      name: t('nav.analytics'),
      href: '/super-admin/analytics',
      icon: ChartBarIcon,
    },
    {
      name: t('nav.diagnostics'),
      href: '/super-admin/diagnostics',
      icon: WrenchScrewdriverIcon,
    },
    {
      name: t('nav.settings'),
      href: '/super-admin/settings',
      icon: Cog6ToothIcon,
    },
  ];

  return (
    <nav className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${
                    isActive
                      ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-orange-600'
                  }
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <div className="text-xs text-gray-500 text-center">
          <p className="font-semibold text-orange-600">{t('nav.footer')}</p>
          <p className="mt-1">v1.0.0</p>
        </div>
      </div>
    </nav>
  );
}
