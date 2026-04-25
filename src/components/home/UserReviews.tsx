import { Star, ThumbsUp, MessageCircle } from "lucide-react";

export default function UserReviews() {
  const reviews = [
    {
      id: 1,
      lawyerName: "Ahmad Abdullah",
      lawyerSpecialty: "商业法",
      rating: 5,
      title: "非常专业的律师，帮我解决了公司合同问题",
      content: "响应速度快，专业知识过硬，给出的建议非常实用。价格也很合理，强烈推荐！",
      helpful: 234,
      verified: true,
      date: "2024-01-15"
    },
    {
      id: 2,
      lawyerName: "Sarah Wong",
      lawyerSpecialty: "家庭法",
      rating: 5,
      title: "在困难时期得到了专业的法律支持",
      content: "律师非常有耐心，详细解释了每一个法律程序。让我在离婚过程中感到被理解和支持。",
      helpful: 189,
      verified: true,
      date: "2024-01-14"
    },
    {
      id: 3,
      lawyerName: "Kumar Rajesh",
      lawyerSpecialty: "房产法",
      rating: 4,
      title: "房产纠纷得到妥善解决",
      content: "律师的谈判技巧很强，最终以满意的价格完成了房产交易。整个过程透明高效。",
      helpful: 156,
      verified: true,
      date: "2024-01-13"
    },
    {
      id: 4,
      lawyerName: "Tan Mei Ling",
      lawyerSpecialty: "家庭法",
      rating: 5,
      title: "完全超出预期的服务质量",
      content: "不仅解决了法律问题，还给了我很多生活建议。这样的律师真的很难找到。",
      helpful: 267,
      verified: true,
      date: "2024-01-12"
    },
    {
      id: 5,
      lawyerName: "李明",
      lawyerSpecialty: "商业法",
      rating: 5,
      title: "创业者的最佳法律顾问",
      content: "从公司注册到合同审查，全程指导。价格透明，没有隐藏费用，非常信任。",
      helpful: 198,
      verified: true,
      date: "2024-01-11"
    },
    {
      id: 6,
      lawyerName: "David Tan",
      lawyerSpecialty: "劳动法",
      rating: 4,
      title: "劳动纠纷处理得很专业",
      content: "律师既懂法律又理解商业运作，给出的建议既合法又实用。推荐给其他企业主。",
      helpful: 142,
      verified: true,
      date: "2024-01-10"
    }
  ];

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
            <div className="text-right">
              <div className="text-3xl font-bold text-neutral-900">4.9</div>
              <div className="flex items-center gap-1 justify-end mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-sm text-neutral-600">基于 12,450+ 条评价</p>
            </div>
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
