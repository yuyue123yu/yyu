'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { withSuperAdminAuth } from '@/lib/auth/withSuperAdminAuth';
import SuperAdminLayout from '@/components/super-admin/SuperAdminLayout';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  PencilIcon,
  ArrowPathIcon,
  UserCircleIcon,
  XCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  user_type: string;
  tenant_id: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  tenants?: {
    id: string;
    name: string;
    subdomain: string;
    status: string;
    subscription_plan: string;
  };
}

interface Activity {
  consultation_count: number;
  order_count: number;
}

function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showMigrateDialog, setShowMigrateDialog] = useState(false);
  const [tenants, setTenants] = useState<any[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    user_type: '',
  });

  useEffect(() => {
    if (userId) {
      fetchUser();
      fetchTenants();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/super-admin/users/${userId}`);
      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setActivity(data.activity);
        setEditForm({
          full_name: data.user.full_name || '',
          phone: data.user.phone || '',
          user_type: data.user.user_type || 'client',
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      showMessage('error', 'Failed to load user details');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTenants = async () => {
    try {
      const response = await fetch('/api/super-admin/tenants?limit=100');
      const data = await response.json();
      if (data.success) {
        setTenants(data.tenants);
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/super-admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setIsEditing(false);
        showMessage('success', 'User updated successfully');
      } else {
        showMessage('error', data.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      showMessage('error', 'Failed to update user');
    }
  };

  const handleMigrate = async () => {
    if (!selectedTenantId) {
      showMessage('error', 'Please select a target tenant');
      return;
    }

    if (
      !confirm(
        `Are you sure you want to migrate this user to the selected tenant? This will move all their data.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/super-admin/users/${userId}/migrate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_tenant_id: selectedTenantId }),
      });

      const data = await response.json();

      if (data.success) {
        setShowMigrateDialog(false);
        fetchUser();
        showMessage(
          'success',
          `User migrated successfully. ${data.migrated_data_count} records updated.`
        );
      } else {
        showMessage('error', data.error || 'Failed to migrate user');
      }
    } catch (error) {
      console.error('Error migrating user:', error);
      showMessage('error', 'Failed to migrate user');
    }
  };

  const handleImpersonate = async () => {
    if (
      !confirm(
        'Are you sure you want to impersonate this user? This action will be logged.'
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/super-admin/users/${userId}/impersonate`,
        {
          method: 'POST',
        }
      );

      const data = await response.json();

      if (data.success) {
        showMessage(
          'success',
          'Impersonation session created. Redirecting...'
        );
        // In a real implementation, this would redirect to the user's view
        setTimeout(() => {
          alert(
            'Impersonation feature: In production, this would redirect to the user view with their permissions.'
          );
        }, 1000);
      } else {
        showMessage('error', data.error || 'Failed to create impersonation session');
      }
    } catch (error) {
      console.error('Error creating impersonation session:', error);
      showMessage('error', 'Failed to create impersonation session');
    }
  };

  const handleDeactivate = async () => {
    const action = user?.active ? 'deactivate' : 'activate';
    if (
      !confirm(
        `Are you sure you want to ${action} this user? ${
          user?.active
            ? 'They will no longer be able to access the platform.'
            : 'They will be able to access the platform again.'
        }`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/super-admin/users/${userId}/deactivate`,
        {
          method: 'POST',
        }
      );

      const data = await response.json();

      if (data.success) {
        fetchUser();
        showMessage('success', `User ${action}d successfully`);
      } else {
        showMessage('error', data.error || `Failed to ${action} user`);
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      showMessage('error', `Failed to ${action} user`);
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

  if (!user) {
    return (
      <SuperAdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">User not found</p>
          <button
            onClick={() => router.push('/super-admin/users')}
            className="mt-4 text-orange-600 hover:text-orange-700"
          >
            Back to Users
          </button>
        </div>
      </SuperAdminLayout>
    );
  }

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'lawyer':
        return 'bg-blue-100 text-blue-800';
      case 'client':
        return 'bg-green-100 text-green-800';
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
              onClick={() => router.push('/super-admin/users')}
              className="text-sm text-gray-600 hover:text-gray-900 mb-2"
            >
              ← Back to Users
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.full_name || user.email}
            </h1>
            <p className="text-gray-600 mt-2">User Details and Management</p>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${getUserTypeColor(
                user.user_type
              )}`}
            >
              {user.user_type}
            </span>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                user.active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {user.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Message Banner */}
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <div className="flex items-center">
              {message.type === 'success' ? (
                <CheckCircleIcon className="w-5 h-5 mr-2" />
              ) : (
                <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
              )}
              {message.text}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <PencilIcon className="w-5 h-5 mr-2" />
            {isEditing ? 'Cancel Edit' : 'Edit User'}
          </button>

          <button
            onClick={() => setShowMigrateDialog(true)}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Migrate Tenant
          </button>

          <button
            onClick={handleImpersonate}
            className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
          >
            <UserCircleIcon className="w-5 h-5 mr-2" />
            Impersonate
          </button>

          <button
            onClick={handleDeactivate}
            className={`flex items-center px-4 py-2 border rounded-lg ${
              user.active
                ? 'border-red-600 text-red-600 hover:bg-red-50'
                : 'border-green-600 text-green-600 hover:bg-green-50'
            }`}
          >
            {user.active ? (
              <>
                <XCircleIcon className="w-5 h-5 mr-2" />
                Deactivate
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Activate
              </>
            )}
          </button>
        </div>

        {/* User Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              User Information
            </h2>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, full_name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Type
                </label>
                <select
                  value={editForm.user_type}
                  onChange={(e) =>
                    setEditForm({ ...editForm, user_type: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="client">Client</option>
                  <option value="lawyer">Lawyer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({
                      full_name: user.full_name || '',
                      phone: user.phone || '',
                      user_type: user.user_type || 'client',
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <EnvelopeIcon className="w-4 h-4 mr-2" />
                  Email
                </dt>
                <dd className="mt-1 text-lg text-gray-900">{user.email}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <UserIcon className="w-4 h-4 mr-2" />
                  Full Name
                </dt>
                <dd className="mt-1 text-lg text-gray-900">
                  {user.full_name || 'Not set'}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  Phone
                </dt>
                <dd className="mt-1 text-lg text-gray-900">
                  {user.phone || 'Not set'}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <UserIcon className="w-4 h-4 mr-2" />
                  User Type
                </dt>
                <dd className="mt-1 text-lg text-gray-900 capitalize">
                  {user.user_type}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Created At
                </dt>
                <dd className="mt-1 text-lg text-gray-900">
                  {new Date(user.created_at).toLocaleString()}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Last Updated
                </dt>
                <dd className="mt-1 text-lg text-gray-900">
                  {new Date(user.updated_at).toLocaleString()}
                </dd>
              </div>
            </dl>
          )}
        </div>

        {/* Tenant Context */}
        {user.tenants && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Tenant Context
            </h2>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <BuildingOfficeIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Current Tenant
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {user.tenants.name}
                  </p>
                  <p className="text-sm text-gray-600 font-mono">
                    {user.tenants.subdomain}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  router.push(`/super-admin/tenants/${user.tenant_id}`)
                }
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                View Tenant →
              </button>
            </div>
          </div>
        )}

        {/* Activity Statistics */}
        {activity && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <CalendarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Consultations
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activity.consultation_count}
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
                  <p className="text-sm font-medium text-gray-600">Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activity.order_count}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Migration Dialog */}
        {showMigrateDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Migrate User to Different Tenant
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Tenant
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">
                    {user.tenants?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {user.tenants?.subdomain}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Tenant
                </label>
                <select
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select a tenant...</option>
                  {tenants
                    .filter((t) => t.id !== user.tenant_id)
                    .map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.name} ({tenant.subdomain})
                      </option>
                    ))}
                </select>
              </div>

              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Impact Preview:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>User will be moved to the selected tenant</li>
                      <li>All consultations and orders will be migrated</li>
                      <li>User will receive a notification email</li>
                      <li>This action will be logged in the audit trail</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setShowMigrateDialog(false);
                    setSelectedTenantId('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMigrate}
                  disabled={!selectedTenantId}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Migrate User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}

export default withSuperAdminAuth(UserDetailsPage);
