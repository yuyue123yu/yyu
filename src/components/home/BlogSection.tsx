import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

const articles = [
  {
    id: 1,
    title: "2024 年马来西亚劳动法最新修订解读",
    excerpt: "了解最新的劳动法修订内容，包括最低工资、加班费计算和员工权益保护等重要变化...",
    category: "劳动法",
    date: "2024-01-15",
    readTime: "5 分钟",
    image: "📋"
  },
  {
    id: 2,
    title: "创业者必知：公司注册完整指南",
    excerpt: "从选择公司类型到完成注册，详细讲解在马来西亚注册公司的每个步骤和注意事项...",
    category: "商业法",
    date: "2024-01-12",
    readTime: "8 分钟",
    image: "🏢"
  },
  {
    id: 3,
    title: "房产买卖：如何避免常见法律陷阱",
    excerpt: "购买房产时需要注意的法律问题，包括产权调查、合同审查和贷款协议等关键环节...",
    category: "房产法",
    date: "2024-01-10",
    readTime: "6 分钟",
    image: "🏠"
  },
];

export default function BlogSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900">
              法律资讯
            </h2>
            <p className="text-lg text-gray-600">
              获取最新的法律知识和行业动态
            </p>
          </div>
          <Link 
            href="/blog" 
            className="hidden md:inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group"
          >
            查看全部
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.id}`}
              className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="bg-gradient-to-br from-blue-50 to-gray-50 h-48 flex items-center justify-center text-6xl">
                {article.image}
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {article.date}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{article.readTime}阅读</span>
                  <span className="text-blue-600 group-hover:gap-2 flex items-center gap-1 transition-all">
                    阅读更多
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-6 md:hidden">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            查看全部文章
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
