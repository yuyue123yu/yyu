// Simple test script to verify Phase 2 files are created correctly
const fs = require('fs');
const path = require('path');

const files = [
  'types/super-admin.ts',
  'src/lib/middleware/super-admin.ts',
  'src/lib/middleware/tenant-context.ts',
  'src/lib/audit/index.ts',
  'src/app/api/super-admin/test/route.ts',
  'src/app/super-admin/test/page.tsx',
  'PHASE_2_TESTING.md',
];

console.log('Phase 2 文件检查:\n');

let allFilesExist = true;

files.forEach((file) => {
  const exists = fs.existsSync(file);
  const status = exists ? '✓' : '✗';
  const color = exists ? '\x1b[32m' : '\x1b[31m';
  console.log(`${color}${status}\x1b[0m ${file}`);
  
  if (!exists) {
    allFilesExist = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allFilesExist) {
  console.log('\x1b[32m✓ 所有 Phase 2 文件已成功创建！\x1b[0m');
  console.log('\n下一步：');
  console.log('1. 确保 Phase 1 的 SQL 迁移已执行');
  console.log('2. 创建 super admin 账户');
  console.log('3. 启动开发服务器: npm run dev');
  console.log('4. 访问测试页面: http://localhost:3000/super-admin/test');
  console.log('\n详细测试说明请查看: PHASE_2_TESTING.md');
} else {
  console.log('\x1b[31m✗ 部分文件缺失\x1b[0m');
  process.exit(1);
}
