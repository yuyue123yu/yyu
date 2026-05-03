"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FileText, Upload, CheckCircle, Clock, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ReviewPage() {
  const { t } = useLanguage();
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
      alert(`${t('review.successMessage')}\n\n${t('common.name')}: ${file?.name}\n预计完成时间: ${formData.urgency === 'urgent' ? '24小时' : '3-5个工作日'}\n\n我们的律师将仔细审核您的文件并提供专业意见。`);
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
                {t('review.title')}
              </h1>
              <p className="text-xl text-purple-100 mb-8">
                {t('review.subtitle')}，RM 299{t('review.priceFrom')}
              </p>
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>3-5{t('review.workingDays')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span>{t('review.confidential')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>{t('review.professionalOpinion')}</span>
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
                      {t('review.submitDocument')}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* File Upload */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          {t('review.uploadFile')} *
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
                                  {t('review.clickToUpload')}
                                </p>
                                <p className="text-sm text-neutral-500">
                                  {t('review.supportedFormats')}
                                </p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          {t('common.name')} *
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
                            {t('common.email')} *
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
                            {t('auth.phone')} *
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
                            {t('review.documentType')} *
                          </label>
                          <select
                            required
                            value={formData.documentType}
                            onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                          >
                            <option value="">{t('review.selectDocumentType')}</option>
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
                            {t('review.urgency')} *
                          </label>
                          <select
                            required
                            value={formData.urgency}
                            onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                          >
                            <option value="normal">{t('review.normal')} (3-5{t('review.workingDays')})</option>
                            <option value="urgent">{t('review.urgent')} (24{t('review.hours')})</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          {t('review.notes')}
                        </label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                          placeholder={t('review.notesPlaceholder')}
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
                            {t('review.submitting')}
                          </>
                        ) : (
                          <>
                            <FileText className="h-5 w-5" />
                            {t('review.submitReview')}
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
                      {t('review.reviewPrice')}
                    </h3>
                    <div className="space-y-4">
                      <div className="border-b border-neutral-200 pb-4">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-3xl font-bold text-purple-600">RM 299</span>
                          <span className="text-neutral-600">{t('review.perDocument')}</span>
                        </div>
                        <p className="text-sm text-neutral-600">{t('review.normalReview')} (3-5{t('review.workingDays')})</p>
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-3xl font-bold text-purple-600">RM 599</span>
                          <span className="text-neutral-600">{t('review.perDocument')}</span>
                        </div>
                        <p className="text-sm text-neutral-600">{t('review.urgentReview')} (24{t('review.hours')})</p>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="bg-purple-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-neutral-900 mb-4">
                      {t('review.reviewContent')}
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700">{t('review.legalityReview')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700">{t('review.riskIdentification')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700">{t('review.modificationSuggestions')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700">{t('review.writtenReport')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700">{t('review.freeRevision')}</span>
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
