'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageIcon } from '@heroicons/react/24/outline';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);

  const languages = [
    { code: 'tc' as const, name: '繁體中文', flag: '🇭🇰' },
    { code: 'zh' as const, name: '简体中文', flag: '🇨🇳' },
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'ms' as const, name: 'Bahasa', flag: '🇲🇾' },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center space-x-2 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
      >
        <LanguageIcon className="w-5 h-5" />
        <span className="text-sm font-medium">{currentLanguage?.flag}</span>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-1 z-20">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setShowMenu(false);
                }}
                className={`w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100 ${
                  language === lang.code
                    ? 'bg-orange-50 text-orange-600 font-medium'
                    : 'text-gray-700'
                }`}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.name}
                {language === lang.code && (
                  <span className="ml-auto text-orange-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
