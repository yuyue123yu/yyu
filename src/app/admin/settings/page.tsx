"use client";

import { useState, useEffect } from "react";
import { Save, Globe, Mail, Bell, Shield, Database, Key } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // 网站设置
    siteName: "LegalMY",
    siteDescription: "专业法律咨询平台",
    contactEmail: "support@legalmy.com",
    contactPhone: "+60 3-1234 5678",
    
    // 邮件设置
    emailNotifications: true,
    emailNewConsultation: true,
    emailNewOrder: true,
    
    // 通知设置
    pushNotifications: true,
    smsNotifications: false,
    
    // 安全设置
    requireEmailVerification: false,
    twoFactorAuth: false,
    sessionTimeout: 30,
    
    // 系统设置
    maintenanceMode: false,
    allowRegistration: true,
    defaultLanguage: "zh",
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const supabase = await createClient();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*");

      if (error) throw error;

      if (data && data.length > 0) {
        const loadedSettings = { ...settings };
        
        data.forEach((item) => {
          if (item.key === 'site') {
            Object.assign(loadedSettings, item.value);
          } else if (item.key === 'email') {
            Object.assign(loadedSettings, item.value);
          } else if (item.key === 'notification') {
            Object.assign(loadedSettings, item.value);
          } else if (item.key === 'security') {
            Object.assign(loadedSettings, item.value);
          } else if (item.key === 'system') {
            Object.assign(loadedSettings, item.value);
          }
        });

        setSettings(loadedSettings);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const supabase = await createClient();

    try {
      console.log("开始保存设置...");
      
      // 保存网站设置
      const { data: siteData, error: siteError } = await supabase
        .from("settings")
        .upsert({
          key: 'site',
          value: {
            siteName: settings.siteName,
            siteDescription: settings.siteDescription,
            contactEmail: settings.contactEmail,
            contactPhone: settings.contactPhone,
            defaultLanguage: settings.defaultLanguage,
          }
        }, { onConflict: 'key' });

      if (siteError) {
        console.error("保存网站设置失败:", siteError);
        alert(`保存失败: ${siteError.message}`);
        return;
      }
      console.log("✅ 网站设置保存成功");

      // 保存邮件设置
      const { data: emailData, error: emailError } = await supabase
        .from("settings")
        .upsert({
          key: 'email',
          value: {
            emailNotifications: settings.emailNotifications,
            emailNewConsultation: settings.emailNewConsultation,
            emailNewOrder: settings.emailNewOrder,
          }
        }, { onConflict: 'key' });

      if (emailError) {
        console.error("保存邮件设置失败:", emailError);
        alert(`保存失败: ${emailError.message}`);
        return;
      }
      console.log("✅ 邮件设置保存成功");

      // 保存通知设置
      const { data: notifData, error: notifError } = await supabase
        .from("settings")
        .upsert({
          key: 'notification',
          value: {
            pushNotifications: settings.pushNotifications,
            smsNotifications: settings.smsNotifications,
          }
        }, { onConflict: 'key' });

      if (notifError) {
        console.error("保存通知设置失败:", notifError);
        alert(`保存失败: ${notifError.message}`);
        return;
      }
      console.log("✅ 通知设置保存成功");

      // 保存安全设置
      const { data: secData, error: secError } = await supabase
        .from("settings")
        .upsert({
          key: 'security',
          value: {
            requireEmailVerification: settings.requireEmailVerification,
            twoFactorAuth: settings.twoFactorAuth,
            sessionTimeout: settings.sessionTimeout,
          }
        }, { onConflict: 'key' });

      if (secError) {
        console.error("保存安全设置失败:", secError);
        alert(`保存失败: ${secError.message}`);
        return;
      }
      console.log("✅ 安全设置保存成功");

      // 保存系统设置
      const { data: sysData, error: sysError } = await supabase
        .from("settings")
        .upsert({
          key: 'system',
          value: {
            maintenanceMode: settings.maintenanceMode,
            allowRegistration: settings.allowRegistration,
          }
        }, { onConflict: 'key' });

      if (sysError) {
        console.error("保存系统设置失败:", sysError);
        alert(`保存失败: ${sysError.message}`);
        return;
      }
      console.log("✅ 系统设置保存成功");

      console.log("🎉 所有设置保存成功！");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      alert("设置保存成功！页面将自动刷新以应用更改。");
      
      // 延迟刷新页面，让用户看到成功提示
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("保存失败，请重试");
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">系统设置</h1>
            <p className="text-neutral-600 mt-2">配置系统参数和选项</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.open('/admin/diagnostics', '_blank')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
            >
              <Database className="h-5 w-5" />
              系统诊断
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              保存设置
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-4 text-neutral-600">加载设置中...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Success Message */}
          {saved && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <div className="h-5 w-5 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">
                ✓
              </div>
              <div className="text-sm text-green-800 font-medium">设置已保存成功！</div>
            </div>
          )}

      <div className="space-y-6">
        {/* Website Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Globe className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">网站设置</h2>
              <p className="text-sm text-neutral-600">配置网站基本信息</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                网站名称
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                网站描述
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  联系邮箱
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  联系电话
                </label>
                <input
                  type="tel"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                默认语言
              </label>
              <select
                value={settings.defaultLanguage}
                onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="zh">中文</option>
                <option value="en">English</option>
                <option value="ms">Bahasa Malaysia</option>
              </select>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">邮件设置</h2>
              <p className="text-sm text-neutral-600">配置邮件通知选项</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100 transition-all">
              <div>
                <div className="font-medium text-neutral-900">启用邮件通知</div>
                <div className="text-sm text-neutral-600">接收系统邮件通知</div>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100 transition-all">
              <div>
                <div className="font-medium text-neutral-900">新咨询通知</div>
                <div className="text-sm text-neutral-600">收到新咨询时发送邮件</div>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNewConsultation}
                onChange={(e) => setSettings({ ...settings, emailNewConsultation: e.target.checked })}
                className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                disabled={!settings.emailNotifications}
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100 transition-all">
              <div>
                <div className="font-medium text-neutral-900">新订单通知</div>
                <div className="text-sm text-neutral-600">收到新订单时发送邮件</div>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNewOrder}
                onChange={(e) => setSettings({ ...settings, emailNewOrder: e.target.checked })}
                className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                disabled={!settings.emailNotifications}
              />
            </label>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Bell className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">通知设置</h2>
              <p className="text-sm text-neutral-600">配置推送和短信通知</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100 transition-all">
              <div>
                <div className="font-medium text-neutral-900">推送通知</div>
                <div className="text-sm text-neutral-600">启用浏览器推送通知</div>
              </div>
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100 transition-all">
              <div>
                <div className="font-medium text-neutral-900">短信通知</div>
                <div className="text-sm text-neutral-600">启用短信通知（需配置短信服务）</div>
              </div>
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              />
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900">安全设置</h2>
                <p className="text-sm text-neutral-600">配置安全和认证选项</p>
              </div>
            </div>
            <a
              href="/settings/security"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-md hover:shadow-lg text-sm font-medium"
            >
              <Key className="h-4 w-4" />
              修改密码
            </a>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100 transition-all">
              <div>
                <div className="font-medium text-neutral-900">邮箱验证</div>
                <div className="text-sm text-neutral-600">要求用户验证邮箱后才能登录</div>
              </div>
              <input
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
                className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100 transition-all">
              <div>
                <div className="font-medium text-neutral-900">双因素认证</div>
                <div className="text-sm text-neutral-600">启用两步验证提高安全性</div>
              </div>
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                会话超时时间（分钟）
              </label>
              <input
                type="number"
                min="5"
                max="1440"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Database className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">系统设置</h2>
              <p className="text-sm text-neutral-600">配置系统运行参数</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100 transition-all">
              <div>
                <div className="font-medium text-neutral-900">维护模式</div>
                <div className="text-sm text-neutral-600">启用后网站将显示维护页面</div>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100 transition-all">
              <div>
                <div className="font-medium text-neutral-900">允许注册</div>
                <div className="text-sm text-neutral-600">允许新用户注册账号</div>
              </div>
              <input
                type="checkbox"
                checked={settings.allowRegistration}
                onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Save Button (Bottom) */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-5 w-5" />
          保存所有设置
        </button>
      </div>
        </>
      )}
    </div>
  );
}
