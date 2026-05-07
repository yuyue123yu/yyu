'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  UserCircleIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  user_type: string;
  tenant_id: string;
  tenant_name: string;
  active: boolean;
  created_at: string;
}

interface UserTableProps {
  users: User[];
  onUpdate: () => void;
}

export default function UserTable({ users, onUpdate }: UserTableProps) {
  const router = useRouter();
  const { t } = useLanguage();

  // 重置密码相关状态
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [resetMethod, setResetMethod] = useState<'email' | 'temporary'>('email');
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState('');
  const [passwordCopied, setPasswordCopied] = useState(false);

  const handleResetPassword = (e: React.MouseEvent, user: User) => {
    e.stopPropagation();
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
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('common.user')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('common.tenant')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('common.type')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('common.status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('common.created')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('common.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/super-admin/users/${user.id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <UserCircleIcon className="w-10 h-10 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.full_name || t('common.na')}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <BuildingOfficeIcon className="w-4 h-4 mr-2 text-gray-400" />
                    {user.tenant_name || t('common.unknown')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.user_type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.active ? (
                    <span className="flex items-center text-sm text-green-600">
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      {t('tenants.active')}
                    </span>
                  ) : (
                    <span className="flex items-center text-sm text-red-600">
                      <XCircleIcon className="w-4 h-4 mr-1" />
                      {t('tenants.inactive')}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      onClick={(e) => handleResetPassword(e, user)}
                      className="text-orange-600 hover:text-orange-900"
                      title="重置密码"
                    >
                      <KeyIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/super-admin/users/${user.id}`);
                      }}
                      className="text-orange-600 hover:text-orange-900"
                    >
                      {t('common.viewDetails')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
    </>
  );
}
