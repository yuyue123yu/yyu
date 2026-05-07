'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { withSuperAdminAuth } from '@/lib/auth/withSuperAdminAuth';
import SuperAdminLayout from '@/components/super-admin/SuperAdminLayout';
import OEMConfigForm from '@/components/super-admin/OEMConfigForm';

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
}

function TenantSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = params?.id as string;

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (tenantId) {
      fetchTenantAndSettings();
    }
  }, [tenantId]);

  const fetchTenantAndSettings = async () => {
    try {
      setIsLoading(true);

      // Fetch tenant info
      const tenantResponse = await fetch(`/api/super-admin/tenants/${tenantId}`);
      const tenantData = await tenantResponse.json();

      if (tenantData.success) {
        setTenant(tenantData.tenant);
      }

      // Fetch settings
      const settingsResponse = await fetch(
        `/api/super-admin/tenants/${tenantId}/settings`
      );
      const settingsData = await settingsResponse.json();

      if (settingsData.success) {
        setSettings(settingsData.settings);
      }
    } catch (error) {
      console.error('Error fetching tenant settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (newSettings: Record<string, any>) => {
    try {
      setIsSaving(true);

      const response = await fetch(
        `/api/super-admin/tenants/${tenantId}/settings/bulk`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ settings: newSettings }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSettings(newSettings);
        alert('Settings saved successfully');
      } else {
        alert(data.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
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

  if (!tenant) {
    return (
      <SuperAdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Tenant not found</p>
          <button
            onClick={() => router.push('/super-admin/tenants')}
            className="mt-4 text-orange-600 hover:text-orange-700"
          >
            Back to Tenants
          </button>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => router.push(`/super-admin/tenants/${tenantId}`)}
            className="text-sm text-gray-600 hover:text-gray-900 mb-2"
          >
            ← Back to Tenant Details
          </button>
          <h1 className="text-3xl font-bold text-gray-900">OEM Configuration</h1>
          <p className="text-gray-600 mt-2">
            Customize branding and settings for {tenant.name}
          </p>
        </div>

        {/* OEM Config Form */}
        <OEMConfigForm
          settings={settings}
          onSave={handleSave}
          isSaving={isSaving}
          tenantSubdomain={tenant.subdomain}
        />
      </div>
    </SuperAdminLayout>
  );
}

export default withSuperAdminAuth(TenantSettingsPage);
