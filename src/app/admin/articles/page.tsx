"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, Plus, Edit, Trash2, Eye, EyeOff, BookOpen } from "lucide-react";

interface Article {
  id: string;
  category: string;
  title_zh: string;
  title_en: string;
  title_ms: string;
  content_zh: string;
  content_en: string;
  content_ms: string;
  excerpt_zh: string;
  excerpt_en: string;
  excerpt_ms: string;
  author: string;
  read_time: number;
  views: number;
  image_url: string;
  published: boolean;
  created_at: string;
}

export default function ArticlesManagement() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    category: "",
    title_zh: "",
    title_en: "",
    title_ms: "",
    content_zh: "",
    content_en: "",
    content_ms: "",
    excerpt_zh: "",
    excerpt_en: "",
    excerpt_ms: "",
    author: "",
    read_time: 5,
    image_url: "",
    published: true,
  });

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    const supabase = await createClient();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = await createClient();

    try {
      const { error } = await supabase.from("articles").insert([formData]);

      if (error) throw error;

      setShowAddModal(false);
      setFormData({
        category: "",
        title_zh: "",
        title_en: "",
        title_ms: "",
        content_zh: "",
        content_en: "",
        content_ms: "",
        excerpt_zh: "",
        excerpt_en: "",
        excerpt_ms: "",
        author: "",
        read_time: 5,
        image_url: "",
        published: true,
      });
      loadArticles();
      alert("文章添加成功！");
    } catch (error) {
      console.error("Error adding article:", error);
      alert("添加失败，请重试");
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    const supabase = await createClient();

    try {
      const { error } = await supabase
        .from("articles")
        .update({ published: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      loadArticles();
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm("确定要删除这篇文章吗？")) return;

    const supabase = await createClient();

    try {
      const { error } = await supabase.from("articles").delete().eq("id", id);

      if (error) throw error;
      loadArticles();
      alert("删除成功！");
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("删除失败，请重试");
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      category: article.category || "",
      title_zh: article.title_zh || "",
      title_en: article.title_en || "",
      title_ms: article.title_ms || "",
      content_zh: article.content_zh || "",
      content_en: article.content_en || "",
      content_ms: article.content_ms || "",
      excerpt_zh: article.excerpt_zh || "",
      excerpt_en: article.excerpt_en || "",
      excerpt_ms: article.excerpt_ms || "",
      author: article.author || "",
      read_time: article.read_time || 5,
      image_url: article.image_url || "",
      published: article.published ?? true,
    });
    setShowEditModal(true);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    const supabase = await createClient();

    try {
      const { error } = await supabase
        .from("articles")
        .update(formData)
        .eq("id", editingArticle.id);

      if (error) throw error;

      setShowEditModal(false);
      setEditingArticle(null);
      loadArticles();
      alert("更新成功！");
    } catch (error) {
      console.error("Error updating article:", error);
      alert("更新失败，请重试");
    }
  };

  const filteredArticles = articles.filter(
    (article) =>
      article.title_zh?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">文章管理</h1>
          <p className="text-neutral-600 mt-2">管理法律知识文章</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all"
        >
          <Plus className="h-5 w-5" />
          添加文章
        </button>
      </div>

      {/* Search & Stats */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200 mb-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <input
            type="text"
            placeholder="搜索文章标题、分类、作者..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold text-neutral-900">{articles.length}</div>
            <div className="text-sm text-neutral-600">总文章数</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {articles.filter((a) => a.published).length}
            </div>
            <div className="text-sm text-neutral-600">已发布</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-600">
              {articles.filter((a) => !a.published).length}
            </div>
            <div className="text-sm text-neutral-600">草稿</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-600">
              {articles.reduce((sum, a) => sum + a.views, 0)}
            </div>
            <div className="text-sm text-neutral-600">总阅读量</div>
          </div>
        </div>
      </div>

      {/* Articles List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-4 text-neutral-600">加载中...</p>
          </div>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-neutral-200">
          <BookOpen className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-600">没有找到文章</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200 hover:shadow-md transition-all"
            >
              <div className="flex gap-6">
                {/* Image */}
                {article.image_url && (
                  <div className="w-48 h-32 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
                    <img
                      src={article.image_url}
                      alt={article.title_zh}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-neutral-900">{article.title_zh}</h3>
                        {article.published ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            已发布
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-full">
                            草稿
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-neutral-600">
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                          {article.category}
                        </span>
                        <span>✍️ {article.author}</span>
                        <span>📖 {article.read_time} 分钟阅读</span>
                        <span>👁️ {article.views} 次浏览</span>
                      </div>
                    </div>
                    <div className="text-sm text-neutral-500">
                      {new Date(article.created_at).toLocaleDateString("zh-CN")}
                    </div>
                  </div>

                  <p className="text-neutral-600 mb-4 line-clamp-2">{article.excerpt_zh}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => togglePublished(article.id, article.published)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        article.published
                          ? "bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }`}
                    >
                      {article.published ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          取消发布
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          发布
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(article)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg font-medium transition-all"
                    >
                      <Edit className="h-4 w-4" />
                      编辑
                    </button>
                    <button
                      onClick={() => deleteArticle(article.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                      删除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-2xl font-bold text-neutral-900">编辑文章</h2>
            </div>

            <form onSubmit={handleSubmitEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    分类
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="例如：合同法、劳动法"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    作者
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  标题（中文）
                </label>
                <input
                  type="text"
                  required
                  value={formData.title_zh}
                  onChange={(e) => setFormData({ ...formData, title_zh: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  标题（English）
                </label>
                <input
                  type="text"
                  required
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  标题（Bahasa Malaysia）
                </label>
                <input
                  type="text"
                  required
                  value={formData.title_ms}
                  onChange={(e) => setFormData({ ...formData, title_ms: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  摘要（中文）
                </label>
                <textarea
                  required
                  value={formData.excerpt_zh}
                  onChange={(e) => setFormData({ ...formData, excerpt_zh: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  正文（中文）
                </label>
                <textarea
                  required
                  value={formData.content_zh}
                  onChange={(e) => setFormData({ ...formData, content_zh: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    封面图片URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    阅读时间（分钟）
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.read_time}
                    onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-neutral-700">立即发布</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingArticle(null);
                  }}
                  className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-all"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all"
                >
                  保存更改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-2xl font-bold text-neutral-900">添加新文章</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    分类
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="例如：合同法、劳动法"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    作者
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  标题（中文）
                </label>
                <input
                  type="text"
                  required
                  value={formData.title_zh}
                  onChange={(e) => setFormData({ ...formData, title_zh: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  标题（English）
                </label>
                <input
                  type="text"
                  required
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  标题（Bahasa Malaysia）
                </label>
                <input
                  type="text"
                  required
                  value={formData.title_ms}
                  onChange={(e) => setFormData({ ...formData, title_ms: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  摘要（中文）
                </label>
                <textarea
                  required
                  value={formData.excerpt_zh}
                  onChange={(e) => setFormData({ ...formData, excerpt_zh: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  正文（中文）
                </label>
                <textarea
                  required
                  value={formData.content_zh}
                  onChange={(e) => setFormData({ ...formData, content_zh: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    封面图片URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    阅读时间（分钟）
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.read_time}
                    onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-neutral-700">立即发布</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-all"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all"
                >
                  添加文章
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
