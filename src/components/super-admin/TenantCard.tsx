'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  BuildingOfficeIcon,
  UsersIcon,
  GlobeAltIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  domain: string | null;
  status: 'active' | 'inactive' | 'suspended';
  user_count: number;
  created_at: string;
}

interface TenantCardProps {
  tenant: Tenant;
  onUpdate: () => void;
}

export default function TenantCard({ tenant, onUpdate }: TenantCardProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleActivate = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/super-admin/tenants/${tenant.id}/activate`,
        { method: 'POST' }
      );
      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error activating tenant:', error);
    } finally {
      setIsLoading(false);
      setShowMenu(false);
    }
  };

  const handleDeactivate = async () => {
    if (isLoading) return;
    if (!confirm(t('confirm.deactivateTenant'))) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/super-admin/tenants/${tenant.id}/deactivate`,
        { method: 'POST' }
      );
      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deactivating tenant:', error);
    } finally {
      setIsLoading(false);
      setShowMenu(false);
    }
  };

  const handleDelete = async () => {
    if (isLoading) return;
    if (!confirm(t('confirm.deleteTenant'))) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/super-admin/tenants/${tenant.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting tenant:', error);
    } finally {
      setIsLoading(false);
      setShowMenu(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 relative">
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            tenant.status
          )}`}
        >
          {tenant.status}
        </span>
      </div>

      {/* Tenant Info */}
      <div className="mb-4">
        <div className="flex items-start">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
            <BuildingOfficeIcon className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{tenant.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              Created {new Date(tenant.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Subdomain & Domain */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <GlobeAltIcon className="w-4 h-4 mr-2" />
          <span className="font-mono">{tenant.subdomain}.example.com</span>
        </div>
        {tenant.domain && (
          <div className="flex items-center text-sm text-gray-600">
            <GlobeAltIcon className="w-4 h-4 mr-2" />
            <span className="font-mono">{tenant.domain}</span>
          </div>
        )}
      </div>

      {/* User Count */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <UsersIcon className="w-4 h-4 mr-2" />
        <span>{tenant.user_count} users</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={() => router.push(`/super-admin/tenants/${tenant.id}`)}
          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          {t('common.view')} {t('common.details')}
        </button>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20">
                <button
                  onClick={() => {
                    router.push(`/super-admin/tenants/${tenant.id}`);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  {t('common.edit')}
                </button>

                {tenant.status === 'active' ? (
                  <button
                    onClick={handleDeactivate}
                    disabled={isLoading}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <XCircleIcon className="w-4 h-4 mr-2" />
                    {t('common.deactivate')}
                  </button>
                ) : (
                  <button
                    onClick={handleActivate}
                    disabled={isLoading}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    {t('common.activate')}
                  </button>
                )}

                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  {t('common.delete')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
