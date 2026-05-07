'use client';

import { useState } from 'react';
import {
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

interface TenantMetrics {
  tenantId: string;
  tenantName: string;
  userCount: number;
  consultationCount: number;
  revenue: number;
  activeLawyers: number;
}

interface TenantComparisonTableProps {
  tenants: TenantMetrics[];
}

type SortField = 'tenantName' | 'userCount' | 'consultationCount' | 'revenue' | 'activeLawyers';
type SortDirection = 'asc' | 'desc';

export default function TenantComparisonTable({ tenants }: TenantComparisonTableProps) {
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedTenants = [...tenants].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return sortDirection === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronUpIcon className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUpIcon className="w-4 h-4 text-orange-600" />
    ) : (
      <ChevronDownIcon className="w-4 h-4 text-orange-600" />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">租户对比</h2>
        <p className="text-sm text-gray-600 mt-1">点击列标题进行排序</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort('tenantName')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>租户名称</span>
                  <SortIcon field="tenantName" />
                </div>
              </th>
              <th
                onClick={() => handleSort('userCount')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>用户数</span>
                  <SortIcon field="userCount" />
                </div>
              </th>
              <th
                onClick={() => handleSort('consultationCount')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>咨询数</span>
                  <SortIcon field="consultationCount" />
                </div>
              </th>
              <th
                onClick={() => handleSort('revenue')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>收入</span>
                  <SortIcon field="revenue" />
                </div>
              </th>
              <th
                onClick={() => handleSort('activeLawyers')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>活跃律师</span>
                  <SortIcon field="activeLawyers" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTenants.map((tenant, index) => (
              <tr 
                key={tenant.tenantId} 
                className={`hover:bg-gray-50 transition-colors ${
                  index < 3 ? 'bg-orange-50/30' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {index < 3 && (
                      <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-xs font-bold text-white bg-orange-600 rounded-full">
                        {index + 1}
                      </span>
                    )}
                    <div className="text-sm font-medium text-gray-900">
                      {tenant.tenantName}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-medium">
                    {tenant.userCount.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-medium">
                    {tenant.consultationCount.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-bold">
                    ¥{tenant.revenue.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-medium">
                    {tenant.activeLawyers}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {sortedTenants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">暂无租户数据</p>
        </div>
      )}
    </div>
  );
}
