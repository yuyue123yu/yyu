'use client';

import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

interface AnalyticsMetricsCardProps {
  title: string;
  value: number | string;
  trend?: number;
  trendLabel?: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  formatValue?: (value: number | string) => string;
}

export default function AnalyticsMetricsCard({
  title,
  value,
  trend,
  trendLabel = 'vs 上月',
  icon,
  iconBgColor,
  iconColor,
  formatValue,
}: AnalyticsMetricsCardProps) {
  const displayValue = formatValue && typeof value === 'number' 
    ? formatValue(value) 
    : typeof value === 'number' 
    ? value.toLocaleString() 
    : value;

  const trendColor = trend && trend > 0 ? 'text-green-600' : 'text-red-600';
  const TrendIcon = trend && trend > 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div
          className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}
        >
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
      
      <p className="text-3xl font-bold text-gray-900 mb-2">
        {displayValue}
      </p>
      
      {trend !== undefined && (
        <div className="flex items-center">
          <TrendIcon className={`w-4 h-4 ${trendColor} mr-1`} />
          <span className={`text-sm ${trendColor} font-medium`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-sm text-gray-500 ml-2">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}
