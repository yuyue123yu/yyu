"use client";

import { useState, useEffect } from "react";
import { Star, CheckCircle, ShoppingCart, Heart } from "lucide-react";
import Link from "next/link";
import { fetchTopLawyers, type Lawyer } from "@/lib/api/lawyers";

export default function FeaturedLawyers() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLawyers();
  }, []);

  const loadLawyers = async () => {
    setLoading(true);
    const data = await fetchTopLawyers(6);
    setLawyers(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="py-8 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-6">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-neutral-50 border-b border-neutral-200">
      <div className="container mx-auto px-6">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-1">
              热销律师
            </h2>
            <p className="text-neutral-600 text-sm">
              根据您的需求精准推荐
            </p>
          </div>
          <Link href="/lawyers" className="text-primary-600 hover:text-primary-700 font-semibold text-sm">
            查看全部 →
          </Link>
        </div>

        {/* 6 列网格 - 电商卡片风格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
          {lawyers.map((lawyer) => (
            <div
              key={lawyer.id}
              className="group bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all border border-neutral-200 hover:border-primary-300 flex flex-col"
            >
              {/* 头部 - Avatar 区域 */}
              <div className="bg-gradient-to-br from-primary-100 to-primary-50 h-20 flex items-center justify-center text-3xl relative">
                👨‍⚖️
                {lawyer.available && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
                {lawyer.soldCount > 150 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    热销
                  </div>
                )}
              </div>
              
              {/* 内容区 */}
              <div className="p-3 flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-neutral-900 truncate">{lawyer.name}</h3>
                <p className="text-xs text-primary-600 font-medium mb-2">{lawyer.specialty[0]}</p>
                
                {/* 评分 */}
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold text-neutral-900">{lawyer.rating}</span>
                  <span className="text-xs text-neutral-500">({lawyer.reviews})</span>
                </div>
                
                {/* 响应时间 */}
                <div className="text-xs text-neutral-600 mb-2 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  {lawyer.responseTime}
                </div>

                {/* 销量 */}
                <div className="text-xs text-neutral-600 mb-2">
                  已服务 {lawyer.soldCount} 人
                </div>
                
                {/* 价格 */}
                <div className="text-xs font-bold text-primary-600 mb-3">
                  {lawyer.priceRange}
                </div>
                
                {/* 按钮 */}
                <div className="flex gap-2 mt-auto">
                  <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-xs py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1">
                    <ShoppingCart className="h-3 w-3" />
                    咨询
                  </button>
                  <button className="px-2 py-2 border border-neutral-300 hover:border-primary-300 rounded-lg transition-all">
                    <Heart className="h-3.5 w-3.5 text-neutral-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 查看全部 */}
        <div className="text-center">
          <Link href="/lawyers" className="inline-flex items-center gap-2 px-6 py-3 border border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg font-semibold text-sm transition-all">
            查看全部律师
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
