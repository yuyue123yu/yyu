"use client";

import { useState, useEffect } from "react";
import { Save, DollarSign, FileText, Users, Tag, ToggleLeft, ToggleRight } from "lucide-react";

interface PricingSettings {
  currency: string;
  consultation: {
    [key: string]: {
      price: number;
      duration: number;
      description: string;
      enabled: boolean;
    };
  };
  documents: {
    [key: string]: {
      price: number;
      description: string;
      enabled: boolean;
    };
  };
  membership: {
    enabled: boolean;
    monthly: {
      price: number;
      description: string;
      benefits: string[];
    };
    yearly: {
      price: number;
      description: string;
      benefits: string[];
    };
  };
  discounts: {
    [key: string]: {
      enabled: boolean;
      percentage: number;
      description: string;
    };
  };
}

export default function PricingPage() {
  const [settings, setSettings] = useState<PricingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tenant/pricing');
      const data = await response.json();

      if (data.success) {
        setSettings(data.pricing);
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
      const response = await fetch('/api/tenant/pricing', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        alert('价格配置已保存！');
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

  const updateConsultation = (key: string, field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      consultation: {
        ...settings.consultation,
        [key]: {
          ...settings.consultation[key],
          [field]: value,
        },
      },
    });
  };

  const updateDocument = (key: string, field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      documents: {
        ...settings.documents,
        [key]: {
          ...settings.documents[key],
          [field]: value,
        },
      },
    });
  };

  const updateMembership = (tier: 'monthly' | 'yearly', field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      membership: {
        ...settings.membership,
        [tier]: {
          ...settings.membership[tier],
          [field]: value,
        },
      },
    });
  };

  const updateDiscount = (key: string, field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      discounts: {
        ...settings.discounts,
        [key]: {
          ...settings.discounts[key],
          [field]: value,
        },
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

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">价格配置</h1>
          <p className="text-neutral-600 mt-2">设置您的服务价格和套餐</p>
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

      <div className="space-y-6">
        {/* 货币设置 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">货币设置</h2>
              <p className="text-sm text-neutral-600">选择您的计价货币</p>
            </div>
          </div>

          <div className="max-w-xs">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              货币类型
            </label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="MYR">马来西亚令吉 (MYR)</option>
              <option value="USD">美元 (USD)</option>
              <option value="SGD">新加坡元 (SGD)</option>
              <option value="CNY">人民币 (CNY)</option>
            </select>
          </div>
        </div>

        {/* 咨询服务价格 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">咨询服务价格</h2>
              <p className="text-sm text-neutral-600">设置不同级别的咨询服务价格</p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(settings.consultation).map(([key, service]) => (
              <div key={key} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-neutral-900">
                    {key === 'basic' ? '基础咨询' : key === 'standard' ? '标准咨询' : '高级咨询'}
                  </h3>
                  <button
                    onClick={() => updateConsultation(key, 'enabled', !service.enabled)}
                    className="flex items-center gap-2"
                  >
                    {service.enabled ? (
                      <ToggleRight className="h-6 w-6 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-neutral-400" />
                    )}
                    <span className="text-sm text-neutral-600">
                      {service.enabled ? '已启用' : '已禁用'}
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      价格 ({settings.currency})
                    </label>
                    <input
                      type="number"
                      value={service.price}
                      onChange={(e) => updateConsultation(key, 'price', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      min="0"
                      step="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      时长 (分钟)
                    </label>
                    <input
                      type="number"
                      value={service.duration}
                      onChange={(e) => updateConsultation(key, 'duration', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      min="15"
                      step="15"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      描述
                    </label>
                    <input
                      type="text"
                      value={service.description}
                      onChange={(e) => updateConsultation(key, 'description', e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 文档服务价格 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">文档服务价格</h2>
              <p className="text-sm text-neutral-600">设置文档相关服务的价格</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(settings.documents).map(([key, service]) => (
              <div key={key} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-neutral-900">
                    {key === 'contract_review' ? '合同审查' : 
                     key === 'legal_letter' ? '法律函件' : 
                     key === 'agreement_draft' ? '协议起草' : '文件公证'}
                  </h3>
                  <button
                    onClick={() => updateDocument(key, 'enabled', !service.enabled)}
                  >
                    {service.enabled ? (
                      <ToggleRight className="h-6 w-6 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-neutral-400" />
                    )}
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      价格 ({settings.currency})
                    </label>
                    <input
                      type="number"
                      value={service.price}
                      onChange={(e) => updateDocument(key, 'price', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      min="0"
                      step="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      描述
                    </label>
                    <input
                      type="text"
                      value={service.description}
                      onChange={(e) => updateDocument(key, 'description', e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 会员套餐 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900">会员套餐</h2>
                <p className="text-sm text-neutral-600">设置会员订阅价格</p>
              </div>
            </div>
            <button
              onClick={() => setSettings({
                ...settings,
                membership: { ...settings.membership, enabled: !settings.membership.enabled }
              })}
              className="flex items-center gap-2"
            >
              {settings.membership.enabled ? (
                <ToggleRight className="h-6 w-6 text-green-600" />
              ) : (
                <ToggleLeft className="h-6 w-6 text-neutral-400" />
              )}
              <span className="text-sm text-neutral-600">
                {settings.membership.enabled ? '已启用' : '已禁用'}
              </span>
            </button>
          </div>

          {settings.membership.enabled && (
            <div className="grid grid-cols-2 gap-6">
              {/* 月度会员 */}
              <div className="border border-neutral-200 rounded-lg p-4">
                <h3 className="font-semibold text-neutral-900 mb-4">月度会员</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      价格 ({settings.currency})
                    </label>
                    <input
                      type="number"
                      value={settings.membership.monthly.price}
                      onChange={(e) => updateMembership('monthly', 'price', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      min="0"
                      step="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      描述
                    </label>
                    <input
                      type="text"
                      value={settings.membership.monthly.description}
                      onChange={(e) => updateMembership('monthly', 'description', e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 年度会员 */}
              <div className="border border-neutral-200 rounded-lg p-4">
                <h3 className="font-semibold text-neutral-900 mb-4">年度会员</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      价格 ({settings.currency})
                    </label>
                    <input
                      type="number"
                      value={settings.membership.yearly.price}
                      onChange={(e) => updateMembership('yearly', 'price', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      min="0"
                      step="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      描述
                    </label>
                    <input
                      type="text"
                      value={settings.membership.yearly.description}
                      onChange={(e) => updateMembership('yearly', 'description', e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 优惠折扣 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Tag className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">优惠折扣</h2>
              <p className="text-sm text-neutral-600">设置各种优惠活动</p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(settings.discounts).map(([key, discount]) => (
              <div key={key} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-neutral-900">
                    {key === 'first_time' ? '首次咨询优惠' : 
                     key === 'referral' ? '推荐好友优惠' : '批量服务优惠'}
                  </h3>
                  <button
                    onClick={() => updateDiscount(key, 'enabled', !discount.enabled)}
                  >
                    {discount.enabled ? (
                      <ToggleRight className="h-6 w-6 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-neutral-400" />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      折扣比例 (%)
                    </label>
                    <input
                      type="number"
                      value={discount.percentage}
                      onChange={(e) => updateDiscount(key, 'percentage', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      min="0"
                      max="100"
                      step="5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      描述
                    </label>
                    <input
                      type="text"
                      value={discount.description}
                      onChange={(e) => updateDiscount(key, 'description', e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
