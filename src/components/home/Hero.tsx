import Link from "next/link";
import { Search, Shield, Clock, Award, ChevronRight, ShoppingCart, Heart } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white overflow-hidden">
      <div className="container mx-auto px-6 py-6 md:py-10">
        <div className="max-w-7xl mx-auto">
          {/* 顶部导航栏 - 搜索 + 购物车 */}
          <div className="mb-4 md:mb-6">
            <div className="flex gap-2 md:gap-3 items-center flex-col md:flex-row">
              <div className="flex-1 w-full bg-white rounded-lg p-2 md:p-3 shadow-lg flex items-center gap-2 md:gap-3">
                <Search className="h-4 md:h-5 w-4 md:w-5 text-neutral-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="搜索律师..."
                  className="flex-1 py-1 md:py-2 text-neutral-900 outline-none text-xs md:text-sm placeholder:text-neutral-400"
                />
              </div>
              <button className="bg-accent-500 hover:bg-accent-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all text-xs md:text-sm w-full md:w-auto">
                搜索
              </button>
              <div className="flex gap-2 w-full md:w-auto">
                <Link href="/cart" className="flex-1 md:flex-none bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 md:p-3 rounded-lg border border-white/30 transition-all">
                  <ShoppingCart className="h-4 md:h-5 w-4 md:w-5 text-white mx-auto" />
                </Link>
                <Link href="/favorites" className="flex-1 md:flex-none bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 md:p-3 rounded-lg border border-white/30 transition-all">
                  <Heart className="h-4 md:h-5 w-4 md:w-5 text-white mx-auto" />
                </Link>
              </div>
            </div>
          </div>

          {/* 轮播 Banner - 3 个法律产品 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-5">
            {/* Banner 1 - 法律文书模板 */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg md:rounded-xl p-3 md:p-5 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 md:w-32 h-24 md:h-32 bg-white/10 rounded-full blur-2xl -mr-12 md:-mr-16 -mt-12 md:-mt-16"></div>
              <div className="relative z-10">
                <div className="text-accent-400 text-xs font-bold mb-0.5 md:mb-1">📄 法律文书</div>
                <h3 className="text-base md:text-lg font-bold mb-0.5 md:mb-1">合同模板库</h3>
                <p className="text-xs text-white/90 mb-1.5 md:mb-2">500+ 专业模板</p>
                <Link href="/templates" className="inline-flex items-center gap-1 bg-white text-red-600 px-2 md:px-3 py-1 md:py-1.5 rounded-lg font-bold text-xs hover:bg-neutral-100 transition-all">
                  立即查看
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Banner 2 - 法律咨询服务 */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg md:rounded-xl p-3 md:p-5 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 md:w-32 h-24 md:h-32 bg-white/10 rounded-full blur-2xl -mr-12 md:-mr-16 -mt-12 md:-mt-16"></div>
              <div className="relative z-10">
                <div className="text-accent-400 text-xs font-bold mb-0.5 md:mb-1">💬 在线咨询</div>
                <h3 className="text-base md:text-lg font-bold mb-0.5 md:mb-1">律师咨询服务</h3>
                <p className="text-xs text-white/90 mb-1.5 md:mb-2">¥99 起咨询</p>
                <Link href="/consultation" className="inline-flex items-center gap-1 bg-white text-blue-600 px-2 md:px-3 py-1 md:py-1.5 rounded-lg font-bold text-xs hover:bg-neutral-100 transition-all">
                  咨询律师
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Banner 3 - 法律文件审核 */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg md:rounded-xl p-3 md:p-5 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 md:w-32 h-24 md:h-32 bg-white/10 rounded-full blur-2xl -mr-12 md:-mr-16 -mt-12 md:-mt-16"></div>
              <div className="relative z-10">
                <div className="text-accent-400 text-xs font-bold mb-0.5 md:mb-1">✅ 文件审核</div>
                <h3 className="text-base md:text-lg font-bold mb-0.5 md:mb-1">合同审核服务</h3>
                <p className="text-xs text-white/90 mb-1.5 md:mb-2">¥299 起审核</p>
                <Link href="/review" className="inline-flex items-center gap-1 bg-white text-purple-600 px-2 md:px-3 py-1 md:py-1.5 rounded-lg font-bold text-xs hover:bg-neutral-100 transition-all">
                  提交审核
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* 分类导航 - 6-8 个主要服务 */}
          <div className="mb-4 md:mb-5">
            <h3 className="text-xs font-bold text-white mb-2 md:mb-3">热门服务分类</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-2">
              {[
                { name: '家庭法', icon: '👨‍👩‍👧' },
                { name: '家庭法', id: 'family', icon: '👨‍👩‍👧' },
                { name: '商业法', id: 'business', icon: '💼' },
                { name: '房产法', id: 'property', icon: '🏠' },
                { name: '刑事法', id: 'criminal', icon: '⚖️' },
                { name: '劳动法', id: 'employment', icon: '👔' },
                { name: '知识产权', id: 'ip', icon: '💡' },
              ].map((service) => (
                <Link
                  key={service.name}
                  href={`/services/${service.id}`}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs font-medium border border-white/30 transition-all text-center"
                >
                  <div className="text-sm md:text-base mb-0.5">{service.icon}</div>
                  <div className="text-xs">{service.name}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* 信任指标 - 3 列 */}
          <div className="grid grid-cols-3 gap-2 md:gap-3 mt-4 md:mt-5">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-white/20 text-center">
              <Shield className="h-4 md:h-5 w-4 md:w-5 mx-auto mb-1 md:mb-1.5 text-accent-400" />
              <div className="text-lg md:text-xl font-bold">500+</div>
              <div className="text-xs text-blue-100">认证律师</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-white/20 text-center">
              <Clock className="h-4 md:h-5 w-4 md:w-5 mx-auto mb-1 md:mb-1.5 text-accent-400" />
              <div className="text-lg md:text-xl font-bold">2h</div>
              <div className="text-xs text-blue-100">平均响应</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-white/20 text-center">
              <Award className="h-4 md:h-5 w-4 md:w-5 mx-auto mb-1 md:mb-1.5 text-accent-400" />
              <div className="text-lg md:text-xl font-bold">4.9/5</div>
              <div className="text-xs text-blue-100">客户评分</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
