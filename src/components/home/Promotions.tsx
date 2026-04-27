"use client";

import { FileText, Users, Briefcase, BookOpen } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Promotions() {
  const { t } = useLanguage();
  
  return (
    <section className="py-4 bg-white border-b border-neutral-200">
      <div className="container mx-auto px-6">
        {/* 法律产品区 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mb-2 md:mb-3">
          {/* 产品 1 - 法律文书模板 */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-red-300 relative overflow-hidden">
            <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-red-500 text-white text-xs font-bold px-1.5 md:px-2 py-0.5 rounded-full">
              {t('common.hot')}
            </div>
            <FileText className="h-4 md:h-5 w-4 md:w-5 text-red-600 mb-1.5 md:mb-2" />
            <h3 className="font-bold text-neutral-900 mb-0.5 text-xs md:text-sm">{t('home.legalTemplates')}</h3>
            <p className="text-xs text-neutral-700 mb-1.5 md:mb-2">500+ {t('home.professionalTemplates')} <span className="font-bold text-red-600">{t('home.freeDownload')}</span></p>
            <Link href="/templates" className="text-red-600 hover:text-red-700 text-xs font-semibold">
              {t('home.browseTemplates')} →
            </Link>
          </div>

          {/* 产品 2 - 在线律师咨询 */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-blue-300">
            <Users className="h-4 md:h-5 w-4 md:w-5 text-blue-600 mb-1.5 md:mb-2" />
            <h3 className="font-bold text-neutral-900 mb-0.5 text-xs md:text-sm">{t('home.onlineLawyerConsultation')}</h3>
            <p className="text-xs text-neutral-700 mb-1.5 md:mb-2">RM 99 {t('home.consultationFrom')} <span className="font-bold text-blue-600">{t('home.replyWithin')}</span></p>
            <Link href="/consultation" className="text-blue-600 hover:text-blue-700 text-xs font-semibold">
              {t('home.consultNow')} →
            </Link>
          </div>

          {/* 产品 3 - 合同审核服务 */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-purple-300">
            <Briefcase className="h-4 md:h-5 w-4 md:w-5 text-purple-600 mb-1.5 md:mb-2" />
            <h3 className="font-bold text-neutral-900 mb-0.5 text-xs md:text-sm">{t('home.contractReview')}</h3>
            <p className="text-xs text-neutral-700 mb-1.5 md:mb-2">RM 299 {t('home.reviewFrom')} <span className="font-bold text-purple-600">{t('home.professionalReview')}</span></p>
            <Link href="/review" className="text-purple-600 hover:text-purple-700 text-xs font-semibold">
              {t('home.submitReview')} →
            </Link>
          </div>

          {/* 产品 4 - 法律知识库 */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-amber-300">
            <BookOpen className="h-4 md:h-5 w-4 md:w-5 text-amber-600 mb-1.5 md:mb-2" />
            <h3 className="font-bold text-neutral-900 mb-0.5 text-xs md:text-sm">{t('home.legalKnowledgeBase')}</h3>
            <p className="text-xs text-neutral-700 mb-1.5 md:mb-2">1000+ {t('home.legalArticles')} <span className="font-bold text-amber-600">{t('home.freeReading')}</span></p>
            <Link href="/knowledge" className="text-amber-600 hover:text-amber-700 text-xs font-semibold">
              {t('home.viewArticles')} →
            </Link>
          </div>
        </div>

        {/* 热销排行 */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg md:rounded-xl p-4 md:p-5 text-white">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <h3 className="text-sm md:text-base font-bold">🔥 {t('home.topLawyersRanking')}</h3>
            <span className="text-xs bg-white/20 px-1.5 md:px-2 py-0.5 rounded-full">{t('home.weeklyUpdate')}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {[
              { rank: 1, name: "Ahmad Abdullah", specialty: t('services.business'), sales: "156" },
              { rank: 2, name: "Sarah Wong", specialty: t('services.family'), sales: "189" },
              { rank: 3, name: "Kumar Rajesh", specialty: t('services.property'), sales: "178" },
              { rank: 4, name: "Tan Mei Ling", specialty: t('services.family'), sales: "203" },
            ].map((item) => (
              <div key={item.rank} className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-white/20">
                <div className="text-lg md:text-xl font-bold text-accent-400 mb-0.5 md:mb-1">#{item.rank}</div>
                <p className="font-semibold text-xs mb-0.5">{item.name}</p>
                <p className="text-xs text-blue-100 mb-0.5 md:mb-1">{item.specialty}</p>
                <p className="text-xs text-accent-300 font-bold">{item.sales} {t('home.consultations')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
