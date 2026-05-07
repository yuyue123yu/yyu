"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, Filter, Eye, CheckCircle, XCircle, Clock } from "lucide-react";

interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  consultation_type: string;
  case_description: string;
  status: string;
  preferred_date: string;
  created_at: string;
}

export default function ConsultationsManagement() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    const supabase = await createClient();
    setLoading(true);

    try {
      let query = supabase
        .from("consultations")
        .select("*")
        .order("created_at", { ascending: false });

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setConsultations(data || []);
    } catch (error) {
      console.error("Error loading consultations:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const supabase = await createClient();

    try {
      const { error } = await supabase
        .from("consultations")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      loadConsultations();
      
      // 如果详情弹窗打开，更新选中的咨询状态
      if (selectedConsultation && selectedConsultation.id === id) {
        setSelectedConsultation({ ...selectedConsultation, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating consultation:", error);
    }
  };

  const handleViewDetail = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setShowDetailModal(true);
  };

  const filteredConsultations = consultations.filter(
    (consultation) =>
      consultation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.phone?.includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };

    const labels = {
      pending: "待处理",
      confirmed: "已确认",
      completed: "已完成",
      cancelled: "已取消",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">咨询管理</h1>
        <p className="text-neutral-600 mt-2">管理所有用户咨询请求</p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="搜索姓名、邮箱、手机号..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              loadConsultations();
            }}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="all">所有状态</option>
            <option value="pending">待处理</option>
            <option value="confirmed">已确认</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 pt-6 border-t border-neutral-200">
          <div>
            <div className="text-2xl font-bold text-neutral-900">{consultations.length}</div>
            <div className="text-sm text-neutral-600">总咨询数</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {consultations.filter((c) => c.status === "pending").length}
            </div>
            <div className="text-sm text-neutral-600">待处理</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {consultations.filter((c) => c.status === "confirmed").length}
            </div>
            <div className="text-sm text-neutral-600">已确认</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {consultations.filter((c) => c.status === "completed").length}
            </div>
            <div className="text-sm text-neutral-600">已完成</div>
          </div>
        </div>
      </div>

      {/* Consultations List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-4 text-neutral-600">加载中...</p>
          </div>
        </div>
      ) : filteredConsultations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-neutral-200">
          <p className="text-neutral-600">没有找到咨询记录</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredConsultations.map((consultation) => (
            <div
              key={consultation.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-neutral-900">{consultation.name}</h3>
                    {getStatusBadge(consultation.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-neutral-600">
                    <div>📧 {consultation.email}</div>
                    <div>📱 {consultation.phone}</div>
                    <div>📅 期望日期: {consultation.preferred_date || "未指定"}</div>
                    <div>💬 咨询方式: {consultation.consultation_type}</div>
                  </div>
                </div>
                <div className="text-sm text-neutral-500">
                  {new Date(consultation.created_at).toLocaleString("zh-CN")}
                </div>
              </div>

              <div className="mb-4 p-4 bg-neutral-50 rounded-lg">
                <div className="text-sm font-medium text-neutral-700 mb-2">案件描述：</div>
                <div className="text-sm text-neutral-600">{consultation.case_description}</div>
              </div>

              <div className="flex gap-2">
                {consultation.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(consultation.id, "confirmed")}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-all"
                    >
                      <CheckCircle className="h-4 w-4" />
                      确认咨询
                    </button>
                    <button
                      onClick={() => updateStatus(consultation.id, "cancelled")}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-all"
                    >
                      <XCircle className="h-4 w-4" />
                      取消
                    </button>
                  </>
                )}
                {consultation.status === "confirmed" && (
                  <button
                    onClick={() => updateStatus(consultation.id, "completed")}
                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg font-medium transition-all"
                  >
                    <CheckCircle className="h-4 w-4" />
                    标记完成
                  </button>
                )}
                <button
                  onClick={() => handleViewDetail(consultation)}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium transition-all"
                >
                  <Eye className="h-4 w-4" />
                  查看详情
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral-900">咨询详情</h2>
                {getStatusBadge(selectedConsultation.status)}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* 基本信息 */}
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-4">基本信息</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="text-sm text-neutral-600 mb-1">姓名</div>
                    <div className="font-medium text-neutral-900">{selectedConsultation.name}</div>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="text-sm text-neutral-600 mb-1">邮箱</div>
                    <div className="font-medium text-neutral-900">{selectedConsultation.email}</div>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="text-sm text-neutral-600 mb-1">手机号</div>
                    <div className="font-medium text-neutral-900">{selectedConsultation.phone}</div>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="text-sm text-neutral-600 mb-1">咨询方式</div>
                    <div className="font-medium text-neutral-900">{selectedConsultation.consultation_type}</div>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="text-sm text-neutral-600 mb-1">期望日期</div>
                    <div className="font-medium text-neutral-900">
                      {selectedConsultation.preferred_date || "未指定"}
                    </div>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="text-sm text-neutral-600 mb-1">提交时间</div>
                    <div className="font-medium text-neutral-900">
                      {new Date(selectedConsultation.created_at).toLocaleString("zh-CN")}
                    </div>
                  </div>
                </div>
              </div>

              {/* 案件描述 */}
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-4">案件描述</h3>
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <p className="text-neutral-700 whitespace-pre-wrap">{selectedConsultation.case_description}</p>
                </div>
              </div>

              {/* 状态操作 */}
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-4">状态操作</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedConsultation.status === "pending" && (
                    <>
                      <button
                        onClick={() => {
                          updateStatus(selectedConsultation.id, "confirmed");
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                      >
                        <CheckCircle className="h-5 w-5" />
                        确认咨询
                      </button>
                      <button
                        onClick={() => {
                          updateStatus(selectedConsultation.id, "cancelled");
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
                      >
                        <XCircle className="h-5 w-5" />
                        取消咨询
                      </button>
                    </>
                  )}
                  {selectedConsultation.status === "confirmed" && (
                    <button
                      onClick={() => {
                        updateStatus(selectedConsultation.id, "completed");
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
                    >
                      <CheckCircle className="h-5 w-5" />
                      标记为已完成
                    </button>
                  )}
                  {selectedConsultation.status === "completed" && (
                    <div className="flex items-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-lg font-medium">
                      <CheckCircle className="h-5 w-5" />
                      咨询已完成
                    </div>
                  )}
                  {selectedConsultation.status === "cancelled" && (
                    <div className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-lg font-medium">
                      <XCircle className="h-5 w-5" />
                      咨询已取消
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-200">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedConsultation(null);
                }}
                className="w-full px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium transition-all"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
