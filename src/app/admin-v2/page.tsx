import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Users, Briefcase, MessageSquare, ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login');
  }

  // 服务端获取统计数据
  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: lawyersCount } = await supabase
    .from('lawyers')
    .select('*', { count: 'exact', head: true });

  const { count: consultationsCount } = await supabase
    .from('consultations')
    .select('*', { count: 'exact', head: true });

  const { count: pendingCount } = await supabase
    .from('consultations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { count: ordersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  const { data: ordersData } = await supabase
    .from('orders')
    .select('amount')
    .eq('status', 'paid');

  const revenue = ordersData?.reduce((sum, order) => sum + Number(order.amount), 0) || 0;

  const stats = {
    totalUsers: usersCount || 0,
    totalLawyers: lawyersCount || 0,
    totalConsultations: consultationsCount || 0,
    totalOrders: ordersCount || 0,
    pendingConsultations: pendingCount || 0,
    revenue,
  };

  const statCards = [
    {
      title: '总用户数',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: '认证律师',
      value: stats.totalLawyers,
      icon: Briefcase,
      color: 'bg-green-500',
      change: '+5%',
    },
    {
      title: '咨询总数',
      value: stats.totalConsultations,
      icon: MessageSquare,
      color: 'bg-purple-500',
      change: '+18%',
    },
    {
      title: '订单总数',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-orange-500',
      change: '+23%',
    },
    {
      title: '待处理咨询',
      value: stats.pendingConsultations,
      icon: TrendingUp,
      color: 'bg-red-500',
      change: '-8%',
    },
    {
      title: '总收入 (RM)',
      value: stats.revenue.toFixed(2),
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: '+31%',
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">仪表板</h1>
        <p className="text-neutral-600 mt-2">欢迎回到 LegalMY 管理后台</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className={`text-sm font-semibold ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-neutral-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Consultations */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">最近咨询</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <div className="font-medium text-neutral-900">咨询 #{i}</div>
                  <div className="text-sm text-neutral-600">2小时前</div>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                  待处理
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">最近订单</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <div className="font-medium text-neutral-900">订单 #{1000 + i}</div>
                  <div className="text-sm text-neutral-600">RM {(Math.random() * 500 + 100).toFixed(2)}</div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  已支付
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
