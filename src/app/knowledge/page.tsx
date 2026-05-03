"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { 
  fetchLegalArticles, 
  knowledgeCategories, 
  type LegalArticle 
} from "@/lib/api/legalKnowledge";
import { BookOpen, Clock, Eye, Tag, TrendingUp, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function KnowledgePage() {
  const { t, language } = useLanguage();
  const [articles, setArticles] = useState<LegalArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadArticles();
  }, [selectedCategory]);

  const loadArticles = async () => {
    setLoading(true);
    const data = await fetchLegalArticles(selectedCategory || undefined);
    setArticles(data);
    setLoading(false);
  };

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-12">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {t('pages.knowledgeTitle')}
            </h1>
            <p className="text-lg text-blue-100 mb-6">
              1000+ {t('pages.knowledgeSubtitle')}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder={t('pages.searchKnowledge')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-neutral-900 outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-neutral-600" />
              <h2 className="text-lg font-bold text-neutral-900">{t('pages.knowledgeCategories')}</h2>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === ""
                    ? "bg-primary-600 text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {t('pages.allArticles')}
              </button>
              {knowledgeCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? "bg-primary-600 text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  {cat.icon} {language === 'zh' ? cat.nameCn : language === 'en' ? cat.name : cat.nameMs} ({cat.articleCount})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Articles List */}
        <section className="py-10">
          <div className="container mx-auto px-6">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                <p className="mt-4 text-neutral-600">{t('pages.loading')}</p>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-neutral-600 text-lg">{t('pages.noArticlesFound')}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-neutral-600">
                    {t('pages.found')} <span className="font-bold text-primary-600">{filteredArticles.length}</span> {t('pages.foundArticles')}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {filteredArticles.map((article) => (
                      <article
                        key={article.id}
                        className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-lg transition-all"
                      >
                        {/* Category Badge */}
                        <div className="mb-3">
                          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                            {(() => {
                              const cat = knowledgeCategories.find(c => c.id === article.category);
                              return cat ? (language === 'zh' ? cat.nameCn : language === 'en' ? cat.name : cat.nameMs) : '';
                            })()}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold text-neutral-900 mb-3 hover:text-primary-600 cursor-pointer">
                          {article.titleCn || article.title}
                        </h2>

                        {/* Summary */}
                        <p className="text-neutral-700 mb-4 line-clamp-2">
                          {article.summary}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-neutral-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{article.readTime} {t('pages.minutesRead')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{article.views.toLocaleString()} {t('pages.views')}</span>
                          </div>
                          <span>{t('pages.author')}: {article.author}</span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {article.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded"
                            >
                              <Tag className="h-3 w-3" />
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Related Laws */}
                        {article.relatedLaws.length > 0 && (
                          <div className="pt-4 border-t border-neutral-100">
                            <p className="text-sm text-neutral-600 mb-2">{t('pages.relatedLaws')}:</p>
                            <div className="flex flex-wrap gap-2">
                              {article.relatedLaws.map((law, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded border border-amber-200"
                                >
                                  {law}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Read More Button */}
                        <div className="mt-4">
                          <Link
                            href={`/knowledge/${article.id}`}
                            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                          >
                            {t('pages.readFullArticle')} →
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Popular Categories */}
                    <div className="bg-white rounded-lg border border-neutral-200 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="h-5 w-5 text-primary-600" />
                        <h3 className="font-bold text-neutral-900">{t('pages.popularCategoriesTitle')}</h3>
                      </div>
                      <div className="space-y-2">
                        {knowledgeCategories.slice(0, 6).map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className="w-full text-left px-3 py-2 rounded hover:bg-neutral-50 transition-all flex items-center justify-between"
                          >
                            <span className="flex items-center gap-2">
                              <span>{cat.icon}</span>
                              <span className="text-sm font-medium text-neutral-700">
                                {language === 'zh' ? cat.nameCn : language === 'en' ? cat.name : cat.nameMs}
                              </span>
                            </span>
                            <span className="text-xs text-neutral-500">
                              {cat.articleCount}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border border-primary-200 p-6">
                      <h3 className="font-bold text-neutral-900 mb-4">{t('pages.quickLinks')}</h3>
                      <div className="space-y-3">
                        <a href="/templates" className="block text-sm text-primary-700 hover:text-primary-800 font-medium">
                          📄 {t('pages.legalDocTemplates')}
                        </a>
                        <a href="/lawyers" className="block text-sm text-primary-700 hover:text-primary-800 font-medium">
                          👨‍⚖️ {t('pages.consultLawyer')}
                        </a>
                        <a href="/consultation" className="block text-sm text-primary-700 hover:text-primary-800 font-medium">
                          💬 {t('pages.onlineConsultation')}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
