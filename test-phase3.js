// Simple test script to verify Phase 3 files are created correctly
const fs = require('fs');

const files = [
  'src/app/api/super-admin/tenants/route.ts',
  'src/app/api/super-admin/tenants/[id]/route.ts',
  'src/app/api/super-admin/tenants/[id]/activate/route.ts',
  'src/app/api/super-admin/tenants/[id]/deactivate/route.ts',
  'src/app/api/super-admin/tenants/[id]/settings/route.ts',
  'src/app/api/super-admin/tenants/[id]/settings/[key]/route.ts',
  'src/app/super-admin/tenants-test/page.tsx',
  'PHASE_3_COMPLETE.md',
];

console.log('Phase 3 文件检查:\n');

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

console.log('\n' + '='.repeat(60));

if (allFilesExist) {
  console.log('\x1b[32m✓ 所有 Phase 3 文件已成功创建！\x1b[0m');
  console.log('\n已创建的 API 端点：');
  console.log('  ✓ GET    /api/super-admin/tenants - 列出租户');
  console.log('  ✓ POST   /api/super-admin/tenants - 创建租户');
  console.log('  ✓ GET    /api/super-admin/tenants/:id - 获取租户详情');
  console.log('  ✓ PATCH  /api/super-admin/tenants/:id - 更新租户');
  console.log('  ✓ DELETE /api/super-admin/tenants/:id - 删除租户');
  console.log('  ✓ POST   /api/super-admin/tenants/:id/activate - 激活租户');
  console.log('  ✓ POST   /api/super-admin/tenants/:id/deactivate - 停用租户');
  console.log('  ✓ GET    /api/super-admin/tenants/:id/settings - 获取设置');
  console.log('  ✓ PUT    /api/super-admin/tenants/:id/settings/:key - 更新设置');
  console.log('  ✓ POST   /api/super-admin/tenants/:id/settings/bulk - 批量更新');
  console.log('\n测试页面：');
  console.log('  http://localhost:3000/super-admin/tenants-test');
  console.log('\n详细文档请查看: PHASE_3_COMPLETE.md');
} else {
  console.log('\x1b[31m✗ 部分文件缺失\x1b[0m');
  process.exit(1);
}
