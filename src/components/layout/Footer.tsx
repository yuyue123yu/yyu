"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gray-50 text-gray-600 border-t border-gray-200">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Services */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 mb-4 tracking-wide uppercase">{t('footer.servicesTitle')}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/services/family" className="hover:text-gray-900">{t('services.family')}</Link></li>
              <li><Link href="/services/business" className="hover:text-gray-900">{t('services.business')}</Link></li>
              <li><Link href="/services/property" className="hover:text-gray-900">{t('services.property')}</Link></li>
              <li><Link href="/services/criminal" className="hover:text-gray-900">{t('services.criminal')}</Link></li>
            </ul>
          </div>

          {/* Lawyers */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 mb-4 tracking-wide uppercase">{t('footer.lawyersTitle')}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/lawyers" className="hover:text-gray-900">{t('footer.browseLawyers')}</Link></li>
              <li><Link href="/consultation" className="hover:text-gray-900">{t('footer.bookConsultation')}</Link></li>
              <li><Link href="/careers" className="hover:text-gray-900">{t('footer.joinUs')}</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 mb-4 tracking-wide uppercase">{t('footer.aboutTitle')}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-gray-900">{t('footer.aboutUs')}</Link></li>
              <li><Link href="/knowledge" className="hover:text-gray-900">{t('footer.legalNews')}</Link></li>
              <li><Link href="/contact" className="hover:text-gray-900">{t('footer.contactUs')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 mb-4 tracking-wide uppercase">{t('footer.supportTitle')}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/help" className="hover:text-gray-900">{t('footer.helpCenter')}</Link></li>
              <li><Link href="/help" className="hover:text-gray-900">{t('footer.faq')}</Link></li>
              <li><Link href="/contact" className="hover:text-gray-900">{t('footer.customerService')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 mb-4 tracking-wide uppercase">{t('footer.legalTitle')}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="hover:text-gray-900">{t('footer.privacyPolicy')}</Link></li>
              <li><Link href="/terms" className="hover:text-gray-900">{t('footer.termsOfService')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>{t('footer.copyright')}</p>
          <p className="mt-4 md:mt-0">{t('footer.location')}</p>
        </div>
      </div>
    </footer>
  );
}
