import { FileText, Users, Briefcase, BookOpen } from "lucide-react";
import Link from "next/link";

export default function Promotions() {
  return (
    <section className="py-4 bg-white border-b border-neutral-200">
      <div className="container mx-auto px-6">
        {/* 法律产品区 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mb-2 md:mb-3">
          {/* 产品 1 - 法律文书模板 */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-red-300 relative overflow-hidden">
            <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-red-500 text-white text-xs font-bold px-1.5 md:px-2 py-0.5 rounded-full">
              热销
            </div>
            <FileText className="h-4 md:h-5 w-4 md:w-5 text-red-600 mb-1.5 md:mb-2" />
            <h3 className="font-bold text-neutral-900 mb-0.5 text-xs md:text-sm">法律文书模板</h3>
            <p className="text-xs text-neutral-700 mb-1.5 md:mb-2">500+ 专业模板 <span className="font-bold text-red-600">免费下载</span></p>
            <Link href="/templates" className="text-red-600 hover:text-red-700 text-xs font-semibold">
              浏览模板 →
            </Link>
          </div>

          {/* 产品 2 - 在线律师咨询 */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-blue-300">
            <Users className="h-4 md:h-5 w-4 md:w-5 text-blue-600 mb-1.5 md:mb-2" />
            <h3 className="font-bold text-neutral-900 mb-0.5 text-xs md:text-sm">在线律师咨询</h3>
            <p className="text-xs text-neutral-700 mb-1.5 md:mb-2">¥99 起咨询 <span className="font-bold text-blue-600">30分钟内回复</span></p>
            <Link href="/consultation" className="text-blue-600 hover:text-blue-700 text-xs font-semibold">
              立即咨询 →
            </Link>
          </div>

          {/* 产品 3 - 合同审核服务 */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-purple-300">
            <Briefcase className="h-4 md:h-5 w-4 md:w-5 text-purple-600 mb-1.5 md:mb-2" />
            <h3 className="font-bold text-neutral-900 mb-0.5 text-xs md:text-sm">合同审核服务</h3>
            <p className="text-xs text-neutral-700 mb-1.5 md:mb-2">¥299 起审核 <span className="font-bold text-purple-600">专业律师把关</span></p>
            <Link href="/review" className="text-purple-600 hover:text-purple-700 text-xs font-semibold">
              提交审核 →
            </Link>
          </div>

          {/* 产品 4 - 法律知识库 */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-amber-300">
            <BookOpen className="h-4 md:h-5 w-4 md:w-5 text-amber-600 mb-1.5 md:mb-2" />
            <h3 className="font-bold text-neutral-900 mb-0.5 text-xs md:text-sm">法律知识库</h3>
            <p className="text-xs text-neutral-700 mb-1.5 md:mb-2">1000+ 法律文章 <span className="font-bold text-amber-600">免费阅读</span></p>
            <Link href="/knowledge" className="text-amber-600 hover:text-amber-700 text-xs font-semibold">
              查看文章 →
            </Link>
          </div>
        </div>

        {/* 热销排行 */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg md:rounded-xl p-4 md:p-5 text-white">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <h3 className="text-sm md:text-base font-bold">🔥 热销律师排行</h3>
            <span className="text-xs bg-white/20 px-1.5 md:px-2 py-0.5 rounded-full">本周更新</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {[
              { rank: 1, name: "Ahmad Abdullah", specialty: "商业法", sales: "156 次咨询" },
              { rank: 2, name: "Sarah Wong", specialty: "家庭法", sales: "189 次咨询" },
              { rank: 3, name: "Kumar Rajesh", specialty: "房产法", sales: "178 次咨询" },
              { rank: 4, name: "Tan Mei Ling", specialty: "家庭法", sales: "203 次咨询" },
            ].map((item) => (
              <div key={item.rank} className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-white/20">
                <div className="text-lg md:text-xl font-bold text-accent-400 mb-0.5 md:mb-1">#{item.rank}</div>
                <p className="font-semibold text-xs mb-0.5">{item.name}</p>
                <p className="text-xs text-blue-100 mb-0.5 md:mb-1">{item.specialty}</p>
                <p className="text-xs text-accent-300 font-bold">{item.sales}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
