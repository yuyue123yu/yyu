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
import { Download, Search, Filter, Star, TrendingUp } from "lucide-react";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<LegalTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [downloading, setDownloading] = useState<string | null>(null);

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
      const result = await downloadTemplate(id);
      if (result.success) {
        // 创建一个虚拟下载链接
        const link = document.createElement('a');
        link.href = result.downloadUrl || '#';
        link.download = `${title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert(`✅ ${result.message}\n\n模板: ${title}\n\n注意: 这是演示版本，实际应用中会下载真实的PDF文件。`);
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      alert('下载失败，请稍后重试');
    } finally {
      setDownloading(null);
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
              法律文书模板库
            </h1>
            <p className="text-lg text-blue-100 mb-6">
              {templates.length}+ 专业法律文书模板，符合马来西亚法律要求
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="搜索模板..."
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
              <h2 className="text-lg font-bold text-neutral-900">分类筛选</h2>
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
                全部 ({templates.length})
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
                  {cat.icon} {cat.nameCn} ({cat.count})
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
                <p className="mt-4 text-neutral-600">加载中...</p>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-neutral-600 text-lg">未找到相关模板</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-neutral-600">
                    找到 <span className="font-bold text-primary-600">{filteredTemplates.length}</span> 个模板
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-lg transition-all"
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
                          <span>{template.downloads.toLocaleString()} 下载</span>
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
                          <span>📑 {template.pages} 页</span>
                        )}
                      </div>

                      {/* Price & Download */}
                      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                        <div>
                          {template.price === 0 ? (
                            <span className="text-lg font-bold text-green-600">免费</span>
                          ) : (
                            <span className="text-lg font-bold text-primary-600">
                              RM {template.price}
                            </span>
                          )}
                        </div>
                        <button 
                          onClick={() => handleDownload(template.id, template.title)}
                          disabled={downloading === template.id}
                          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {downloading === template.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                              下载中...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4" />
                              下载
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
              <h2 className="text-2xl font-bold text-neutral-900">热门分类</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {templateCategories.slice(0, 8).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="bg-gradient-to-br from-neutral-50 to-neutral-100 hover:from-primary-50 hover:to-primary-100 border border-neutral-200 hover:border-primary-300 rounded-lg p-6 text-center transition-all"
                >
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h3 className="font-bold text-neutral-900 mb-1">{cat.nameCn}</h3>
                  <p className="text-sm text-neutral-600">{cat.count} 个模板</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
