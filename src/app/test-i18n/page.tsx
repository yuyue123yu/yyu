"use client";

import { useLanguage } from '@/contexts/LanguageContext';

export default function TestI18nPage() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            多语言测试页面 / Multi-language Test / Ujian Berbilang Bahasa
          </h1>

          {/* 语言切换按钮 */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setLanguage('zh')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                language === 'zh'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              中文
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                language === 'en'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ms')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                language === 'ms'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Bahasa Melayu
            </button>
          </div>

          {/* 当前语言显示 */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
            <p className="text-lg">
              <strong>当前语言 / Current Language / Bahasa Semasa:</strong>{' '}
              <span className="text-blue-600 font-bold">{language.toUpperCase()}</span>
            </p>
          </div>

          {/* 测试翻译 */}
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">通用翻译 / Common / Biasa</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-sm text-gray-500">common.contact:</span>
                  <p className="font-medium">{t('common.contact')}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-sm text-gray-500">common.login:</span>
                  <p className="font-medium">{t('common.login')}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-sm text-gray-500">common.services:</span>
                  <p className="font-medium">{t('common.services')}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-sm text-gray-500">common.lawyers:</span>
                  <p className="font-medium">{t('common.lawyers')}</p>
                </div>
              </div>
            </div>

            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">首页翻译 / Home / Laman Utama</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-sm text-gray-500">home.heroTitle:</span>
                  <p className="font-medium">{t('home.heroTitle')}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-sm text-gray-500">home.heroSubtitle:</span>
                  <p className="font-medium">{t('home.heroSubtitle')}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-sm text-gray-500">home.searchButton:</span>
                  <p className="font-medium">{t('home.searchButton')}</p>
                </div>
              </div>
            </div>

            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">服务分类 / Services / Perkhidmatan</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-sm text-gray-500">services.debt:</span>
                  <p className="font-medium">{t('services.debt')}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-sm text-gray-500">services.family:</span>
                  <p className="font-medium">{t('services.family')}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-sm text-gray-500">services.business:</span>
                  <p className="font-medium">{t('services.business')}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-sm text-gray-500">services.property:</span>
                  <p className="font-medium">{t('services.property')}</p>
                </div>
              </div>
            </div>

            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">页脚 / Footer / Kaki</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-sm text-gray-500">footer.aboutUs:</span>
                  <p className="font-medium">{t('footer.aboutUs')}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-sm text-gray-500">footer.contactUs:</span>
                  <p className="font-medium">{t('footer.contactUs')}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-sm text-gray-500">footer.privacyPolicy:</span>
                  <p className="font-medium">{t('footer.privacyPolicy')}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-sm text-gray-500">footer.termsOfService:</span>
                  <p className="font-medium">{t('footer.termsOfService')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="mt-8 bg-green-50 border-l-4 border-green-500 p-4">
            <h3 className="font-semibold text-green-800 mb-2">✅ 翻译覆盖率统计</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• 中文 (Chinese): 114% (723/635 keys)</li>
              <li>• 英文 (English): 114% (723/635 keys)</li>
              <li>• 马来语 (Malay): 89% (565/635 keys)</li>
            </ul>
          </div>

          {/* 返回首页 */}
          <div className="mt-8 text-center">
            <a
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('auth.backToHome') || '返回首页 / Back to Home / Kembali ke Laman Utama'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
