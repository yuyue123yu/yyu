'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { withSuperAdminAuth } from '@/lib/auth/withSuperAdminAuth';
import SuperAdminLayout from '@/components/super-admin/SuperAdminLayout';
import {
  ShieldCheckIcon,
  QrCodeIcon,
  KeyIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';

function MFASetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<'generate' | 'verify' | 'complete'>('generate');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedBackupCodes, setCopiedBackupCodes] = useState(false);

  const handleGenerateSecret = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('/api/super-admin/mfa/setup', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setQrCodeUrl(data.qrCode);
        setSecret(data.secret);
        // Generate backup codes (8 random codes)
        const codes = Array.from({ length: 8 }, () =>
          Math.random().toString(36).substring(2, 10).toUpperCase()
        );
        setBackupCodes(codes);
        setStep('verify');
      } else {
        setError(data.error || 'Failed to generate MFA secret');
      }
    } catch (error) {
      console.error('Error generating MFA secret:', error);
      setError('Failed to generate MFA secret');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setIsLoading(true);
      setError('');

      if (!verificationCode || verificationCode.length !== 6) {
        setError('Please enter a 6-digit code');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/super-admin/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: verificationCode,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep('complete');
      } else {
        setError(data.error || 'Invalid verification code');
      }
    } catch (error) {
      console.error('Error verifying MFA code:', error);
      setError('Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText);
    setCopiedBackupCodes(true);
    setTimeout(() => setCopiedBackupCodes(false), 3000);
  };

  const handleComplete = () => {
    router.push('/super-admin');
  };

  return (
    <SuperAdminLayout>
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <ShieldCheckIcon className="w-10 h-10 text-orange-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Multi-Factor Authentication Setup
            </h1>
          </div>
          <p className="text-gray-600">
            Secure your super admin account with two-factor authentication
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === 'generate'
                    ? 'bg-orange-600 text-white'
                    : 'bg-green-600 text-white'
                }`}
              >
                1
              </div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                Generate Secret
              </span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div
                className={`h-full transition-all ${
                  step !== 'generate' ? 'bg-green-600' : 'bg-gray-200'
                }`}
              />
            </div>
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === 'verify'
                    ? 'bg-orange-600 text-white'
                    : step === 'complete'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                2
              </div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                Verify Code
              </span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div
                className={`h-full transition-all ${
                  step === 'complete' ? 'bg-green-600' : 'bg-gray-200'
                }`}
              />
            </div>
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === 'complete'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                3
              </div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                Complete
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationCircleIcon className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Step 1: Generate Secret */}
        {step === 'generate' && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center">
              <QrCodeIcon className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Enable Two-Factor Authentication
              </h2>
              <p className="text-gray-600 mb-8">
                Two-factor authentication adds an extra layer of security to your
                account. You'll need an authenticator app like Google Authenticator
                or Authy.
              </p>
              <button
                onClick={handleGenerateSecret}
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Generating...' : 'Generate QR Code'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Verify Code */}
        {step === 'verify' && (
          <div className="space-y-6">
            {/* QR Code */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                Scan QR Code
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                Scan this QR code with your authenticator app
              </p>
              <div className="flex justify-center mb-6">
                {qrCodeUrl && (
                  <Image
                    src={qrCodeUrl}
                    alt="MFA QR Code"
                    width={256}
                    height={256}
                    className="border-4 border-gray-200 rounded-lg"
                  />
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2 text-center">
                  Or enter this code manually:
                </p>
                <p className="text-center font-mono text-lg font-semibold text-gray-900">
                  {secret}
                </p>
              </div>
            </div>

            {/* Verification */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Verify Setup
              </h2>
              <p className="text-gray-600 mb-6">
                Enter the 6-digit code from your authenticator app to verify the
                setup
              </p>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                />
              </div>
              <button
                onClick={handleVerifyCode}
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify and Enable'}
              </button>
            </div>

            {/* Backup Codes */}
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex items-center mb-4">
                <KeyIcon className="w-6 h-6 text-orange-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Backup Codes
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                Save these backup codes in a safe place. You can use them to access
                your account if you lose your authenticator device.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, index) => (
                    <div
                      key={index}
                      className="font-mono text-sm text-gray-900 bg-white px-3 py-2 rounded border border-gray-200"
                    >
                      {code}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={handleCopyBackupCodes}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                {copiedBackupCodes ? 'Copied!' : 'Copy Backup Codes'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Complete */}
        {step === 'complete' && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center">
              <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                MFA Enabled Successfully!
              </h2>
              <p className="text-gray-600 mb-8">
                Your account is now protected with two-factor authentication. You'll
                need to enter a code from your authenticator app each time you log
                in.
              </p>
              <button
                onClick={handleComplete}
                className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}

export default withSuperAdminAuth(MFASetupPage);
