'use client';

import { useEffect, useState } from 'react';
import { withSuperAdminAuth } from '@/lib/auth/withSuperAdminAuth';
import SuperAdminLayout from '@/components/super-admin/SuperAdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  CogIcon,
  FlagIcon,
  ClockIcon,
  PaintBrushIcon,
} from '@heroicons/react/24/outline';

interface SystemSettings {
  maintenance_mode: boolean;
  feature_flags: {
    multi_tenancy: boolean;
    user_impersonation: boolean;
    audit_logging: boolean;
    analytics: boolean;
    password_reset: boolean;
  };
  rate_limits: {
    requests_per_minute: number;
    requests_per_hour: number;
    requests_per_day: number;
  };
  default_oem_config: string;
}

function SystemSettingsPage() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<SystemSettings>({
    maintenance_mode: false,
    feature_flags: {
      multi_tenancy: true,
      user_impersonation: true,
      audit_logging: true,
      analytics: true,
      password_reset: true,
    },
    rate_limits: {
      requests_per_minute: 60,
      requests_per_hour: 1000,
      requests_per_day: 10000,
    },
    default_oem_config: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/super-admin/system-settings');
      const data = await response.json();

      if (data.success) {
        // Parse settings from key-value pairs
        const parsedSettings: SystemSettings = {
          maintenance_mode: data.settings.find((s: any) => s.key === 'maintenance_mode')?.value === 'true',
          feature_flags: {
            multi_tenancy: data.settings.find((s: any) => s.key === 'feature_multi_tenancy')?.value !== 'false',
            user_impersonation: data.settings.find((s: any) => s.key === 'feature_user_impersonation')?.value !== 'false',
            audit_logging: data.settings.find((s: any) => s.key === 'feature_audit_logging')?.value !== 'false',
            analytics: data.settings.find((s: any) => s.key === 'feature_analytics')?.value !== 'false',
            password_reset: data.settings.find((s: any) => s.key === 'feature_password_reset')?.value !== 'false',
          },
          rate_limits: {
            requests_per_minute: parseInt(data.settings.find((s: any) => s.key === 'rate_limit_per_minute')?.value || '60'),
            requests_per_hour: parseInt(data.settings.find((s: any) => s.key === 'rate_limit_per_hour')?.value || '1000'),
            requests_per_day: parseInt(data.settings.find((s: any) => s.key === 'rate_limit_per_day')?.value || '10000'),
          },
          default_oem_config: data.settings.find((s: any) => s.key === 'default_oem_config')?.value || JSON.stringify({
            branding: {
              primary_color: '#f97316',
              secondary_color: '#dc2626',
              logo_url: '',
            },
            features: {
              consultations: true,
              orders: true,
              reviews: true,
            },
            language: 'en',
          }, null, 2),
        };

        setSettings(parsedSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      showMessage('error', 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleMaintenanceModeToggle = async () => {
    try {
      setIsSaving('maintenance');
      const response = await fetch('/api/super-admin/system-settings/maintenance-mode', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setSettings((prev) => ({
          ...prev,
          maintenance_mode: !prev.maintenance_mode,
        }));
        showMessage('success', `Maintenance mode ${!settings.maintenance_mode ? 'enabled' : 'disabled'}`);
      } else {
        showMessage('error', data.error || 'Failed to toggle maintenance mode');
      }
    } catch (error) {
      console.error('Error toggling maintenance mode:', error);
      showMessage('error', 'Failed to toggle maintenance mode');
    } finally {
      setIsSaving(null);
    }
  };

  const handleFeatureFlagChange = (flag: keyof SystemSettings['feature_flags']) => {
    setSettings((prev) => ({
      ...prev,
      feature_flags: {
        ...prev.feature_flags,
        [flag]: !prev.feature_flags[flag],
      },
    }));
  };

  const handleSaveFeatureFlags = async () => {
    try {
      setIsSaving('features');
      
      // Save each feature flag
      const promises = Object.entries(settings.feature_flags).map(([key, value]) =>
        fetch(`/api/super-admin/system-settings/feature_${key}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: value.toString() }),
        })
      );

      const results = await Promise.all(promises);
      const allSuccess = results.every((r) => r.ok);

      if (allSuccess) {
        showMessage('success', 'Feature flags updated successfully');
      } else {
        showMessage('error', 'Some feature flags failed to update');
      }
    } catch (error) {
      console.error('Error saving feature flags:', error);
      showMessage('error', 'Failed to save feature flags');
    } finally {
      setIsSaving(null);
    }
  };

  const handleRateLimitChange = (limit: keyof SystemSettings['rate_limits'], value: string) => {
    const numValue = parseInt(value) || 0;
    setSettings((prev) => ({
      ...prev,
      rate_limits: {
        ...prev.rate_limits,
        [limit]: numValue,
      },
    }));
  };

  const handleSaveRateLimits = async () => {
    try {
      setIsSaving('rate_limits');

      // Validate
      if (settings.rate_limits.requests_per_minute <= 0 ||
          settings.rate_limits.requests_per_hour <= 0 ||
          settings.rate_limits.requests_per_day <= 0) {
        showMessage('error', 'Rate limits must be greater than 0');
        setIsSaving(null);
        return;
      }

      // Save each rate limit
      const promises = [
        fetch('/api/super-admin/system-settings/rate_limit_per_minute', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: settings.rate_limits.requests_per_minute.toString() }),
        }),
        fetch('/api/super-admin/system-settings/rate_limit_per_hour', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: settings.rate_limits.requests_per_hour.toString() }),
        }),
        fetch('/api/super-admin/system-settings/rate_limit_per_day', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: settings.rate_limits.requests_per_day.toString() }),
        }),
      ];

      const results = await Promise.all(promises);
      const allSuccess = results.every((r) => r.ok);

      if (allSuccess) {
        showMessage('success', 'Rate limits updated successfully');
      } else {
        showMessage('error', 'Some rate limits failed to update');
      }
    } catch (error) {
      console.error('Error saving rate limits:', error);
      showMessage('error', 'Failed to save rate limits');
    } finally {
      setIsSaving(null);
    }
  };

  const handleOEMConfigChange = (value: string) => {
    setSettings((prev) => ({
      ...prev,
      default_oem_config: value,
    }));
  };

  const handleSaveOEMConfig = async () => {
    try {
      setIsSaving('oem_config');

      // Validate JSON
      try {
        JSON.parse(settings.default_oem_config);
      } catch (e) {
        showMessage('error', 'Invalid JSON format');
        setIsSaving(null);
        return;
      }

      const response = await fetch('/api/super-admin/system-settings/default_oem_config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: settings.default_oem_config }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Default OEM configuration updated successfully');
      } else {
        showMessage('error', data.error || 'Failed to update OEM configuration');
      }
    } catch (error) {
      console.error('Error saving OEM config:', error);
      showMessage('error', 'Failed to save OEM configuration');
    } finally {
      setIsSaving(null);
    }
  };

  if (isLoading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('settings.title')}</h1>
          <p className="text-gray-600 mt-2">
            {t('settings.configureSystem')}
          </p>
        </div>

        {/* Message Banner */}
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <div className="flex items-center">
              {message.type === 'success' ? (
                <CheckCircleIcon className="w-5 h-5 mr-2" />
              ) : (
                <ExclamationCircleIcon className="w-5 h-5 mr-2" />
              )}
              {message.text}
            </div>
          </div>
        )}

        {/* Maintenance Mode Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <WrenchScrewdriverIcon className="w-6 h-6 text-orange-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                {t('settings.maintenanceMode')}
              </h2>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-700 mb-2">
                  {t('settings.maintenanceModeDesc')}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">{t('settings.status')}:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      settings.maintenance_mode
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {settings.maintenance_mode ? t('settings.active') : t('settings.inactive')}
                  </span>
                </div>
              </div>
              <button
                onClick={handleMaintenanceModeToggle}
                disabled={isSaving === 'maintenance'}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  settings.maintenance_mode
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSaving === 'maintenance'
                  ? t('settings.savingChanges')
                  : settings.maintenance_mode
                  ? t('settings.disableMaintenance')
                  : t('settings.enableMaintenance')}
              </button>
            </div>
          </div>
        </div>

        {/* Feature Flags Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <FlagIcon className="w-6 h-6 text-orange-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                {t('settings.featureFlags')}
              </h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(settings.feature_flags).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">
                      {t(`settings.${key.replace(/_/g, '')}`)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t(`settings.${key.replace(/_/g, '')}Desc`)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleFeatureFlagChange(key as keyof SystemSettings['feature_flags'])}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-orange-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveFeatureFlags}
                disabled={isSaving === 'features'}
                className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving === 'features' ? t('settings.savingChanges') : t('settings.saveChanges')}
              </button>
            </div>
          </div>
        </div>

        {/* API Rate Limits Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <ClockIcon className="w-6 h-6 text-orange-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                {t('settings.rateLimits')}
              </h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.requestsPerMinute')}
                </label>
                <input
                  type="number"
                  value={settings.rate_limits.requests_per_minute}
                  onChange={(e) => handleRateLimitChange('requests_per_minute', e.target.value)}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.requestsPerHour')}
                </label>
                <input
                  type="number"
                  value={settings.rate_limits.requests_per_hour}
                  onChange={(e) => handleRateLimitChange('requests_per_hour', e.target.value)}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.requestsPerDay')}
                </label>
                <input
                  type="number"
                  value={settings.rate_limits.requests_per_day}
                  onChange={(e) => handleRateLimitChange('requests_per_day', e.target.value)}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveRateLimits}
                disabled={isSaving === 'rate_limits'}
                className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving === 'rate_limits' ? t('settings.savingChanges') : t('settings.saveChanges')}
              </button>
            </div>
          </div>
        </div>

        {/* Default OEM Configuration Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <PaintBrushIcon className="w-6 h-6 text-orange-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                {t('settings.defaultOemConfig')}
              </h2>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              This configuration will be used as the default for new tenants.
              Must be valid JSON format.
            </p>
            <textarea
              value={settings.default_oem_config}
              onChange={(e) => handleOEMConfigChange(e.target.value)}
              rows={15}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
              placeholder='{"branding": {...}, "features": {...}}'
            />
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveOEMConfig}
                disabled={isSaving === 'oem_config'}
                className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving === 'oem_config' ? t('settings.savingChanges') : t('settings.saveChanges')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}

export default withSuperAdminAuth(SystemSettingsPage);
