"use client";

import { useState, useEffect } from "react";
import { Save, Search, Image, Share2, Code, Settings as SettingsIcon, X, Info } from "lucide-react";

interface SEOSettings {
  basic: any;
  favicon: any;
  open_graph: any;
  twitter: any;
  structured_data: any;
  advanced: any;
}

export default function SEOPage() {
  const [settings, setSettings] = useState<SEOSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'favicon' | 'og' | 'twitter' | 'schema' | 'advanced'>('basic');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tenant/seo');
      const data = await response.json();

      if (data.success) {
        setSettings(data.seo);
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
      const response = await fetch('/api/tenant/seo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        alert('SEO 配置已保存！');
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

  const handleFileUpload = async (file: File, type: string) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/tenant/seo/upload-favicon', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        updateFavicon(type, data.url);
        alert('上传成功！');
      } else {
        alert(data.error || '上传失败');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  const updateBasic = (field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      basic: {
        ...settings.basic,
        [field]: value,
      },
    });
  };

  const updateFavicon = (field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      favicon: {
        ...settings.favicon,
        [field]: value,
      },
    });
  };

  const updateOpenGraph = (field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      open_graph: {
        ...settings.open_graph,
        [field]: value,
      },
    });
  };

  const updateTwitter = (field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      twitter: {
        ...settings.twitter,
        [field]: value,
      },
    });
  };

  const updateStructuredData = (section: string, field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      structured_data: {
        ...settings.structured_data,
        [section]: {
          ...settings.structured_data[section],
          [field]: value,
        },
      },
    });
  };

  const updateAdvanced = (field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      advanced: {
        ...settings.advanced,
        [field]: value,
      },
    });
  };

  const addKeyword = () => {
    if (!settings) return;
    const keywords = [...settings.basic.keywords, ''];
    updateBasic('keywords', keywords);
  };

  const removeKeyword = (index: number) => {
    if (!settings) return;
    const keywords = settings.basic.keywords.filter((_: any, i: number) => i !== index);
    updateBasic('keywords', keywords);
  };

  const updateKeyword = (index: number, value: string) => {
    if (!settings) return;
    const keywords = [...settings.basic.keywords];
    keywords[index] = value;
    updateBasic('keywords', keywords);
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
    { id: 'basic', label: '基础 SEO', icon: Search },
    { id: 'favicon', label: 'Favicon', icon: Image },
    { id: 'og', label: 'Open Graph', icon: Share2 },
    { id: 'twitter', label: 'Twitter Card', icon: Share2 },
    { id: 'schema', label: '结构化数据', icon: Code },
    { id: 'advanced', label: '高级设置', icon: SettingsIcon },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">SEO 设置</h1>
          <p className="text-neutral-600 mt-2">优化搜索引擎排名和社交媒体分享</p>
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
        {/* 基础 SEO */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                网站标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={settings.basic.site_title}
                onChange={(e) => updateBasic('site_title', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="专业法律咨询服务"
              />
              <p className="text-xs text-neutral-500 mt-1">
                推荐长度：50-60 字符（当前：{settings.basic.site_title.length} 字符）
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                网站描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={settings.basic.site_description}
                onChange={(e) => updateBasic('site_description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="为您提供全方位的法律支持与解决方案"
              />
              <p className="text-xs text-neutral-500 mt-1">
                推荐长度：150-160 字符（当前：{settings.basic.site_description.length} 字符）
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-neutral-700">
                  关键词
                </label>
                <button
                  onClick={addKeyword}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + 添加关键词
                </button>
              </div>
              <div className="space-y-2">
                {settings.basic.keywords.map((keyword: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => updateKeyword(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="输入关键词"
                    />
                    <button
                      onClick={() => removeKeyword(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  作者
                </label>
                <input
                  type="text"
                  value={settings.basic.author}
                  onChange={(e) => updateBasic('author', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="公司名称或作者"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  语言
                </label>
                <select
                  value={settings.basic.language}
                  onChange={(e) => updateBasic('language', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="zh-CN">简体中文</option>
                  <option value="zh-TW">繁体中文</option>
                  <option value="en">English</option>
                  <option value="ms">Bahasa Melayu</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Favicon */}
        {activeTab === 'favicon' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Favicon 说明</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Favicon: 16x16 或 32x32 像素，ICO 或 PNG 格式</li>
                  <li>Apple Touch Icon: 180x180 像素，PNG 格式</li>
                  <li>文件大小限制：1MB</li>
                </ul>
              </div>
            </div>

            {[
              { key: 'favicon_url', label: 'Favicon (16x16 或 32x32)', type: 'favicon' },
              { key: 'apple_touch_icon_url', label: 'Apple Touch Icon (180x180)', type: 'apple-touch-icon' },
              { key: 'favicon_32_url', label: 'Favicon 32x32', type: 'favicon-32' },
              { key: 'favicon_16_url', label: 'Favicon 16x16', type: 'favicon-16' },
            ].map((item) => (
              <div key={item.key} className="border border-neutral-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  {item.label}
                </label>
                <div className="flex items-center gap-4">
                  {settings.favicon[item.key] && (
                    <img
                      src={settings.favicon[item.key]}
                      alt={item.label}
                      className="w-16 h-16 object-contain border border-neutral-200 rounded"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/x-icon,image/png,image/jpeg,image/svg+xml"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, item.type);
                      }}
                      className="block w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                      disabled={uploading}
                    />
                  </div>
                  {settings.favicon[item.key] && (
                    <button
                      onClick={() => updateFavicon(item.key, '')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Open Graph */}
        {activeTab === 'og' && (
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={settings.open_graph.enabled}
                  onChange={(e) => updateOpenGraph('enabled', e.target.checked)}
                  className="rounded border-neutral-300"
                />
                <span className="text-sm font-medium text-neutral-700">启用 Open Graph</span>
              </label>
            </div>

            {settings.open_graph.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    OG 标题
                  </label>
                  <input
                    type="text"
                    value={settings.open_graph.og_title}
                    onChange={(e) => updateOpenGraph('og_title', e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                    placeholder="留空则使用网站标题"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    OG 描述
                  </label>
                  <textarea
                    value={settings.open_graph.og_description}
                    onChange={(e) => updateOpenGraph('og_description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                    placeholder="留空则使用网站描述"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    OG 图片 URL（推荐 1200x630）
                  </label>
                  <input
                    type="text"
                    value={settings.open_graph.og_image}
                    onChange={(e) => updateOpenGraph('og_image', e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                    placeholder="https://example.com/og-image.jpg"
                  />
                  {settings.open_graph.og_image && (
                    <img
                      src={settings.open_graph.og_image}
                      alt="OG Preview"
                      className="mt-2 w-full max-w-md h-auto border border-neutral-200 rounded"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      OG 类型
                    </label>
                    <select
                      value={settings.open_graph.og_type}
                      onChange={(e) => updateOpenGraph('og_type', e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                    >
                      <option value="website">Website</option>
                      <option value="article">Article</option>
                      <option value="profile">Profile</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      OG 语言
                    </label>
                    <input
                      type="text"
                      value={settings.open_graph.og_locale}
                      onChange={(e) => updateOpenGraph('og_locale', e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                      placeholder="zh_CN"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      OG 网站名称
                    </label>
                    <input
                      type="text"
                      value={settings.open_graph.og_site_name}
                      onChange={(e) => updateOpenGraph('og_site_name', e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                      placeholder="网站名称"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Twitter Card */}
        {activeTab === 'twitter' && (
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={settings.twitter.enabled}
                  onChange={(e) => updateTwitter('enabled', e.target.checked)}
                  className="rounded border-neutral-300"
                />
                <span className="text-sm font-medium text-neutral-700">启用 Twitter Card</span>
              </label>
            </div>

            {settings.twitter.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    卡片类型
                  </label>
                  <select
                    value={settings.twitter.card_type}
                    onChange={(e) => updateTwitter('card_type', e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                  >
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary Large Image</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Twitter 站点账号
                    </label>
                    <input
                      type="text"
                      value={settings.twitter.twitter_site}
                      onChange={(e) => updateTwitter('twitter_site', e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                      placeholder="@username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Twitter 创建者账号
                    </label>
                    <input
                      type="text"
                      value={settings.twitter.twitter_creator}
                      onChange={(e) => updateTwitter('twitter_creator', e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                      placeholder="@username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Twitter 标题
                  </label>
                  <input
                    type="text"
                    value={settings.twitter.twitter_title}
                    onChange={(e) => updateTwitter('twitter_title', e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                    placeholder="留空则使用网站标题"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Twitter 描述
                  </label>
                  <textarea
                    value={settings.twitter.twitter_description}
                    onChange={(e) => updateTwitter('twitter_description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                    placeholder="留空则使用网站描述"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Twitter 图片 URL（推荐 1200x600）
                  </label>
                  <input
                    type="text"
                    value={settings.twitter.twitter_image}
                    onChange={(e) => updateTwitter('twitter_image', e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                    placeholder="https://example.com/twitter-image.jpg"
                  />
                  {settings.twitter.twitter_image && (
                    <img
                      src={settings.twitter.twitter_image}
                      alt="Twitter Preview"
                      className="mt-2 w-full max-w-md h-auto border border-neutral-200 rounded"
                    />
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* 结构化数据 */}
        {activeTab === 'schema' && (
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={settings.structured_data.enabled}
                  onChange={(e) => updateStructuredData('enabled', '', e.target.checked)}
                  className="rounded border-neutral-300"
                />
                <span className="text-sm font-medium text-neutral-700">启用结构化数据</span>
              </label>
            </div>

            {settings.structured_data.enabled && (
              <>
                <div className="border-t border-neutral-200 pt-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">组织信息</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          组织名称
                        </label>
                        <input
                          type="text"
                          value={settings.structured_data.organization.name}
                          onChange={(e) => updateStructuredData('organization', 'name', e.target.value)}
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Logo URL
                        </label>
                        <input
                          type="text"
                          value={settings.structured_data.organization.logo}
                          onChange={(e) => updateStructuredData('organization', 'logo', e.target.value)}
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          网站 URL
                        </label>
                        <input
                          type="text"
                          value={settings.structured_data.organization.url}
                          onChange={(e) => updateStructuredData('organization', 'url', e.target.value)}
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          电话
                        </label>
                        <input
                          type="text"
                          value={settings.structured_data.organization.telephone}
                          onChange={(e) => updateStructuredData('organization', 'telephone', e.target.value)}
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          邮箱
                        </label>
                        <input
                          type="email"
                          value={settings.structured_data.organization.email}
                          onChange={(e) => updateStructuredData('organization', 'email', e.target.value)}
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        描述
                      </label>
                      <textarea
                        value={settings.structured_data.organization.description}
                        onChange={(e) => updateStructuredData('organization', 'description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">本地商业信息</h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.structured_data.local_business.enabled}
                        onChange={(e) => updateStructuredData('local_business', 'enabled', e.target.checked)}
                        className="rounded border-neutral-300"
                      />
                      <span className="text-sm text-neutral-700">启用本地商业信息</span>
                    </label>

                    {settings.structured_data.local_business.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            商业类型
                          </label>
                          <input
                            type="text"
                            value={settings.structured_data.local_business.business_type}
                            onChange={(e) => updateStructuredData('local_business', 'business_type', e.target.value)}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                            placeholder="LegalService"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            价格范围
                          </label>
                          <select
                            value={settings.structured_data.local_business.price_range}
                            onChange={(e) => updateStructuredData('local_business', 'price_range', e.target.value)}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                          >
                            <option value="$">$</option>
                            <option value="$$">$$</option>
                            <option value="$$$">$$$</option>
                            <option value="$$$$">$$$$</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            营业时间
                          </label>
                          <input
                            type="text"
                            value={settings.structured_data.local_business.opening_hours}
                            onChange={(e) => updateStructuredData('local_business', 'opening_hours', e.target.value)}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                            placeholder="Mo-Fr 09:00-18:00"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 高级设置 */}
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Robots 设置
              </label>
              <select
                value={settings.advanced.robots}
                onChange={(e) => updateAdvanced('robots', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
              >
                <option value="index, follow">Index, Follow（推荐）</option>
                <option value="noindex, follow">NoIndex, Follow</option>
                <option value="index, nofollow">Index, NoFollow</option>
                <option value="noindex, nofollow">NoIndex, NoFollow</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Canonical URL
              </label>
              <input
                type="text"
                value={settings.advanced.canonical_url}
                onChange={(e) => updateAdvanced('canonical_url', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                placeholder="https://example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Google 站点验证码
                </label>
                <input
                  type="text"
                  value={settings.advanced.google_site_verification}
                  onChange={(e) => updateAdvanced('google_site_verification', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                  placeholder="验证码"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Bing 站点验证码
                </label>
                <input
                  type="text"
                  value={settings.advanced.bing_site_verification}
                  onChange={(e) => updateAdvanced('bing_site_verification', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                  placeholder="验证码"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  value={settings.advanced.google_analytics_id}
                  onChange={(e) => updateAdvanced('google_analytics_id', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                  placeholder="G-XXXXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Google Tag Manager ID
                </label>
                <input
                  type="text"
                  value={settings.advanced.google_tag_manager_id}
                  onChange={(e) => updateAdvanced('google_tag_manager_id', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                  placeholder="GTM-XXXXXXX"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 提示信息 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">SEO 优化建议</p>
          <ul className="list-disc list-inside space-y-1">
            <li>网站标题应简洁明了，包含核心关键词</li>
            <li>网站描述应吸引人，准确描述网站内容</li>
            <li>关键词应与网站内容相关，避免堆砌</li>
            <li>定期更新内容，保持网站活跃度</li>
            <li>确保网站加载速度快，移动端友好</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
