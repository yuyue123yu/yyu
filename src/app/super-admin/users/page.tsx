'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { withSuperAdminAuth } from '@/lib/auth/withSuperAdminAuth';
import SuperAdminLayout from '@/components/super-admin/SuperAdminLayout';
import UserTable from '@/components/super-admin/UserTable';
import UserFilters from '@/components/super-admin/UserFilters';
import { useLanguage } from '@/contexts/LanguageContext';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  user_type: string;
  tenant_id: string;
  tenant_name: string;
  active: boolean;
  created_at: string;
}

function UsersPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    tenant_id: 'all',
    user_type: 'all',
    search: '',
  });

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  useEffect(() => {
    applyFilters();
  }, [users, filters]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/super-admin/users?page=${currentPage}&limit=20`
      );
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Tenant filter
    if (filters.tenant_id !== 'all') {
      filtered = filtered.filter((u) => u.tenant_id === filters.tenant_id);
    }

    // User type filter
    if (filters.user_type !== 'all') {
      filtered = filtered.filter((u) => u.user_type === filters.user_type);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.email.toLowerCase().includes(searchLower) ||
          u.full_name?.toLowerCase().includes(searchLower) ||
          u.phone?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredUsers(filtered);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('users.title')}</h1>
            <p className="text-gray-600 mt-2">
              {t('users.subtitle')}
            </p>
          </div>
        </div>

        {/* Filters */}
        <UserFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Users Table */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">{t('users.noUsers')}</p>
            {filters.search ||
            filters.tenant_id !== 'all' ||
            filters.user_type !== 'all' ? (
              <button
                onClick={() =>
                  setFilters({ tenant_id: 'all', user_type: 'all', search: '' })
                }
                className="mt-4 text-orange-600 hover:text-orange-700"
              >
                {t('common.filter')}
              </button>
            ) : null}
          </div>
        ) : (
          <UserTable users={filteredUsers} onUpdate={fetchUsers} />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('common.previous')}
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('common.next')}
            </button>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}

export default withSuperAdminAuth(UsersPage);
