"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { 
  fetchLegalTemplates, 
  templateCategories, 
  downloadTemplate,
  type LegalTemplate 
} from "@/lib/api/legalTemplates";
import { Download, Search, Filter, Star, TrendingUp, X, FileText, Calendar, Eye, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TemplatesPage() {
  const { t, language } = useLanguage();
  const [templates, setTemplates] = useState<LegalTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [downloading, setDownloading] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<LegalTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
  }, [selectedCategory]);

  const loadTemplates = async () => {
    setLoading(true);
    const data = await fetchLegalTemplates(selectedCategory || undefined);
    setTemplates(data);
    setLoading(false);
  };

  const handleDownload = async (id: string, title: string) => {
    setDownloading(id);
    try {
      // 获取模板详情
      const template = templates.find(t => t.id === id);
      if (!template) {
        alert(language === 'zh' ? '模板不存在' : language === 'en' ? 'Template not found' : 'Templat tidak dijumpai');
        return;
      }
      
      // 动态导入PDF生成库（减少初始加载）
      const { generateTemplatePDF, downloadPDF } = await import('@/lib/pdfGenerator');
      
      // 生成PDF
      const pdfBlob = generateTemplatePDF({
        id: template.id,
        title: template.title,
        category: template.category,
        description: template.description,
        language: template.language,
      });
      
      // 下载PDF
      const filename = `${template.title.replace(/[^a-z0-9]/gi, '_')}_${template.id}.pdf`;
      downloadPDF(pdfBlob, filename);
      
      // 显示成功消息
      const successMsg = language === 'zh' 
        ? `✅ 下载成功！\n\n文件名: ${filename}\n\n文件已保存到您的下载文件夹。`
        : language === 'en'
        ? `✅ Download successful!\n\nFilename: ${filename}\n\nFile saved to your downloads folder.`
        : `✅ Muat turun berjaya!\n\nNama fail: ${filename}\n\nFail disimpan ke folder muat turun anda.`;
      alert(successMsg);
    } catch (error) {
      console.error('Download error:', error);
      const errorMsg = language === 'zh' 
        ? '❌ 下载失败，请稍后重试'
        : language === 'en'
        ? '❌ Download failed, please try again later'
        : '❌ Muat turun gagal, sila cuba lagi kemudian';
      alert(errorMsg);
    } finally {
      setDownloading(null);
      setSelectedTemplate(null);
    }
  };

  const filteredTemplates = templates.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-blue-600 text-white py-20 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 shadow-lg">
                <span className="animate-pulse">✨</span>
                <span>{templates.length}+ {language === 'zh' ? '专业法律模板' : language === 'en' ? 'Professional Legal Templates' : 'Templat Undang-undang Profesional'}</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                {t('pages.templatesTitle')}
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-50 mb-10 leading-relaxed">
                {t('pages.templatesSubtitle')}
              </p>

              {/* Enhanced Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl p-2">
                  <div className="flex items-center gap-3">
                    <Search className="ml-4 h-6 w-6 text-neutral-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder={t('pages.searchTemplates')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 py-4 text-lg text-neutral-900 outline-none bg-transparent"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="mr-2 p-2 hover:bg-neutral-100 rounded-lg transition-all"
                      >
                        <X className="h-5 w-5 text-neutral-400" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">{templates.length}+</div>
                  <div className="text-sm text-blue-100">{language === 'zh' ? '法律模板' : language === 'en' ? 'Templates' : 'Templat'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">{templateCategories.length}</div>
                  <div className="text-sm text-blue-100">{language === 'zh' ? '分类' : language === 'en' ? 'Categories' : 'Kategori'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">100%</div>
                  <div className="text-sm text-blue-100">{language === 'zh' ? '免费下载' : language === 'en' ? 'Free Download' : 'Muat Turun Percuma'}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 bg-white border-b sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-neutral-600" />
                <h2 className="text-lg font-bold text-neutral-900">{t('pages.categoryFilter')}</h2>
              </div>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory("")}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  {language === 'zh' ? '清除筛选' : language === 'en' ? 'Clear Filter' : 'Kosongkan Penapis'}
                </button>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-5 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all shadow-sm ${
                  selectedCategory === ""
                    ? "bg-primary-600 text-white shadow-primary-200"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {t('pages.allTemplates')} ({templates.length})
              </button>
              {templateCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all shadow-sm flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? "bg-primary-600 text-white shadow-primary-200"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span>{language === 'zh' ? cat.nameCn : language === 'ms' ? cat.nameMs : cat.name}</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Templates Grid */}
        <section className="py-10">
          <div className="container mx-auto px-6">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                <p className="mt-4 text-neutral-600">{t('pages.loading')}</p>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-neutral-600 text-lg">{t('pages.noTemplatesFound')}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-neutral-600">
                      {t('pages.found')} <span className="font-bold text-primary-600 text-xl">{filteredTemplates.length}</span> {t('pages.foundTemplates')}
                    </p>
                    {searchQuery && (
                      <p className="text-sm text-neutral-500 mt-1">
                        {language === 'zh' ? `搜索关键词: "${searchQuery}"` : language === 'en' ? `Search: "${searchQuery}"` : `Carian: "${searchQuery}"`}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-600">{language === 'zh' ? '排序:' : language === 'en' ? 'Sort:' : 'Isih:'}</span>
                    <select className="px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200">
                      <option>{language === 'zh' ? '最受欢迎' : language === 'en' ? 'Most Popular' : 'Paling Popular'}</option>
                      <option>{language === 'zh' ? '最新上传' : language === 'en' ? 'Newest' : 'Terbaru'}</option>
                      <option>{language === 'zh' ? '下载最多' : language === 'en' ? 'Most Downloaded' : 'Paling Banyak Dimuat Turun'}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="group bg-white rounded-2xl border-2 border-neutral-200 hover:border-primary-300 p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      {/* Header with Icon */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-md">
                          <FileText className="h-7 w-7 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                            {template.title}
                          </h3>
                          <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">
                            {template.description}
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1.5 text-yellow-600">
                          <Star className="h-4 w-4 fill-yellow-500" />
                          <span className="font-semibold">{template.rating}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-600">
                          <Download className="h-4 w-4" />
                          <span className="font-medium">{template.downloads.toLocaleString()}</span>
                        </div>
                        {template.pages && (
                          <div className="flex items-center gap-1.5 text-neutral-600">
                            <FileText className="h-4 w-4" />
                            <span className="font-medium">{template.pages} {language === 'zh' ? '页' : language === 'en' ? 'pages' : 'halaman'}</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                          {template.language === 'en' ? '🇬🇧 English' : template.language === 'ms' ? '🇲🇾 Bahasa' : '🇨🇳 中文'}
                        </span>
                        {template.fileSize && (
                          <span className="inline-flex items-center px-3 py-1.5 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-full border border-neutral-200">
                            📄 {template.fileSize}
                          </span>
                        )}
                        {template.rating >= 4.5 && (
                          <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 text-xs font-semibold rounded-full border border-yellow-200">
                            ⭐ {language === 'zh' ? '热门' : language === 'en' ? 'Popular' : 'Popular'}
                          </span>
                        )}
                      </div>

                      {/* Price & Download */}
                      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                        <div>
                          {template.price === 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-green-600">{t('pages.free')}</span>
                              <span className="px-2.5 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-700 text-xs font-bold rounded-full border border-green-300">FREE</span>
                            </div>
                          ) : (
                            <span className="text-xl font-bold text-primary-600">
                              RM {template.price}
                            </span>
                          )}
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(template.id, template.title);
                          }}
                          disabled={downloading === template.id}
                          className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          {downloading === template.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                              <span className="hidden sm:inline">{t('pages.downloading')}</span>
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4" />
                              <span className="hidden sm:inline">{t('pages.download')}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Popular Categories */}
        <section className="py-16 bg-gradient-to-b from-white to-neutral-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
                <TrendingUp className="h-4 w-4" />
                {language === 'zh' ? '热门分类' : language === 'en' ? 'Trending' : 'Trending'}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">{t('pages.popularCategories')}</h2>
              <p className="text-neutral-600 text-lg">
                {language === 'zh' ? '浏览最受欢迎的法律文书分类' : language === 'en' ? 'Browse the most popular legal document categories' : 'Layari kategori dokumen undang-undang yang paling popular'}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {templateCategories.slice(0, 8).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group bg-white hover:bg-gradient-to-br hover:from-primary-50 hover:to-primary-100 border-2 border-neutral-200 hover:border-primary-300 rounded-2xl p-8 text-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
                  <h3 className="font-bold text-neutral-900 mb-2 text-lg">{language === 'zh' ? cat.nameCn : language === 'ms' ? cat.nameMs : cat.name}</h3>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-sm text-neutral-600">{cat.count} {t('pages.templates')}</p>
                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setSelectedTemplate(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-slideUp" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 flex items-start justify-between">
              <div className="flex-1 pr-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-3">
                  <FileText className="h-3 w-3" />
                  {language === 'zh' ? '法律文书' : language === 'en' ? 'Legal Document' : 'Dokumen Undang-undang'}
                </div>
                <h2 className="text-3xl font-bold mb-3 leading-tight">
                  {selectedTemplate.title}
                </h2>
                <p className="text-blue-100 text-lg leading-relaxed">
                  {selectedTemplate.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="ml-4 p-2.5 hover:bg-white/20 rounded-xl transition-all flex-shrink-0"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="p-8 space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl p-5 text-center">
                    <Star className="h-7 w-7 text-yellow-500 fill-yellow-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-neutral-900 mb-1">{selectedTemplate.rating}</div>
                    <div className="text-sm text-neutral-600 font-medium">{t('common.rating')}</div>
                  </div>
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200 rounded-xl p-5 text-center">
                    <Download className="h-7 w-7 text-primary-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-neutral-900 mb-1">{selectedTemplate.downloads.toLocaleString()}</div>
                    <div className="text-sm text-neutral-600 font-medium">{t('pages.downloads')}</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-5 text-center">
                    <FileText className="h-7 w-7 text-green-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-neutral-900 mb-1">{selectedTemplate.pages}</div>
                    <div className="text-sm text-neutral-600 font-medium">{language === 'zh' ? '页数' : language === 'en' ? 'Pages' : 'Halaman'}</div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
                    <h3 className="font-bold text-neutral-900 mb-4 text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary-600" />
                      {t('pages.templateInfo')}
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-3 border-b border-neutral-200">
                        <span className="text-neutral-600 font-medium">{t('pages.language')}:</span>
                        <span className="font-semibold text-neutral-900">
                          {selectedTemplate.language === 'en' ? '🇬🇧 English' : selectedTemplate.language === 'ms' ? '🇲🇾 Bahasa Malaysia' : '🇨🇳 中文'}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-neutral-200">
                        <span className="text-neutral-600 font-medium">{t('pages.fileSize')}:</span>
                        <span className="font-semibold text-neutral-900">{selectedTemplate.fileSize}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-neutral-200">
                        <span className="text-neutral-600 font-medium">{t('pages.format')}:</span>
                        <span className="font-semibold text-neutral-900">📄 PDF</span>
                      </div>
                      <div className="flex justify-between py-3">
                        <span className="text-neutral-600 font-medium">{t('pages.lastUpdated')}:</span>
                        <span className="font-semibold text-neutral-900">{selectedTemplate.lastUpdated}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="font-bold text-neutral-900 mb-3 text-lg">{t('pages.detailedDescription')}</h3>
                    <p className="text-neutral-700 leading-relaxed">
                      {language === 'zh' && `这是一份专业的${selectedTemplate.title}，符合马来西亚法律要求。该模板由专业律师审核，包含所有必要的法律条款和条件。您可以根据自己的需求进行修改和定制。`}
                      {language === 'en' && `This is a professional ${selectedTemplate.title} that complies with Malaysian legal requirements. The template has been reviewed by professional lawyers and includes all necessary legal terms and conditions. You can modify and customize it according to your needs.`}
                      {language === 'ms' && `Ini adalah ${selectedTemplate.title} profesional yang mematuhi keperluan undang-undang Malaysia. Templat ini telah disemak oleh peguam profesional dan mengandungi semua terma dan syarat undang-undang yang diperlukan. Anda boleh mengubah suai dan menyesuaikannya mengikut keperluan anda.`}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="font-bold text-neutral-900 mb-4 text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      {t('pages.templateFeatures')}
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                        <span className="text-neutral-700 font-medium">{t('pages.compliantWithLaw')}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                        <span className="text-neutral-700 font-medium">{t('pages.lawyerReviewed')}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                        <span className="text-neutral-700 font-medium">{t('pages.editablePDF')}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                        <span className="text-neutral-700 font-medium">{t('pages.includesInstructions')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Price & Download - Sticky Footer */}
              <div className="sticky bottom-0 bg-gradient-to-r from-primary-600 to-primary-700 p-6">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <div className="text-sm mb-1 opacity-90">{t('common.price')}</div>
                    {selectedTemplate.price === 0 ? (
                      <div className="text-4xl font-bold">{t('pages.free')}</div>
                    ) : (
                      <div className="text-4xl font-bold">RM {selectedTemplate.price}</div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDownload(selectedTemplate.id, selectedTemplate.title)}
                    disabled={downloading === selectedTemplate.id}
                    className="bg-white text-primary-700 hover:bg-blue-50 py-4 px-8 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    {downloading === selectedTemplate.id ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-3 border-primary-700 border-t-transparent"></div>
                        {t('pages.downloading')}
                      </>
                    ) : (
                      <>
                        <Download className="h-6 w-6" />
                        {t('pages.downloadNow')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
