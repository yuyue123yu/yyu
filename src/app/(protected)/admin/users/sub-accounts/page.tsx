'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  LockClosedIcon,
  LockOpenIcon,
  KeyIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import CreateSubAccountModal from '@/components/admin/CreateSubAccountModal';
import EditSubAccountModal from '@/components/admin/EditSubAccountModal';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
  parent_user_id: string | null;
}

export default function SubAccountsPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 重置密码相关状态
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [resetMethod, setResetMethod] = useState<'email' | 'temporary'>('email');
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState('');
  const [passwordCopied, setPasswordCopied] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, search, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search,
        role: roleFilter,
        status: statusFilter,
      });

      const response = await fetch(`/api/tenant/users?${params}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    if (!confirm(`确定要${user.is_active ? '禁用' : '启用'}该用户吗？`)) {
      return;
    }

    try {
      const response = await fetch(`/api/tenant/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: !user.is_active,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchUsers();
      } else {
        alert(data.error || '操作失败');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('操作失败，请稍后重试');
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`确定要删除用户 ${user.full_name} (${user.email}) 吗？此操作无法撤销！`)) {
      return;
    }

    try {
      const response = await fetch(`/api/tenant/users/${user.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchUsers();
      } else {
        alert(data.error || '删除失败');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('删除失败，请稍后重试');
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'manager':
        return 'bg-green-100 text-green-800';
      case 'user':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'owner':
        return '所有者';
      case 'admin':
        return '管理员';
      case 'manager':
        return '经理';
      case 'user':
        return '普通用户';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">子账号管理</h1>
              <p className="text-gray-600 mt-2">管理您的团队成员和子账号</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              创建子账号
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索邮箱或姓名..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">所有角色</option>
              <option value="admin">管理员</option>
              <option value="manager">经理</option>
              <option value="user">普通用户</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">所有状态</option>
              <option value="active">激活</option>
              <option value="inactive">禁用</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">暂无子账号</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 text-orange-600 hover:text-orange-700"
              >
                创建第一个子账号
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      用户
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      角色
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      最后登录
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      创建时间
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.full_name}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                          {getRoleText(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? '激活' : '禁用'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.last_login_at 
                          ? new Date(user.last_login_at).toLocaleDateString('zh-CN')
                          : '从未登录'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleResetPassword(user)}
                            className="text-orange-600 hover:text-orange-900"
                            title="重置密码"
                          >
                            <KeyIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-blue-600 hover:text-blue-900"
                            title="编辑"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={user.is_active ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}
                            title={user.is_active ? '禁用' : '启用'}
                          >
                            {user.is_active ? (
                              <LockClosedIcon className="w-5 h-5" />
                            ) : (
                              <LockOpenIcon className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="text-red-600 hover:text-red-900"
                            title="删除"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  上一页
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  下一页
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    第 <span className="font-medium">{currentPage}</span> 页，共{' '}
                    <span className="font-medium">{totalPages}</span> 页
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      上一页
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      下一页
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateSubAccountModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchUsers();
          }}
        />
      )}

      {showEditModal && selectedUser && (
        <EditSubAccountModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedUser(null);
            fetchUsers();
          }}
        />
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && resetPasswordUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">重置用户密码</h2>
              <p className="text-sm text-gray-600 mt-2">
                用户: {resetPasswordUser.full_name} ({resetPasswordUser.email})
              </p>
            </div>

            <div className="p-6">
              {/* 如果已生成临时密码，显示密码 */}
              {temporaryPassword ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircleIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      临时密码已生成
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      请将以下密码发送给用户
                    </p>
                  </div>

                  {/* 临时密码显示 */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-2">临时密码</p>
                    <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-3">
                      <code className="text-lg font-mono text-gray-900 select-all">
                        {temporaryPassword}
                      </code>
                      <button
                        onClick={handleCopyPassword}
                        className="ml-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="复制密码"
                      >
                        {passwordCopied ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        ) : (
                          <KeyIcon className="w-5 h-5" />
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
                    className="w-full px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all font-medium"
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
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      选择重置方式
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                        <input
                          type="radio"
                          name="resetMethod"
                          value="email"
                          checked={resetMethod === 'email'}
                          onChange={(e) => setResetMethod(e.target.value as 'email')}
                          className="mt-1 mr-3"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">发送重置邮件</div>
                          <div className="text-sm text-gray-600 mt-1">
                            系统将发送密码重置链接到用户邮箱
                          </div>
                        </div>
                      </label>

                      <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                        <input
                          type="radio"
                          name="resetMethod"
                          value="temporary"
                          checked={resetMethod === 'temporary'}
                          onChange={(e) => setResetMethod(e.target.value as 'temporary')}
                          className="mt-1 mr-3"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">生成临时密码</div>
                          <div className="text-sm text-gray-600 mt-1">
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
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
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
