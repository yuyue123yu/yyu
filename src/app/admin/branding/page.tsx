"use client";

import { useState, useEffect } from "react";
import { Upload, Save, Eye, Palette, Building2, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface BrandingSettings {
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  company_name: string;
  company_description: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  social_links: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
}

export default function BrandingPage() {
  const [settings, setSettings] = useState<BrandingSettings>({
    logo_url: '',
    primary_color: '#1E40AF',
    secondary_color: '#F59E0B',
    company_name: '',
    company_description: '',
    contact_phone: '',
    contact_email: '',
    contact_address: '',
    social_links: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tenant/branding');
      const data = await response.json();

      if (data.success) {
        setSettings(data.branding);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      alert('加载设置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('不支持的文件类型，请上传 JPG、PNG、SVG、WebP 或 GIF 格式');
      return;
    }

    // 验证文件大小
    if (file.size > 5 * 1024 * 1024) {
      alert('文件太大，最大支持 5MB');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('logo', file);

      const response = await fetch('/api/tenant/branding/upload-logo', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSettings({ ...settings, logo_url: data.logo_url });
        alert('Logo 上传成功！');
      } else {
        alert(data.error || '上传失败');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    // 验证必填字段
    if (!settings.company_name) {
      alert('请填写公司名称');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/tenant/branding', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        alert('品牌设置已保存！');
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

  if (loading) {
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
          <h1 className="text-3xl font-bold text-neutral-900">品牌设置</h1>
          <p className="text-neutral-600 mt-2">自定义您的品牌形象和公司信息</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-all"
          >
            <Eye className="h-5 w-5" />
            {showPreview ? '隐藏预览' : '显示预览'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            {saving ? '保存中...' : '保存设置'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 设置表单 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Logo 设置 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Upload className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900">Logo 设置</h2>
                <p className="text-sm text-neutral-600">上传您的公司 Logo</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Logo 预览 */}
              <div className="flex items-center gap-6">
                <div className="w-48 h-32 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center bg-neutral-50">
                  {settings.logo_url ? (
                    <img
                      src={settings.logo_url}
                      alt="Logo"
                      className="max-w-full max-h-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-center text-neutral-400">
                      <Upload className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">暂无 Logo</p>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <label className="block">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/svg+xml,image/webp,image/gif"
                      onChange={handleLogoUpload}
                      disabled={uploading}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all cursor-pointer ${
                        uploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Upload className="h-5 w-5" />
                      {uploading ? '上传中...' : '上传 Logo'}
                    </label>
                  </label>
                  <p className="text-sm text-neutral-500 mt-2">
                    支持 JPG、PNG、SVG、WebP、GIF 格式<br />
                    建议尺寸: 200x60px，最大 5MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 主题颜色 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Palette className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900">主题颜色</h2>
                <p className="text-sm text-neutral-600">设置您的品牌主题色</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  主色调
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    className="w-16 h-16 rounded-lg border-2 border-neutral-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primary_color}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none font-mono"
                    placeholder="#1E40AF"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  辅色调
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.secondary_color}
                    onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                    className="w-16 h-16 rounded-lg border-2 border-neutral-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.secondary_color}
                    onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                    className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none font-mono"
                    placeholder="#F59E0B"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 公司信息 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900">公司信息</h2>
                <p className="text-sm text-neutral-600">填写您的公司基本信息</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  公司名称 *
                </label>
                <input
                  type="text"
                  value={settings.company_name}
                  onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="ABC律师事务所"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  公司简介
                </label>
                <textarea
                  value={settings.company_description}
                  onChange={(e) => setSettings({ ...settings, company_description: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  rows={3}
                  placeholder="专业法律服务提供商，为您提供最优质的法律解决方案"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    联系电话
                  </label>
                  <input
                    type="tel"
                    value={settings.contact_phone}
                    onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="+60 3-1234 5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    联系邮箱
                  </label>
                  <input
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="info@abc-law.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  公司地址
                </label>
                <input
                  type="text"
                  value={settings.contact_address}
                  onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="吉隆坡市中心"
                />
              </div>
            </div>
          </div>

          {/* 社交媒体 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Facebook className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900">社交媒体</h2>
                <p className="text-sm text-neutral-600">添加您的社交媒体链接</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <Facebook className="inline h-4 w-4 mr-1" />
                  Facebook
                </label>
                <input
                  type="url"
                  value={settings.social_links.facebook}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    social_links: { ...settings.social_links, facebook: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="https://facebook.com/your-page"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <Twitter className="inline h-4 w-4 mr-1" />
                  Twitter
                </label>
                <input
                  type="url"
                  value={settings.social_links.twitter}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    social_links: { ...settings.social_links, twitter: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="https://twitter.com/your-account"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <Linkedin className="inline h-4 w-4 mr-1" />
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={settings.social_links.linkedin}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    social_links: { ...settings.social_links, linkedin: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="https://linkedin.com/company/your-company"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <Instagram className="inline h-4 w-4 mr-1" />
                  Instagram
                </label>
                <input
                  type="url"
                  value={settings.social_links.instagram}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    social_links: { ...settings.social_links, instagram: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="https://instagram.com/your-account"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 实时预览 */}
        {showPreview && (
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
                <h3 className="text-lg font-bold text-neutral-900 mb-4">实时预览</h3>
                
                {/* 预览区域 */}
                <div 
                  className="border-2 border-neutral-200 rounded-lg p-6"
                  style={{
                    background: `linear-gradient(135deg, ${settings.primary_color}15 0%, ${settings.secondary_color}15 100%)`,
                  }}
                >
                  {/* Logo */}
                  {settings.logo_url && (
                    <div className="mb-4">
                      <img
                        src={settings.logo_url}
                        alt="Logo Preview"
                        className="h-12 object-contain"
                      />
                    </div>
                  )}

                  {/* 公司名称 */}
                  <h2 
                    className="text-2xl font-bold mb-2"
                    style={{ color: settings.primary_color }}
                  >
                    {settings.company_name || '公司名称'}
                  </h2>

                  {/* 公司简介 */}
                  {settings.company_description && (
                    <p className="text-neutral-600 text-sm mb-4">
                      {settings.company_description}
                    </p>
                  )}

                  {/* 按钮示例 */}
                  <button
                    className="px-6 py-2 rounded-lg text-white font-medium mb-4 w-full"
                    style={{ 
                      background: `linear-gradient(135deg, ${settings.primary_color} 0%, ${settings.secondary_color} 100%)` 
                    }}
                  >
                    立即咨询
                  </button>

                  {/* 联系信息 */}
                  <div className="space-y-2 text-sm text-neutral-600">
                    {settings.contact_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" style={{ color: settings.primary_color }} />
                        <span>{settings.contact_phone}</span>
                      </div>
                    )}
                    {settings.contact_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" style={{ color: settings.primary_color }} />
                        <span>{settings.contact_email}</span>
                      </div>
                    )}
                    {settings.contact_address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" style={{ color: settings.primary_color }} />
                        <span>{settings.contact_address}</span>
                      </div>
                    )}
                  </div>

                  {/* 社交媒体图标 */}
                  {(settings.social_links.facebook || settings.social_links.twitter || 
                    settings.social_links.linkedin || settings.social_links.instagram) && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-neutral-200">
                      {settings.social_links.facebook && (
                        <Facebook className="h-5 w-5" style={{ color: settings.primary_color }} />
                      )}
                      {settings.social_links.twitter && (
                        <Twitter className="h-5 w-5" style={{ color: settings.primary_color }} />
                      )}
                      {settings.social_links.linkedin && (
                        <Linkedin className="h-5 w-5" style={{ color: settings.primary_color }} />
                      )}
                      {settings.social_links.instagram && (
                        <Instagram className="h-5 w-5" style={{ color: settings.primary_color }} />
                      )}
                    </div>
                  )}
                </div>

                <p className="text-xs text-neutral-500 mt-4 text-center">
                  这是您的品牌在前台的预览效果
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
