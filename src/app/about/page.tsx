"use client";

import Link from "next/link";
import { Users, Target, Award, Globe, Shield, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">关于 LegalMY</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            马来西亚领先的在线法律服务平台，连接优秀律师与需要法律帮助的人们
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-600">
              <Target className="w-12 h-12 text-blue-600 mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">我们的使命</h2>
              <p className="text-gray-600 leading-relaxed">
                让每个马来西亚人都能轻松获得专业、可靠、实惠的法律服务。我们致力于打破传统法律服务的壁垒，通过技术创新让法律咨询变得简单透明。
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-yellow-500">
              <Award className="w-12 h-12 text-yellow-600 mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">我们的愿景</h2>
              <p className="text-gray-600 leading-relaxed">
                成为东南亚最值得信赖的法律科技平台，通过数字化转型推动法律行业的现代化发展，让法律服务触手可及。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">核心价值观</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
              <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">专业可靠</h3>
              <p className="text-gray-600">
                所有律师均经过严格认证，持有马来西亚律师执业资格，确保服务质量
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
              <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">用户至上</h3>
              <p className="text-gray-600">
                始终将用户需求放在首位，提供贴心周到的服务体验和全程支持
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
              <Globe className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">开放透明</h3>
              <p className="text-gray-600">
                价格透明，流程清晰，让用户明明白白消费，放心选择法律服务
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">平台数据</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">认证律师</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">690+</div>
              <div className="text-gray-600">法律文档模板</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">成功案例</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">客户满意度</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">我们的团队</h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            LegalMY 由一群充满激情的法律专业人士和技术专家组成，我们致力于用科技改变法律服务行业
          </p>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Users className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <p className="text-center text-gray-600 leading-relaxed">
              我们的团队包括资深律师、法律顾问、软件工程师、产品设计师和客户服务专员。
              每个成员都在各自领域拥有丰富经验，共同为用户提供最优质的法律科技服务。
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">想了解更多？</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            如有任何疑问或合作意向，欢迎随时联系我们
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              联系我们
            </Link>
            <Link
              href="/careers"
              className="bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              加入我们
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
