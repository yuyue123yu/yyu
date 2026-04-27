"use client";

import { useState, useEffect } from "react";
import { BookOpen, Clock, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";
import { fetchPopularArticles, type LegalArticle } from "@/lib/api/legalKnowledge";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BlogSection() {
  const { t } = useLanguage();
  const [articles, setArticles] = useState<LegalArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    const data = await fetchPopularArticles(3);
    setArticles(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">
              {t('home.legalKnowledge')}
            </h2>
            <p className="text-neutral-600">
              {t('home.legalKnowledgeDesc')}
            </p>
          </div>
          <Link
            href="/knowledge"
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
          >
            {t('common.viewAll')}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-neutral-50 rounded-xl overflow-hidden hover:shadow-lg transition-all border border-neutral-200 hover:border-primary-300"
            >
              {/* Image Placeholder */}
              <div className="bg-gradient-to-br from-primary-100 to-primary-50 h-48 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-primary-600" />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category */}
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                    {article.category === 'employment' ? t('services.employment') :
                     article.category === 'property' ? t('services.property') :
                     article.category === 'family' ? t('services.family') :
                     article.category === 'business' ? t('services.business') :
                     article.category === 'consumer' ? t('common.knowledge') :
                     article.category === 'immigration' ? t('common.knowledge') : t('common.knowledge')}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-neutral-900 mb-3 line-clamp-2">
                  <Link href={`/knowledge/${article.id}`} className="hover:text-primary-600 cursor-pointer">
                    {article.titleCn || article.title}
                  </Link>
                </h3>

                {/* Summary */}
                <p className="text-neutral-600 mb-4 line-clamp-3">
                  {article.summary}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{article.readTime} {t('home.minutes')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{article.views.toLocaleString()}</span>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <span className="text-sm text-neutral-600">
                    {article.author}
                  </span>
                  <Link
                    href={`/knowledge/${article.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    {t('home.readMore')} →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/knowledge"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            <BookOpen className="h-5 w-5" />
            {t('home.browseAllArticles')}
          </Link>
        </div>
      </div>
    </section>
  );
}
