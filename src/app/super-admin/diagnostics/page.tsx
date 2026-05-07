'use client';

import { useState } from 'react';
import { withSuperAdminAuth } from '@/lib/auth/withSuperAdminAuth';
import SuperAdminLayout from '@/components/super-admin/SuperAdminLayout';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  details?: string;
}

function DiagnosticsPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);

    const checks: DiagnosticResult[] = [];

    // 1. 数据库连接检查
    checks.push({
      name: '数据库连接',
      status: 'pending',
      message: '检查中...',
    });
    setResults([...checks]);

    try {
      const response = await fetch('/api/super-admin/diagnostics/database');
      const data = await response.json();
      checks[checks.length - 1] = {
        name: '数据库连接',
        status: data.success ? 'success' : 'error',
        message: data.success ? '连接正常' : '连接失败',
        details: data.message,
      };
      setResults([...checks]);
    } catch (error) {
      checks[checks.length - 1] = {
        name: '数据库连接',
        status: 'error',
        message: '检查失败',
        details: String(error),
      };
      setResults([...checks]);
    }

    // 2. RLS 策略检查
    checks.push({
      name: 'RLS 策略',
      status: 'pending',
      message: '检查中...',
    });
    setResults([...checks]);

    try {
      const response = await fetch('/api/super-admin/diagnostics/rls');
      const data = await response.json();
      checks[checks.length - 1] = {
        name: 'RLS 策略',
        status: data.success ? 'success' : 'error',
        message: data.success ? '策略正常' : '策略异常',
        details: data.message,
      };
      setResults([...checks]);
    } catch (error) {
      checks[checks.length - 1] = {
        name: 'RLS 策略',
        status: 'error',
        message: '检查失败',
        details: String(error),
      };
      setResults([...checks]);
    }

    // 3. 表结构检查
    checks.push({
      name: '表结构',
      status: 'pending',
      message: '检查中...',
    });
    setResults([...checks]);

    try {
      const response = await fetch('/api/super-admin/diagnostics/tables');
      const data = await response.json();
      checks[checks.length - 1] = {
        name: '表结构',
        status: data.success ? 'success' : 'error',
        message: data.success ? '表结构完整' : '表结构异常',
        details: data.message,
      };
      setResults([...checks]);
    } catch (error) {
      checks[checks.length - 1] = {
        name: '表结构',
        status: 'error',
        message: '检查失败',
        details: String(error),
      };
      setResults([...checks]);
    }

    // 4. 认证权限检查
    checks.push({
      name: '认证权限',
      status: 'pending',
      message: '检查中...',
    });
    setResults([...checks]);

    try {
      const response = await fetch('/api/super-admin/diagnostics/auth');
      const data = await response.json();
      checks[checks.length - 1] = {
        name: '认证权限',
        status: data.success ? 'success' : 'error',
        message: data.success ? '权限正常' : '权限异常',
        details: data.message,
      };
      setResults([...checks]);
    } catch (error) {
      checks[checks.length - 1] = {
        name: '认证权限',
        status: 'error',
        message: '检查失败',
        details: String(error),
      };
      setResults([...checks]);
    }

    // 5. 环境变量检查
    checks.push({
      name: '环境变量',
      status: 'pending',
      message: '检查中...',
    });
    setResults([...checks]);

    try {
      const response = await fetch('/api/super-admin/diagnostics/env');
      const data = await response.json();
      checks[checks.length - 1] = {
        name: '环境变量',
        status: data.success ? 'success' : 'error',
        message: data.success ? '配置正常' : '配置异常',
        details: data.message,
      };
      setResults([...checks]);
    } catch (error) {
      checks[checks.length - 1] = {
        name: '环境变量',
        status: 'error',
        message: '检查失败',
        details: String(error),
      };
      setResults([...checks]);
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
      case 'error':
        return <XCircleIcon className="w-6 h-6 text-red-600" />;
      case 'pending':
        return <ClockIcon className="w-6 h-6 text-yellow-600 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <SuperAdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <WrenchScrewdriverIcon className="w-10 h-10 text-orange-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">系统诊断</h1>
          </div>
          <p className="text-gray-600">
            检查 Super Admin 系统的所有关键组件
          </p>
        </div>

        <div className="mb-8">
          <button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isRunning ? '诊断中...' : '开始诊断'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              诊断结果
            </h2>

            {results.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    {getStatusIcon(result.status)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {result.name}
                    </h3>
                    <p className="text-gray-700 mb-2">{result.message}</p>
                    {result.details && (
                      <details className="text-sm text-gray-600">
                        <summary className="cursor-pointer hover:text-gray-900">
                          查看详情
                        </summary>
                        <pre className="mt-2 p-2 bg-white rounded border border-gray-300 overflow-x-auto">
                          {result.details}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {!isRunning && (
              <div className="mt-8 p-6 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  诊断总结
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {results.filter((r) => r.status === 'success').length}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">通过</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {results.filter((r) => r.status === 'error').length}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">失败</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-600">
                      {results.length}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">总计</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {results.length === 0 && !isRunning && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              使用说明
            </h3>
            <ul className="list-disc list-inside text-blue-800 space-y-2">
              <li>点击"开始诊断"按钮运行系统检查</li>
              <li>诊断将检查数据库、RLS策略、表结构等关键组件</li>
              <li>如果发现问题，请查看详情并联系技术支持</li>
            </ul>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}

export default withSuperAdminAuth(DiagnosticsPage);
