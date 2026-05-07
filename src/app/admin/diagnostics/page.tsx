"use client";

import { useState, useEffect } from "react";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  Database,
  Server,
  Globe,
  Shield,
  Clock,
  Activity
} from "lucide-react";

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setLoading(true);
    const results: DiagnosticResult[] = [];

    try {
      // 1. 检查数据库连接
      try {
        const dbResponse = await fetch('/api/health/database');
        const dbData = await dbResponse.json();
        results.push({
          name: '数据库连接',
          status: dbData.success ? 'success' : 'error',
          message: dbData.success ? '数据库连接正常' : '数据库连接失败',
          details: dbData.message || ''
        });
      } catch (error) {
        results.push({
          name: '数据库连接',
          status: 'error',
          message: '无法检查数据库连接',
          details: error instanceof Error ? error.message : '未知错误'
        });
      }

      // 2. 检查API服务
      try {
        const apiResponse = await fetch('/api/health');
        const apiData = await apiResponse.json();
        results.push({
          name: 'API 服务',
          status: apiResponse.ok ? 'success' : 'error',
          message: apiResponse.ok ? 'API 服务运行正常' : 'API 服务异常',
          details: `响应时间: ${apiData.timestamp || 'N/A'}`
        });
      } catch (error) {
        results.push({
          name: 'API 服务',
          status: 'error',
          message: 'API 服务无响应',
          details: error instanceof Error ? error.message : '未知错误'
        });
      }

      // 3. 检查认证服务
      try {
        const authResponse = await fetch('/api/auth/session');
        results.push({
          name: '认证服务',
          status: authResponse.ok ? 'success' : 'warning',
          message: authResponse.ok ? '认证服务正常' : '认证服务可能存在问题',
          details: `状态码: ${authResponse.status}`
        });
      } catch (error) {
        results.push({
          name: '认证服务',
          status: 'error',
          message: '认证服务检查失败',
          details: error instanceof Error ? error.message : '未知错误'
        });
      }

      // 4. 检查环境变量
      try {
        const envResponse = await fetch('/api/health/env');
        const envData = await envResponse.json();
        results.push({
          name: '环境配置',
          status: envData.configured ? 'success' : 'warning',
          message: envData.configured ? '环境变量配置完整' : '部分环境变量未配置',
          details: envData.missing ? `缺失: ${envData.missing.join(', ')}` : '所有必需变量已配置'
        });
      } catch (error) {
        results.push({
          name: '环境配置',
          status: 'warning',
          message: '无法检查环境配置',
          details: '请确保环境变量正确配置'
        });
      }

      // 5. 检查存储服务
      try {
        const storageResponse = await fetch('/api/health/storage');
        const storageData = await storageResponse.json();
        results.push({
          name: '存储服务',
          status: storageData.available ? 'success' : 'warning',
          message: storageData.available ? '存储服务可用' : '存储服务不可用',
          details: storageData.message || ''
        });
      } catch (error) {
        results.push({
          name: '存储服务',
          status: 'warning',
          message: '存储服务检查失败',
          details: '文件上传功能可能受影响'
        });
      }

      // 6. 检查邮件服务
      try {
        const emailResponse = await fetch('/api/health/email');
        const emailData = await emailResponse.json();
        results.push({
          name: '邮件服务',
          status: emailData.configured ? 'success' : 'warning',
          message: emailData.configured ? '邮件服务已配置' : '邮件服务未配置',
          details: emailData.message || ''
        });
      } catch (error) {
        results.push({
          name: '邮件服务',
          status: 'warning',
          message: '邮件服务检查失败',
          details: '邮件通知功能可能不可用'
        });
      }

    } catch (error) {
      console.error('诊断过程出错:', error);
    }

    setDiagnostics(results);
    setLastCheck(new Date());
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-yellow-600" />;
      default:
        return <Activity className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const successCount = diagnostics.filter(d => d.status === 'success').length;
  const errorCount = diagnostics.filter(d => d.status === 'error').length;
  const warningCount = diagnostics.filter(d => d.status === 'warning').length;

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
                <Activity className="h-8 w-8 text-primary-600" />
                系统诊断
              </h1>
              <p className="text-neutral-600 mt-2">检查系统各项服务的运行状态</p>
            </div>
            <button
              onClick={runDiagnostics}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? '检查中...' : '重新检查'}
            </button>
          </div>

          {lastCheck && (
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Clock className="h-4 w-4" />
              最后检查时间: {lastCheck.toLocaleString('zh-CN')}
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-600 mb-1">正常</div>
                <div className="text-3xl font-bold text-green-600">{successCount}</div>
              </div>
              <CheckCircle className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-600 mb-1">警告</div>
                <div className="text-3xl font-bold text-yellow-600">{warningCount}</div>
              </div>
              <AlertCircle className="h-12 w-12 text-yellow-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-600 mb-1">错误</div>
                <div className="text-3xl font-bold text-red-600">{errorCount}</div>
              </div>
              <XCircle className="h-12 w-12 text-red-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Diagnostic Results */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mb-4"></div>
            <p className="text-neutral-600">正在检查系统状态...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {diagnostics.map((diagnostic, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-sm p-6 border-2 ${getStatusColor(diagnostic.status)} transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(diagnostic.status)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">
                      {diagnostic.name}
                    </h3>
                    <p className="text-neutral-700 mb-2">{diagnostic.message}</p>
                    {diagnostic.details && (
                      <p className="text-sm text-neutral-600 bg-white/50 rounded px-3 py-2 font-mono">
                        {diagnostic.details}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* System Info */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
          <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Server className="h-5 w-5 text-primary-600" />
            系统信息
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-neutral-600">浏览器:</span>
              <span className="ml-2 font-medium text-neutral-900">
                {typeof window !== 'undefined' ? window.navigator.userAgent.split(' ').slice(-1)[0] : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-neutral-600">平台:</span>
              <span className="ml-2 font-medium text-neutral-900">
                {typeof window !== 'undefined' ? window.navigator.platform : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-neutral-600">语言:</span>
              <span className="ml-2 font-medium text-neutral-900">
                {typeof window !== 'undefined' ? window.navigator.language : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-neutral-600">在线状态:</span>
              <span className="ml-2 font-medium text-neutral-900">
                {typeof window !== 'undefined' ? (window.navigator.onLine ? '在线' : '离线') : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => window.close()}
            className="px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-all"
          >
            关闭窗口
          </button>
          <button
            onClick={() => window.location.href = '/admin/settings'}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all"
          >
            返回设置
          </button>
        </div>
      </div>
    </div>
  );
}
