/**
 * 数据库连接测试脚本
 * 使用方法：node test-database-connection.js
 */

const https = require('https');

const BASE_URL = 'http://localhost:3000';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok && data.success) {
      log(`✅ ${name}: 成功`, 'green');
      if (data.message) log(`   ${data.message}`, 'blue');
      if (data.details) log(`   ${data.details}`, 'blue');
      return true;
    } else {
      log(`❌ ${name}: 失败`, 'red');
      if (data.message) log(`   ${data.message}`, 'yellow');
      if (data.error) log(`   错误: ${data.error}`, 'red');
      if (data.details) log(`   ${data.details}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ ${name}: 连接失败`, 'red');
    log(`   ${error.message}`, 'red');
    return false;
  }
}

async function runTests() {
  log('\n🔍 开始测试数据库连接...\n', 'blue');
  
  const tests = [
    { name: '主健康检查', url: `${BASE_URL}/api/health` },
    { name: '数据库连接', url: `${BASE_URL}/api/health/database` },
    { name: '环境配置', url: `${BASE_URL}/api/health/env` },
    { name: '认证服务', url: `${BASE_URL}/api/auth/session` },
    { name: '存储服务', url: `${BASE_URL}/api/health/storage` },
    { name: '邮件服务', url: `${BASE_URL}/api/health/email` },
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await testEndpoint(test.name, test.url);
    if (result) {
      passed++;
    } else {
      failed++;
    }
    console.log(''); // 空行
  }
  
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log(`\n📊 测试结果:`, 'blue');
  log(`   ✅ 通过: ${passed}`, 'green');
  log(`   ❌ 失败: ${failed}`, 'red');
  log(`   📈 成功率: ${Math.round((passed / tests.length) * 100)}%\n`, 'blue');
  
  if (failed === 0) {
    log('🎉 所有测试通过！数据库连接正常。\n', 'green');
  } else {
    log('⚠️  部分测试失败，请查看上面的错误信息。\n', 'yellow');
    log('💡 修复建议:', 'blue');
    log('   1. 检查 .env.local 文件是否存在', 'yellow');
    log('   2. 确认 Supabase 配置正确', 'yellow');
    log('   3. 运行数据库迁移脚本', 'yellow');
    log('   4. 重启开发服务器\n', 'yellow');
  }
}

// 运行测试
runTests().catch(error => {
  log(`\n❌ 测试过程出错: ${error.message}\n`, 'red');
  process.exit(1);
});
