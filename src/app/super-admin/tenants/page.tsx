'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { withSuperAdminAuth } from '@/lib/auth/withSuperAdminAuth';
import SuperAdminLayout from '@/components/super-admin/SuperAdminLayout';
import TenantCard from '@/components/super-admin/TenantCard';
import TenantFilters from '@/components/super-admin/TenantFilters';
import { useLanguage } from '@/contexts/LanguageContext';
import { PlusIcon } from '@heroicons/react/24/outline';

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  domain: string | null;
  status: 'active' | 'inactive' | 'suspended';
  user_count: number;
  created_at: string;
}

function TenantsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
  });

  useEffect(() => {
    fetchTenants();
  }, [currentPage]);

  useEffect(() => {
    applyFilters();
  }, [tenants, filters]);

  const fetchTenants = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/super-admin/tenants?page=${currentPage}&limit=10`
      );
      const data = await response.json();

      if (data.success) {
        setTenants(data.tenants);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tenants];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((t) => t.status === filters.status);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchLower) ||
          t.subdomain.toLowerCase().includes(searchLower) ||
          t.domain?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredTenants(filtered);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('tenants.title')}</h1>
            <p className="text-gray-600 mt-2">
              {t('tenants.subtitle')}
            </p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => router.push('/super-admin/tenants/new')}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              {t('tenants.createTenant')}
            </button>
          </div>
        </div>

        {/* Filters */}
        <TenantFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Tenants Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : filteredTenants.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No tenants found</p>
            {filters.search || filters.status !== 'all' ? (
              <button
                onClick={() => setFilters({ status: 'all', search: '' })}
                className="mt-4 text-orange-600 hover:text-orange-700"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTenants.map((tenant) => (
              <TenantCard key={tenant.id} tenant={tenant} onUpdate={fetchTenants} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}

export default withSuperAdminAuth(TenantsPage);
