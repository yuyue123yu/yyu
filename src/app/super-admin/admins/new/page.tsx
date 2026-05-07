'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { withSuperAdminAuth } from '@/lib/auth/withSuperAdminAuth';
import SuperAdminLayout from '@/components/super-admin/SuperAdminLayout';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  status: string;
}

function NewAdminPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoadingTenants, setIsLoadingTenants] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activationLink, setActivationLink] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    tenant_id: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    full_name: '',
    tenant_id: '',
  });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setIsLoadingTenants(true);
      const response = await fetch('/api/super-admin/tenants?limit=1000');
      const data = await response.json();

      if (data.success) {
        // Filter only active tenants
        const activeTenants = data.tenants.filter(
          (t: Tenant) => t.status === 'active'
        );
        setTenants(activeTenants);
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setIsLoadingTenants(false);
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      full_name: '',
      tenant_id: '',
    };

    let isValid = true;

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Full name validation
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
      isValid = false;
    }

    // Tenant validation
    if (!formData.tenant_id) {
      newErrors.tenant_id = 'Please select a tenant';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setShowError(false);
    setShowSuccess(false);

    try {
      const response = await fetch('/api/super-admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setActivationLink(data.activation_link);
        setShowSuccess(true);
        // Reset form
        setFormData({
          email: '',
          full_name: '',
          phone: '',
          tenant_id: '',
        });
      } else {
        setErrorMessage(data.error || 'Failed to create admin account');
        setShowError(true);
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(activationLink);
    alert('Activation link copied to clipboard!');
  };

  return (
    <SuperAdminLayout>
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/super-admin/admins')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Admins
        </button>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Tenant Admin
          </h1>
          <p className="text-gray-600 mt-2">
            Create a new administrator account for a tenant
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-green-900 mb-2">
                  Admin Account Created Successfully
                </h3>
                <p className="text-sm text-green-800 mb-3">
                  The admin account has been created. Please send the following
                  activation link to the admin via email:
                </p>
                <div className="bg-white border border-green-300 rounded p-3 mb-3">
                  <code className="text-xs text-gray-800 break-all">
                    {activationLink}
                  </code>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="text-sm text-green-700 hover:text-green-900 font-medium"
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {showError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <ExclamationCircleIcon className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-red-900 mb-1">
                  Error Creating Admin
                </h3>
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="admin@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.full_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="+60123456789"
              />
            </div>

            {/* Tenant Selection */}
            <div>
              <label
                htmlFor="tenant_id"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tenant <span className="text-red-500">*</span>
              </label>
              {isLoadingTenants ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                </div>
              ) : (
                <select
                  id="tenant_id"
                  name="tenant_id"
                  value={formData.tenant_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.tenant_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a tenant...</option>
                  {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name} ({tenant.subdomain})
                    </option>
                  ))}
                </select>
              )}
              {errors.tenant_id && (
                <p className="mt-1 text-sm text-red-600">{errors.tenant_id}</p>
              )}
              {tenants.length === 0 && !isLoadingTenants && (
                <p className="mt-1 text-sm text-yellow-600">
                  No active tenants available. Please create a tenant first.
                </p>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> After creating the admin account, you
                will receive an activation link that must be sent to the admin
                via email. The admin will use this link to set their password
                and activate their account.
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push('/super-admin/admins')}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || tenants.length === 0}
                className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Admin'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </SuperAdminLayout>
  );
}

export default withSuperAdminAuth(NewAdminPage);
