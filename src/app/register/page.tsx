"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RegisterPage() {
  const { t, language } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "client",
    agree: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert(t('auth.passwordMismatch'));
      return;
    }
    
    if (!formData.agree) {
      alert(t('auth.agreeToTermsRequired'));
      return;
    }
    
    alert(t('auth.registerDemo'));
    console.log("Register data:", formData);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            {/* Card */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                  {t('auth.createAccount')}
                </h1>
                <p className="text-neutral-600">
                  {t('auth.registerSubtitle')}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* User Type */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('auth.accountType')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, userType: "client" })}
                      className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                        formData.userType === "client"
                          ? "border-primary-600 bg-primary-50 text-primary-700"
                          : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                      }`}
                    >
                      {t('auth.client')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, userType: "lawyer" })}
                      className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                        formData.userType === "lawyer"
                          ? "border-primary-600 bg-primary-50 text-primary-700"
                          : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                      }`}
                    >
                      {t('auth.lawyer')}
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('auth.name')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder={t('auth.yourName')}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('auth.emailAddress')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('auth.phoneNumber')}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="+60 12-345 6789"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('auth.password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder={t('auth.atLeast8Chars')}
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('auth.confirmPassword')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder={t('auth.reenterPassword')}
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <div>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agree}
                      onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                      className="w-4 h-4 mt-1 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-neutral-700">
                      {t('auth.agreeToTerms')}{" "}
                      <Link href="/terms" className="text-primary-600 hover:text-primary-700">
                        {t('auth.termsOfService')}
                      </Link>{" "}
                      {t('auth.and')}{" "}
                      <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
                        {t('auth.privacyPolicy')}
                      </Link>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-all"
                >
                  {t('auth.registerButton')}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-neutral-500">{t('auth.or')}</span>
                </div>
              </div>

              {/* Social Register */}
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-3 border border-neutral-300 hover:bg-neutral-50 py-3 rounded-lg font-medium transition-all">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t('auth.registerWithGoogle')}
                </button>
              </div>

              {/* Login Link */}
              <p className="text-center text-sm text-neutral-600 mt-6">
                {t('auth.hasAccount')}{" "}
                <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                  {t('auth.loginNow')}
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-6">
              <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
                ← {t('auth.backToHome')}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
