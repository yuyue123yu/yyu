'use client';

import { useState } from 'react';
import T from '@/components/super-admin/T';
import {
  ClockIcon,
  UserIcon,
  CubeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

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

interface AuditLogTableProps {
  logs: AuditLog[];
}

export default function AuditLogTable({ logs }: AuditLogTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (logId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedRows(newExpanded);
  };

  const getActionColor = (actionType: string): string => {
    if (actionType.includes('create')) return 'text-green-600 bg-green-100';
    if (actionType.includes('update')) return 'text-blue-600 bg-blue-100';
    if (actionType.includes('delete')) return 'text-red-600 bg-red-100';
    if (actionType.includes('login')) return 'text-purple-600 bg-purple-100';
    return 'text-gray-600 bg-gray-100';
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatUserAgent = (userAgent: string | null): string => {
    if (!userAgent) return 'N/A';
    
    // Extract browser and OS info
    const browserMatch = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)\/[\d.]+/);
    const osMatch = userAgent.match(/(Windows|Mac OS|Linux|Android|iOS)/);
    
    const browser = browserMatch ? browserMatch[1] : 'Unknown';
    const os = osMatch ? osMatch[1] : 'Unknown';
    
    return `${browser} on ${os}`;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                {/* Expand column */}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <T zh="时间戳" en="Timestamp" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <T zh="操作" en="Action" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <T zh="用户" en="User" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <T zh="实体" en="Entity" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <T zh="IP地址" en="IP Address" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => {
              const isExpanded = expandedRows.has(log.id);
              
              return (
                <>
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleRow(log.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.changes ? (
                        isExpanded ? (
                          <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                        )
                      ) : null}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
                        {formatTimestamp(log.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionColor(
                          log.action_type
                        )}`}
                      >
                        {log.action_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                        {log.user_id ? (
                          <span className="truncate max-w-[150px]" title={log.user_id}>
                            {log.user_id.substring(0, 8)}...
                          </span>
                        ) : (
                          <T zh="系统" en="System" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <CubeIcon className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <div className="font-medium">{log.target_entity}</div>
                          {log.target_id && (
                            <div className="text-xs text-gray-500 truncate max-w-[150px]" title={log.target_id}>
                              {log.target_id.substring(0, 8)}...
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <GlobeAltIcon className="w-4 h-4 mr-2 text-gray-400" />
                        {log.ip_address || <T zh="不适用" en="N/A" />}
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded row with change details */}
                  {isExpanded && log.changes && (
                    <tr key={`${log.id}-details`} className="bg-gray-50">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="space-y-3">
                          <div className="flex items-start space-x-4">
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                <T zh="变更详情" en="Change Details" />
                              </h4>
                              <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <pre className="text-xs text-gray-800 overflow-x-auto whitespace-pre-wrap break-words">
                                  {JSON.stringify(log.changes, null, 2)}
                                </pre>
                              </div>
                            </div>
                            
                            {log.user_agent && (
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                  <T zh="用户代理" en="User Agent" />
                                </h4>
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                  <p className="text-xs text-gray-800">
                                    {formatUserAgent(log.user_agent)}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-2 break-all">
                                    {log.user_agent}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {log.tenant_id && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                <T zh="租户ID" en="Tenant ID" />
                              </h4>
                              <div className="bg-white rounded-lg p-3 border border-gray-200">
                                <p className="text-xs text-gray-800 font-mono">
                                  {log.tenant_id}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
