'use client';

import { useEffect, useState } from 'react';
import T from '@/components/super-admin/T';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

interface AuditLogFiltersProps {
  filters: {
    action_type: string;
    target_entity: string;
    user_id: string;
    tenant_id: string;
    start_date: string;
    end_date: string;
    search: string;
  };
  onFilterChange: (filters: any) => void;
  onExport: (format: 'csv' | 'json') => void;
  isExporting: boolean;
}

interface Tenant {
  id: string;
  name: string;
}

export default function AuditLogFilters({
  filters,
  onFilterChange,
  onExport,
  isExporting,
}: AuditLogFiltersProps) {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoadingTenants, setIsLoadingTenants] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setIsLoadingTenants(true);
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

  const handleActionTypeChange = (action_type: string) => {
    onFilterChange({ ...filters, action_type });
  };

  const handleTargetEntityChange = (target_entity: string) => {
    onFilterChange({ ...filters, target_entity });
  };

  const handleTenantChange = (tenant_id: string) => {
    onFilterChange({ ...filters, tenant_id });
  };

  const handleStartDateChange = (start_date: string) => {
    onFilterChange({ ...filters, start_date });
  };

  const handleEndDateChange = (end_date: string) => {
    onFilterChange({ ...filters, end_date });
  };

  const handleSearchChange = (search: string) => {
    onFilterChange({ ...filters, search });
  };

  const handleClearFilters = () => {
    onFilterChange({
      action_type: '',
      target_entity: '',
      user_id: '',
      tenant_id: '',
      start_date: '',
      end_date: '',
      search: '',
    });
  };

  const handleExport = (format: 'csv' | 'json') => {
    setShowExportMenu(false);
    onExport(format);
  };

  const hasActiveFilters =
    filters.action_type !== '' ||
    filters.target_entity !== '' ||
    filters.user_id !== '' ||
    filters.tenant_id !== '' ||
    filters.start_date !== '' ||
    filters.end_date !== '' ||
    filters.search !== '';

  // Action type options
  const actionTypes = [
    { value: '', label: language === 'zh' ? '所有操作' : 'All Actions' },
    { value: 'tenant.create', label: language === 'zh' ? '创建租户' : 'Tenant Created' },
    { value: 'tenant.update', label: language === 'zh' ? '更新租户' : 'Tenant Updated' },
    { value: 'tenant.delete', label: language === 'zh' ? '删除租户' : 'Tenant Deleted' },
    { value: 'tenant.activate', label: language === 'zh' ? '激活租户' : 'Tenant Activated' },
    { value: 'tenant.deactivate', label: language === 'zh' ? '停用租户' : 'Tenant Deactivated' },
    { value: 'user.create', label: language === 'zh' ? '创建用户' : 'User Created' },
    { value: 'user.update', label: language === 'zh' ? '更新用户' : 'User Updated' },
    { value: 'user.delete', label: language === 'zh' ? '删除用户' : 'User Deleted' },
    { value: 'user.migrate', label: language === 'zh' ? '迁移用户' : 'User Migrated' },
    { value: 'user.impersonate', label: language === 'zh' ? '模拟用户' : 'User Impersonated' },
    { value: 'admin.create', label: language === 'zh' ? '创建管理员' : 'Admin Created' },
    { value: 'admin.update', label: language === 'zh' ? '更新管理员' : 'Admin Updated' },
    { value: 'admin.revoke', label: language === 'zh' ? '撤销管理员' : 'Admin Revoked' },
    { value: 'password.reset', label: language === 'zh' ? '重置密码' : 'Password Reset' },
    { value: 'settings.update', label: language === 'zh' ? '更新设置' : 'Settings Updated' },
    { value: 'audit_logs.export', label: language === 'zh' ? '导出日志' : 'Logs Exported' },
  ];

  // Entity type options
  const entityTypes = [
    { value: '', label: language === 'zh' ? '所有实体' : 'All Entities' },
    { value: 'tenants', label: language === 'zh' ? '租户' : 'Tenants' },
    { value: 'profiles', label: language === 'zh' ? '用户资料' : 'Profiles' },
    { value: 'users', label: language === 'zh' ? '用户' : 'Users' },
    { value: 'admins', label: language === 'zh' ? '管理员' : 'Admins' },
    { value: 'settings', label: language === 'zh' ? '设置' : 'Settings' },
    { value: 'audit_logs', label: language === 'zh' ? '审计日志' : 'Audit Logs' },
  ];

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg shadow p-4 border border-orange-200">
      <div className="flex flex-col space-y-4">
        {/* Date Range Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <T zh="开始日期" en="Start Date" />
            </label>
            <input
              type="datetime-local"
              value={filters.start_date}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <T zh="结束日期" en="End Date" />
            </label>
            <input
              type="datetime-local"
              value={filters.end_date}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Action Type Filter */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-orange-500 flex-shrink-0" />
            <select
              value={filters.action_type}
              onChange={(e) => handleActionTypeChange(e.target.value)}
              className="flex-1 px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              {actionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Entity Type Filter */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-orange-500 flex-shrink-0" />
            <select
              value={filters.target_entity}
              onChange={(e) => handleTargetEntityChange(e.target.value)}
              className="flex-1 px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              {entityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tenant Filter */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-orange-500 flex-shrink-0" />
            <select
              value={filters.tenant_id}
              onChange={(e) => handleTenantChange(e.target.value)}
              disabled={isLoadingTenants}
              className="flex-1 px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value=""><T zh="所有租户" en="All Tenants" /></option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search and Actions Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400" />
              <input
                type="text"
                placeholder={language === 'zh' ? '按用户邮箱或实体ID搜索...' : 'Search by user email or entity ID...'}
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Export Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={isExporting}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                <span>{isExporting ? <T zh="导出中..." en="Exporting..." /> : <T zh="导出" en="Export" />}</span>
              </button>

              {/* Export Dropdown Menu */}
              {showExportMenu && !isExporting && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-t-lg transition-colors"
                  >
                    <T zh="导出为 CSV" en="Export as CSV" />
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-b-lg transition-colors"
                  >
                    <T zh="导出为 JSON" en="Export as JSON" />
                  </button>
                </div>
              )}
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
                <span><T zh="清除" en="Clear" /></span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
