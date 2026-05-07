'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function SuperAdminHeader() {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { t } = useLanguage();

  const handleLogout = async () => {
    // TODO: Implement logout logic
    router.push('/super-admin/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-orange-600 to-red-600 shadow-lg z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-orange-600 font-bold text-xl">超</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">{t('header.title')}</h1>
              <p className="text-orange-100 text-xs">{t('header.subtitle')}</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Notifications */}
          <button className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <UserCircleIcon className="w-6 h-6" />
              <span className="text-sm font-medium">{t('header.admin')}</span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{t('header.superAdmin')}</p>
                    <p className="text-xs text-gray-500">admin@example.com</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                    {t('header.logout')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
