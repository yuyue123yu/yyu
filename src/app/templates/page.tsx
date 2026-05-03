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
import { Download, Search, Filter, Star, TrendingUp, X, FileText, Calendar, Eye } from "lucide-react";
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
        <section className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-12">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {t('pages.templatesTitle')}
            </h1>
            <p className="text-lg text-blue-100 mb-6">
              {templates.length}+ {t('pages.templatesSubtitle')}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder={t('pages.searchTemplates')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-neutral-900 outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-neutral-600" />
              <h2 className="text-lg font-bold text-neutral-900">{t('pages.categoryFilter')}</h2>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === ""
                    ? "bg-primary-600 text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {t('pages.allTemplates')} ({templates.length})
              </button>
              {templateCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? "bg-primary-600 text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  {cat.icon} {language === 'zh' ? cat.nameCn : language === 'ms' ? cat.nameMs : cat.name} ({cat.count})
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
                  <p className="text-neutral-600">
                    {t('pages.found')} <span className="font-bold text-primary-600">{filteredTemplates.length}</span> {t('pages.foundTemplates')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-neutral-900 mb-2">
                            {template.title}
                          </h3>
                          <p className="text-sm text-neutral-600 line-clamp-2">
                            {template.description}
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 mb-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{template.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          <span>{template.downloads.toLocaleString()} {t('pages.downloads')}</span>
                        </div>
                      </div>

                      {/* Language Badge */}
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          {template.language === 'en' ? 'English' : template.language === 'ms' ? 'Bahasa Malaysia' : '中文'}
                        </span>
                      </div>

                      {/* File Info */}
                      <div className="flex items-center gap-3 text-xs text-neutral-600 mb-3">
                        {template.fileSize && (
                          <span>📄 {template.fileSize}</span>
                        )}
                        {template.pages && (
                          <span>📑 {template.pages} {language === 'zh' ? '页' : language === 'en' ? 'pages' : 'halaman'}</span>
                        )}
                      </div>

                      {/* Price & Download */}
                      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                        <div>
                          {template.price === 0 ? (
                            <span className="text-lg font-bold text-green-600">{t('pages.free')}</span>
                          ) : (
                            <span className="text-lg font-bold text-primary-600">
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
                          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {downloading === template.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                              {t('pages.downloading')}
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4" />
                              {t('pages.download')}
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
        <section className="py-10 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-neutral-900">{t('pages.popularCategories')}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {templateCategories.slice(0, 8).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="bg-gradient-to-br from-neutral-50 to-neutral-100 hover:from-primary-50 hover:to-primary-100 border border-neutral-200 hover:border-primary-300 rounded-lg p-6 text-center transition-all"
                >
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h3 className="font-bold text-neutral-900 mb-1">{language === 'zh' ? cat.nameCn : language === 'ms' ? cat.nameMs : cat.name}</h3>
                  <p className="text-sm text-neutral-600">{cat.count} {t('pages.templates')}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedTemplate(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  {selectedTemplate.title}
                </h2>
                <p className="text-neutral-600">
                  {selectedTemplate.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="ml-4 p-2 hover:bg-neutral-100 rounded-lg transition-all"
              >
                <X className="h-6 w-6 text-neutral-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-neutral-50 rounded-lg p-4 text-center">
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neutral-900">{selectedTemplate.rating}</div>
                  <div className="text-sm text-neutral-600">{t('common.rating')}</div>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4 text-center">
                  <Download className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neutral-900">{selectedTemplate.downloads.toLocaleString()}</div>
                  <div className="text-sm text-neutral-600">{t('pages.downloads')}</div>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4 text-center">
                  <FileText className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neutral-900">{selectedTemplate.pages}</div>
                  <div className="text-sm text-neutral-600">{language === 'zh' ? '页数' : language === 'en' ? 'Pages' : 'Halaman'}</div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-neutral-900 mb-2">{t('pages.templateInfo')}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-neutral-100">
                      <span className="text-neutral-600">{t('pages.language')}:</span>
                      <span className="font-medium text-neutral-900">
                        {selectedTemplate.language === 'en' ? 'English' : selectedTemplate.language === 'ms' ? 'Bahasa Malaysia' : '中文'}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-neutral-100">
                      <span className="text-neutral-600">{t('pages.fileSize')}:</span>
                      <span className="font-medium text-neutral-900">{selectedTemplate.fileSize}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-neutral-100">
                      <span className="text-neutral-600">{t('pages.format')}:</span>
                      <span className="font-medium text-neutral-900">PDF</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-neutral-100">
                      <span className="text-neutral-600">{t('pages.lastUpdated')}:</span>
                      <span className="font-medium text-neutral-900">{selectedTemplate.lastUpdated}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-bold text-neutral-900 mb-2">{t('pages.detailedDescription')}</h3>
                  <p className="text-neutral-700 leading-relaxed">
                    {language === 'zh' && `这是一份专业的${selectedTemplate.title}，符合马来西亚法律要求。该模板由专业律师审核，包含所有必要的法律条款和条件。您可以根据自己的需求进行修改和定制。`}
                    {language === 'en' && `This is a professional ${selectedTemplate.title} that complies with Malaysian legal requirements. The template has been reviewed by professional lawyers and includes all necessary legal terms and conditions. You can modify and customize it according to your needs.`}
                    {language === 'ms' && `Ini adalah ${selectedTemplate.title} profesional yang mematuhi keperluan undang-undang Malaysia. Templat ini telah disemak oleh peguam profesional dan mengandungi semua terma dan syarat undang-undang yang diperlukan. Anda boleh mengubah suai dan menyesuaikannya mengikut keperluan anda.`}
                  </p>
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-bold text-neutral-900 mb-2">{t('pages.templateFeatures')}</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-neutral-700">{t('pages.compliantWithLaw')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-neutral-700">{t('pages.lawyerReviewed')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-neutral-700">{t('pages.editablePDF')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-neutral-700">{t('pages.includesInstructions')}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Price & Download */}
              <div className="bg-primary-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-neutral-600 mb-1">{t('common.price')}</div>
                    {selectedTemplate.price === 0 ? (
                      <div className="text-3xl font-bold text-green-600">{t('pages.free')}</div>
                    ) : (
                      <div className="text-3xl font-bold text-primary-600">RM {selectedTemplate.price}</div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(selectedTemplate.id, selectedTemplate.title)}
                  disabled={downloading === selectedTemplate.id}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloading === selectedTemplate.id ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      {t('pages.downloading')}
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5" />
                      {t('pages.downloadNow')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
