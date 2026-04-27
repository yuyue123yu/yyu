"use client";

import { Search, ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SearchFilters() {
  const { t } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: "all",
    rating: "all",
    responseTime: "all",
    location: "all",
    specialty: "all"
  });

  const toggleFilter = (filterType: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType as keyof typeof prev] === value ? "all" : value
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      priceRange: "all",
      rating: "all",
      responseTime: "all",
      location: "all",
      specialty: "all"
    });
  };

  const hasActiveFilters = Object.values(selectedFilters).some(v => v !== "all");

  return (
    <section className="bg-white border-b border-neutral-200 sticky top-0 z-40">
      <div className="container mx-auto px-6 py-3">
        {/* 搜索框 */}
        <div className="mb-2 md:mb-3">
          <div className="relative">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-4 md:h-5 w-4 md:w-5 text-neutral-400" />
            <input
              type="text"
              placeholder={t('home.searchLawyers')}
              className="w-full pl-9 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-xs md:text-sm"
            />
          </div>
        </div>

        {/* 筛选按钮和排序 */}
        <div className="flex items-center justify-between gap-2 md:gap-3 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-all text-xs md:text-sm font-medium"
          >
            <ChevronDown className="h-3 md:h-4 w-3 md:w-4" />
            {t('home.filterBy')}
            {hasActiveFilters && (
              <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-xs">
                {Object.values(selectedFilters).filter(v => v !== "all").length}
              </span>
            )}
          </button>

          {/* 排序选项 */}
          <div className="flex items-center gap-1 md:gap-2">
            <span className="text-xs md:text-sm text-neutral-600">{t('home.sortBy')}:</span>
            <select className="px-2 md:px-3 py-1.5 md:py-2 border border-neutral-300 rounded-lg text-xs md:text-sm focus:outline-none focus:border-primary-500">
              <option>{t('common.hot')}</option>
              <option>{t('common.rating')}</option>
              <option>{t('common.price')}</option>
              <option>{t('common.new')}</option>
            </select>
          </div>

          {/* 清除筛选 */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-0.5 md:gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              <X className="h-3 md:h-4 w-3 md:w-4" />
              {t('home.clearFilters')}
            </button>
          )}
        </div>

        {/* 展开的筛选面板 */}
        {showFilters && (
          <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-neutral-200 grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-6">
            {/* 价格筛选 */}
            <div>
              <h4 className="font-semibold text-xs md:text-sm mb-2 md:mb-3 text-neutral-900">{t('home.priceRange')}</h4>
              <div className="space-y-1.5 md:space-y-2">
                {[
                  { label: t('home.all'), value: "all" },
                  { label: "RM 0-500", value: "0-500" },
                  { label: "RM 500-1000", value: "500-1000" },
                  { label: "RM 1000-2000", value: "1000-2000" },
                  { label: "RM 2000+", value: "2000+" }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-1.5 md:gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.priceRange === option.value}
                      onChange={() => toggleFilter("priceRange", option.value)}
                      className="w-3 h-3 md:w-4 md:h-4 rounded border-neutral-300"
                    />
                    <span className="text-xs md:text-sm text-neutral-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 评分筛选 */}
            <div>
              <h4 className="font-semibold text-xs md:text-sm mb-2 md:mb-3 text-neutral-900">{t('common.rating')}</h4>
              <div className="space-y-1.5 md:space-y-2">
                {[
                  { label: t('home.all'), value: "all" },
                  { label: "4.9-5.0 ⭐", value: "4.9" },
                  { label: "4.7-4.8 ⭐", value: "4.7" },
                  { label: "4.5-4.6 ⭐", value: "4.5" },
                  { label: "4.0+ ⭐", value: "4.0" }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-1.5 md:gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.rating === option.value}
                      onChange={() => toggleFilter("rating", option.value)}
                      className="w-3 h-3 md:w-4 md:h-4 rounded border-neutral-300"
                    />
                    <span className="text-xs md:text-sm text-neutral-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 响应时间筛选 */}
            <div>
              <h4 className="font-semibold text-xs md:text-sm mb-2 md:mb-3 text-neutral-900">{t('home.responseTime')}</h4>
              <div className="space-y-1.5 md:space-y-2">
                {[
                  { label: t('home.all'), value: "all" },
                  { label: "30 " + t('home.minutes'), value: "30min" },
                  { label: "1h", value: "1h" },
                  { label: "2h", value: "2h" },
                  { label: "4h", value: "4h" }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-1.5 md:gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.responseTime === option.value}
                      onChange={() => toggleFilter("responseTime", option.value)}
                      className="w-3 h-3 md:w-4 md:h-4 rounded border-neutral-300"
                    />
                    <span className="text-xs md:text-sm text-neutral-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 地区筛选 */}
            <div>
              <h4 className="font-semibold text-xs md:text-sm mb-2 md:mb-3 text-neutral-900">{t('home.location')}</h4>
              <div className="space-y-1.5 md:space-y-2">
                {[
                  { label: t('home.all'), value: "all" },
                  { label: "Kuala Lumpur", value: "kl" },
                  { label: "Penang", value: "penang" },
                  { label: "Johor", value: "johor" },
                  { label: "Selangor", value: "selangor" }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-1.5 md:gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.location === option.value}
                      onChange={() => toggleFilter("location", option.value)}
                      className="w-3 h-3 md:w-4 md:h-4 rounded border-neutral-300"
                    />
                    <span className="text-xs md:text-sm text-neutral-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 专业领域筛选 */}
            <div>
              <h4 className="font-semibold text-xs md:text-sm mb-2 md:mb-3 text-neutral-900">{t('home.specialty')}</h4>
              <div className="space-y-1.5 md:space-y-2">
                {[
                  { label: t('home.all'), value: "all", labelKey: undefined },
                  { label: "", labelKey: "services.business", value: "business" },
                  { label: "", labelKey: "services.family", value: "family" },
                  { label: "", labelKey: "services.property", value: "property" },
                  { label: "", labelKey: "services.criminal", value: "criminal" }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-1.5 md:gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.specialty === option.value}
                      onChange={() => toggleFilter("specialty", option.value)}
                      className="w-3 h-3 md:w-4 md:h-4 rounded border-neutral-300"
                    />
                    <span className="text-xs md:text-sm text-neutral-700">
                      {option.labelKey ? t(option.labelKey) : option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
