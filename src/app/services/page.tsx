"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Briefcase, Home, Users, Shield, TrendingUp, Scale, ArrowRight } from "lucide-react";

const services = [
  {
    id: 'debt',
    icon: Scale,
    title: "债务纠纷",
    titleEn: "Debt Disputes",
    description: "债务追讨、破产申请、债务重组、债权人保护等债务法律事务",
    cases: "2,850+ 案例",
    avgPrice: "RM 1,200-4,500",
    color: "from-amber-400 to-amber-500",
    features: ["债务追讨", "破产申请", "债务重组", "债权人保护", "还款协议"]
  },
  {
    id: 'family',
    icon: Users,
    title: "家庭法",
    titleEn: "Family Law",
    description: "离婚、监护权、财产分配、婚前协议等家庭法律事务",
    cases: "2,340+ 案例",
    avgPrice: "RM 800-3,000",
    color: "from-blue-400 to-blue-500",
    features: ["离婚诉讼", "子女监护权", "财产分配", "婚前协议", "家庭暴力保护令"]
  },
  {
    id: 'business',
    icon: Briefcase,
    title: "商业法",
    titleEn: "Business Law",
    description: "公司注册、合同审查、商业纠纷、知识产权保护",
    cases: "1,890+ 案例",
    avgPrice: "RM 1,000-5,000",
    color: "from-purple-400 to-purple-500",
    features: ["公司注册", "合同起草", "商业谈判", "股权转让", "商标注册"]
  },
  {
    id: 'business',
    icon: Briefcase,
    title: "商业法",
    titleEn: "Business Law",
    description: "公司注册、合同审查、商业纠纷、知识产权保护",
    cases: "1,890+ 案例",
    avgPrice: "RM 1,000-5,000",
    color: "from-purple-400 to-purple-500",
    features: ["公司注册", "合同起草", "商业谈判", "股权转让", "商标注册"]
  },
  {
    id: 'property',
    icon: Home,
    title: "房产法",
    titleEn: "Property Law",
    description: "房产买卖、租赁合同、产权纠纷、土地法律事务",
    cases: "3,120+ 案例",
    avgPrice: "RM 600-2,500",
    color: "from-green-400 to-green-500",
    features: ["房产买卖", "租赁协议", "产权转让", "土地纠纷", "房产开发"]
  },
  {
    id: 'criminal',
    icon: Shield,
    title: "刑事法",
    titleEn: "Criminal Law",
    description: "刑事辩护、法律代理、保释申请、上诉服务",
    cases: "980+ 案例",
    avgPrice: "RM 2,000-10,000",
    color: "from-red-400 to-red-500",
    features: ["刑事辩护", "保释申请", "上诉服务", "证人保护", "法律咨询"]
  },
  {
    id: 'employment',
    icon: TrendingUp,
    title: "劳动法",
    titleEn: "Employment Law",
    description: "劳动纠纷、不当解雇、工伤赔偿、劳动合同",
    cases: "1,560+ 案例",
    avgPrice: "RM 700-3,500",
    color: "from-orange-400 to-orange-500",
    features: ["劳动纠纷", "不当解雇", "工伤赔偿", "劳动合同", "薪资纠纷"]
  },
  {
    id: 'ip',
    icon: Scale,
    title: "知识产权",
    titleEn: "Intellectual Property",
    description: "专利申请、商标注册、版权保护、侵权诉讼",
    cases: "890+ 案例",
    avgPrice: "RM 1,500-6,000",
    color: "from-indigo-400 to-indigo-500",
    features: ["专利申请", "商标注册", "版权保护", "侵权诉讼", "许可协议"]
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                专业法律服务
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                涵盖7大法律领域，为您提供全方位的法律支持
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Link
                    key={service.id}
                    href={`/services/${service.id}`}
                    className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-8 border border-neutral-200 hover:border-primary-300"
                  >
                    {/* Icon */}
                    <div className={`bg-gradient-to-br ${service.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-neutral-500 mb-4">{service.titleEn}</p>

                    {/* Description */}
                    <p className="text-neutral-700 mb-6">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-neutral-900 mb-3">服务内容：</p>
                      <div className="flex flex-wrap gap-2">
                        {service.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
                      <div>
                        <p className="text-sm text-neutral-600">{service.cases}</p>
                        <p className="text-lg font-bold text-primary-600">{service.avgPrice}</p>
                      </div>
                      <ArrowRight className="h-6 w-6 text-primary-600 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              需要法律帮助？
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              立即咨询我们的专业律师团队
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/consultation"
                className="px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-bold text-lg transition-all"
              >
                在线咨询
              </Link>
              <Link
                href="/lawyers"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold text-lg transition-all border-2 border-white/30"
              >
                查看律师
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
