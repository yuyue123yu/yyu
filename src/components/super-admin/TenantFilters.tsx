'use client';

import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';

interface TenantFiltersProps {
  filters: {
    status: string;
    search: string;
  };
  onFilterChange: (filters: any) => void;
}

export default function TenantFilters({
  filters,
  onFilterChange,
}: TenantFiltersProps) {
  const { t } = useLanguage();

  const handleStatusChange = (status: string) => {
    onFilterChange({ ...filters, status });
  };

  const handleSearchChange = (search: string) => {
    onFilterChange({ ...filters, search });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('tenants.searchPlaceholder')}
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <FunnelIcon className="w-5 h-5 text-gray-400" />
          <select
            value={filters.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">{t('tenants.allStatuses')}</option>
            <option value="active">{t('tenants.active')}</option>
            <option value="inactive">{t('tenants.inactive')}</option>
            <option value="suspended">{t('tenants.suspended')}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
