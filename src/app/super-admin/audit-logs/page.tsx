'use client';

import { useEffect, useState } from 'react';
import { withSuperAdminAuth } from '@/lib/auth/withSuperAdminAuth';
import SuperAdminLayout from '@/components/super-admin/SuperAdminLayout';
import AuditLogTable from '@/components/super-admin/AuditLogTable';
import AuditLogFilters from '@/components/super-admin/AuditLogFilters';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuditLog {
  id: string;
  action_type: string;
  target_entity: string;
  target_id: string | null;
  user_id: string | null;
  tenant_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  changes: Record<string, any> | null;
  created_at: string;
}

function AuditLogsPage() {
  const { t } = useLanguage();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [filters, setFilters] = useState({
    action_type: '',
    target_entity: '',
    user_id: '',
    tenant_id: '',
    start_date: '',
    end_date: '',
    search: '',
  });
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [currentPage, filters]);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      
      // Build query params
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '50',
      });

      if (filters.action_type) params.append('action_type', filters.action_type);
      if (filters.target_entity) params.append('target_entity', filters.target_entity);
      if (filters.user_id) params.append('user_id', filters.user_id);
      if (filters.tenant_id) params.append('tenant_id', filters.tenant_id);
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);

      const response = await fetch(`/api/super-admin/audit-logs?${params}`);
      const data = await response.json();

      if (data.success) {
        setLogs(data.logs);
        setTotalPages(data.totalPages);
        setTotalLogs(data.total);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      setIsExporting(true);

      // Build query params with filters
      const params = new URLSearchParams({ format });

      if (filters.action_type) params.append('action_type', filters.action_type);
      if (filters.target_entity) params.append('target_entity', filters.target_entity);
      if (filters.user_id) params.append('user_id', filters.user_id);
      if (filters.tenant_id) params.append('tenant_id', filters.tenant_id);
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);

      const response = await fetch(`/api/super-admin/audit-logs/export?${params}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `audit-logs-${Date.now()}.${format}`;

      // Download file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      alert('Failed to export audit logs. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('auditLogs.title')}</h1>
            <p className="text-gray-600 mt-2">
              {t('auditLogs.activityRecords')}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Total Logs: <span className="font-semibold text-gray-900">{totalLogs.toLocaleString()}</span>
          </div>
        </div>

        {/* Filters */}
        <AuditLogFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onExport={handleExport}
          isExporting={isExporting}
        />

        {/* Audit Logs Table */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No audit logs found</p>
            {Object.values(filters).some((v) => v !== '') ? (
              <button
                onClick={() =>
                  setFilters({
                    action_type: '',
                    target_entity: '',
                    user_id: '',
                    tenant_id: '',
                    start_date: '',
                    end_date: '',
                    search: '',
                  })
                }
                className="mt-4 text-orange-600 hover:text-orange-700"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        ) : (
          <AuditLogTable logs={logs} />
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

export default withSuperAdminAuth(AuditLogsPage);
