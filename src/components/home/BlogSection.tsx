"use client";

import { useState, useEffect } from "react";
import { BookOpen, Clock, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";
import { fetchPopularArticles, type LegalArticle } from "@/lib/api/legalKnowledge";

export default function BlogSection() {
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
              法律知识库
            </h2>
            <p className="text-neutral-600">
              了解马来西亚法律知识，保护您的权益
            </p>
          </div>
          <Link
            href="/knowledge"
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
          >
            查看全部
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
                    {article.category === 'employment' ? '劳动法' :
                     article.category === 'property' ? '房产法' :
                     article.category === 'family' ? '家庭法' :
                     article.category === 'business' ? '商业法' :
                     article.category === 'consumer' ? '消费者权益' :
                     article.category === 'immigration' ? '移民法' : '法律知识'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-neutral-900 mb-3 line-clamp-2 hover:text-primary-600 cursor-pointer">
                  {article.titleCn || article.title}
                </h3>

                {/* Summary */}
                <p className="text-neutral-600 mb-4 line-clamp-3">
                  {article.summary}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{article.readTime} 分钟</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{article.views.toLocaleString()}</span>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <span className="text-sm text-neutral-600">
                    作者: {article.author}
                  </span>
                  <Link
                    href={`/knowledge`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    阅读更多 →
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
            浏览所有文章
          </Link>
        </div>
      </div>
    </section>
  );
}
