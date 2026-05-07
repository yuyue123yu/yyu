"use client";

import { Briefcase, Home, Users, Shield, ArrowRight, TrendingUp, Scale } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

// 圖標映射
const iconMap: Record<string, any> = {
  'Scale': Scale,
  'Users': Users,
  'Briefcase': Briefcase,
  'Home': Home,
  'Shield': Shield,
  'TrendingUp': TrendingUp,
};

// 顏色映射
const colorMap: Record<string, string> = {
  'debt': 'from-amber-400 to-amber-500',
  'family': 'from-blue-400 to-blue-500',
  'business': 'from-purple-400 to-purple-500',
  'property': 'from-green-400 to-green-500',
  'criminal': 'from-red-400 to-red-500',
  'employment': 'from-orange-400 to-orange-500',
  'ip': 'from-indigo-400 to-indigo-500',
};

interface Service {
  id: string;
  name_zh: string;
  name_en: string;
  name_tc: string;
  name_ms: string;
  description_zh: string;
  description_en: string;
  description_tc: string;
  description_ms: string;
  category: string;
  base_price: number;
  currency: string;
  case_count: number;
  is_active: boolean;
  is_featured: boolean;
  badge: string | null;
  icon_name: string;
  display_order: number;
}

export default function Services() {
  const { t, language } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 從 API 獲取服務列表
  useEffect(() => {
    fetch('/api/public/services')
      .then(res => res.json())
      .then(data => {
        setServices(data.services || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('獲取服務列表失敗:', err);
        setLoading(false);
      });
  }, []);

  // 獲取貨幣符號
  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      'MYR': 'RM',
      'USD': '$',
      'SGD': 'S$',
      'CNY': '¥',
    };
    return symbols[currency] || currency;
  };
  
  // 獲取徽章文本
  const getBadgeText = (badge: string | null) => {
    if (!badge) return null;
    if (badge === 'hot') return t('common.hot') || '熱銷';
    if (badge === 'recommended') return t('common.recommended') || '推薦';
    if (badge === 'new') return t('common.new') || '新';
    return badge;
  };

  // 根據語言獲取服務名稱
  const getServiceName = (service: Service) => {
    if (language === 'zh') return service.name_zh;
    if (language === 'tc') return service.name_tc;
    if (language === 'en') return service.name_en;
    if (language === 'ms') return service.name_ms;
    return service.name_tc; // 默認繁體中文
  };

  // 根據語言獲取服務描述
  const getServiceDescription = (service: Service) => {
    if (language === 'zh') return service.description_zh;
    if (language === 'tc') return service.description_tc;
    if (language === 'en') return service.description_en;
    if (language === 'ms') return service.description_ms;
    return service.description_tc; // 默認繁體中文
  };

  if (loading) {
    return (
      <section className="py-8 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">加載中...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white border-b border-neutral-200">
      <div className="container mx-auto px-6">
        {/* 標題 */}
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

        {/* 服務網格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {services.map((service) => {
            const Icon = iconMap[service.icon_name] || Briefcase;
            const badgeText = getBadgeText(service.badge);
            const color = colorMap[service.category] || 'from-gray-400 to-gray-500';
            const currencySymbol = getCurrencySymbol(service.currency);
            
            return (
              <Link
                href={`/services/${service.category}`}
                key={service.id} 
                className="group bg-neutral-50 rounded-lg p-4 hover:shadow-md transition-all border border-neutral-200 hover:border-primary-300 cursor-pointer relative"
              >
                {/* 徽章 */}
                {badgeText && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    {badgeText}
                  </div>
                )}

                {/* 彩色背景 */}
                <div className={`bg-gradient-to-br ${color} w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                
                {/* 標題 */}
                <h3 className="text-base font-bold text-neutral-900 mb-1">
                  {getServiceName(service)}
                </h3>
                
                {/* 描述 */}
                <p className="text-xs text-neutral-600 mb-3 line-clamp-2">
                  {getServiceDescription(service)}
                </p>
                
                {/* 底部信息 */}
                <div className="flex flex-col gap-2 text-xs text-neutral-500 pt-3 border-t border-neutral-100">
                  <div className="flex items-center justify-between">
                    <span>{service.case_count}+ {t('common.cases')}</span>
                    <span className="font-bold text-primary-600">
                      {currencySymbol} {service.base_price.toLocaleString()}
                    </span>
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
