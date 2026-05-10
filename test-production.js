/**
 * 生产环境自动化测试脚本
 * 测试网站的基本功能和 API 端点
 */

const BASE_URL = 'https://yyu-2026.vercel.app';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// 测试结果统计
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
};

/**
 * 测试 HTTP 请求
 */
async function testEndpoint(name, url, options = {}) {
  results.total++;
  const startTime = Date.now();

  try {
    logInfo(`Testing: ${name}`);
    const response = await fetch(url, options);
    const duration = Date.now() - startTime;

    // 检查状态码
    if (response.ok) {
      logSuccess(
        `${name} - Status: ${response.status} - Time: ${duration}ms`
      );
      results.passed++;
      return { success: true, response, duration };
    } else {
      logError(
        `${name} - Status: ${response.status} - Time: ${duration}ms`
      );
      results.failed++;
      return { success: false, response, duration };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    logError(`${name} - Error: ${error.message} - Time: ${duration}ms`);
    results.failed++;
    return { success: false, error, duration };
  }
}

/**
 * 测试页面加载
 */
async function testPageLoad(name, path) {
  return testEndpoint(name, `${BASE_URL}${path}`);
}

/**
 * 测试 API 端点
 */
async function testAPI(name, path, options = {}) {
  return testEndpoint(name, `${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

/**
 * 测试性能
 */
async function testPerformance(url) {
  const iterations = 5;
  const times = [];

  logInfo(`Performance test: ${url} (${iterations} iterations)`);

  for (let i = 0; i < iterations; i++) {
    const startTime = Date.now();
    await fetch(url);
    const duration = Date.now() - startTime;
    times.push(duration);
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);

  log(`  Average: ${avg.toFixed(2)}ms`, 'cyan');
  log(`  Min: ${min}ms`, 'cyan');
  log(`  Max: ${max}ms`, 'cyan');

  if (avg < 1000) {
    logSuccess('Performance: Excellent (< 1s)');
  } else if (avg < 2000) {
    logWarning('Performance: Good (< 2s)');
    results.warnings++;
  } else if (avg < 3000) {
    logWarning('Performance: Acceptable (< 3s)');
    results.warnings++;
  } else {
    logError('Performance: Poor (> 3s)');
    results.failed++;
  }

  return { avg, min, max };
}

/**
 * 主测试函数
 */
async function runTests() {
  log('\n🚀 Starting Production Environment Tests\n', 'cyan');
  log(`Base URL: ${BASE_URL}\n`, 'cyan');

  // ========================================
  // 1. 基础页面测试
  // ========================================
  log('\n📄 Testing Pages\n', 'yellow');

  await testPageLoad('Homepage', '/');
  await testPageLoad('Services Page', '/services');
  await testPageLoad('Lawyers Page', '/lawyers');
  await testPageLoad('About Page', '/about');
  await testPageLoad('Contact Page', '/contact');
  await testPageLoad('Login Page', '/auth/login');
  await testPageLoad('Register Page', '/auth/register');

  // ========================================
  // 2. API 端点测试
  // ========================================
  log('\n🔌 Testing API Endpoints\n', 'yellow');

  // 公共 API
  const configResult = await testAPI(
    'Public Tenant Config API',
    '/api/public/tenant-config'
  );

  if (configResult.success) {
    try {
      const data = await configResult.response.json();
      logInfo(`Tenant: ${data.tenant?.name || 'Unknown'}`);
    } catch (e) {
      logWarning('Failed to parse tenant config JSON');
    }
  }

  // 认证 API（预期返回 401 或重定向）
  await testAPI('Auth Check API', '/api/auth/session');

  // 管理后台 API（预期返回 401）
  await testAPI('Admin Branding API', '/api/tenant/branding');
  await testAPI('Admin Users API', '/api/tenant/users');

  // 超级管理员 API（预期返回 401）
  await testAPI('Super Admin Tenants API', '/api/super-admin/tenants');
  await testAPI(
    'Super Admin Diagnostics - Database',
    '/api/super-admin/diagnostics/database'
  );
  await testAPI(
    'Super Admin Diagnostics - Env',
    '/api/super-admin/diagnostics/env'
  );
  await testAPI(
    'Super Admin Diagnostics - Tables',
    '/api/super-admin/diagnostics/tables'
  );
  await testAPI(
    'Super Admin Diagnostics - RLS',
    '/api/super-admin/diagnostics/rls'
  );

  // ========================================
  // 3. 404 测试
  // ========================================
  log('\n🔍 Testing 404 Handling\n', 'yellow');

  const notFoundResult = await testEndpoint(
    '404 Page',
    `${BASE_URL}/this-page-does-not-exist`
  );

  if (notFoundResult.response?.status === 404) {
    logSuccess('404 handling works correctly');
  } else {
    logWarning(
      `Expected 404, got ${notFoundResult.response?.status || 'error'}`
    );
  }

  // ========================================
  // 4. 性能测试
  // ========================================
  log('\n⚡ Performance Testing\n', 'yellow');

  await testPerformance(`${BASE_URL}/`);
  await testPerformance(`${BASE_URL}/api/public/tenant-config`);

  // ========================================
  // 5. 安全 Headers 检查
  // ========================================
  log('\n🔒 Security Headers Check\n', 'yellow');

  const securityResult = await fetch(BASE_URL);
  const headers = securityResult.headers;

  const securityHeaders = {
    'x-frame-options': 'X-Frame-Options',
    'x-content-type-options': 'X-Content-Type-Options',
    'content-security-policy': 'Content-Security-Policy',
    'referrer-policy': 'Referrer-Policy',
  };

  for (const [key, name] of Object.entries(securityHeaders)) {
    if (headers.has(key)) {
      logSuccess(`${name}: ${headers.get(key)}`);
    } else {
      logWarning(`${name}: Not found`);
      results.warnings++;
    }
  }

  // ========================================
  // 6. 测试总结
  // ========================================
  log('\n📊 Test Summary\n', 'cyan');

  log(`Total Tests: ${results.total}`, 'cyan');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, 'red');
  log(`Warnings: ${results.warnings}`, 'yellow');

  const successRate = ((results.passed / results.total) * 100).toFixed(2);
  log(`\nSuccess Rate: ${successRate}%`, 'cyan');

  if (results.failed === 0) {
    log('\n🎉 All tests passed!\n', 'green');
  } else {
    log('\n⚠️  Some tests failed. Please review the results.\n', 'yellow');
  }

  // 返回退出码
  return results.failed === 0 ? 0 : 1;
}

// 运行测试
runTests()
  .then((exitCode) => {
    process.exit(exitCode);
  })
  .catch((error) => {
    logError(`Fatal error: ${error.message}`);
    console.error(error);
    process.exit(1);
  });
