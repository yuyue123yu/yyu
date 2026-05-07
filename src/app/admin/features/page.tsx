"use client";

import { useState, useEffect } from "react";
import { Save, ToggleLeft, ToggleRight, MessageSquare, Users, FileText, CreditCard, Crown, MessageCircle, Calendar, Upload, Mail, Gift, Star, Globe, BarChart, Info } from "lucide-react";

interface FeatureConfig {
  enabled: boolean;
  description: string;
  [key: string]: any;
}

interface FeaturesSettings {
  [key: string]: FeatureConfig;
}

export default function FeaturesPage() {
  const [settings, setSettings] = useState<FeaturesSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tenant/features');
      const data = await response.json();

      if (data.success) {
        setSettings(data.features);
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
      const response = await fetch('/api/tenant/features', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        alert('功能开关已保存！');
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

  const toggleFeature = (key: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [key]: {
        ...settings[key],
        enabled: !settings[key].enabled,
      },
    });
  };

  const updateFeatureConfig = (key: string, field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [key]: {
        ...settings[key],
        [field]: value,
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

  const featureGroups = [
    {
      title: '核心功能',
      icon: MessageSquare,
      color: 'blue',
      features: [
        { key: 'consultations', name: '在线咨询', icon: MessageSquare },
        { key: 'lawyers', name: '律师展示', icon: Users },
        { key: 'articles', name: '法律文章', icon: FileText },
      ],
    },
    {
      title: '商业功能',
      icon: CreditCard,
      color: 'green',
      features: [
        { key: 'online_payment', name: '在线支付', icon: CreditCard },
        { key: 'membership', name: '会员系统', icon: Crown },
      ],
    },
    {
      title: '交互功能',
      icon: MessageCircle,
      color: 'purple',
      features: [
        { key: 'live_chat', name: '在线客服', icon: MessageCircle },
        { key: 'appointment_booking', name: '预约预订', icon: Calendar },
        { key: 'document_upload', name: '文档上传', icon: Upload },
      ],
    },
    {
      title: '营销功能',
      icon: Gift,
      color: 'orange',
      features: [
        { key: 'newsletter', name: '邮件订阅', icon: Mail },
        { key: 'referral_program', name: '推荐奖励', icon: Gift },
        { key: 'reviews', name: '用户评价', icon: Star },
      ],
    },
    {
      title: '其他功能',
      icon: Globe,
      color: 'gray',
      features: [
        { key: 'multi_language', name: '多语言', icon: Globe },
        { key: 'seo', name: 'SEO 优化', icon: BarChart },
        { key: 'analytics', name: '数据分析', icon: BarChart },
      ],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; text: string } } = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
      gray: { bg: 'bg-gray-100', text: 'text-gray-600' },
    };
    return colors[color] || colors.gray;
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">功能开关</h1>
          <p className="text-neutral-600 mt-2">控制前台显示的功能模块</p>
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

      {/* 功能统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">总功能数</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">
                {Object.keys(settings).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">已启用</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {Object.values(settings).filter(f => f.enabled).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ToggleRight className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">已禁用</p>
              <p className="text-3xl font-bold text-neutral-400 mt-1">
                {Object.values(settings).filter(f => !f.enabled).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
              <ToggleLeft className="h-6 w-6 text-neutral-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 功能分组 */}
      <div className="space-y-6">
        {featureGroups.map((group) => {
          const colorClasses = getColorClasses(group.color);
          return (
            <div key={group.title} className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 ${colorClasses.bg} rounded-lg flex items-center justify-center`}>
                  <group.icon className={`h-5 w-5 ${colorClasses.text}`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">{group.title}</h2>
                  <p className="text-sm text-neutral-600">
                    {group.features.filter(f => settings[f.key]?.enabled).length} / {group.features.length} 已启用
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.features.map((feature) => {
                  const config = settings[feature.key];
                  if (!config) return null;

                  return (
                    <div
                      key={feature.key}
                      className={`border-2 rounded-lg p-4 transition-all ${
                        config.enabled
                          ? 'border-primary-200 bg-primary-50'
                          : 'border-neutral-200 bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <feature.icon className={`h-5 w-5 ${config.enabled ? 'text-primary-600' : 'text-neutral-400'}`} />
                          <h3 className={`font-semibold ${config.enabled ? 'text-neutral-900' : 'text-neutral-500'}`}>
                            {feature.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => toggleFeature(feature.key)}
                          className="flex-shrink-0"
                        >
                          {config.enabled ? (
                            <ToggleRight className="h-6 w-6 text-green-600" />
                          ) : (
                            <ToggleLeft className="h-6 w-6 text-neutral-400" />
                          )}
                        </button>
                      </div>

                      <p className="text-sm text-neutral-600 mb-3">
                        {config.description}
                      </p>

                      {/* 特定功能的额外配置 */}
                      {config.enabled && (
                        <div className="space-y-2 pt-3 border-t border-neutral-200">
                          {/* 在线咨询的额外选项 */}
                          {feature.key === 'consultations' && (
                            <>
                              <label className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={config.online_booking}
                                  onChange={(e) => updateFeatureConfig(feature.key, 'online_booking', e.target.checked)}
                                  className="rounded border-neutral-300"
                                />
                                <span>在线预约</span>
                              </label>
                              <label className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={config.video_consultation}
                                  onChange={(e) => updateFeatureConfig(feature.key, 'video_consultation', e.target.checked)}
                                  className="rounded border-neutral-300"
                                />
                                <span>视频咨询</span>
                              </label>
                            </>
                          )}

                          {/* 律师展示的额外选项 */}
                          {feature.key === 'lawyers' && (
                            <>
                              <label className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={config.show_profiles}
                                  onChange={(e) => updateFeatureConfig(feature.key, 'show_profiles', e.target.checked)}
                                  className="rounded border-neutral-300"
                                />
                                <span>显示律师资料</span>
                              </label>
                              <label className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={config.show_ratings}
                                  onChange={(e) => updateFeatureConfig(feature.key, 'show_ratings', e.target.checked)}
                                  className="rounded border-neutral-300"
                                />
                                <span>显示评分</span>
                              </label>
                            </>
                          )}

                          {/* 文章的额外选项 */}
                          {feature.key === 'articles' && (
                            <>
                              <label className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={config.allow_comments}
                                  onChange={(e) => updateFeatureConfig(feature.key, 'allow_comments', e.target.checked)}
                                  className="rounded border-neutral-300"
                                />
                                <span>允许评论</span>
                              </label>
                              <label className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={config.show_author}
                                  onChange={(e) => updateFeatureConfig(feature.key, 'show_author', e.target.checked)}
                                  className="rounded border-neutral-300"
                                />
                                <span>显示作者</span>
                              </label>
                            </>
                          )}

                          {/* 会员系统的额外选项 */}
                          {feature.key === 'membership' && (
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={config.auto_renewal}
                                onChange={(e) => updateFeatureConfig(feature.key, 'auto_renewal', e.target.checked)}
                                className="rounded border-neutral-300"
                              />
                              <span>自动续费</span>
                            </label>
                          )}

                          {/* 在线客服的额外选项 */}
                          {feature.key === 'live_chat' && (
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={config.business_hours_only}
                                onChange={(e) => updateFeatureConfig(feature.key, 'business_hours_only', e.target.checked)}
                                className="rounded border-neutral-300"
                              />
                              <span>仅营业时间</span>
                            </label>
                          )}

                          {/* 预约预订的额外选项 */}
                          {feature.key === 'appointment_booking' && (
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={config.require_deposit}
                                onChange={(e) => updateFeatureConfig(feature.key, 'require_deposit', e.target.checked)}
                                className="rounded border-neutral-300"
                              />
                              <span>需要定金</span>
                            </label>
                          )}

                          {/* 文档上传的额外选项 */}
                          {feature.key === 'document_upload' && (
                            <div>
                              <label className="block text-xs text-neutral-600 mb-1">
                                最大文件大小 (MB)
                              </label>
                              <input
                                type="number"
                                value={config.max_file_size_mb}
                                onChange={(e) => updateFeatureConfig(feature.key, 'max_file_size_mb', parseInt(e.target.value))}
                                className="w-full px-2 py-1 text-sm border border-neutral-300 rounded"
                                min="1"
                                max="100"
                              />
                            </div>
                          )}

                          {/* 用户评价的额外选项 */}
                          {feature.key === 'reviews' && (
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={config.require_verification}
                                onChange={(e) => updateFeatureConfig(feature.key, 'require_verification', e.target.checked)}
                                className="rounded border-neutral-300"
                              />
                              <span>需要验证</span>
                            </label>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 提示信息 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">功能开关说明</p>
          <ul className="list-disc list-inside space-y-1">
            <li>启用的功能将在前台网站显示</li>
            <li>禁用的功能将从前台隐藏，但数据不会删除</li>
            <li>某些功能可能需要额外配置才能正常工作</li>
            <li>修改后请点击"保存设置"按钮</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
