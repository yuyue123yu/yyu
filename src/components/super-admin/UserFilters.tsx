'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface UserFiltersProps {
  filters: {
    tenant_id: string;
    user_type: string;
    search: string;
  };
  onFilterChange: (filters: any) => void;
}

interface Tenant {
  id: string;
  name: string;
}

export default function UserFilters({
  filters,
  onFilterChange,
}: UserFiltersProps) {
  const { t } = useLanguage();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoadingTenants, setIsLoadingTenants] = useState(true);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setIsLoadingTenants(true);
      // Fetch all tenants without pagination for filter dropdown
      const response = await fetch(
        '/api/super-admin/tenants?limit=1000&status=active'
      );
      const data = await response.json();

      if (data.success) {
        setTenants(data.tenants);
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setIsLoadingTenants(false);
    }
  };

  const handleTenantChange = (tenant_id: string) => {
    onFilterChange({ ...filters, tenant_id });
  };

  const handleUserTypeChange = (user_type: string) => {
    onFilterChange({ ...filters, user_type });
  };

  const handleSearchChange = (search: string) => {
    onFilterChange({ ...filters, search });
  };

  const handleClearFilters = () => {
    onFilterChange({
      tenant_id: 'all',
      user_type: 'all',
      search: '',
    });
  };

  const hasActiveFilters =
    filters.tenant_id !== 'all' ||
    filters.user_type !== 'all' ||
    filters.search !== '';

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg shadow p-4 border border-orange-200">
      <div className="flex flex-col space-y-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400" />
            <input
              type="text"
              placeholder={t('users.searchPlaceholder')}
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Tenant Filter */}
          <div className="flex items-center space-x-2 flex-1">
            <FunnelIcon className="w-5 h-5 text-orange-500" />
            <select
              value={filters.tenant_id}
              onChange={(e) => handleTenantChange(e.target.value)}
              disabled={isLoadingTenants}
              className="flex-1 px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="all">{t('users.allTenants')}</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))}
            </select>
          </div>

          {/* User Type Filter */}
          <div className="flex items-center space-x-2 flex-1">
            <FunnelIcon className="w-5 h-5 text-orange-500" />
            <select
              value={filters.user_type}
              onChange={(e) => handleUserTypeChange(e.target.value)}
              className="flex-1 px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              <option value="all">{t('users.allUserTypes')}</option>
              <option value="customer">{t('users.customer')}</option>
              <option value="lawyer">{t('users.lawyer')}</option>
              <option value="admin">{t('users.admin')}</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
              <span>{t('users.clearFilters')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
