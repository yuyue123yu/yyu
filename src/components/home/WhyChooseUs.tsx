"use client";

import { Shield, Zap, DollarSign, Users, Award, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WhyChooseUs() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      titleKey: "whyChoose.certificationTitle",
      descKey: "whyChoose.certificationDesc"
    },
    {
      icon: Zap,
      titleKey: "whyChoose.quickResponseTitle",
      descKey: "whyChoose.quickResponseDesc"
    },
    {
      icon: DollarSign,
      titleKey: "whyChoose.transparentPricingTitle",
      descKey: "whyChoose.transparentPricingDesc"
    },
    {
      icon: Users,
      titleKey: "whyChoose.smartMatchingTitle",
      descKey: "whyChoose.smartMatchingDesc"
    },
    {
      icon: Award,
      titleKey: "whyChoose.serviceGuaranteeTitle",
      descKey: "whyChoose.serviceGuaranteeDesc"
    },
    {
      icon: Clock,
      titleKey: "whyChoose.alwaysOnlineTitle",
      descKey: "whyChoose.alwaysOnlineDesc"
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900">
            {t('whyChoose.title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t('whyChoose.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group relative bg-white p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
