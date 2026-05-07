"use client";

import { useState, useEffect } from "react";
import { Save, Globe, CheckCircle, XCircle, Clock, AlertCircle, Copy, ExternalLink, RefreshCw } from "lucide-react";

interface DomainSettings {
  subdomain: any;
  custom_domain: any;
  dns_records: any;
  verification: any;
  redirect: any;
}

export default function DomainPage() {
  const [settings, setSettings] = useState<DomainSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState<'subdomain' | 'custom'>('subdomain');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tenant/domain');
      const data = await response.json();

      if (data.success) {
        setSettings(data.domain);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      alert('加载设置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      const response = await fetch('/api/tenant/domain', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        alert('域名配置已保存！');
      } else {
        alert(data.error || '保存失败');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleVerify = async (type: 'subdomain' | 'custom_domain') => {
    try {
      setVerifying(true);
      const response = await fetch('/api/tenant/domain/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        if (data.verified) {
          setSettings(data.domain);
        }
      } else {
        alert(data.error || '验证失败');
      }
    } catch (error) {
      console.error('Error verifying domain:', error);
      alert('验证失败，请重试');
    } finally {
      setVerifying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('已复制到剪贴板');
  };

  const updateSubdomain = (field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      subdomain: {
        ...settings.subdomain,
        [field]: value,
      },
    });
  };

  const updateCustomDomain = (field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      custom_domain: {
        ...settings.custom_domain,
        [field]: value,
      },
    });
  };

  const updateRedirect = (field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      redirect: {
        ...settings.redirect,
        [field]: value,
      },
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { icon: any; color: string; text: string } } = {
      not_configured: { icon: AlertCircle, color: 'text-gray-600 bg-gray-100', text: '未配置' },
      pending: { icon: Clock, color: 'text-yellow-600 bg-yellow-100', text: '待验证' },
      active: { icon: CheckCircle, color: 'text-green-600 bg-green-100', text: '已激活' },
      error: { icon: XCircle, color: 'text-red-600 bg-red-100', text: '错误' },
    };

    const config = statusConfig[status] || statusConfig.not_configured;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </span>
    );
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-4 text-neutral-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">域名配置</h1>
          <p className="text-neutral-600 mt-2">配置您的自定义域名或子域名</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-5 w-5" />
          {saving ? '保存中...' : '保存配置'}
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-neutral-200">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('subdomain')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${
              activeTab === 'subdomain'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Globe className="h-5 w-5" />
            子域名
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${
              activeTab === 'custom'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Globe className="h-5 w-5" />
            自定义域名
          </button>
        </div>
      </div>

      {/* Subdomain Tab */}
      {activeTab === 'subdomain' && (
        <div className="space-y-6">
          {/* 子域名配置 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">子域名配置</h2>
                <p className="text-sm text-neutral-600 mt-1">使用平台提供的子域名</p>
              </div>
              {getStatusBadge(settings.subdomain.status)}
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    checked={settings.subdomain.enabled}
                    onChange={(e) => updateSubdomain('enabled', e.target.checked)}
                    className="rounded border-neutral-300"
                  />
                  <span className="text-sm font-medium text-neutral-700">启用子域名</span>
                </label>
              </div>

              {settings.subdomain.enabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      子域名名称
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={settings.subdomain.name}
                        onChange={(e) => updateSubdomain('name', e.target.value.toLowerCase())}
                        className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="your-company"
                      />
                      <span className="text-neutral-600">.platform.com</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      只能包含小写字母、数字和连字符，不能以连字符开头或结尾
                    </p>
                  </div>

                  {settings.subdomain.name && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Globe className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-900 mb-2">您的子域名</p>
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-white px-3 py-1 rounded border border-blue-200">
                              {settings.subdomain.name}.platform.com
                            </code>
                            <button
                              onClick={() => copyToClipboard(`${settings.subdomain.name}.platform.com`)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <a
                              href={`https://${settings.subdomain.name}.platform.com`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {settings.subdomain.status === 'pending' && (
                    <button
                      onClick={() => handleVerify('subdomain')}
                      disabled={verifying}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all disabled:opacity-50"
                    >
                      <RefreshCw className={`h-4 w-4 ${verifying ? 'animate-spin' : ''}`} />
                      {verifying ? '验证中...' : '验证子域名'}
                    </button>
                  )}

                  {settings.subdomain.verified_at && (
                    <div className="text-sm text-green-600">
                      ✓ 已验证于 {new Date(settings.subdomain.verified_at).toLocaleString('zh-CN')}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Domain Tab */}
      {activeTab === 'custom' && (
        <div className="space-y-6">
          {/* 自定义域名配置 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">自定义域名配置</h2>
                <p className="text-sm text-neutral-600 mt-1">使用您自己的域名</p>
              </div>
              {getStatusBadge(settings.custom_domain.status)}
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    checked={settings.custom_domain.enabled}
                    onChange={(e) => updateCustomDomain('enabled', e.target.checked)}
                    className="rounded border-neutral-300"
                  />
                  <span className="text-sm font-medium text-neutral-700">启用自定义域名</span>
                </label>
              </div>

              {settings.custom_domain.enabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      域名
                    </label>
                    <input
                      type="text"
                      value={settings.custom_domain.domain}
                      onChange={(e) => updateCustomDomain('domain', e.target.value.toLowerCase())}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="www.example.com"
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      请输入完整的域名，包括子域名（如 www）
                    </p>
                  </div>

                  {settings.custom_domain.domain && (
                    <>
                      {/* DNS 配置说明 */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-yellow-900 mb-2">DNS 配置说明</p>
                            <p className="text-sm text-yellow-800 mb-3">
                              请在您的域名注册商处添加以下 DNS 记录：
                            </p>

                            <div className="space-y-3">
                              {/* A 记录 */}
                              <div className="bg-white rounded border border-yellow-200 p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-medium text-neutral-600">A 记录</span>
                                  <button
                                    onClick={() => copyToClipboard(settings.dns_records.a_record.value)}
                                    className="text-yellow-600 hover:text-yellow-700"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </button>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                  <div>
                                    <span className="text-neutral-500">类型:</span>
                                    <code className="ml-1 font-mono">{settings.dns_records.a_record.type}</code>
                                  </div>
                                  <div>
                                    <span className="text-neutral-500">名称:</span>
                                    <code className="ml-1 font-mono">{settings.dns_records.a_record.name}</code>
                                  </div>
                                  <div>
                                    <span className="text-neutral-500">值:</span>
                                    <code className="ml-1 font-mono">{settings.dns_records.a_record.value}</code>
                                  </div>
                                </div>
                              </div>

                              {/* CNAME 记录 */}
                              <div className="bg-white rounded border border-yellow-200 p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-medium text-neutral-600">CNAME 记录</span>
                                  <button
                                    onClick={() => copyToClipboard(settings.dns_records.cname_record.value)}
                                    className="text-yellow-600 hover:text-yellow-700"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </button>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                  <div>
                                    <span className="text-neutral-500">类型:</span>
                                    <code className="ml-1 font-mono">{settings.dns_records.cname_record.type}</code>
                                  </div>
                                  <div>
                                    <span className="text-neutral-500">名称:</span>
                                    <code className="ml-1 font-mono">{settings.dns_records.cname_record.name}</code>
                                  </div>
                                  <div>
                                    <span className="text-neutral-500">值:</span>
                                    <code className="ml-1 font-mono">{settings.dns_records.cname_record.value}</code>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <p className="text-xs text-yellow-700 mt-3">
                              DNS 记录生效通常需要 10 分钟到 48 小时，请耐心等待
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* SSL 状态 */}
                      {settings.custom_domain.status === 'active' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-green-900 mb-1">SSL 证书状态</p>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(settings.custom_domain.ssl_status)}
                                {settings.custom_domain.ssl_issued_at && (
                                  <span className="text-xs text-green-700">
                                    签发于 {new Date(settings.custom_domain.ssl_issued_at).toLocaleString('zh-CN')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => handleVerify('custom_domain')}
                        disabled={verifying}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all disabled:opacity-50"
                      >
                        <RefreshCw className={`h-4 w-4 ${verifying ? 'animate-spin' : ''}`} />
                        {verifying ? '验证中...' : '验证域名'}
                      </button>

                      {settings.custom_domain.verified_at && (
                        <div className="text-sm text-green-600">
                          ✓ 已验证于 {new Date(settings.custom_domain.verified_at).toLocaleString('zh-CN')}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 重定向设置 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">重定向设置</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.redirect.force_https}
                  onChange={(e) => updateRedirect('force_https', e.target.checked)}
                  className="rounded border-neutral-300"
                />
                <span className="text-sm text-neutral-700">强制使用 HTTPS</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.redirect.force_www}
                  onChange={(e) => updateRedirect('force_www', e.target.checked)}
                  className="rounded border-neutral-300"
                />
                <span className="text-sm text-neutral-700">强制使用 www 前缀</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.redirect.redirect_from_old_domain}
                  onChange={(e) => updateRedirect('redirect_from_old_domain', e.target.checked)}
                  className="rounded border-neutral-300"
                />
                <span className="text-sm text-neutral-700">从旧域名重定向</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 提示信息 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">域名配置说明</p>
          <ul className="list-disc list-inside space-y-1">
            <li>子域名由平台提供，配置后即可使用</li>
            <li>自定义域名需要您在域名注册商处配置 DNS 记录</li>
            <li>DNS 记录生效通常需要 10 分钟到 48 小时</li>
            <li>域名验证成功后，系统会自动签发 SSL 证书</li>
            <li>修改后请点击"保存配置"按钮</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
