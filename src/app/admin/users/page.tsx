"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Search, Filter, MoreVertical, Edit, Trash2, Ban, CheckCircle, Key } from "lucide-react";

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  user_type: string;
  created_at: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    user_type: "client",
  });

  // 重置密码相关状态
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [resetMethod, setResetMethod] = useState<'email' | 'temporary'>('email');
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState('');
  const [passwordCopied, setPasswordCopied] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const supabase = await createClient();
    setLoading(true);

    try {
      let query = supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (filterType !== "all") {
        query = query.eq("user_type", filterType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
  );

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      full_name: user.full_name || "",
      email: user.email || "",
      phone: user.phone || "",
      user_type: user.user_type || "client",
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`确定要删除用户 "${name || '未命名用户'}" 吗？此操作无法撤销。`)) return;

    const supabase = await createClient();

    try {
      const { error } = await supabase.from("profiles").delete().eq("id", id);

      if (error) throw error;
      loadUsers();
      alert("删除成功！");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("删除失败，请重试");
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const supabase = await createClient();

    try {
      const { error } = await supabase
        .from("profiles")
        .update(formData)
        .eq("id", editingUser.id);

      if (error) throw error;

      setShowEditModal(false);
      setEditingUser(null);
      loadUsers();
      alert("更新成功！");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("更新失败，请重试");
    }
  };

  const handleResetPassword = (user: User) => {
    setResetPasswordUser(user);
    setResetMethod('email');
    setTemporaryPassword('');
    setResetError('');
    setPasswordCopied(false);
    setShowResetPasswordModal(true);
  };

  const handleSubmitResetPassword = async () => {
    if (!resetPasswordUser) return;

    setIsResetting(true);
    setResetError('');

    try {
      const response = await fetch(`/api/admin/users/${resetPasswordUser.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method: resetMethod }),
      });

      const data = await response.json();

      if (data.success) {
        if (resetMethod === 'temporary' && data.temporaryPassword) {
          setTemporaryPassword(data.temporaryPassword);
        } else {
          alert('重置邮件已发送到用户邮箱！');
          setShowResetPasswordModal(false);
          setResetPasswordUser(null);
        }
      } else {
        setResetError(data.error || '重置失败，请重试');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setResetError('网络错误，请稍后重试');
    } finally {
      setIsResetting(false);
    }
  };

  const handleCopyPassword = () => {
    if (temporaryPassword) {
      navigator.clipboard.writeText(temporaryPassword);
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    }
  };

  const handleCloseResetModal = () => {
    setShowResetPasswordModal(false);
    setResetPasswordUser(null);
    setTemporaryPassword('');
    setResetError('');
    setPasswordCopied(false);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">用户管理</h1>
        <p className="text-neutral-600 mt-2">管理平台所有用户账号</p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="搜索用户邮箱、姓名、手机号..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                loadUsers();
              }}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="all">所有用户</option>
              <option value="client">客户</option>
              <option value="lawyer">律师</option>
              <option value="admin">管理员</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-200">
          <div>
            <div className="text-2xl font-bold text-neutral-900">{users.length}</div>
            <div className="text-sm text-neutral-600">总用户数</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900">
              {users.filter((u) => u.user_type === "client").length}
            </div>
            <div className="text-sm text-neutral-600">客户</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900">
              {users.filter((u) => u.user_type === "lawyer").length}
            </div>
            <div className="text-sm text-neutral-600">律师</div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
              <p className="mt-4 text-neutral-600">加载中...</p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-600">没有找到用户</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    用户
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    联系方式
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    注册时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                          {user.email?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">
                            {user.full_name || "未设置"}
                          </div>
                          <div className="text-sm text-neutral-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">{user.phone || "未设置"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.user_type === "lawyer"
                            ? "bg-blue-100 text-blue-800"
                            : user.user_type === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.user_type === "lawyer"
                          ? "律师"
                          : user.user_type === "admin"
                          ? "管理员"
                          : "客户"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {new Date(user.created_at).toLocaleDateString("zh-CN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResetPassword(user)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="重置密码"
                        >
                          <Key className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-primary-600 hover:text-primary-900"
                          title="编辑"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.full_name)}
                          className="text-red-600 hover:text-red-900"
                          title="删除"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-2xl font-bold text-neutral-900">编辑用户信息</h2>
            </div>

            <form onSubmit={handleSubmitEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  姓名 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  邮箱 *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  disabled
                  title="邮箱不可修改"
                />
                <p className="text-xs text-neutral-500 mt-1">邮箱地址不可修改</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  手机号
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="+60 12-345 6789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  用户类型 *
                </label>
                <select
                  value={formData.user_type}
                  onChange={(e) => setFormData({ ...formData, user_type: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="client">客户</option>
                  <option value="lawyer">律师</option>
                  <option value="admin">管理员</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
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

      {/* Reset Password Modal */}
      {showResetPasswordModal && resetPasswordUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-2xl font-bold text-neutral-900">重置用户密码</h2>
              <p className="text-sm text-neutral-600 mt-2">
                用户: {resetPasswordUser.full_name || resetPasswordUser.email}
              </p>
            </div>

            <div className="p-6">
              {/* 如果已生成临时密码，显示密码 */}
              {temporaryPassword ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-2">
                      临时密码已生成
                    </h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      请将以下密码发送给用户
                    </p>
                  </div>

                  {/* 临时密码显示 */}
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                    <p className="text-xs text-neutral-600 mb-2">临时密码</p>
                    <div className="flex items-center justify-between bg-white border border-neutral-300 rounded-lg p-3">
                      <code className="text-lg font-mono text-neutral-900 select-all">
                        {temporaryPassword}
                      </code>
                      <button
                        onClick={handleCopyPassword}
                        className="ml-2 p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                        title="复制密码"
                      >
                        {passwordCopied ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Key className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 警告 */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      ⚠️ 此密码仅显示一次，请务必保存或立即发送给用户
                    </p>
                  </div>

                  {/* 完成按钮 */}
                  <button
                    onClick={handleCloseResetModal}
                    className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all"
                  >
                    完成
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 错误提示 */}
                  {resetError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-sm">{resetError}</p>
                    </div>
                  )}

                  {/* 选择重置方式 */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      选择重置方式
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-start p-4 border-2 border-neutral-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                        <input
                          type="radio"
                          name="resetMethod"
                          value="email"
                          checked={resetMethod === 'email'}
                          onChange={(e) => setResetMethod(e.target.value as 'email')}
                          className="mt-1 mr-3"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-neutral-900">发送重置邮件</div>
                          <div className="text-sm text-neutral-600 mt-1">
                            系统将发送密码重置链接到用户邮箱
                          </div>
                        </div>
                      </label>

                      <label className="flex items-start p-4 border-2 border-neutral-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                        <input
                          type="radio"
                          name="resetMethod"
                          value="temporary"
                          checked={resetMethod === 'temporary'}
                          onChange={(e) => setResetMethod(e.target.value as 'temporary')}
                          className="mt-1 mr-3"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-neutral-900">生成临时密码</div>
                          <div className="text-sm text-neutral-600 mt-1">
                            系统将生成临时密码并显示给您
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* 提示信息 */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      💡 {resetMethod === 'email' 
                        ? '用户将收到重置邮件，可以自行设置新密码' 
                        : '临时密码仅显示一次，请务必保存并发送给用户'}
                    </p>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseResetModal}
                      disabled={isResetting}
                      className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-all disabled:opacity-50"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitResetPassword}
                      disabled={isResetting}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isResetting ? '处理中...' : '确认重置'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
