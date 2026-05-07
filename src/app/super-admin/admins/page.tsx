'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { withSuperAdminAuth } from '@/lib/auth/withSuperAdminAuth';
import SuperAdminLayout from '@/components/super-admin/SuperAdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowPathIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

interface Admin {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  tenant_id: string;
  created_at: string;
  tenants: {
    id: string;
    name: string;
    subdomain: string;
    status: string;
  };
}

interface GroupedAdmins {
  [tenantId: string]: {
    tenant: {
      id: string;
      name: string;
      subdomain: string;
      status: string;
    };
    admins: Admin[];
  };
}

function AdminsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [groupedAdmins, setGroupedAdmins] = useState<GroupedAdmins>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<string>('all');
  const [tenants, setTenants] = useState<any[]>([]);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [targetTenantId, setTargetTenantId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAdmins();
    fetchTenants();
  }, []);

  useEffect(() => {
    groupAndFilterAdmins();
  }, [admins, searchQuery, selectedTenant]);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/super-admin/admins?limit=1000');
      const data = await response.json();

      if (data.success) {
        setAdmins(data.admins);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTenants = async () => {
    try {
      const response = await fetch('/api/super-admin/tenants?limit=1000');
      const data = await response.json();

      if (data.success) {
        setTenants(data.tenants);
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const groupAndFilterAdmins = () => {
    let filtered = [...admins];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (admin) =>
          admin.email.toLowerCase().includes(query) ||
          admin.full_name?.toLowerCase().includes(query) ||
          admin.tenants?.name.toLowerCase().includes(query)
      );
    }

    // Apply tenant filter
    if (selectedTenant !== 'all') {
      filtered = filtered.filter((admin) => admin.tenant_id === selectedTenant);
    }

    // Group by tenant
    const grouped: GroupedAdmins = {};
    filtered.forEach((admin) => {
      if (!grouped[admin.tenant_id]) {
        grouped[admin.tenant_id] = {
          tenant: admin.tenants,
          admins: [],
        };
      }
      grouped[admin.tenant_id].admins.push(admin);
    });

    setGroupedAdmins(grouped);
  };

  const handleReassign = (admin: Admin) => {
    setSelectedAdmin(admin);
    setTargetTenantId('');
    setShowReassignModal(true);
  };

  const handleRevoke = (admin: Admin) => {
    setSelectedAdmin(admin);
    setShowRevokeModal(true);
  };

  const confirmReassign = async () => {
    if (!selectedAdmin || !targetTenantId) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/super-admin/admins/${selectedAdmin.id}/reassign`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tenant_id: targetTenantId }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('Admin reassigned successfully');
        setShowReassignModal(false);
        fetchAdmins();
      } else {
        alert(data.error || 'Failed to reassign admin');
      }
    } catch (error) {
      console.error('Error reassigning admin:', error);
      alert('Failed to reassign admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmRevoke = async () => {
    if (!selectedAdmin) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/super-admin/admins/${selectedAdmin.id}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('Admin privileges revoked successfully');
        setShowRevokeModal(false);
        fetchAdmins();
      } else {
        alert(data.error || 'Failed to revoke admin privileges');
      }
    } catch (error) {
      console.error('Error revoking admin:', error);
      alert('Failed to revoke admin privileges');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('admins.title')}
            </h1>
            <p className="text-gray-600 mt-2">
              {t('admins.subtitle')}
            </p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => router.push('/super-admin/admins/new')}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              {t('admins.createAdmin')}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email, name, or tenant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Tenant Filter */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Tenants</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTenant('all');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Clear filters"
              >
                <ArrowPathIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Admin List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : Object.keys(groupedAdmins).length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No admins found</p>
            {searchQuery || selectedTenant !== 'all' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTenant('all');
                }}
                className="mt-4 text-orange-600 hover:text-orange-700"
              >
                Clear filters
              </button>
            ) : (
              <button
                onClick={() => router.push('/super-admin/admins/new')}
                className="mt-4 text-orange-600 hover:text-orange-700"
              >
                Create your first admin
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedAdmins).map(([tenantId, group]) => (
              <div key={tenantId} className="bg-white rounded-lg shadow">
                {/* Tenant Header */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {group.tenant.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {group.tenant.subdomain} • {group.admins.length} admin
                        {group.admins.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        group.tenant.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {group.tenant.status}
                    </span>
                  </div>
                </div>

                {/* Admins Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Admin
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {group.admins.map((admin) => (
                        <tr key={admin.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {admin.full_name
                                  ? admin.full_name.charAt(0).toUpperCase()
                                  : admin.email.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {admin.full_name || 'No name'}
                                </div>
                                {admin.phone && (
                                  <div className="text-sm text-gray-500">
                                    {admin.phone}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {admin.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {formatDate(admin.created_at)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleReassign(admin)}
                              className="text-orange-600 hover:text-orange-900 mr-4"
                            >
                              Reassign
                            </button>
                            <button
                              onClick={() => handleRevoke(admin)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Revoke
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reassign Modal */}
        {showReassignModal && selectedAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Reassign Admin
              </h3>
              <p className="text-gray-600 mb-4">
                Reassign <strong>{selectedAdmin.email}</strong> to a different
                tenant.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select New Tenant
                </label>
                <select
                  value={targetTenantId}
                  onChange={(e) => setTargetTenantId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select a tenant...</option>
                  {tenants
                    .filter((t) => t.id !== selectedAdmin.tenant_id)
                    .map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowReassignModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReassign}
                  disabled={!targetTenantId || isSubmitting}
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Reassigning...' : 'Reassign'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Revoke Modal */}
        {showRevokeModal && selectedAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Revoke Admin Privileges
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to revoke admin privileges for{' '}
                <strong>{selectedAdmin.email}</strong>? This will convert them
                to a regular user.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This action will remove all
                  administrative capabilities for this user.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRevokeModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRevoke}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Revoking...' : 'Revoke Privileges'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}

export default withSuperAdminAuth(AdminsPage);
