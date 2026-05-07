'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TestPagesStatus() {
  const router = useRouter();
  const [results, setResults] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);

  const pages = [
    {
      name: '首页',
      path: '/',
      description: '主页面 - 应该正常显示',
    },
    {
      name: '登录页面',
      path: '/login',
      description: '用户登录 - 应该正常显示',
    },
    {
      name: '注册页面',
      path: '/register',
      description: '用户注册 - 应该正常显示',
    },
    {
      name: '律师列表',
      path: '/lawyers',
      description: '律师列表页面 - 应该正常显示',
    },
    {
      name: '咨询页面',
      path: '/consultation',
      description: '咨询预约 - 应该正常显示',
    },
    {
      name: 'Super Admin 登录',
      path: '/super-admin/login',
      description: 'Super Admin 登录 - 应该显示维护页面',
    },
    {
      name: 'Super Admin Dashboard',
      path: '/super-admin',
      description: 'Super Admin 主页 - 应该重定向到登录',
    },
    {
      name: 'Super Admin 简化版',
      path: '/super-admin/dashboard-simple',
      description: 'Super Admin 简化 Dashboard - 需要登录',
    },
  ];

  const testPage = async (page: any) => {
    try {
      const response = await fetch(page.path, { method: 'HEAD' });
      return {
        ...page,
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      };
    } catch (error: any) {
      return {
        ...page,
        status: 'Error',
        ok: false,
        statusText: error.message,
      };
    }
  };

  const runTests = async () => {
    setTesting(true);
    setResults([]);

    const testResults = [];
    for (const page of pages) {
      const result = await testPage(page);
      testResults.push(result);
      setResults([...testResults]);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setTesting(false);
  };

  const getStatusColor = (status: number | string) => {
    if (status === 200) return 'text-green-600 bg-green-50';
    if (status === 404) return 'text-red-600 bg-red-50';
    if (status === 302 || status === 301) return 'text-blue-600 bg-blue-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const getStatusIcon = (status: number | string) => {
    if (status === 200) return '✅';
    if (status === 404) return '❌';
    if (status === 302 || status === 301) return '🔄';
    return '⚠️';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            页面状态测试
          </h1>
          <p className="text-gray-600">
            测试关键页面的访问状态，确保上线前一切正常
          </p>
        </div>

        {/* Test Button */}
        <div className="mb-6">
          <button
            onClick={runTests}
            disabled={testing}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testing ? '测试中...' : '开始测试'}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getStatusIcon(result.status)}</span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {result.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          result.status
                        )}`}
                      >
                        {result.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {result.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-500">
                        路径: <code className="bg-gray-100 px-2 py-1 rounded">{result.path}</code>
                      </span>
                      {result.statusText && (
                        <span className="text-gray-500">
                          状态: {result.statusText}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => window.open(result.path, '_blank')}
                    className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                  >
                    访问页面
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {results.length > 0 && !testing && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">测试摘要</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600 font-medium mb-1">正常</p>
                <p className="text-3xl font-bold text-green-700">
                  {results.filter(r => r.status === 200).length}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600 font-medium mb-1">重定向</p>
                <p className="text-3xl font-bold text-blue-700">
                  {results.filter(r => r.status === 302 || r.status === 301).length}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-red-600 font-medium mb-1">错误</p>
                <p className="text-3xl font-bold text-red-700">
                  {results.filter(r => r.status === 404 || r.status === 'Error').length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Manual Test Links */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">手动测试链接</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pages.map((page, index) => (
              <a
                key={index}
                href={page.path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{page.name}</span>
                <span className="text-sm text-gray-500">{page.path}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">📋 测试说明</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>首页、登录、注册、律师、咨询</strong> - 应该返回 200 (正常)</li>
            <li>• <strong>Super Admin 登录</strong> - 应该显示维护页面 (200)</li>
            <li>• <strong>Super Admin Dashboard</strong> - 应该重定向到登录 (302)</li>
            <li>• <strong>Super Admin 简化版</strong> - 需要先登录才能访问</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
