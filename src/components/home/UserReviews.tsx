"use client";

import { useState, useEffect } from "react";
import { Star, ThumbsUp, MessageCircle } from "lucide-react";
import { fetchTopReviews, fetchReviewStats, type UserReview } from "@/lib/api/reviews";

export default function UserReviews() {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [reviewsData, statsData] = await Promise.all([
      fetchTopReviews(6),
      fetchReviewStats()
    ]);
    setReviews(reviewsData);
    setStats(statsData);
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="py-10 bg-neutral-50">
        <div className="container mx-auto px-6">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-neutral-50">
      <div className="container mx-auto px-6">
        {/* 标题和统计 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                客户评价
              </h2>
              <p className="text-neutral-600 text-sm">
                真实用户的咨询体验分享
              </p>
            </div>
            {stats && (
              <div className="text-right">
                <div className="text-3xl font-bold text-neutral-900">{stats.averageRating}</div>
                <div className="flex items-center gap-1 justify-end mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-sm text-neutral-600">基于 {stats.totalReviews}+ 条评价</p>
              </div>
            )}
          </div>
        </div>

        {/* 评价卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg border border-neutral-200 p-5 hover:shadow-md transition-all"
            >
              {/* 头部 - 律师信息 */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-semibold text-neutral-900 text-sm">
                    {review.lawyerName}
                  </p>
                  <p className="text-xs text-primary-600 font-medium">
                    {review.lawyerSpecialty}
                  </p>
                </div>
                {review.verified && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                    已验证
                  </span>
                )}
              </div>

              {/* 评分 */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < review.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-neutral-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-neutral-600">{review.date}</span>
              </div>

              {/* 用户名 */}
              <p className="text-xs text-neutral-500 mb-2">评价人: {review.userName}</p>

              {/* 标题 */}
              <h4 className="font-semibold text-neutral-900 text-sm mb-2 line-clamp-2">
                {review.title}
              </h4>

              {/* 内容 */}
              <p className="text-sm text-neutral-700 mb-4 line-clamp-3">
                {review.content}
              </p>

              {/* 底部 - 有用按钮 */}
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                <button className="flex items-center gap-1 text-xs text-neutral-600 hover:text-primary-600 transition-all">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  有用 ({review.helpful})
                </button>
                <button className="flex items-center gap-1 text-xs text-neutral-600 hover:text-primary-600 transition-all">
                  <MessageCircle className="h-3.5 w-3.5" />
                  回复
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 查看全部评价 */}
        <div className="text-center">
          <button className="px-6 py-3 border border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg font-semibold text-sm transition-all">
            查看全部评价
          </button>
        </div>
      </div>
    </section>
  );
}
