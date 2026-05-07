'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { withSuperAdminAuth } from '@/lib/auth/withSuperAdminAuth';
import SuperAdminLayout from '@/components/super-admin/SuperAdminLayout';
import TenantWizard from '@/components/super-admin/TenantWizard';

function NewTenantPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async (tenantData: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/super-admin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tenantData),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/super-admin/tenants/${data.tenant.id}`);
      } else {
        alert(data.error || 'Failed to create tenant');
      }
    } catch (error) {
      console.error('Error creating tenant:', error);
      alert('Failed to create tenant');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All progress will be lost.')) {
      router.push('/super-admin/tenants');
    }
  };

  return (
    <SuperAdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Tenant</h1>
          <p className="text-gray-600 mt-2">
            Follow the steps to set up a new tenant organization
          </p>
        </div>

        <TenantWizard
          onComplete={handleComplete}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </SuperAdminLayout>
  );
}

export default withSuperAdminAuth(NewTenantPage);
