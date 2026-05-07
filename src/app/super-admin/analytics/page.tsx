'use client';

import { useEffect, useState } from 'react';
import { withSuperAdminAuth } from '@/lib/auth/withSuperAdminAuth';
import SuperAdminLayout from '@/components/super-admin/SuperAdminLayout';
import AnalyticsChart from '@/components/super-admin/AnalyticsChart';
import AnalyticsMetricsCard from '@/components/super-admin/AnalyticsMetricsCard';
import TenantComparisonTable from '@/components/super-admin/TenantComparisonTable';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ChartBarIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

interface SystemMetrics {
  totalUsers: number;
  totalConsultations: number;
  totalRevenue: number;
  activeLawyers: number;
  userGrowth: number;
  consultationGrowth: number;
  revenueGrowth: number;
  lawyerGrowth: number;
}

interface TenantMetrics {
  tenantId: string;
  tenantName: string;
  userCount: number;
  consultationCount: number;
  revenue: number;
  activeLawyers: number;
}

interface TrendData {
  date: string;
  users: number;
  consultations: number;
  revenue: number;
}

type DateRange = 'daily' | 'weekly' | 'monthly';
type ChartType = 'line' | 'bar';
type MetricType = 'users' | 'consultations' | 'revenue' | 'all';

function AnalyticsPage() {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [tenantMetrics, setTenantMetrics] = useState<TenantMetrics[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>('monthly');
  const [selectedTenant, setSelectedTenant] = useState<string>('all');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('all');
  const { t } = useLanguage();

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, selectedTenant]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      // Placeholder data for now
      setSystemMetrics({
        totalUsers: 1250,
        totalConsultations: 3450,
        totalRevenue: 875000,
        activeLawyers: 85,
        userGrowth: 12.5,
        consultationGrowth: 8.3,
        revenueGrowth: 15.7,
        lawyerGrowth: 5.2,
      });

      setTenantMetrics([
        {
          tenantId: '1',
          tenantName: 'Tenant A',
          userCount: 450,
          consultationCount: 1200,
          revenue: 320000,
          activeLawyers: 30,
        },
        {
          tenantId: '2',
          tenantName: 'Tenant B',
          userCount: 380,
          consultationCount: 980,
          revenue: 245000,
          activeLawyers: 25,
        },
        {
          tenantId: '3',
          tenantName: 'Tenant C',
          userCount: 420,
          consultationCount: 1270,
          revenue: 310000,
          activeLawyers: 30,
        },
      ]);

      // Generate sample trend data
      const trends: TrendData[] = [];
      const days = dateRange === 'daily' ? 7 : dateRange === 'weekly' ? 12 : 12;
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        trends.push({
          date: date.toISOString().split('T')[0],
          users: Math.floor(Math.random() * 100) + 50,
          consultations: Math.floor(Math.random() * 200) + 100,
          revenue: Math.floor(Math.random() * 50000) + 20000,
        });
      }
      setTrendData(trends);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const response = await fetch(
        `/api/super-admin/analytics/export?format=${format}&dateRange=${dateRange}&tenant=${selectedTenant}`,
        { method: 'POST' }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('导出失败，请稍后重试');
      }
    } catch (error) {
      console.error('Error exporting analytics:', error);
      alert('导出失败，请稍后重试');
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

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('analytics.title') || '数据分析'}
            </h1>
            <p className="text-gray-600 mt-2">
              {t('analytics.subtitle') || '查看系统和租户的分析数据'}
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">导出 CSV</span>
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap"
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">导出 PDF</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">时间范围:</span>
            </div>
            <div className="flex space-x-2">
              {(['daily', 'weekly', 'monthly'] as DateRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    dateRange === range
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range === 'daily' ? '每日' : range === 'weekly' ? '每周' : '每月'}
                </button>
              ))}
            </div>
            <div className="ml-auto">
              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">所有租户</option>
                {tenantMetrics.map((tenant) => (
                  <option key={tenant.tenantId} value={tenant.tenantId}>
                    {tenant.tenantName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* System Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnalyticsMetricsCard
            title="总用户数"
            value={systemMetrics?.totalUsers || 0}
            trend={systemMetrics?.userGrowth}
            icon={<UsersIcon className="w-5 h-5" />}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          
          <AnalyticsMetricsCard
            title="总咨询数"
            value={systemMetrics?.totalConsultations || 0}
            trend={systemMetrics?.consultationGrowth}
            icon={<ChatBubbleLeftRightIcon className="w-5 h-5" />}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />
          
          <AnalyticsMetricsCard
            title="总收入"
            value={systemMetrics?.totalRevenue || 0}
            trend={systemMetrics?.revenueGrowth}
            icon={<CurrencyDollarIcon className="w-5 h-5" />}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
            formatValue={(value) => `¥${(value as number).toLocaleString()}`}
          />
          
          <AnalyticsMetricsCard
            title="活跃律师"
            value={systemMetrics?.activeLawyers || 0}
            trend={systemMetrics?.lawyerGrowth}
            icon={<BriefcaseIcon className="w-5 h-5" />}
            iconBgColor="bg-orange-100"
            iconColor="text-orange-600"
          />
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">趋势分析</h2>
            <div className="flex items-center space-x-2">
              {/* Chart Type Toggle */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    chartType === 'line'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  折线图
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    chartType === 'bar'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  柱状图
                </button>
              </div>
              
              {/* Metric Selector */}
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">全部指标</option>
                <option value="users">用户数</option>
                <option value="consultations">咨询数</option>
                <option value="revenue">收入</option>
              </select>
            </div>
          </div>
          
          <div className="h-80">
            <AnalyticsChart
              data={trendData}
              type={chartType}
              metric={selectedMetric}
            />
          </div>
        </div>

        {/* Tenant Comparison Table */}
        <TenantComparisonTable tenants={tenantMetrics} />
      </div>
    </SuperAdminLayout>
  );
}

export default withSuperAdminAuth(AnalyticsPage);
