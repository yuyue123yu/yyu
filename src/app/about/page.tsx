"use client";

import Link from "next/link";
import { Users, Target, Award, Globe, Shield, Heart, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('common.back')}</span>
          </Link>
          <h1 className="text-5xl font-bold mb-6">{t('about.title')}</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-600">
              <Target className="w-12 h-12 text-blue-600 mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.ourMission')}</h2>
              <p className="text-gray-600 leading-relaxed">
                {t('about.missionText')}
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-yellow-500">
              <Award className="w-12 h-12 text-yellow-600 mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.ourVision')}</h2>
              <p className="text-gray-600 leading-relaxed">
                {t('about.visionText')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">{t('about.coreValues')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
              <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about.professional')}</h3>
              <p className="text-gray-600">
                {t('about.professionalText')}
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
              <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about.userFirst')}</h3>
              <p className="text-gray-600">
                {t('about.userFirstText')}
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
              <Globe className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about.transparent')}</h3>
              <p className="text-gray-600">
                {t('about.transparentText')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">{t('about.platformStats')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">{t('about.certifiedLawyers')}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">690+</div>
              <div className="text-gray-600">{t('about.legalTemplates')}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">{t('about.successCases')}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">{t('about.satisfaction')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">{t('about.ourTeam')}</h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            {t('about.teamText')}
          </p>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Users className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <p className="text-center text-gray-600 leading-relaxed">
              {t('about.teamDescription')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">{t('about.learnMore')}</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('about.learnMoreText')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              {t('common.contact')}
            </Link>
            <Link
              href="/careers"
              className="bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              {t('about.joinUs')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
