/**
 * 租户自助 DIY 系统 - API 端点测试脚本
 * 
 * 使用方法：node test-api-endpoints.js
 */

const BASE_URL = 'http://localhost:3000';

// 测试结果
const results = {
  passed: [],
  failed: [],
  total: 0
};

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 测试单个 API 端点
async function testEndpoint(method, path, description) {
  results.total++;
  
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      // 注意：这里没有认证 token，所以预期会返回 401
    });

    const status = response.status;
    
    // 对于需要认证的端点，401 是预期的
    if (status === 401) {
      log(`✓ ${method} ${path} - ${description} (需要认证)`, 'green');
      results.passed.push({ method, path, description, status });
      return true;
    }
    
    // 200-299 是成功
    if (status >= 200 && status < 300) {
      log(`✓ ${method} ${path} - ${description} (${status})`, 'green');
      results.passed.push({ method, path, description, status });
      return true;
    }
    
    // 其他状态码
    log(`✗ ${method} ${path} - ${description} (${status})`, 'red');
    results.failed.push({ method, path, description, status });
    return false;
    
  } catch (error) {
    log(`✗ ${method} ${path} - ${description} (错误: ${error.message})`, 'red');
    results.failed.push({ method, path, description, error: error.message });
    return false;
  }
}

// 主测试函数
async function runTests() {
  log('\n========================================', 'cyan');
  log('租户自助 DIY 系统 - API 端点测试', 'cyan');
  log('========================================\n', 'cyan');

  log('Phase 1: 品牌设置 API', 'blue');
  await testEndpoint('GET', '/api/tenant/branding', '获取品牌配置');
  await testEndpoint('PUT', '/api/tenant/branding', '更新品牌配置');
  await testEndpoint('POST', '/api/tenant/branding/upload-logo', '上传 Logo');

  log('\nPhase 2: 价格配置 API', 'blue');
  await testEndpoint('GET', '/api/tenant/pricing', '获取价格配置');
  await testEndpoint('PUT', '/api/tenant/pricing', '更新价格配置');

  log('\nPhase 3: 功能开关 API', 'blue');
  await testEndpoint('GET', '/api/tenant/features', '获取功能配置');
  await testEndpoint('PUT', '/api/tenant/features', '更新功能配置');

  log('\nPhase 4: 内容管理 API', 'blue');
  await testEndpoint('GET', '/api/tenant/content', '获取内容配置');
  await testEndpoint('PUT', '/api/tenant/content', '更新内容配置');

  log('\nPhase 5: 域名配置 API', 'blue');
  await testEndpoint('GET', '/api/tenant/domain', '获取域名配置');
  await testEndpoint('PUT', '/api/tenant/domain', '更新域名配置');
  await testEndpoint('POST', '/api/tenant/domain/verify', '验证域名');

  log('\nPhase 6: SEO 设置 API', 'blue');
  await testEndpoint('GET', '/api/tenant/seo', '获取 SEO 配置');
  await testEndpoint('PUT', '/api/tenant/seo', '更新 SEO 配置');
  await testEndpoint('POST', '/api/tenant/seo/upload-favicon', '上传 Favicon');

  log('\nPhase 7: 通知设置 API', 'blue');
  await testEndpoint('GET', '/api/tenant/notifications', '获取通知配置');
  await testEndpoint('PUT', '/api/tenant/notifications', '更新通知配置');
  await testEndpoint('POST', '/api/tenant/notifications/test', '测试通知');

  // 打印测试结果
  log('\n========================================', 'cyan');
  log('测试结果汇总', 'cyan');
  log('========================================\n', 'cyan');

  log(`总测试数: ${results.total}`, 'yellow');
  log(`通过: ${results.passed.length}`, 'green');
  log(`失败: ${results.failed.length}`, 'red');
  log(`成功率: ${((results.passed.length / results.total) * 100).toFixed(2)}%\n`, 'yellow');

  if (results.failed.length > 0) {
    log('失败的测试:', 'red');
    results.failed.forEach(test => {
      log(`  - ${test.method} ${test.path}: ${test.error || test.status}`, 'red');
    });
  }

  log('\n注意: 返回 401 (需要认证) 是正常的，说明 API 端点存在且权限检查正常工作。\n', 'yellow');
}

// 运行测试
runTests().catch(error => {
  log(`\n测试运行失败: ${error.message}`, 'red');
  process.exit(1);
});
