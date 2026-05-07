// 检查 settings 表是否存在的脚本
// 使用方法：node check-settings-table.js

const fs = require('fs');
const path = require('path');

console.log('🔍 检查 settings 表状态...\n');

// 读取 .env.local
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ 找不到 .env.local 文件');
  console.log('📝 请确保项目根目录有 .env.local 文件\n');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const lines = envContent.split('\n');

let supabaseUrl = '';
let supabaseKey = '';

lines.forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1].trim();
  }
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    supabaseKey = line.split('=')[1].trim();
  }
});

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ .env.local 中缺少 Supabase 配置');
  console.log('📝 需要以下配置：');
  console.log('   NEXT_PUBLIC_SUPABASE_URL=...');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=...\n');
  process.exit(1);
}

console.log('✅ 找到 Supabase 配置');
console.log(`📍 URL: ${supabaseUrl}\n`);

console.log('📋 下一步操作：\n');
console.log('1. 打开 Supabase Dashboard:');
console.log(`   ${supabaseUrl.replace('/rest/v1', '')}\n`);

console.log('2. 进入 SQL Editor\n');

console.log('3. 执行以下 SQL 检查表是否存在：');
console.log('   ----------------------------------------');
console.log('   SELECT * FROM public.settings;');
console.log('   ----------------------------------------\n');

console.log('4. 如果报错 "relation does not exist"，说明表不存在');
console.log('   请执行项目中的 create-settings-table-now.sql\n');

console.log('5. 如果能看到数据，说明表已存在');
console.log('   检查是否有 key=\'site\' 的记录\n');

console.log('📄 相关文件：');
console.log('   - create-settings-table-now.sql (创建表的SQL)');
console.log('   - 修复同步问题-执行步骤.md (详细步骤)\n');

console.log('💡 提示：');
console.log('   如果表已存在但前端不同步，请：');
console.log('   1. 硬刷新浏览器 (Ctrl+Shift+R)');
console.log('   2. 检查浏览器控制台是否有错误');
console.log('   3. 重启开发服务器\n');
