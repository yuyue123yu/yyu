'use client';

import { useEffect, useState } from 'react';
import { withSuperAdminAuth } from '@/lib/auth/withSuperAdminAuth';
import SuperAdminLayout from '@/components/super-admin/SuperAdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  BuildingOfficeIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
  tenants: {
    total: number;
    active: number;
    inactive: number;
  };
  users: {
    total: number;
    new_this_month: number;
  };
  consultations: {
    total: number;
    pending: number;
  };
  orders: {
    total: number;
    revenue: number;
  };
}

function SuperAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // TODO: Create a dedicated dashboard stats endpoint
      // For now, we'll use placeholder data
      setStats({
        tenants: {
          total: 5,
          active: 4,
          inactive: 1,
        },
        users: {
          total: 150,
          new_this_month: 25,
        },
        consultations: {
          total: 500,
          pending: 45,
        },
        orders: {
          total: 300,
          revenue: 150000,
        },
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <p className="text-gray-600 mt-2">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tenants */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('dashboard.totalTenants')}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.tenants.total}
                </p>
                <p className="text-sm text-green-600 mt-2 flex items-center">
                  <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                  {stats?.tenants.active} {t('dashboard.active')}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('dashboard.totalUsers')}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.users.total}
                </p>
                <p className="text-sm text-green-600 mt-2 flex items-center">
                  <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                  +{stats?.users.new_this_month} {t('dashboard.newThisMonth')}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Consultations */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('dashboard.consultations')}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.consultations.total}
                </p>
                <p className="text-sm text-yellow-600 mt-2 flex items-center">
                  {stats?.consultations.pending} {t('dashboard.pending')}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('dashboard.totalRevenue')}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ¥{stats?.orders.revenue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {stats?.orders.total} {t('dashboard.orders')}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingCartIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('dashboard.quickActions')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => (window.location.href = '/super-admin/tenants/new')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-left"
            >
              <BuildingOfficeIcon className="w-6 h-6 text-orange-600 mb-2" />
              <p className="font-medium text-gray-900">{t('dashboard.createTenant')}</p>
              <p className="text-sm text-gray-600 mt-1">
                {t('dashboard.createTenantDesc')}
              </p>
            </button>

            <button
              onClick={() => (window.location.href = '/super-admin/users')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <UsersIcon className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-medium text-gray-900">{t('dashboard.manageUsers')}</p>
              <p className="text-sm text-gray-600 mt-1">
                {t('dashboard.manageUsersDesc')}
              </p>
            </button>

            <button
              onClick={() => (window.location.href = '/super-admin/audit-logs')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left"
            >
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-600 mb-2" />
              <p className="font-medium text-gray-900">{t('dashboard.viewAuditLogs')}</p>
              <p className="text-sm text-gray-600 mt-1">
                {t('dashboard.viewAuditLogsDesc')}
              </p>
            </button>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('dashboard.systemHealth')}
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">{t('dashboard.database')}</span>
              </div>
              <span className="text-sm text-green-600 font-medium">{t('dashboard.operational')}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">{t('dashboard.apiServices')}</span>
              </div>
              <span className="text-sm text-green-600 font-medium">{t('dashboard.operational')}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">{t('dashboard.authentication')}</span>
              </div>
              <span className="text-sm text-green-600 font-medium">{t('dashboard.operational')}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('dashboard.recentActivity')}
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{t('dashboard.newTenantCreated')}</p>
                <p className="text-xs text-gray-500 mt-1">2 {t('dashboard.hoursAgo')}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{t('dashboard.userMigrated')}</p>
                <p className="text-xs text-gray-500 mt-1">5 {t('dashboard.hoursAgo')}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{t('dashboard.settingsUpdated')}</p>
                <p className="text-xs text-gray-500 mt-1">1 {t('dashboard.dayAgo')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}

export default withSuperAdminAuth(SuperAdminDashboard);
