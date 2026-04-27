"use client";

import { Briefcase, Home, Users, Shield, ArrowRight, TrendingUp, Scale } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const services = [
  {
    icon: Scale,
    titleKey: "services.debt",
    descKey: "services.debtDesc",
    cases: "2,850+",
    avgPrice: "RM 3,500",
    link: "/services/debt",
    color: "from-amber-400 to-amber-500",
    badge: "hot"
  },
  {
    icon: Users,
    titleKey: "services.family",
    descKey: "services.familyDesc",
    cases: "2,340+",
    avgPrice: "RM 3,000",
    link: "/services/family",
    color: "from-blue-400 to-blue-500",
    badge: null
  },
  {
    icon: Briefcase,
    titleKey: "services.business",
    descKey: "services.businessDesc",
    cases: "1,890+",
    avgPrice: "RM 2,500",
    link: "/services/business",
    color: "from-purple-400 to-purple-500",
    badge: "recommended"
  },
  {
    icon: Home,
    titleKey: "services.property",
    descKey: "services.propertyDesc",
    cases: "3,120+",
    avgPrice: "RM 2,000",
    link: "/services/property",
    color: "from-green-400 to-green-500",
    badge: "hot"
  },
  {
    icon: Shield,
    titleKey: "services.criminal",
    descKey: "services.criminalDesc",
    cases: "980+",
    avgPrice: "RM 5,000",
    link: "/services/criminal",
    color: "from-red-400 to-red-500",
    badge: null
  },
  {
    icon: TrendingUp,
    titleKey: "services.employment",
    descKey: "services.employmentDesc",
    cases: "1,560+",
    avgPrice: "RM 2,800",
    link: "/services/employment",
    color: "from-orange-400 to-orange-500",
    badge: null
  },
  {
    icon: Briefcase,
    titleKey: "services.ip",
    descKey: "services.ipDesc",
    cases: "890+",
    avgPrice: "RM 3,500",
    link: "/services/ip",
    color: "from-indigo-400 to-indigo-500",
    badge: "new"
  },
];

export default function Services() {
  const { t } = useLanguage();
  
  const getBadgeText = (badge: string | null) => {
    if (!badge) return null;
    if (badge === 'hot') return t('common.hot') || '热销';
    if (badge === 'recommended') return t('common.recommended') || '推荐';
    if (badge === 'new') return t('common.new') || '新';
    return badge;
  };

  return (
    <section className="py-8 bg-white border-b border-neutral-200">
      <div className="container mx-auto px-6">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-1">
              {t('home.hotServicesTitle')}
            </h2>
            <p className="text-neutral-600 text-sm">
              {t('home.hotServicesSubtitle')}
            </p>
          </div>
          <Link href="/services" className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1">
            {t('common.viewAll')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 7 列网格 - 紧凑排列 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            const badgeText = getBadgeText(service.badge);
            
            return (
              <Link
                href={service.link}
                key={index} 
                className="group bg-neutral-50 rounded-lg p-4 hover:shadow-md transition-all border border-neutral-200 hover:border-primary-300 cursor-pointer relative"
              >
                {/* 徽章 */}
                {badgeText && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    {badgeText}
                  </div>
                )}

                {/* 彩色背景 */}
                <div className={`bg-gradient-to-br ${service.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                
                {/* 标题 */}
                <h3 className="text-base font-bold text-neutral-900 mb-1">
                  {t(service.titleKey)}
                </h3>
                
                {/* 描述 */}
                <p className="text-xs text-neutral-600 mb-3 line-clamp-2">
                  {t(service.descKey)}
                </p>
                
                {/* 底部信息 */}
                <div className="flex flex-col gap-2 text-xs text-neutral-500 pt-3 border-t border-neutral-100">
                  <div className="flex items-center justify-between">
                    <span>{service.cases} {t('common.cases')}</span>
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
