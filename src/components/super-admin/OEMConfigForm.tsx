'use client';

import { useState, useEffect } from 'react';
import T from '@/components/super-admin/T';
import {
  PaintBrushIcon,
  PhotoIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface OEMConfigFormProps {
  settings: Record<string, any>;
  onSave: (settings: Record<string, any>) => void;
  isSaving: boolean;
  tenantSubdomain: string;
}

export default function OEMConfigForm({
  settings,
  onSave,
  isSaving,
  tenantSubdomain,
}: OEMConfigFormProps) {
  const [formData, setFormData] = useState({
    // Branding
    primary_color: settings.primary_color || '#EA580C',
    secondary_color: settings.secondary_color || '#DC2626',
    logo_url: settings.logo_url || '',
    company_name: settings.company_name || '',
    
    // Contact
    support_email: settings.support_email || '',
    support_phone: settings.support_phone || '',
    website_url: settings.website_url || '',
    
    // Features
    enable_consultations: settings.enable_consultations !== false,
    enable_orders: settings.enable_orders !== false,
    enable_reviews: settings.enable_reviews !== false,
    enable_articles: settings.enable_articles !== false,
    
    // Language
    default_language: settings.default_language || 'ms',
    supported_languages: settings.supported_languages || ['ms', 'en', 'zh'],
  });

  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setFormData({
      primary_color: settings.primary_color || '#EA580C',
      secondary_color: settings.secondary_color || '#DC2626',
      logo_url: settings.logo_url || '',
      company_name: settings.company_name || '',
      support_email: settings.support_email || '',
      support_phone: settings.support_phone || '',
      website_url: settings.website_url || '',
      enable_consultations: settings.enable_consultations !== false,
      enable_orders: settings.enable_orders !== false,
      enable_reviews: settings.enable_reviews !== false,
      enable_articles: settings.enable_articles !== false,
      default_language: settings.default_language || 'ms',
      supported_languages: settings.supported_languages || ['ms', 'en', 'zh'],
    });
  }, [settings]);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Branding Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <PaintBrushIcon className="w-6 h-6 text-orange-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            <T zh="品牌设置" en="Branding" />
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <T zh="公司名称" en="Company Name" />
            </label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) => updateField('company_name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Acme Corporation"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <T zh="主色调" en="Primary Color" />
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.primary_color}
                  onChange={(e) => updateField('primary_color', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primary_color}
                  onChange={(e) => updateField('primary_color', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <T zh="辅助色" en="Secondary Color" />
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.secondary_color}
                  onChange={(e) => updateField('secondary_color', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.secondary_color}
                  onChange={(e) => updateField('secondary_color', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <T zh="Logo URL" en="Logo URL" />
            </label>
            <div className="flex items-center space-x-2">
              <PhotoIcon className="w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={formData.logo_url}
                onChange={(e) => updateField('logo_url', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <EnvelopeIcon className="w-6 h-6 text-orange-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            <T zh="联系信息" en="Contact Information" />
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <T zh="支持邮箱" en="Support Email" />
            </label>
            <div className="flex items-center space-x-2">
              <EnvelopeIcon className="w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.support_email}
                onChange={(e) => updateField('support_email', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="support@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <T zh="支持电话" en="Support Phone" />
            </label>
            <div className="flex items-center space-x-2">
              <PhoneIcon className="w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={formData.support_phone}
                onChange={(e) => updateField('support_phone', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="+60 12-345 6789"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <T zh="网站URL" en="Website URL" />
            </label>
            <div className="flex items-center space-x-2">
              <GlobeAltIcon className="w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={formData.website_url}
                onChange={(e) => updateField('website_url', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="https://www.example.com"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          <T zh="功能开关" en="Feature Toggles" />
        </h2>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">
                <T zh="咨询服务" en="Consultations" />
              </p>
              <p className="text-sm text-gray-500">
                <T zh="启用律师咨询预约" en="Enable lawyer consultation booking" />
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.enable_consultations}
              onChange={(e) =>
                updateField('enable_consultations', e.target.checked)
              }
              className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">
                <T zh="订单服务" en="Orders" />
              </p>
              <p className="text-sm text-gray-500">
                <T zh="启用服务订购" en="Enable service ordering" />
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.enable_orders}
              onChange={(e) => updateField('enable_orders', e.target.checked)}
              className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">
                <T zh="评价功能" en="Reviews" />
              </p>
              <p className="text-sm text-gray-500">
                <T zh="启用律师评价" en="Enable lawyer reviews" />
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.enable_reviews}
              onChange={(e) => updateField('enable_reviews', e.target.checked)}
              className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">
                <T zh="文章功能" en="Articles" />
              </p>
              <p className="text-sm text-gray-500">
                <T zh="启用法律文章" en="Enable legal articles" />
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.enable_articles}
              onChange={(e) => updateField('enable_articles', e.target.checked)}
              className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
            />
          </label>
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          <T zh="语言设置" en="Language Settings" />
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <T zh="默认语言" en="Default Language" />
            </label>
            <select
              value={formData.default_language}
              onChange={(e) => updateField('default_language', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="ms"><T zh="马来语" en="Malay (Bahasa Malaysia)" /></option>
              <option value="en"><T zh="英语" en="English" /></option>
              <option value="zh"><T zh="中文" en="Chinese (中文)" /></option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <T zh="支持的语言" en="Supported Languages" />
            </label>
            <div className="space-y-2">
              {['ms', 'en', 'zh'].map((lang) => (
                <label
                  key={lang}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.supported_languages.includes(lang)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateField('supported_languages', [
                          ...formData.supported_languages,
                          lang,
                        ]);
                      } else {
                        updateField(
                          'supported_languages',
                          formData.supported_languages.filter((l) => l !== lang)
                        );
                      }
                    }}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 mr-3"
                  />
                  <span className="text-gray-900">
                    {lang === 'ms' ? (
                      <T zh="马来语" en="Malay (Bahasa Malaysia)" />
                    ) : lang === 'en' ? (
                      <T zh="英语" en="English" />
                    ) : (
                      <T zh="中文" en="Chinese (中文)" />
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            <T zh="预览" en="Preview" />
          </h2>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center text-orange-600 hover:text-orange-700"
          >
            <EyeIcon className="w-5 h-5 mr-1" />
            {showPreview ? <T zh="隐藏" en="Hide" /> : <T zh="显示" en="Show" />} <T zh="预览" en="Preview" />
          </button>
        </div>

        {showPreview && (
          <div className="border-2 border-gray-200 rounded-lg p-6">
            <div
              className="h-16 rounded-t-lg flex items-center px-6"
              style={{
                background: `linear-gradient(to right, ${formData.primary_color}, ${formData.secondary_color})`,
              }}
            >
              <div className="text-white font-bold text-xl">
                {formData.company_name || <T zh="公司名称" en="Company Name" />}
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-b-lg">
              <p className="text-sm text-gray-600">
                <T zh="这是您的品牌颜色预览效果。" en="This is a preview of how your branding colors will appear." />
              </p>
              <div className="mt-4 flex items-center space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-white"
                  style={{ backgroundColor: formData.primary_color }}
                >
                  <T zh="主按钮" en="Primary Button" />
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-white"
                  style={{ backgroundColor: formData.secondary_color }}
                >
                  <T zh="辅助按钮" en="Secondary Button" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <T zh="取消" en="Cancel" />
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50"
        >
          {isSaving ? <T zh="保存中..." en="Saving..." /> : <T zh="保存配置" en="Save Configuration" />}
        </button>
      </div>
    </form>
  );
}
