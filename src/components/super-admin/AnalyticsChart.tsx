'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TrendData {
  date: string;
  users: number;
  consultations: number;
  revenue: number;
}

interface AnalyticsChartProps {
  data: TrendData[];
  type: 'line' | 'bar';
  metric: 'users' | 'consultations' | 'revenue' | 'all';
}

export default function AnalyticsChart({ data, type, metric }: AnalyticsChartProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const formatRevenue = (value: number) => {
    if (value >= 1000000) {
      return `¥${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `¥${(value / 1000).toFixed(0)}K`;
    }
    return `¥${value}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === '收入' ? formatRevenue(entry.value) : entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartData = data.map((item) => ({
    date: formatDate(item.date),
    用户数: item.users,
    咨询数: item.consultations,
    收入: item.revenue,
  }));

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) =>
              metric === 'revenue' ? formatRevenue(value) : value.toLocaleString()
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          
          {(metric === 'users' || metric === 'all') && (
            <Line
              type="monotone"
              dataKey="用户数"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
          
          {(metric === 'consultations' || metric === 'all') && (
            <Line
              type="monotone"
              dataKey="咨询数"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: '#10B981', r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
          
          {(metric === 'revenue' || metric === 'all') && (
            <Line
              type="monotone"
              dataKey="收入"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: '#8B5CF6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="date"
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) =>
            metric === 'revenue' ? formatRevenue(value) : value.toLocaleString()
          }
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '14px' }} />
        
        {(metric === 'users' || metric === 'all') && (
          <Bar dataKey="用户数" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        )}
        
        {(metric === 'consultations' || metric === 'all') && (
          <Bar dataKey="咨询数" fill="#10B981" radius={[4, 4, 0, 0]} />
        )}
        
        {(metric === 'revenue' || metric === 'all') && (
          <Bar dataKey="收入" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
