"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FileText, Upload, CheckCircle, Clock, Shield } from "lucide-react";

export default function ReviewPage() {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    documentType: "",
    urgency: "normal",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      alert(`✅ 文件已提交审核！\n\n文件名: ${file?.name}\n预计完成时间: ${formData.urgency === 'urgent' ? '24小时' : '3-5个工作日'}\n\n我们的律师将仔细审核您的文件并提供专业意见。`);
      setFile(null);
      setFormData({ name: "", email: "", phone: "", documentType: "", urgency: "normal", notes: "" });
      setSubmitted(false);
    }, 1000);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-600 to-purple-500 text-white py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <FileText className="h-16 w-16 mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                合同审核服务
              </h1>
              <p className="text-xl text-purple-100 mb-8">
                专业律师审核您的法律文件，RM 299起
              </p>
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>3-5个工作日</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span>保密协议</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>专业意见</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upload Form */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                      提交审核文件
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* File Upload */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          上传文件 *
                        </label>
                        <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-primary-500 transition-all">
                          <input
                            type="file"
                            required
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            id="file-upload"
                          />
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <Upload className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                            {file ? (
                              <div>
                                <p className="text-primary-600 font-medium mb-2">{file.name}</p>
                                <p className="text-sm text-neutral-600">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p className="text-neutral-700 font-medium mb-2">
                                  点击上传或拖拽文件到此处
                                </p>
                                <p className="text-sm text-neutral-500">
                                  支持 PDF, DOC, DOCX 格式，最大 10MB
                                </p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          姓名 *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                          placeholder="请输入您的姓名"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            电子邮箱 *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                            placeholder="your@email.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            电话号码 *
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                            placeholder="+60 12-345 6789"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            文件类型 *
                          </label>
                          <select
                            required
                            value={formData.documentType}
                            onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                          >
                            <option value="">请选择文件类型</option>
                            <option value="employment">雇佣合同</option>
                            <option value="property">房产协议</option>
                            <option value="business">商业合同</option>
                            <option value="tenancy">租赁协议</option>
                            <option value="loan">贷款协议</option>
                            <option value="other">其他</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            紧急程度 *
                          </label>
                          <select
                            required
                            value={formData.urgency}
                            onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                          >
                            <option value="normal">普通 (3-5个工作日)</option>
                            <option value="urgent">加急 (24小时)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          备注说明
                        </label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                          placeholder="请说明需要特别关注的条款或问题..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitted}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {submitted ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            提交中...
                          </>
                        ) : (
                          <>
                            <FileText className="h-5 w-5" />
                            提交审核
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Pricing & Info */}
                <div className="space-y-6">
                  {/* Pricing Card */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-neutral-900 mb-4">
                      审核价格
                    </h3>
                    <div className="space-y-4">
                      <div className="border-b border-neutral-200 pb-4">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-3xl font-bold text-purple-600">RM 299</span>
                          <span className="text-neutral-600">/份</span>
                        </div>
                        <p className="text-sm text-neutral-600">普通审核 (3-5天)</p>
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-3xl font-bold text-purple-600">RM 599</span>
                          <span className="text-neutral-600">/份</span>
                        </div>
                        <p className="text-sm text-neutral-600">加急审核 (24小时)</p>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="bg-purple-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-neutral-900 mb-4">
                      审核内容
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700">条款合法性审查</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700">风险点识别</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700">修改建议</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700">书面审核报告</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700">一次免费修改</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
