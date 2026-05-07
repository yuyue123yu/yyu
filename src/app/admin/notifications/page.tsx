"use client";

import { useState, useEffect } from "react";
import { Save, Mail, MessageSquare, Bell, Users, Send, Plus, X, Info, AlertCircle } from "lucide-react";

interface NotificationSettings {
  email: any;
  sms: any;
  recipients: any;
  triggers: any;
  rate_limit: any;
}

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [activeTab, setActiveTab] = useState<'email' | 'sms' | 'recipients' | 'triggers'>('email');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tenant/notifications');
      const data = await response.json();

      if (data.success) {
        setSettings(data.notifications);
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
      const response = await fetch('/api/tenant/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        alert('通知配置已保存！');
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

  const handleTest = async (type: 'email' | 'sms') => {
    const recipient = prompt(`请输入测试${type === 'email' ? '邮箱' : '手机号'}：`);
    if (!recipient) return;

    try {
      setTesting(true);
      const response = await fetch('/api/tenant/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, recipient }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
      } else {
        alert(data.error || '测试失败');
      }
    } catch (error) {
      console.error('Error testing notification:', error);
      alert('测试失败，请重试');
    } finally {
      setTesting(false);
    }
  };

  const updateEmail = (field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      email: {
        ...settings.email,
        [field]: value,
      },
    });
  };

  const updateEmailNested = (parent: string, field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      email: {
        ...settings.email,
        [parent]: {
          ...settings.email[parent],
          [field]: value,
        },
      },
    });
  };

  const updateSMS = (field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      sms: {
        ...settings.sms,
        [field]: value,
      },
    });
  };

  const updateSMSNested = (parent: string, field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      sms: {
        ...settings.sms,
        [parent]: {
          ...settings.sms[parent],
          [field]: value,
        },
      },
    });
  };

  const updateTrigger = (trigger: string, field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      triggers: {
        ...settings.triggers,
        [trigger]: {
          ...settings.triggers[trigger],
          [field]: value,
        },
      },
    });
  };

  const addRecipient = (type: string) => {
    if (!settings) return;
    const email = prompt('请输入邮箱地址：');
    if (!email) return;
    
    setSettings({
      ...settings,
      recipients: {
        ...settings.recipients,
        [type]: [...settings.recipients[type], email],
      },
    });
  };

  const removeRecipient = (type: string, index: number) => {
    if (!settings) return;
    const newRecipients = settings.recipients[type].filter((_: any, i: number) => i !== index);
    setSettings({
      ...settings,
      recipients: {
        ...settings.recipients,
        [type]: newRecipients,
      },
    });
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

  const tabs = [
    { id: 'email', label: '邮件通知', icon: Mail },
    { id: 'sms', label: '短信通知', icon: MessageSquare },
    { id: 'recipients', label: '接收人', icon: Users },
    { id: 'triggers', label: '触发条件', icon: Bell },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">通知设置</h1>
          <p className="text-neutral-600 mt-2">配置邮件和短信通知</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-5 w-5" />
          {saving ? '保存中...' : '保存设置'}
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-neutral-200">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
        {/* 邮件通知 */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.email.enabled}
                  onChange={(e) => updateEmail('enabled', e.target.checked)}
                  className="rounded border-neutral-300"
                />
                <span className="text-sm font-medium text-neutral-700">启用邮件通知</span>
              </label>
              {settings.email.enabled && (
                <button
                  onClick={() => handleTest('email')}
                  disabled={testing}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg transition-all disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {testing ? '发送中...' : '发送测试邮件'}
                </button>
              )}
            </div>

            {settings.email.enabled && (
              <>
                <div className="border-t border-neutral-200 pt-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">SMTP 服务器配置</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        SMTP 主机
                      </label>
                      <input
                        type="text"
                        value={settings.email.smtp.host}
                        onChange={(e) => updateEmailNested('smtp', 'host', e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                        placeholder="smtp.gmail.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        SMTP 端口
                      </label>
                      <input
                        type="number"
                        value={settings.email.smtp.port}
                        onChange={(e) => updateEmailNested('smtp', 'port', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                        placeholder="587"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        用户名
                      </label>
                      <input
                        type="text"
                        value={settings.email.smtp.auth.user}
                        onChange={(e) => updateEmailNested('smtp', 'auth', { ...settings.email.smtp.auth, user: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                        placeholder="your-email@gmail.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        密码
                      </label>
                      <input
                        type="password"
                        value={settings.email.smtp.auth.pass}
                        onChange={(e) => updateEmailNested('smtp', 'auth', { ...settings.email.smtp.auth, pass: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.email.smtp.secure}
                        onChange={(e) => updateEmailNested('smtp', 'secure', e.target.checked)}
                        className="rounded border-neutral-300"
                      />
                      <span className="text-sm text-neutral-700">使用 SSL/TLS（端口 465）</span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">发件人信息</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        发件人名称
                      </label>
                      <input
                        type="text"
                        value={settings.email.from.name}
                        onChange={(e) => updateEmailNested('from', 'name', e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                        placeholder="法律咨询平台"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        发件人邮箱 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={settings.email.from.email}
                        onChange={(e) => updateEmailNested('from', 'email', e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                        placeholder="noreply@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">邮件模板</h3>
                  <div className="space-y-4">
                    {Object.entries(settings.email.templates).map(([key, template]: [string, any]) => (
                      <div key={key} className="border border-neutral-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={template.enabled}
                              onChange={(e) => {
                                const newTemplates = { ...settings.email.templates };
                                newTemplates[key].enabled = e.target.checked;
                                updateEmail('templates', newTemplates);
                              }}
                              className="rounded border-neutral-300"
                            />
                            <span className="font-medium text-neutral-900">
                              {key === 'new_consultation' && '新咨询请求'}
                              {key === 'consultation_confirmed' && '咨询已确认'}
                              {key === 'payment_received' && '付款成功'}
                              {key === 'document_ready' && '文档已准备好'}
                            </span>
                          </label>
                        </div>

                        {template.enabled && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-neutral-600 mb-1">
                                邮件主题
                              </label>
                              <input
                                type="text"
                                value={template.subject}
                                onChange={(e) => {
                                  const newTemplates = { ...settings.email.templates };
                                  newTemplates[key].subject = e.target.value;
                                  updateEmail('templates', newTemplates);
                                }}
                                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-neutral-600 mb-1">
                                邮件内容
                              </label>
                              <textarea
                                value={template.body}
                                onChange={(e) => {
                                  const newTemplates = { ...settings.email.templates };
                                  newTemplates[key].body = e.target.value;
                                  updateEmail('templates', newTemplates);
                                }}
                                rows={4}
                                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg font-mono"
                              />
                              <p className="text-xs text-neutral-500 mt-1">
                                可用变量：{'{{'} client_name {'}}'}, {'{{'} consultation_type {'}}'}, {'{{'} created_at {'}}'} 等
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 短信通知 */}
        {activeTab === 'sms' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.sms.enabled}
                  onChange={(e) => updateSMS('enabled', e.target.checked)}
                  className="rounded border-neutral-300"
                />
                <span className="text-sm font-medium text-neutral-700">启用短信通知</span>
              </label>
              {settings.sms.enabled && (
                <button
                  onClick={() => handleTest('sms')}
                  disabled={testing}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg transition-all disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {testing ? '发送中...' : '发送测试短信'}
                </button>
              )}
            </div>

            {settings.sms.enabled && (
              <>
                <div className="border-t border-neutral-200 pt-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">短信服务商配置</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        服务商
                      </label>
                      <select
                        value={settings.sms.provider}
                        onChange={(e) => updateSMS('provider', e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                      >
                        <option value="twilio">Twilio</option>
                        <option value="aliyun">阿里云</option>
                        <option value="tencent">腾讯云</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Account SID / Access Key
                        </label>
                        <input
                          type="text"
                          value={settings.sms.config.account_sid}
                          onChange={(e) => updateSMSNested('config', 'account_sid', e.target.value)}
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                          placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Auth Token / Secret Key
                        </label>
                        <input
                          type="password"
                          value={settings.sms.config.auth_token}
                          onChange={(e) => updateSMSNested('config', 'auth_token', e.target.value)}
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                          placeholder="••••••••"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          发送号码
                        </label>
                        <input
                          type="text"
                          value={settings.sms.config.from_number}
                          onChange={(e) => updateSMSNested('config', 'from_number', e.target.value)}
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                          placeholder="+1234567890"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">短信模板</h3>
                  <div className="space-y-4">
                    {Object.entries(settings.sms.templates).map(([key, template]: [string, any]) => (
                      <div key={key} className="border border-neutral-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={template.enabled}
                              onChange={(e) => {
                                const newTemplates = { ...settings.sms.templates };
                                newTemplates[key].enabled = e.target.checked;
                                updateSMS('templates', newTemplates);
                              }}
                              className="rounded border-neutral-300"
                            />
                            <span className="font-medium text-neutral-900">
                              {key === 'consultation_reminder' && '咨询提醒'}
                              {key === 'payment_confirmation' && '付款确认'}
                            </span>
                          </label>
                        </div>

                        {template.enabled && (
                          <div>
                            <label className="block text-xs font-medium text-neutral-600 mb-1">
                              短信内容
                            </label>
                            <textarea
                              value={template.content}
                              onChange={(e) => {
                                const newTemplates = { ...settings.sms.templates };
                                newTemplates[key].content = e.target.value;
                                updateSMS('templates', newTemplates);
                              }}
                              rows={3}
                              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg"
                            />
                            <p className="text-xs text-neutral-500 mt-1">
                              可用变量：{'{{'} time {'}}'}, {'{{'} lawyer_name {'}}'}, {'{{'} order_id {'}}'}, {'{{'} amount {'}}'} 等
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 接收人 */}
        {activeTab === 'recipients' && (
          <div className="space-y-6">
            {[
              { key: 'admin_emails', label: '管理员邮箱', description: '接收所有通知' },
              { key: 'consultation_emails', label: '咨询通知邮箱', description: '接收咨询相关通知' },
              { key: 'payment_emails', label: '付款通知邮箱', description: '接收付款相关通知' },
              { key: 'document_emails', label: '文档通知邮箱', description: '接收文档相关通知' },
            ].map((item) => (
              <div key={item.key} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-neutral-900">{item.label}</h3>
                    <p className="text-sm text-neutral-600">{item.description}</p>
                  </div>
                  <button
                    onClick={() => addRecipient(item.key)}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
                  >
                    <Plus className="h-4 w-4" />
                    添加
                  </button>
                </div>

                <div className="space-y-2">
                  {settings.recipients[item.key].map((email: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="email"
                        value={email}
                        readOnly
                        className="flex-1 px-3 py-2 text-sm border border-neutral-300 rounded-lg bg-neutral-50"
                      />
                      <button
                        onClick={() => removeRecipient(item.key, index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  {settings.recipients[item.key].length === 0 && (
                    <p className="text-sm text-neutral-500 italic">暂无接收人</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 触发条件 */}
        {activeTab === 'triggers' && (
          <div className="space-y-4">
            {[
              { key: 'new_consultation', label: '新咨询请求', fields: ['notify_admin', 'notify_lawyer', 'notify_client'] },
              { key: 'consultation_confirmed', label: '咨询已确认', fields: ['notify_client', 'notify_lawyer'] },
              { key: 'consultation_cancelled', label: '咨询已取消', fields: ['notify_all'] },
              { key: 'payment_received', label: '付款成功', fields: ['notify_admin', 'notify_client'] },
              { key: 'payment_failed', label: '付款失败', fields: ['notify_admin', 'notify_client'] },
              { key: 'document_uploaded', label: '文档已上传', fields: ['notify_admin', 'notify_lawyer'] },
              { key: 'document_ready', label: '文档已准备好', fields: ['notify_client'] },
              { key: 'new_user_registered', label: '新用户注册', fields: ['notify_admin'] },
            ].map((item) => (
              <div key={item.key} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.triggers[item.key].enabled}
                      onChange={(e) => updateTrigger(item.key, 'enabled', e.target.checked)}
                      className="rounded border-neutral-300"
                    />
                    <span className="font-medium text-neutral-900">{item.label}</span>
                  </label>
                </div>

                {settings.triggers[item.key].enabled && (
                  <div className="pl-6 space-y-2">
                    {item.fields.map((field) => (
                      <label key={field} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={settings.triggers[item.key][field]}
                          onChange={(e) => updateTrigger(item.key, field, e.target.checked)}
                          className="rounded border-neutral-300"
                        />
                        <span className="text-sm text-neutral-700">
                          {field === 'notify_admin' && '通知管理员'}
                          {field === 'notify_lawyer' && '通知律师'}
                          {field === 'notify_client' && '通知客户'}
                          {field === 'notify_all' && '通知所有相关人员'}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 提示信息 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">通知配置说明</p>
          <ul className="list-disc list-inside space-y-1">
            <li>配置 SMTP 服务器以发送邮件通知</li>
            <li>配置短信服务商以发送短信通知</li>
            <li>设置通知接收人和触发条件</li>
            <li>使用测试功能验证配置是否正确</li>
            <li>修改后请点击"保存设置"按钮</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
