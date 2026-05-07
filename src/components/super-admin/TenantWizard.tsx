'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import T from '@/components/super-admin/T';
import {
  CheckIcon,
  BuildingOfficeIcon,
  PaintBrushIcon,
  UserPlusIcon,
  DocumentCheckIcon,
} from '@heroicons/react/24/outline';

interface TenantWizardProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function TenantWizard({
  onComplete,
  onCancel,
  isSubmitting,
}: TenantWizardProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  
  const steps = [
    { id: 1, name: t('wizard.basicInfo'), icon: BuildingOfficeIcon },
    { id: 2, name: t('wizard.oemConfig'), icon: PaintBrushIcon },
    { id: 3, name: t('wizard.adminAccount'), icon: UserPlusIcon },
    { id: 4, name: t('wizard.reviewConfirm'), icon: DocumentCheckIcon },
  ];
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    name: '',
    subdomain: '',
    domain: '',
    status: 'active',

    // Step 2: OEM Configuration
    primary_color: '#EA580C',
    secondary_color: '#DC2626',
    logo_url: '',
    company_name: '',
    support_email: '',
    support_phone: '',

    // Step 3: Admin Account
    admin_email: '',
    admin_name: '',
    admin_phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = t('wizard.tenantNameRequired');
      if (!formData.subdomain.trim())
        newErrors.subdomain = t('wizard.subdomainRequired');
      if (!/^[a-z0-9-]+$/.test(formData.subdomain))
        newErrors.subdomain = t('wizard.subdomainInvalid');
    }

    if (step === 2) {
      if (!formData.company_name.trim())
        newErrors.company_name = t('wizard.companyNameRequired');
      if (!formData.support_email.trim())
        newErrors.support_email = t('wizard.supportEmailRequired');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.support_email))
        newErrors.support_email = t('wizard.supportEmailInvalid');
    }

    if (step === 3) {
      if (!formData.admin_email.trim())
        newErrors.admin_email = t('wizard.adminEmailRequired');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.admin_email))
        newErrors.admin_email = t('wizard.adminEmailInvalid');
      if (!formData.admin_name.trim())
        newErrors.admin_name = t('wizard.adminNameRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete(formData);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Progress Steps */}
      <div className="px-8 pt-8">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {steps.map((step, index) => (
              <li
                key={step.id}
                className={`relative ${
                  index !== steps.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      currentStep > step.id
                        ? 'bg-orange-600 border-orange-600'
                        : currentStep === step.id
                        ? 'border-orange-600 bg-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckIcon className="w-6 h-6 text-white" />
                    ) : (
                      <step.icon
                        className={`w-5 h-5 ${
                          currentStep === step.id
                            ? 'text-orange-600'
                            : 'text-gray-400'
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                    } hidden md:block`}
                  >
                    {step.name}
                  </span>
                </div>
                {index !== steps.length - 1 && (
                  <div
                    className={`absolute top-5 left-10 w-full h-0.5 ${
                      currentStep > step.id ? 'bg-orange-600' : 'bg-gray-300'
                    } hidden md:block`}
                  ></div>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Step Content */}
      <div className="p-8">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              <T zh="基本信息" en="Basic Information" />
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <T zh="租户名称 *" en="Tenant Name *" />
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Acme Corporation"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <T zh="子域名 *" en="Subdomain *" />
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={formData.subdomain}
                  onChange={(e) =>
                    updateFormData('subdomain', e.target.value.toLowerCase())
                  }
                  className={`flex-1 px-4 py-2 border rounded-l-lg focus:ring-2 focus:ring-orange-500 ${
                    errors.subdomain ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="acme"
                />
                <span className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600">
                  .example.com
                </span>
              </div>
              {errors.subdomain && (
                <p className="mt-1 text-sm text-red-600">{errors.subdomain}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                <T zh="只允许小写字母、数字和连字符" en="Only lowercase letters, numbers, and hyphens allowed" />
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <T zh="自定义域名（可选）" en="Custom Domain (Optional)" />
              </label>
              <input
                type="text"
                value={formData.domain}
                onChange={(e) => updateFormData('domain', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="www.acme.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <T zh="初始状态" en="Initial Status" />
              </label>
              <select
                value={formData.status}
                onChange={(e) => updateFormData('status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="active"><T zh="活跃" en="Active" /></option>
                <option value="inactive"><T zh="停用" en="Inactive" /></option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2: OEM Configuration */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              <T zh="OEM配置" en="OEM Configuration" />
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <T zh="公司名称 *" en="Company Name *" />
              </label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => updateFormData('company_name', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                  errors.company_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Acme Corporation"
              />
              {errors.company_name && (
                <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
              )}
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
                    onChange={(e) => updateFormData('primary_color', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primary_color}
                    onChange={(e) => updateFormData('primary_color', e.target.value)}
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
                    onChange={(e) =>
                      updateFormData('secondary_color', e.target.value)
                    }
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.secondary_color}
                    onChange={(e) =>
                      updateFormData('secondary_color', e.target.value)
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <T zh="Logo URL（可选）" en="Logo URL (Optional)" />
              </label>
              <input
                type="url"
                value={formData.logo_url}
                onChange={(e) => updateFormData('logo_url', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <T zh="支持邮箱 *" en="Support Email *" />
              </label>
              <input
                type="email"
                value={formData.support_email}
                onChange={(e) => updateFormData('support_email', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                  errors.support_email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="support@acme.com"
              />
              {errors.support_email && (
                <p className="mt-1 text-sm text-red-600">{errors.support_email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <T zh="支持电话（可选）" en="Support Phone (Optional)" />
              </label>
              <input
                type="tel"
                value={formData.support_phone}
                onChange={(e) => updateFormData('support_phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="+60 12-345 6789"
              />
            </div>
          </div>
        )}

        {/* Step 3: Admin Account */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              <T zh="管理员账户" en="Admin Account" />
            </h2>
            <p className="text-gray-600">
              <T zh="为此租户创建初始管理员账户" en="Create the initial administrator account for this tenant" />
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <T zh="管理员邮箱 *" en="Admin Email *" />
              </label>
              <input
                type="email"
                value={formData.admin_email}
                onChange={(e) => updateFormData('admin_email', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                  errors.admin_email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="admin@acme.com"
              />
              {errors.admin_email && (
                <p className="mt-1 text-sm text-red-600">{errors.admin_email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <T zh="管理员姓名 *" en="Admin Name *" />
              </label>
              <input
                type="text"
                value={formData.admin_name}
                onChange={(e) => updateFormData('admin_name', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                  errors.admin_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />
              {errors.admin_name && (
                <p className="mt-1 text-sm text-red-600">{errors.admin_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <T zh="管理员电话（可选）" en="Admin Phone (Optional)" />
              </label>
              <input
                type="tel"
                value={formData.admin_phone}
                onChange={(e) => updateFormData('admin_phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="+60 12-345 6789"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong><T zh="注意：" en="Note:" /></strong> <T zh="激活邮件将发送到管理员邮箱，包含设置密码的说明。" en="An activation email will be sent to the admin email address with instructions to set up their password." />
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Review & Confirm */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              <T zh="审核确认" en="Review & Confirm" />
            </h2>
            <p className="text-gray-600">
              <T zh="请在创建租户前审核信息" en="Please review the information before creating the tenant" />
            </p>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  <T zh="基本信息" en="Basic Information" />
                </h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-600"><T zh="租户名称：" en="Tenant Name:" /></dt>
                    <dd className="font-medium">{formData.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600"><T zh="子域名：" en="Subdomain:" /></dt>
                    <dd className="font-medium">{formData.subdomain}.example.com</dd>
                  </div>
                  {formData.domain && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600"><T zh="自定义域名：" en="Custom Domain:" /></dt>
                      <dd className="font-medium">{formData.domain}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-gray-600"><T zh="状态：" en="Status:" /></dt>
                    <dd className="font-medium capitalize">
                      <T zh={formData.status === 'active' ? '活跃' : '停用'} en={formData.status} />
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  <T zh="OEM配置" en="OEM Configuration" />
                </h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-600"><T zh="公司名称：" en="Company Name:" /></dt>
                    <dd className="font-medium">{formData.company_name}</dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-600"><T zh="主色调：" en="Primary Color:" /></dt>
                    <dd className="flex items-center">
                      <div
                        className="w-6 h-6 rounded border border-gray-300 mr-2"
                        style={{ backgroundColor: formData.primary_color }}
                      ></div>
                      <span className="font-medium">{formData.primary_color}</span>
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-600"><T zh="辅助色：" en="Secondary Color:" /></dt>
                    <dd className="flex items-center">
                      <div
                        className="w-6 h-6 rounded border border-gray-300 mr-2"
                        style={{ backgroundColor: formData.secondary_color }}
                      ></div>
                      <span className="font-medium">{formData.secondary_color}</span>
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600"><T zh="支持邮箱：" en="Support Email:" /></dt>
                    <dd className="font-medium">{formData.support_email}</dd>
                  </div>
                  {formData.support_phone && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600"><T zh="支持电话：" en="Support Phone:" /></dt>
                      <dd className="font-medium">{formData.support_phone}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  <T zh="管理员账户" en="Admin Account" />
                </h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-600"><T zh="邮箱：" en="Email:" /></dt>
                    <dd className="font-medium">{formData.admin_email}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600"><T zh="姓名：" en="Name:" /></dt>
                    <dd className="font-medium">{formData.admin_name}</dd>
                  </div>
                  {formData.admin_phone && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600"><T zh="电话：" en="Phone:" /></dt>
                      <dd className="font-medium">{formData.admin_phone}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="px-8 py-6 bg-gray-50 rounded-b-lg flex items-center justify-between">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          <T zh="取消" en="Cancel" />
        </button>

        <div className="flex items-center space-x-4">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              <T zh="返回" en="Back" />
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <T zh="创建中..." en="Creating..." />
            ) : currentStep === 4 ? (
              <T zh="创建租户" en="Create Tenant" />
            ) : (
              <T zh="下一步" en="Next" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
