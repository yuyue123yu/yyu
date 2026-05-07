"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, Plus, Edit, Trash2, Download, FileText, Upload, X } from "lucide-react";
import FileUpload from "@/components/FileUpload";

interface Template {
  id: string;
  category: string;
  title_zh: string;
  title_en: string;
  title_ms: string;
  description_zh: string;
  description_en: string;
  description_ms: string;
  file_url: string;
  file_size: string;
  language: string;
  downloads: number;
  is_free: boolean;
  price: number;
  created_at: string;
}

export default function TemplatesManagement() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    category: "",
    title_zh: "",
    title_en: "",
    title_ms: "",
    description_zh: "",
    description_en: "",
    description_ms: "",
    file_url: "",
    file_size: "",
    language: "ms",
    is_free: true,
    price: 0,
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const supabase = await createClient();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error("Error loading templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件类型
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert('只支持 PDF、Word、Excel 文件格式');
        return;
      }

      // 验证文件大小（最大 10MB）
      if (file.size > 10 * 1024 * 1024) {
        alert('文件大小不能超过 10MB');
        return;
      }

      setSelectedFile(file);
      
      // 自动计算文件大小
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setFormData({ ...formData, file_size: `${sizeInMB} MB` });
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const supabase = await createClient();
    setUploading(true);
    setUploadProgress(0);

    try {
      // 生成唯一文件名
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `templates/${fileName}`;

      // 上传文件到 Supabase Storage
      const { data, error } = await supabase.storage
        .from('templates')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // 获取公共 URL
      const { data: urlData } = supabase.storage
        .from('templates')
        .getPublicUrl(filePath);

      setUploadProgress(100);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('文件上传失败，请重试');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 如果选择了文件，先上传文件
    let fileUrl = formData.file_url;
    if (selectedFile) {
      const uploadedUrl = await uploadFile(selectedFile);
      if (!uploadedUrl) {
        return; // 上传失败，不继续
      }
      fileUrl = uploadedUrl;
    }

    // 验证必填字段
    if (!fileUrl) {
      alert('请上传文件或输入文件URL');
      return;
    }

    const supabase = await createClient();

    try {
      const { error } = await supabase.from("templates").insert([{
        ...formData,
        file_url: fileUrl,
      }]);

      if (error) throw error;

      setShowAddModal(false);
      setSelectedFile(null);
      setFormData({
        category: "",
        title_zh: "",
        title_en: "",
        title_ms: "",
        description_zh: "",
        description_en: "",
        description_ms: "",
        file_url: "",
        file_size: "",
        language: "ms",
        is_free: true,
        price: 0,
      });
      loadTemplates();
      alert("模板添加成功！");
    } catch (error) {
      console.error("Error adding template:", error);
      alert("添加失败，请重试");
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm("确定要删除这个模板吗？")) return;

    const supabase = await createClient();

    try {
      const { error } = await supabase.from("templates").delete().eq("id", id);

      if (error) throw error;
      loadTemplates();
      alert("删除成功！");
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("删除失败，请重试");
    }
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      category: template.category || "",
      title_zh: template.title_zh || "",
      title_en: template.title_en || "",
      title_ms: template.title_ms || "",
      description_zh: template.description_zh || "",
      description_en: template.description_en || "",
      description_ms: template.description_ms || "",
      file_url: template.file_url || "",
      file_size: template.file_size || "",
      language: template.language || "ms",
      is_free: template.is_free ?? true,
      price: template.price || 0,
    });
    setShowEditModal(true);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    // 如果选择了新文件，先上传
    let fileUrl = formData.file_url;
    if (selectedFile) {
      const uploadedUrl = await uploadFile(selectedFile);
      if (!uploadedUrl) {
        return; // 上传失败，不继续
      }
      fileUrl = uploadedUrl;
    }

    const supabase = await createClient();

    try {
      const { error } = await supabase
        .from("templates")
        .update({
          ...formData,
          file_url: fileUrl,
        })
        .eq("id", editingTemplate.id);

      if (error) throw error;

      setShowEditModal(false);
      setEditingTemplate(null);
      setSelectedFile(null);
      loadTemplates();
      alert("更新成功！");
    } catch (error) {
      console.error("Error updating template:", error);
      alert("更新失败，请重试");
    }
  };

  const filteredTemplates = templates.filter(
    (template) =>
      template.title_zh?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">模板管理</h1>
          <p className="text-neutral-600 mt-2">管理法律文档模板</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all"
        >
          <Plus className="h-5 w-5" />
          添加模板
        </button>
      </div>

      {/* Search & Stats */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200 mb-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <input
            type="text"
            placeholder="搜索模板标题、分类..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold text-neutral-900">{templates.length}</div>
            <div className="text-sm text-neutral-600">总模板数</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {templates.filter((t) => t.is_free).length}
            </div>
            <div className="text-sm text-neutral-600">免费模板</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-600">
              {templates.filter((t) => !t.is_free).length}
            </div>
            <div className="text-sm text-neutral-600">付费模板</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900">
              {templates.reduce((sum, t) => sum + t.downloads, 0)}
            </div>
            <div className="text-sm text-neutral-600">总下载量</div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-4 text-neutral-600">加载中...</p>
          </div>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-neutral-200">
          <FileText className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-600">没有找到模板</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900">{template.title_zh}</h3>
                    <div className="text-sm text-neutral-600">{template.category}</div>
                  </div>
                </div>
                {template.is_free ? (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    免费
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                    RM {template.price}
                  </span>
                )}
              </div>

              <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                {template.description_zh}
              </p>

              <div className="flex items-center gap-4 text-sm text-neutral-600 mb-4">
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  {template.downloads}
                </div>
                <div>{template.file_size}</div>
                <div className="uppercase">{template.language}</div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-neutral-200">
                <button
                  onClick={() => handleEdit(template)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg font-medium transition-all"
                >
                  <Edit className="h-4 w-4" />
                  编辑
                </button>
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-2xl font-bold text-neutral-900">编辑模板</h2>
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
                    placeholder="例如：合同、协议"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    语言
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="zh">中文</option>
                    <option value="en">English</option>
                    <option value="ms">Bahasa Malaysia</option>
                  </select>
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
                  描述（中文）
                </label>
                <textarea
                  required
                  value={formData.description_zh}
                  onChange={(e) => setFormData({ ...formData, description_zh: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    文件URL
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.file_url}
                    onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    文件大小
                  </label>
                  <input
                    type="text"
                    value={formData.file_size}
                    onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="例如：2.5 MB"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_free}
                    onChange={(e) =>
                      setFormData({ ...formData, is_free: e.target.checked, price: e.target.checked ? 0 : formData.price })
                    }
                    className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-neutral-700">免费模板</span>
                </label>

                {!formData.is_free && (
                  <div className="flex-1">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="价格 (RM)"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingTemplate(null);
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
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-2xl font-bold text-neutral-900">添加新模板</h2>
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
                    placeholder="例如：合同、协议"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    语言
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="zh">中文</option>
                    <option value="en">English</option>
                    <option value="ms">Bahasa Malaysia</option>
                  </select>
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
                  描述（中文）
                </label>
                <textarea
                  required
                  value={formData.description_zh}
                  onChange={(e) => setFormData({ ...formData, description_zh: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    文件URL
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.file_url}
                    onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    文件大小
                  </label>
                  <input
                    type="text"
                    value={formData.file_size}
                    onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="例如：2.5 MB"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_free}
                    onChange={(e) =>
                      setFormData({ ...formData, is_free: e.target.checked, price: e.target.checked ? 0 : formData.price })
                    }
                    className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-neutral-700">免费模板</span>
                </label>

                {!formData.is_free && (
                  <div className="flex-1">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="价格 (RM)"
                    />
                  </div>
                )}
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
                  添加模板
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
