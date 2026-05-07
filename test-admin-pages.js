/**
 * 租户自助 DIY 系统 - 管理页面测试脚本
 * 
 * 使用方法：node test-admin-pages.js
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

// 测试单个页面
async function testPage(path, description) {
  results.total++;
  
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      redirect: 'manual', // 不自动跟随重定向
    });

    const status = response.status;
    
    // 302/307 重定向到登录页是预期的（需要认证）
    if (status === 302 || status === 307) {
      const location = response.headers.get('location');
      if (location && location.includes('login')) {
        log(`✓ ${path} - ${description} (重定向到登录页)`, 'green');
        results.passed.push({ path, description, status: 'redirect_to_login' });
        return true;
      }
    }
    
    // 200 是成功（页面加载）
    if (status === 200) {
      log(`✓ ${path} - ${description} (200 OK)`, 'green');
      results.passed.push({ path, description, status: 200 });
      return true;
    }
    
    // 其他状态码
    log(`✗ ${path} - ${description} (${status})`, 'red');
    results.failed.push({ path, description, status });
    return false;
    
  } catch (error) {
    log(`✗ ${path} - ${description} (错误: ${error.message})`, 'red');
    results.failed.push({ path, description, error: error.message });
    return false;
  }
}

// 主测试函数
async function runTests() {
  log('\n========================================', 'cyan');
  log('租户自助 DIY 系统 - 管理页面测试', 'cyan');
  log('========================================\n', 'cyan');

  log('Phase 1: 品牌设置页面', 'blue');
  await testPage('/admin/branding', '品牌设置页面');

  log('\nPhase 2: 价格配置页面', 'blue');
  await testPage('/admin/pricing', '价格配置页面');

  log('\nPhase 3: 功能开关页面', 'blue');
  await testPage('/admin/features', '功能开关页面');

  log('\nPhase 4: 内容管理页面', 'blue');
  await testPage('/admin/content', '内容管理页面');

  log('\nPhase 5: 域名配置页面', 'blue');
  await testPage('/admin/domain', '域名配置页面');

  log('\nPhase 6: SEO 设置页面', 'blue');
  await testPage('/admin/seo', 'SEO 设置页面');

  log('\nPhase 7: 通知设置页面', 'blue');
  await testPage('/admin/notifications', '通知设置页面');

  log('\n其他管理页面', 'blue');
  await testPage('/admin', 'Admin Dashboard');
  await testPage('/admin/login', 'Admin 登录页');

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
      log(`  - ${test.path}: ${test.error || test.status}`, 'red');
    });
  }

  log('\n注意: 重定向到登录页是正常的，说明页面存在且权限检查正常工作。\n', 'yellow');
  
  // 打印访问说明
  log('========================================', 'cyan');
  log('手动测试说明', 'cyan');
  log('========================================\n', 'cyan');
  
  log('1. 登录 Admin 系统:', 'yellow');
  log('   访问: http://localhost:3000/admin/login', 'cyan');
  log('   使用您的 Admin 账号登录\n', 'cyan');
  
  log('2. 测试各个功能页面:', 'yellow');
  log('   - 品牌设置: http://localhost:3000/admin/branding', 'cyan');
  log('   - 价格配置: http://localhost:3000/admin/pricing', 'cyan');
  log('   - 功能开关: http://localhost:3000/admin/features', 'cyan');
  log('   - 内容管理: http://localhost:3000/admin/content', 'cyan');
  log('   - 域名配置: http://localhost:3000/admin/domain', 'cyan');
  log('   - SEO 设置: http://localhost:3000/admin/seo', 'cyan');
  log('   - 通知设置: http://localhost:3000/admin/notifications\n', 'cyan');
}

// 运行测试
runTests().catch(error => {
  log(`\n测试运行失败: ${error.message}`, 'red');
  process.exit(1);
});
