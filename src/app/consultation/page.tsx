"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MessageCircle, Clock, CheckCircle, Star, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ConsultationPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      alert(t('consultation.successMessage'));
      setFormData({ name: "", email: "", phone: "", category: "", description: "" });
      setSubmitted(false);
    }, 1000);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <MessageCircle className="h-16 w-16 mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t('pages.consultationTitle')}
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                {t('pages.consultationSubtitle')}, RM 99{t('pages.consultationFrom')}
              </p>
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>30{t('pages.minutesResponse')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>{t('pages.professionalCertified')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  <span>4.9/5 {t('common.rating')}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Consultation Form */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                      {t('pages.submitRequest')}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          {t('pages.yourName')} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                          placeholder={t('pages.yourName')}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            {t('pages.yourEmail')} *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                            placeholder="your@email.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            {t('pages.yourPhone')} *
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                            placeholder="+60 12-345 6789"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          {t('pages.consultationCategory')} *
                        </label>
                        <select
                          required
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                        >
                          <option value="">{t('pages.selectCategory')}</option>
                          <option value="debt">{t('services.debt')}</option>
                          <option value="family">{t('services.family')}</option>
                          <option value="business">{t('services.business')}</option>
                          <option value="property">{t('services.property')}</option>
                          <option value="criminal">{t('services.criminal')}</option>
                          <option value="employment">{t('services.employment')}</option>
                          <option value="ip">{t('services.ip')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          {t('pages.problemDescription')} *
                        </label>
                        <textarea
                          required
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={6}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                          placeholder={t('pages.problemPlaceholder')}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitted}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {submitted ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            {t('pages.submitting')}
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            {t('pages.submitConsultation')}
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
                      {t('pages.consultationPrice')}
                    </h3>
                    <div className="space-y-4">
                      <div className="border-b border-neutral-200 pb-4">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-3xl font-bold text-primary-600">RM 99</span>
                          <span className="text-neutral-600">/{t('pages.perSession')}</span>
                        </div>
                        <p className="text-sm text-neutral-600">{t('pages.basicConsultation')}</p>
                      </div>
                      <div className="border-b border-neutral-200 pb-4">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-3xl font-bold text-primary-600">RM 299</span>
                          <span className="text-neutral-600">/{t('pages.perSession')}</span>
                        </div>
                        <p className="text-sm text-neutral-600">{t('pages.deepAnalysis')}</p>
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-3xl font-bold text-primary-600">RM 999</span>
                          <span className="text-neutral-600">/{t('pages.perMonth')}</span>
                        </div>
                        <p className="text-sm text-neutral-600">{t('pages.monthlyAdvisor')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="bg-primary-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-neutral-900 mb-4">
                      {t('pages.serviceFeatures')}
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700">30 {t('pages.quickResponse')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700">{t('pages.professionalTeam')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700">{t('pages.confidentialityAgreement')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700">{t('pages.writtenOpinion')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700">{t('pages.followUpService')}</span>
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
