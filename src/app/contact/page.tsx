"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactPage() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      alert(t('contact.successMessage'));
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setSubmitted(false);
    }, 1000);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('contact.title')}</h1>
              <p className="text-xl text-blue-100">
                {t('contact.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Info */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary-100 p-3 rounded-lg">
                        <Phone className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-900 mb-2">电话</h3>
                        <p className="text-neutral-600">+60 3-1234 5678</p>
                        <p className="text-neutral-600">+60 12-345 6789</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary-100 p-3 rounded-lg">
                        <Mail className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-900 mb-2">电子邮箱</h3>
                        <p className="text-neutral-600">info@legalmy.com</p>
                        <p className="text-neutral-600">support@legalmy.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary-100 p-3 rounded-lg">
                        <MapPin className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-900 mb-2">地址</h3>
                        <p className="text-neutral-600">
                          Level 10, Menara ABC<br />
                          Jalan Ampang<br />
                          50450 Kuala Lumpur<br />
                          Malaysia
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary-100 p-3 rounded-lg">
                        <Clock className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-900 mb-2">营业时间</h3>
                        <p className="text-neutral-600">周一至周五: 9:00 - 18:00</p>
                        <p className="text-neutral-600">周六: 9:00 - 13:00</p>
                        <p className="text-neutral-600">周日: 休息</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                      发送消息
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          姓名 *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
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
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                            placeholder="your@email.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            电话号码
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                            placeholder="+60 12-345 6789"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          主题 *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                          placeholder="请输入主题"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          消息 *
                        </label>
                        <textarea
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={6}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                          placeholder="请输入您的消息..."
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
                            发送中...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            发送消息
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
                我们的位置
              </h2>
              <div className="bg-neutral-200 rounded-xl overflow-hidden" style={{ height: '400px' }}>
                <div className="w-full h-full flex items-center justify-center text-neutral-600">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg">地图加载中...</p>
                    <p className="text-sm mt-2">Level 10, Menara ABC, Jalan Ampang, KL</p>
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
