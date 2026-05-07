"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, Plus, Edit, Trash2, CheckCircle, XCircle, Star } from "lucide-react";
import Link from "next/link";

interface Lawyer {
  id: string;
  name: string;
  specialty: string[];
  experience: number;
  rating: number;
  reviews: number;
  location: string;
  available: boolean;
  sold_count: number;
  created_at: string;
  price_range?: string;
  languages?: string[];
  bio?: string;
  education?: string;
  certification?: string;
  response_time?: string;
  success_rate?: number;
}

export default function LawyersManagement() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLawyer, setEditingLawyer] = useState<Lawyer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    specialty: [] as string[],
    experience: 0,
    price_range: "",
    location: "",
    languages: [] as string[],
    bio: "",
    education: "",
    certification: "",
    response_time: "",
    success_rate: 0,
  });

  useEffect(() => {
    loadLawyers();
  }, []);

  const loadLawyers = async () => {
    const supabase = await createClient();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("lawyers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLawyers(data || []);
    } catch (error) {
      console.error("Error loading lawyers:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    const supabase = await createClient();

    try {
      const { error } = await supabase
        .from("lawyers")
        .update({ available: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      loadLawyers();
    } catch (error) {
      console.error("Error updating lawyer:", error);
    }
  };

  const handleEdit = (lawyer: Lawyer) => {
    setEditingLawyer(lawyer);
    setFormData({
      name: lawyer.name || "",
      specialty: lawyer.specialty || [],
      experience: lawyer.experience || 0,
      price_range: lawyer.price_range || "",
      location: lawyer.location || "",
      languages: lawyer.languages || [],
      bio: lawyer.bio || "",
      education: lawyer.education || "",
      certification: lawyer.certification || "",
      response_time: lawyer.response_time || "",
      success_rate: lawyer.success_rate || 0,
    });
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setFormData({
      name: "",
      specialty: [],
      experience: 0,
      price_range: "",
      location: "",
      languages: [],
      bio: "",
      education: "",
      certification: "",
      response_time: "",
      success_rate: 0,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`确定要删除律师 "${name}" 吗？此操作无法撤销。`)) return;

    const supabase = await createClient();

    try {
      const { error } = await supabase.from("lawyers").delete().eq("id", id);

      if (error) throw error;
      loadLawyers();
      alert("删除成功！");
    } catch (error) {
      console.error("Error deleting lawyer:", error);
      alert("删除失败，请重试");
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLawyer) return;

    const supabase = await createClient();

    try {
      const { error } = await supabase
        .from("lawyers")
        .update(formData)
        .eq("id", editingLawyer.id);

      if (error) throw error;

      setShowEditModal(false);
      setEditingLawyer(null);
      loadLawyers();
      alert("更新成功！");
    } catch (error) {
      console.error("Error updating lawyer:", error);
      alert("更新失败，请重试");
    }
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = await createClient();

    try {
      const { error } = await supabase.from("lawyers").insert([
        {
          ...formData,
          rating: 5.0,
          reviews: 0,
          available: true,
          sold_count: 0,
        },
      ]);

      if (error) throw error;

      setShowAddModal(false);
      loadLawyers();
      alert("添加成功！");
    } catch (error) {
      console.error("Error adding lawyer:", error);
      alert("添加失败，请重试");
    }
  };

  const filteredLawyers = lawyers.filter(
    (lawyer) =>
      lawyer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.specialty?.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">律师管理</h1>
          <p className="text-neutral-600 mt-2">管理平台所有律师信息</p>
        </div>
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleAdd();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all"
        >
          <Plus className="h-5 w-5" />
          添加律师
        </Link>
      </div>

      {/* Search & Stats */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200 mb-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <input
            type="text"
            placeholder="搜索律师姓名、地区、专业领域..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold text-neutral-900">{lawyers.length}</div>
            <div className="text-sm text-neutral-600">总律师数</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {lawyers.filter((l) => l.available).length}
            </div>
            <div className="text-sm text-neutral-600">在线律师</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900">
              {lawyers.reduce((sum, l) => sum + l.sold_count, 0)}
            </div>
            <div className="text-sm text-neutral-600">总咨询数</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {(lawyers.reduce((sum, l) => sum + l.rating, 0) / lawyers.length || 0).toFixed(1)}
            </div>
            <div className="text-sm text-neutral-600">平均评分</div>
          </div>
        </div>
      </div>

      {/* Lawyers Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-4 text-neutral-600">加载中...</p>
          </div>
        </div>
      ) : filteredLawyers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-neutral-200">
          <p className="text-neutral-600">没有找到律师</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLawyers.map((lawyer) => (
            <div
              key={lawyer.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200 hover:shadow-md transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-50 rounded-full flex items-center justify-center text-2xl">
                    👨‍⚖️
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900">{lawyer.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-neutral-600">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>{lawyer.rating}</span>
                      <span className="text-neutral-400">({lawyer.reviews})</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleAvailability(lawyer.id, lawyer.available)}
                  className={`p-2 rounded-lg ${
                    lawyer.available
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {lawyer.available ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Info */}
              <div className="space-y-2 mb-4">
                <div className="flex flex-wrap gap-1">
                  {lawyer.specialty.slice(0, 2).map((spec, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                  {lawyer.specialty.length > 2 && (
                    <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-full">
                      +{lawyer.specialty.length - 2}
                    </span>
                  )}
                </div>
                <div className="text-sm text-neutral-600">
                  📍 {lawyer.location} • {lawyer.experience}年经验
                </div>
                <div className="text-sm text-neutral-600">
                  💼 已服务 {lawyer.sold_count} 位客户
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-neutral-200">
                <button
                  onClick={() => handleEdit(lawyer)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg font-medium transition-all"
                >
                  <Edit className="h-4 w-4" />
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(lawyer.id, lawyer.name)}
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
      {showEditModal && editingLawyer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-2xl font-bold text-neutral-900">编辑律师信息</h2>
            </div>

            <form onSubmit={handleSubmitEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    姓名 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    执业年限 *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  专业领域 * (用逗号分隔)
                </label>
                <input
                  type="text"
                  required
                  value={formData.specialty.join(", ")}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value.split(",").map(s => s.trim()) })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="例如：合同法, 劳动法, 房产法"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    价格区间
                  </label>
                  <input
                    type="text"
                    value={formData.price_range}
                    onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="例如：RM 500-1000/小时"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    所在地区 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="例如：吉隆坡"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  语言能力 (用逗号分隔)
                </label>
                <input
                  type="text"
                  value={formData.languages.join(", ")}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value.split(",").map(s => s.trim()) })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="例如：中文, 英语, 马来语"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  个人简介
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  rows={3}
                  placeholder="律师的专业背景和经验介绍"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  教育背景
                </label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="例如：马来亚大学法学学士"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    执业证书
                  </label>
                  <input
                    type="text"
                    value={formData.certification}
                    onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="例如：马来西亚律师公会会员"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    响应时间
                  </label>
                  <input
                    type="text"
                    value={formData.response_time}
                    onChange={(e) => setFormData({ ...formData, response_time: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="例如：24小时内"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  成功率 (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.success_rate}
                  onChange={(e) => setFormData({ ...formData, success_rate: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingLawyer(null);
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
              <h2 className="text-2xl font-bold text-neutral-900">添加新律师</h2>
            </div>

            <form onSubmit={handleSubmitAdd} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    姓名 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    执业年限 *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  专业领域 * (用逗号分隔)
                </label>
                <input
                  type="text"
                  required
                  value={formData.specialty.join(", ")}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value.split(",").map(s => s.trim()) })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="例如：合同法, 劳动法, 房产法"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    价格区间
                  </label>
                  <input
                    type="text"
                    value={formData.price_range}
                    onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="例如：RM 500-1000/小时"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    所在地区 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="例如：吉隆坡"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  语言能力 (用逗号分隔)
                </label>
                <input
                  type="text"
                  value={formData.languages.join(", ")}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value.split(",").map(s => s.trim()) })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="例如：中文, 英语, 马来语"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  个人简介
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  rows={3}
                  placeholder="律师的专业背景和经验介绍"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  教育背景
                </label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="例如：马来亚大学法学学士"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    执业证书
                  </label>
                  <input
                    type="text"
                    value={formData.certification}
                    onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="例如：马来西亚律师公会会员"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    响应时间
                  </label>
                  <input
                    type="text"
                    value={formData.response_time}
                    onChange={(e) => setFormData({ ...formData, response_time: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="例如：24小时内"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  成功率 (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.success_rate}
                  onChange={(e) => setFormData({ ...formData, success_rate: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
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
                  添加律师
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
