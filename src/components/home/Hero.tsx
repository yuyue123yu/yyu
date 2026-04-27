"use client";

import Link from "next/link";
import { Search, Shield, Clock, Award, ChevronRight, ShoppingCart, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white overflow-hidden">
      <div className="container mx-auto px-6 py-6 md:py-10">
        <div className="max-w-7xl mx-auto">
          {/* 顶部导航栏 - 搜索 + 购物车 */}
          <div className="mb-4 md:mb-6">
            <div className="flex gap-2 md:gap-3 items-center flex-col md:flex-row">
              <div className="flex-1 w-full bg-white rounded-lg p-2 md:p-3 shadow-lg flex items-center gap-2 md:gap-3">
                <Search className="h-4 md:h-5 w-4 md:w-5 text-neutral-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder={t('home.searchLawyers')}
                  className="flex-1 py-1 md:py-2 text-neutral-900 outline-none text-xs md:text-sm placeholder:text-neutral-400"
                />
              </div>
              <button className="bg-accent-500 hover:bg-accent-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all text-xs md:text-sm w-full md:w-auto">
                {t('home.searchButton')}
              </button>
              <div className="flex gap-2 w-full md:w-auto">
                <Link href="/cart" className="flex-1 md:flex-none bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 md:p-3 rounded-lg border border-white/30 transition-all">
                  <ShoppingCart className="h-4 md:h-5 w-4 md:w-5 text-white mx-auto" />
                </Link>
                <Link href="/favorites" className="flex-1 md:flex-none bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 md:p-3 rounded-lg border border-white/30 transition-all">
                  <Heart className="h-4 md:h-5 w-4 md:w-5 text-white mx-auto" />
                </Link>
              </div>
            </div>
          </div>

          {/* 轮播 Banner - 3 个法律产品 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-5">
            {/* Banner 1 - 法律文书模板 */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg md:rounded-xl p-3 md:p-5 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 md:w-32 h-24 md:h-32 bg-white/10 rounded-full blur-2xl -mr-12 md:-mr-16 -mt-12 md:-mt-16"></div>
              <div className="relative z-10">
                <div className="text-accent-400 text-xs font-bold mb-0.5 md:mb-1">📄 {t('common.templates')}</div>
                <h3 className="text-base md:text-lg font-bold mb-0.5 md:mb-1">{t('home.legalTemplates')}</h3>
                <p className="text-xs text-white/90 mb-1.5 md:mb-2">500+ {t('home.professionalTemplates')}</p>
                <Link href="/templates" className="inline-flex items-center gap-1 bg-white text-red-600 px-2 md:px-3 py-1 md:py-1.5 rounded-lg font-bold text-xs hover:bg-neutral-100 transition-all">
                  {t('home.browseTemplates')}
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Banner 2 - 法律咨询服务 */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg md:rounded-xl p-3 md:p-5 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 md:w-32 h-24 md:h-32 bg-white/10 rounded-full blur-2xl -mr-12 md:-mr-16 -mt-12 md:-mt-16"></div>
              <div className="relative z-10">
                <div className="text-accent-400 text-xs font-bold mb-0.5 md:mb-1">💬 {t('common.consultation')}</div>
                <h3 className="text-base md:text-lg font-bold mb-0.5 md:mb-1">{t('home.onlineLawyerConsultation')}</h3>
                <p className="text-xs text-white/90 mb-1.5 md:mb-2">RM 99 {t('home.consultationFrom')}</p>
                <Link href="/consultation" className="inline-flex items-center gap-1 bg-white text-blue-600 px-2 md:px-3 py-1 md:py-1.5 rounded-lg font-bold text-xs hover:bg-neutral-100 transition-all">
                  {t('home.consultNow')}
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Banner 3 - 法律文件审核 */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg md:rounded-xl p-3 md:p-5 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 md:w-32 h-24 md:h-32 bg-white/10 rounded-full blur-2xl -mr-12 md:-mr-16 -mt-12 md:-mt-16"></div>
              <div className="relative z-10">
                <div className="text-accent-400 text-xs font-bold mb-0.5 md:mb-1">✅ {t('home.contractReview')}</div>
                <h3 className="text-base md:text-lg font-bold mb-0.5 md:mb-1">{t('home.contractReview')}</h3>
                <p className="text-xs text-white/90 mb-1.5 md:mb-2">RM 299 {t('home.reviewFrom')}</p>
                <Link href="/review" className="inline-flex items-center gap-1 bg-white text-purple-600 px-2 md:px-3 py-1 md:py-1.5 rounded-lg font-bold text-xs hover:bg-neutral-100 transition-all">
                  {t('home.submitReview')}
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* 分类导航 - 6-8 个主要服务 */}
          <div className="mb-4 md:mb-5">
            <h3 className="text-xs font-bold text-white mb-2 md:mb-3">{t('home.hotCategories')}</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-2">
              {[
                { nameKey: 'services.debt', id: 'debt', icon: '⚖️' },
                { nameKey: 'services.family', id: 'family', icon: '👨‍👩‍👧' },
                { nameKey: 'services.business', id: 'business', icon: '💼' },
                { nameKey: 'services.property', id: 'property', icon: '🏠' },
                { nameKey: 'services.criminal', id: 'criminal', icon: '⚖️' },
                { nameKey: 'services.employment', id: 'employment', icon: '👔' },
                { nameKey: 'services.ip', id: 'ip', icon: '💡' },
              ].map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.id}`}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs font-medium border border-white/30 transition-all text-center"
                >
                  <div className="text-sm md:text-base mb-0.5">{service.icon}</div>
                  <div className="text-xs">{t(service.nameKey)}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* 信任指标 - 3 列 */}
          <div className="grid grid-cols-3 gap-2 md:gap-3 mt-4 md:mt-5">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-white/20 text-center">
              <Shield className="h-4 md:h-5 w-4 md:w-5 mx-auto mb-1 md:mb-1.5 text-accent-400" />
              <div className="text-lg md:text-xl font-bold">500+</div>
              <div className="text-xs text-blue-100">{t('home.certifiedLawyers')}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-white/20 text-center">
              <Clock className="h-4 md:h-5 w-4 md:w-5 mx-auto mb-1 md:mb-1.5 text-accent-400" />
              <div className="text-lg md:text-xl font-bold">2h</div>
              <div className="text-xs text-blue-100">{t('home.avgResponse')}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-white/20 text-center">
              <Award className="h-4 md:h-5 w-4 md:w-5 mx-auto mb-1 md:mb-1.5 text-accent-400" />
              <div className="text-lg md:text-xl font-bold">4.9/5</div>
              <div className="text-xs text-blue-100">{t('home.clientRating')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
