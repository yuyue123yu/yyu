'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { withSuperAdminAuth } from '@/lib/auth/withSuperAdminAuth';
import SuperAdminLayout from '@/components/super-admin/SuperAdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import T from '@/components/super-admin/T';
import {
  BuildingOfficeIcon,
  UsersIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  domain: string | null;
  status: 'active' | 'inactive' | 'suspended';
  user_count: number;
  created_at: string;
  updated_at: string;
}

function TenantDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useLanguage();
  const tenantId = params?.id as string;

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    subdomain: '',
    domain: '',
  });

  useEffect(() => {
    if (tenantId) {
      fetchTenant();
    }
  }, [tenantId]);

  const fetchTenant = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/super-admin/tenants/${tenantId}`);
      const data = await response.json();

      if (data.success) {
        setTenant(data.tenant);
        setEditForm({
          name: data.tenant.name,
          subdomain: data.tenant.subdomain,
          domain: data.tenant.domain || '',
        });
      }
    } catch (error) {
      console.error('Error fetching tenant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/super-admin/tenants/${tenantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (data.success) {
        setTenant(data.tenant);
        setIsEditing(false);
      } else {
        alert(data.error || 'Failed to update tenant');
      }
    } catch (error) {
      console.error('Error updating tenant:', error);
      alert('Failed to update tenant');
    }
  };

  const handleActivate = async () => {
    try {
      const response = await fetch(
        `/api/super-admin/tenants/${tenantId}/activate`,
        { method: 'POST' }
      );

      if (response.ok) {
        fetchTenant();
      }
    } catch (error) {
      console.error('Error activating tenant:', error);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm(t('tenantDetail.confirmDeactivate'))) return;

    try {
      const response = await fetch(
        `/api/super-admin/tenants/${tenantId}/deactivate`,
        { method: 'POST' }
      );

      if (response.ok) {
        fetchTenant();
      }
    } catch (error) {
      console.error('Error deactivating tenant:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t('tenantDetail.confirmDelete'))) return;

    try {
      const response = await fetch(`/api/super-admin/tenants/${tenantId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/super-admin/tenants');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete tenant');
      }
    } catch (error) {
      console.error('Error deleting tenant:', error);
      alert('Failed to delete tenant');
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

  if (!tenant) {
    return (
      <SuperAdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">
            <T zh="未找到租户" en="Tenant not found" />
          </p>
          <button
            onClick={() => router.push('/super-admin/tenants')}
            className="mt-4 text-orange-600 hover:text-orange-700"
          >
            <T zh="返回租户列表" en="Back to Tenants" />
          </button>
        </div>
      </SuperAdminLayout>
    );
  }

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

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => router.push('/super-admin/tenants')}
              className="text-sm text-gray-600 hover:text-gray-900 mb-2"
            >
              ← <T zh="返回租户列表" en="Back to Tenants" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{tenant.name}</h1>
            <p className="text-gray-600 mt-2">
              <T zh="租户详情和配置" en="Tenant Details and Configuration" />
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
              tenant.status
            )}`}
          >
            <T 
              zh={tenant.status === 'active' ? '活跃' : tenant.status === 'inactive' ? '停用' : '暂停'} 
              en={tenant.status} 
            />
          </span>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push(`/super-admin/tenants/${tenantId}/settings`)}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <Cog6ToothIcon className="w-5 h-5 mr-2" />
            <T zh="OEM设置" en="OEM Settings" />
          </button>

          {tenant.status === 'active' ? (
            <button
              onClick={handleDeactivate}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <XCircleIcon className="w-5 h-5 mr-2" />
              <T zh="停用" en="Deactivate" />
            </button>
          ) : (
            <button
              onClick={handleActivate}
              className="flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50"
            >
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              <T zh="激活" en="Activate" />
            </button>
          )}

          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
          >
            <TrashIcon className="w-5 h-5 mr-2" />
            <T zh="删除" en="Delete" />
          </button>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              <T zh="基本信息" en="Basic Information" />
            </h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center text-orange-600 hover:text-orange-700"
              >
                <PencilIcon className="w-4 h-4 mr-1" />
                <T zh="编辑" en="Edit" />
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({
                      name: tenant.name,
                      subdomain: tenant.subdomain,
                      domain: tenant.domain || '',
                    });
                  }}
                  className="px-3 py-1 text-gray-600 hover:text-gray-900"
                >
                  <T zh="取消" en="Cancel" />
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700"
                >
                  <T zh="保存" en="Save" />
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <T zh="租户名称" en="Tenant Name" />
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <T zh="子域名" en="Subdomain" />
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={editForm.subdomain}
                    onChange={(e) =>
                      setEditForm({ ...editForm, subdomain: e.target.value })
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600">
                    .example.com
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <T zh="自定义域名" en="Custom Domain" />
                </label>
                <input
                  type="text"
                  value={editForm.domain}
                  onChange={(e) =>
                    setEditForm({ ...editForm, domain: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="www.example.com"
                />
              </div>
            </div>
          ) : (
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  <T zh="租户名称" en="Tenant Name" />
                </dt>
                <dd className="mt-1 text-lg text-gray-900">{tenant.name}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  <T zh="子域名" en="Subdomain" />
                </dt>
                <dd className="mt-1 text-lg text-gray-900 font-mono">
                  {tenant.subdomain}.example.com
                </dd>
              </div>

              {tenant.domain && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    <T zh="自定义域名" en="Custom Domain" />
                  </dt>
                  <dd className="mt-1 text-lg text-gray-900 font-mono">
                    {tenant.domain}
                  </dd>
                </div>
              )}

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  <T zh="租户ID" en="Tenant ID" />
                </dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">{tenant.id}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  <T zh="创建时间" en="Created At" />
                </dt>
                <dd className="mt-1 text-lg text-gray-900">
                  {new Date(tenant.created_at).toLocaleString()}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  <T zh="最后更新" en="Last Updated" />
                </dt>
                <dd className="mt-1 text-lg text-gray-900">
                  {new Date(tenant.updated_at).toLocaleString()}
                </dd>
              </div>
            </dl>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  <T zh="用户总数" en="Total Users" />
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {tenant.user_count}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <BuildingOfficeIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  <T zh="状态" en="Status" />
                </p>
                <p className="text-2xl font-bold text-gray-900 capitalize">
                  <T 
                    zh={tenant.status === 'active' ? '活跃' : tenant.status === 'inactive' ? '停用' : '暂停'} 
                    en={tenant.status} 
                  />
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Cog6ToothIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  <T zh="配置" en="Configuration" />
                </p>
                <button
                  onClick={() =>
                    router.push(`/super-admin/tenants/${tenantId}/settings`)
                  }
                  className="text-lg font-bold text-orange-600 hover:text-orange-700"
                >
                  <T zh="管理 →" en="Manage →" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}

export default withSuperAdminAuth(TenantDetailsPage);
