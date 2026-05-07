'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import Link from 'next/link';

interface Service {
  id: string;
  name_zh: string;
  name_en: string;
  category: string;
  base_price: number;
  currency: string;
  case_count: number;
  is_active: boolean;
  is_featured: boolean;
  badge: string | null;
  display_order: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      setServices(data.services || []);
    } catch (error) {
      console.error('獲取服務列表失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/admin/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      fetchServices();
    } catch (error) {
      console.error('更新服務狀態失敗:', error);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('確定要刪除此服務嗎？')) return;

    try {
      await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
      });
      fetchServices();
    } catch (error) {
      console.error('刪除服務失敗:', error);
    }
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      'MYR': 'RM',
      'USD': '$',
      'SGD': 'S$',
      'CNY': '¥',
    };
    return symbols[currency] || currency;
  };

  const getBadgeColor = (badge: string | null) => {
    if (!badge) return '';
    if (badge === 'hot') return 'bg-red-100 text-red-600';
    if (badge === 'recommended') return 'bg-blue-100 text-blue-600';
    if (badge === 'new') return 'bg-green-100 text-green-600';
    return 'bg-gray-100 text-gray-600';
  };

  const getBadgeText = (badge: string | null) => {
    if (!badge) return '';
    if (badge === 'hot') return '🔥 熱門';
    if (badge === 'recommended') return '⭐ 推薦';
    if (badge === 'new') return '✨ 新品';
    return badge;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加載中...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">服務管理</h1>
          <p className="text-gray-600 mt-1">管理所有法律服務的信息、價格和顯示設置</p>
        </div>
        <Link
          href="/admin/services/new"
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          添加服務
        </Link>
      </div>

      {/* 服務列表 */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  排序
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  服務名稱
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  價格
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  案件數
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  標籤
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  狀態
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    暫無服務，點擊「添加服務」創建第一個服務
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                        <span className="text-sm text-gray-500">#{service.display_order}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{service.name_zh}</div>
                        <div className="text-sm text-gray-500">{service.name_en}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getCurrencySymbol(service.currency)} {service.base_price.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{service.case_count}+</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {service.badge && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(service.badge)}`}>
                          {getBadgeText(service.badge)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleActive(service.id, service.is_active)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          service.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {service.is_active ? (
                          <>
                            <Eye className="w-3 h-3" />
                            啟用
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            停用
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/services/${service.id}`}
                          className="text-orange-600 hover:text-orange-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteService(service.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 統計信息 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">總服務數</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{services.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">啟用服務</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {services.filter(s => s.is_active).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">推薦服務</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {services.filter(s => s.is_featured).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">總案件數</div>
          <div className="text-2xl font-bold text-orange-600 mt-1">
            {services.reduce((sum, s) => sum + s.case_count, 0)}+
          </div>
        </div>
      </div>
    </div>
  );
}
