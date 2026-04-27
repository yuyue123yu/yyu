import { Briefcase, Home, Users, Shield, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Users,
    title: "家庭法",
    description: "离婚、监护权、财产分配",
    cases: "2,340+ 案例",
    avgPrice: "¥3,000 起",
    link: "/services/family",
    color: "from-blue-400 to-blue-500",
    badge: "热销"
  },
  {
    icon: Briefcase,
    title: "商业法",
    description: "公司注册、合同审查",
    cases: "1,890+ 案例",
    avgPrice: "¥2,500 起",
    link: "/services/business",
    color: "from-purple-400 to-purple-500",
    badge: "推荐"
  },
  {
    icon: Home,
    title: "房产法",
    description: "房产买卖、租赁合同",
    cases: "3,120+ 案例",
    avgPrice: "¥2,000 起",
    link: "/services/property",
    color: "from-green-400 to-green-500",
    badge: "热销"
  },
  {
    icon: Shield,
    title: "刑事法",
    description: "刑事辩护、法律代理",
    cases: "980+ 案例",
    avgPrice: "¥5,000 起",
    link: "/services/criminal",
    color: "from-red-400 to-red-500",
    badge: null
  },
  {
    icon: TrendingUp,
    title: "劳动法",
    description: "劳动纠纷、合同纠纷",
    cases: "1,560+ 案例",
    avgPrice: "¥2,800 起",
    link: "/services/employment",
    color: "from-orange-400 to-orange-500",
    badge: null
  },
  {
    icon: Briefcase,
    title: "知识产权",
    description: "专利、商标、版权",
    cases: "890+ 案例",
    avgPrice: "¥3,500 起",
    link: "/services/ip",
    color: "from-indigo-400 to-indigo-500",
    badge: "新"
  },
];

export default function Services() {
  return (
    <section className="py-8 bg-white border-b border-neutral-200">
      <div className="container mx-auto px-6">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-1">
              热门法律服务
            </h2>
            <p className="text-neutral-600 text-sm">
              选择您需要的法律服务类型
            </p>
          </div>
          <Link href="/services" className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1">
            查看全部
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 6 列网格 - 紧凑排列 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                href={service.link}
                key={index} 
                className="group bg-neutral-50 rounded-lg p-4 hover:shadow-md transition-all border border-neutral-200 hover:border-primary-300 cursor-pointer relative"
              >
                {/* 徽章 */}
                {service.badge && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    {service.badge}
                  </div>
                )}

                {/* 彩色背景 */}
                <div className={`bg-gradient-to-br ${service.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                
                {/* 标题 */}
                <h3 className="text-base font-bold text-neutral-900 mb-1">
                  {service.title}
                </h3>
                
                {/* 描述 */}
                <p className="text-xs text-neutral-600 mb-3 line-clamp-2">
                  {service.description}
                </p>
                
                {/* 底部信息 */}
                <div className="flex flex-col gap-2 text-xs text-neutral-500 pt-3 border-t border-neutral-100">
                  <div className="flex items-center justify-between">
                    <span>{service.cases}</span>
                    <span className="font-bold text-primary-600">{service.avgPrice}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
