import { TrendingUp, Users, Award, Clock } from "lucide-react";

const stats = [
  {
    icon: Users,
    number: "50,000+",
    label: "服务客户",
    growth: "+23% 本月"
  },
  {
    icon: Award,
    number: "500+",
    label: "认证律师",
    growth: "覆盖全马"
  },
  {
    icon: Clock,
    number: "2 小时",
    label: "平均响应",
    growth: "98% 满意度"
  },
  {
    icon: TrendingUp,
    number: "RM 2.5M",
    label: "为客户节省",
    growth: "2024 年度"
  },
];

export default function Stats() {
  return (
    <section className="py-12 bg-neutral-800 border-y border-neutral-700">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center text-white">
                <Icon className="h-7 w-7 mx-auto mb-3 text-accent-500" />
                <div className="text-3xl md:text-4xl font-bold mb-1 text-white">{stat.number}</div>
                <div className="text-sm text-neutral-300 mb-1 font-medium">{stat.label}</div>
                <div className="text-xs text-neutral-400">{stat.growth}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
