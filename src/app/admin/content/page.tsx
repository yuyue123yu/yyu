"use client";

import { useState, useEffect } from "react";
import { Save, FileText, Home, Info, HelpCircle, Mail, Plus, Trash2, Eye, EyeOff } from "lucide-react";

interface ContentSettings {
  hero: any;
  services: any;
  about: any;
  faq: any;
  footer: any;
}

export default function ContentPage() {
  const [settings, setSettings] = useState<ContentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'services' | 'about' | 'faq' | 'footer'>('hero');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tenant/content');
      const data = await response.json();

      if (data.success) {
        setSettings(data.content);
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
      const response = await fetch('/api/tenant/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        alert('内容已保存！');
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

  const updateSection = (section: keyof ContentSettings, field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    });
  };

  const updateNestedField = (section: keyof ContentSettings, parent: string, field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [parent]: {
          ...settings[section][parent],
          [field]: value,
        },
      },
    });
  };

  const addArrayItem = (section: keyof ContentSettings, field: string, defaultItem: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: [...settings[section][field], defaultItem],
      },
    });
  };

  const removeArrayItem = (section: keyof ContentSettings, field: string, index: number) => {
    if (!settings) return;
    const newArray = [...settings[section][field]];
    newArray.splice(index, 1);
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: newArray,
      },
    });
  };

  const updateArrayItem = (section: keyof ContentSettings, field: string, index: number, itemField: string, value: any) => {
    if (!settings) return;
    const newArray = [...settings[section][field]];
    newArray[index] = {
      ...newArray[index],
      [itemField]: value,
    };
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: newArray,
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
    { id: 'hero', label: '首页横幅', icon: Home },
    { id: 'services', label: '服务介绍', icon: FileText },
    { id: 'about', label: '关于我们', icon: Info },
    { id: 'faq', label: '常见问题', icon: HelpCircle },
    { id: 'footer', label: '页脚内容', icon: Mail },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">内容管理</h1>
          <p className="text-neutral-600 mt-2">编辑网站的文字内容和描述</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-lg font-medium transition-all"
          >
            {previewMode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            {previewMode ? '编辑模式' : '预览模式'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            {saving ? '保存中...' : '保存内容'}
          </button>
        </div>
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

      {/* Content Sections */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
        {/* 首页横幅 */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                主标题
              </label>
              <input
                type="text"
                value={settings.hero.title}
                onChange={(e) => updateSection('hero', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="专业法律咨询服务"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                副标题
              </label>
              <input
                type="text"
                value={settings.hero.subtitle}
                onChange={(e) => updateSection('hero', 'subtitle', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="为您提供全方位的法律支持与解决方案"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                详细描述
              </label>
              <textarea
                value={settings.hero.description}
                onChange={(e) => updateSection('hero', 'description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="详细介绍您的服务..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  按钮文字
                </label>
                <input
                  type="text"
                  value={settings.hero.cta_text}
                  onChange={(e) => updateSection('hero', 'cta_text', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="立即咨询"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  按钮链接
                </label>
                <input
                  type="text"
                  value={settings.hero.cta_link}
                  onChange={(e) => updateSection('hero', 'cta_link', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="/consultations"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                背景图片 URL（可选）
              </label>
              <input
                type="text"
                value={settings.hero.background_image}
                onChange={(e) => updateSection('hero', 'background_image', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        )}

        {/* 服务介绍 */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                标题
              </label>
              <input
                type="text"
                value={settings.services.title}
                onChange={(e) => updateSection('services', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                副标题
              </label>
              <input
                type="text"
                value={settings.services.subtitle}
                onChange={(e) => updateSection('services', 'subtitle', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-neutral-700">
                  服务项目
                </label>
                <button
                  onClick={() => addArrayItem('services', 'items', {
                    title: '新服务',
                    description: '服务描述',
                    icon: 'FileText',
                  })}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
                >
                  <Plus className="h-4 w-4" />
                  添加服务
                </button>
              </div>

              <div className="space-y-4">
                {settings.services.items.map((item: any, index: number) => (
                  <div key={index} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-neutral-900">服务 {index + 1}</h4>
                      <button
                        onClick={() => removeArrayItem('services', 'items', index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateArrayItem('services', 'items', index, 'title', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg"
                        placeholder="服务标题"
                      />
                      <textarea
                        value={item.description}
                        onChange={(e) => updateArrayItem('services', 'items', index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg"
                        placeholder="服务描述"
                      />
                      <input
                        type="text"
                        value={item.icon}
                        onChange={(e) => updateArrayItem('services', 'items', index, 'icon', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg"
                        placeholder="图标名称 (如: MessageSquare)"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 关于我们 */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                标题
              </label>
              <input
                type="text"
                value={settings.about.title}
                onChange={(e) => updateSection('about', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                副标题
              </label>
              <input
                type="text"
                value={settings.about.subtitle}
                onChange={(e) => updateSection('about', 'subtitle', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                详细内容
              </label>
              <textarea
                value={settings.about.content}
                onChange={(e) => updateSection('about', 'content', e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  使命
                </label>
                <input
                  type="text"
                  value={settings.about.mission}
                  onChange={(e) => updateSection('about', 'mission', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  愿景
                </label>
                <input
                  type="text"
                  value={settings.about.vision}
                  onChange={(e) => updateSection('about', 'vision', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  团队规模
                </label>
                <input
                  type="text"
                  value={settings.about.team_size}
                  onChange={(e) => updateSection('about', 'team_size', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="20+"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  从业年限
                </label>
                <input
                  type="text"
                  value={settings.about.years_experience}
                  onChange={(e) => updateSection('about', 'years_experience', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="10+"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  处理案件
                </label>
                <input
                  type="text"
                  value={settings.about.cases_handled}
                  onChange={(e) => updateSection('about', 'cases_handled', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="1000+"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  客户满意度
                </label>
                <input
                  type="text"
                  value={settings.about.client_satisfaction}
                  onChange={(e) => updateSection('about', 'client_satisfaction', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="98%"
                />
              </div>
            </div>
          </div>
        )}

        {/* 常见问题 */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                标题
              </label>
              <input
                type="text"
                value={settings.faq.title}
                onChange={(e) => updateSection('faq', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                副标题
              </label>
              <input
                type="text"
                value={settings.faq.subtitle}
                onChange={(e) => updateSection('faq', 'subtitle', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-neutral-700">
                  问题列表
                </label>
                <button
                  onClick={() => addArrayItem('faq', 'items', {
                    question: '新问题',
                    answer: '答案',
                  })}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
                >
                  <Plus className="h-4 w-4" />
                  添加问题
                </button>
              </div>

              <div className="space-y-4">
                {settings.faq.items.map((item: any, index: number) => (
                  <div key={index} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-neutral-900">问题 {index + 1}</h4>
                      <button
                        onClick={() => removeArrayItem('faq', 'items', index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) => updateArrayItem('faq', 'items', index, 'question', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg"
                        placeholder="问题"
                      />
                      <textarea
                        value={item.answer}
                        onChange={(e) => updateArrayItem('faq', 'items', index, 'answer', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg"
                        placeholder="答案"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 页脚内容 */}
        {activeTab === 'footer' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                公司简介
              </label>
              <textarea
                value={settings.footer.company_description}
                onChange={(e) => updateSection('footer', 'company_description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="border-t border-neutral-200 pt-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">联系信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    地址
                  </label>
                  <input
                    type="text"
                    value={settings.footer.contact.address}
                    onChange={(e) => updateNestedField('footer', 'contact', 'address', e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    电话
                  </label>
                  <input
                    type="text"
                    value={settings.footer.contact.phone}
                    onChange={(e) => updateNestedField('footer', 'contact', 'phone', e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    邮箱
                  </label>
                  <input
                    type="email"
                    value={settings.footer.contact.email}
                    onChange={(e) => updateNestedField('footer', 'contact', 'email', e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    营业时间
                  </label>
                  <input
                    type="text"
                    value={settings.footer.contact.business_hours}
                    onChange={(e) => updateNestedField('footer', 'contact', 'business_hours', e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                版权信息
              </label>
              <input
                type="text"
                value={settings.footer.copyright}
                onChange={(e) => updateSection('footer', 'copyright', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.footer.show_social_links}
                  onChange={(e) => updateSection('footer', 'show_social_links', e.target.checked)}
                  className="rounded border-neutral-300"
                />
                <span className="text-sm font-medium text-neutral-700">显示社交媒体链接</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 提示信息 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">内容管理说明</p>
          <ul className="list-disc list-inside space-y-1">
            <li>修改的内容将在前台网站实时显示</li>
            <li>建议定期备份重要内容</li>
            <li>使用预览模式查看效果（开发中）</li>
            <li>修改后请点击"保存内容"按钮</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
