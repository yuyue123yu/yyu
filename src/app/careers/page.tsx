"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Users, TrendingUp, Heart, Award, Globe, Upload, Send } from "lucide-react";

export default function CareersPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    barCouncilNumber: "",
    specialization: "",
    message: ""
  });
  const [resume, setResume] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("申请已提交！我们会在3个工作日内与您联系。");
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      barCouncilNumber: "",
      specialization: "",
      message: ""
    });
    setResume(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">加入 LegalMY</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            成为马来西亚领先法律科技平台的一员，用科技改变法律服务行业
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">为什么选择 LegalMY？</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
              <TrendingUp className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">快速成长</h3>
              <p className="text-gray-600">
                加入快速发展的法律科技行业，与平台一起成长，获得更多职业发展机会
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
              <Users className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">优秀团队</h3>
              <p className="text-gray-600">
                与充满激情的专业人士合作，在支持性和协作性的环境中工作
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
              <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">有意义的工作</h3>
              <p className="text-gray-600">
                帮助更多人获得法律服务，为社会创造真正的价值和影响
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">福利待遇</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-bold text-gray-900 mb-2">有竞争力的薪酬</h3>
              <p className="text-gray-600 text-sm">行业领先的薪资和绩效奖金</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">🏥</div>
              <h3 className="font-bold text-gray-900 mb-2">医疗保险</h3>
              <p className="text-gray-600 text-sm">全面的医疗和牙科保险</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">🏖️</div>
              <h3 className="font-bold text-gray-900 mb-2">灵活假期</h3>
              <p className="text-gray-600 text-sm">年假、病假和灵活工作安排</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-bold text-gray-900 mb-2">学习发展</h3>
              <p className="text-gray-600 text-sm">培训预算和职业发展支持</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">💻</div>
              <h3 className="font-bold text-gray-900 mb-2">远程工作</h3>
              <p className="text-gray-600 text-sm">混合办公模式，工作生活平衡</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">🎉</div>
              <h3 className="font-bold text-gray-900 mb-2">团队活动</h3>
              <p className="text-gray-600 text-sm">定期团建和公司活动</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-bold text-gray-900 mb-2">股权激励</h3>
              <p className="text-gray-600 text-sm">核心员工股权期权计划</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">☕</div>
              <h3 className="font-bold text-gray-900 mb-2">办公环境</h3>
              <p className="text-gray-600 text-sm">现代化办公室，免费零食饮料</p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">招聘职位</h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Lawyer Position */}
            <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-blue-600 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">认证律师</h3>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">全职/兼职</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">吉隆坡/远程</span>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">经验不限</span>
                  </div>
                </div>
                <Briefcase className="w-8 h-8 text-blue-600 flex-shrink-0" />
              </div>
              <p className="text-gray-600 mb-4">
                我们正在寻找持有马来西亚律师执业资格的律师加入我们的平台。
                您将通过在线和线下方式为客户提供法律咨询服务。
              </p>
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">要求：</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>持有马来西亚律师公会（Bar Council）执业证书</li>
                  <li>良好的沟通能力，能使用英语、马来语或中文</li>
                  <li>熟悉马来西亚法律法规</li>
                  <li>有责任心，注重客户服务</li>
                </ul>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">优势：</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>灵活的工作时间和地点</li>
                  <li>平台提供客户资源</li>
                  <li>有竞争力的收入分成（律师获得90%咨询费）</li>
                  <li>专业的技术和运营支持</li>
                </ul>
              </div>
            </div>

            {/* Legal Content Writer */}
            <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-green-600 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">法律内容编辑</h3>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">全职</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">吉隆坡</span>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">2年以上经验</span>
                  </div>
                </div>
                <Award className="w-8 h-8 text-green-600 flex-shrink-0" />
              </div>
              <p className="text-gray-600 mb-4">
                负责撰写和编辑法律资讯文章、指南和文档模板，帮助用户理解法律知识。
              </p>
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">要求：</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>法律相关专业背景</li>
                  <li>优秀的中文、英文或马来文写作能力</li>
                  <li>能将复杂法律概念转化为易懂的内容</li>
                  <li>注重细节，有责任心</li>
                </ul>
              </div>
            </div>

            {/* Software Engineer */}
            <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-purple-600 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">全栈工程师</h3>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">全职</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">吉隆坡/远程</span>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">3年以上经验</span>
                  </div>
                </div>
                <Globe className="w-8 h-8 text-purple-600 flex-shrink-0" />
              </div>
              <p className="text-gray-600 mb-4">
                参与平台的开发和维护，构建高质量的法律科技产品。
              </p>
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">要求：</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>熟练掌握 React、Next.js、TypeScript</li>
                  <li>有 Node.js 后端开发经验</li>
                  <li>熟悉数据库设计和优化</li>
                  <li>良好的代码质量意识和团队协作能力</li>
                </ul>
              </div>
            </div>

            {/* Customer Service */}
            <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-yellow-600 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">客户服务专员</h3>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">全职</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">吉隆坡</span>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">1年以上经验</span>
                  </div>
                </div>
                <Users className="w-8 h-8 text-yellow-600 flex-shrink-0" />
              </div>
              <p className="text-gray-600 mb-4">
                为用户提供优质的客户服务，解答疑问，处理投诉和反馈。
              </p>
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">要求：</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>优秀的沟通和人际交往能力</li>
                  <li>能使用中文、英文或马来文</li>
                  <li>有客户服务经验优先</li>
                  <li>耐心、细心，有服务意识</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">提交申请</h2>
            <p className="text-center text-gray-600 mb-12">
              填写以下表格，我们会在3个工作日内与您联系
            </p>
            
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="您的全名"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    邮箱 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    手机号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+60 12-345 6789"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    申请职位 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">请选择</option>
                    <option value="lawyer">认证律师</option>
                    <option value="content-writer">法律内容编辑</option>
                    <option value="engineer">全栈工程师</option>
                    <option value="customer-service">客户服务专员</option>
                    <option value="other">其他</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    工作经验（年）
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    律师公会编号（仅律师）
                  </label>
                  <input
                    type="text"
                    name="barCouncilNumber"
                    value={formData.barCouncilNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="如适用"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  专业领域/技能
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例如：家庭法、React开发、客户服务等"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  简历/CV <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    required
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      {resume ? resume.name : "点击上传简历（PDF, DOC, DOCX）"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">最大 5MB</p>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  个人陈述
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请简要介绍您的背景、为什么想加入 LegalMY，以及您能为团队带来什么..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                提交申请
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">还有疑问？</h2>
          <p className="text-gray-600 mb-8">
            如对招聘有任何疑问，欢迎联系我们的人力资源团队
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:careers@legalmy.com"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              发送邮件
            </a>
            <Link
              href="/contact"
              className="bg-gray-200 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              联系我们
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
