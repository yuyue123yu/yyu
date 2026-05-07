/**
 * 批量修复所有 API 路由的字段名
 * 
 * 使用方法：node 批量修复API字段.js
 */

const fs = require('fs');
const path = require('path');

// 需要修复的文件列表
const files = [
  'src/app/api/tenant/pricing/route.ts',
  'src/app/api/tenant/features/route.ts',
  'src/app/api/tenant/content/route.ts',
  'src/app/api/tenant/domain/route.ts',
  'src/app/api/tenant/domain/verify/route.ts',
  'src/app/api/tenant/seo/route.ts',
  'src/app/api/tenant/seo/upload-favicon/route.ts',
  'src/app/api/tenant/notifications/route.ts',
  'src/app/api/tenant/notifications/test/route.ts',
];

// 替换规则
const replacements = [
  // profiles 表字段
  {
    from: /\.select\('tenant_id, role'\)/g,
    to: ".select('tenant_id, user_type')",
    description: 'profiles 表: role → user_type'
  },
  {
    from: /profile\.role/g,
    to: 'profile.user_type',
    description: 'profile 对象: role → user_type'
  },
  
  // tenant_settings 表字段 - select
  {
    from: /\.select\('value'\)/g,
    to: ".select('setting_value')",
    description: 'tenant_settings 表: select value → setting_value'
  },
  
  // tenant_settings 表字段 - eq key
  {
    from: /\.eq\('key', /g,
    to: ".eq('setting_key', ",
    description: 'tenant_settings 表: eq key → setting_key'
  },
  
  // tenant_settings 表字段 - upsert key
  {
    from: /key: '(branding|pricing|features|content|domain|seo|notifications)'/g,
    to: "setting_key: '$1'",
    description: 'tenant_settings 表: upsert key → setting_key'
  },
  
  // tenant_settings 表字段 - upsert value
  {
    from: /value: (\w+),/g,
    to: 'setting_value: $1,',
    description: 'tenant_settings 表: upsert value → setting_value'
  },
  
  // tenant_settings 表字段 - 访问 value
  {
    from: /settings\?\.value/g,
    to: 'settings?.setting_value',
    description: 'tenant_settings 表: settings.value → setting_value'
  },
  {
    from: /currentSettings\?\.value/g,
    to: 'currentSettings?.setting_value',
    description: 'tenant_settings 表: currentSettings.value → setting_value'
  },
  
  // onConflict 约束
  {
    from: /onConflict: 'tenant_id,key'/g,
    to: "onConflict: 'tenant_id,setting_key'",
    description: 'onConflict 约束: key → setting_key'
  },
];

// 修复单个文件
function fixFile(filePath) {
  try {
    // 读取文件
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const appliedReplacements = [];

    // 应用所有替换规则
    replacements.forEach(rule => {
      const before = content;
      content = content.replace(rule.from, rule.to);
      if (content !== before) {
        modified = true;
        appliedReplacements.push(rule.description);
      }
    });

    // 如果有修改，写回文件
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ 修复: ${filePath}`);
      appliedReplacements.forEach(desc => {
        console.log(`  - ${desc}`);
      });
      return true;
    } else {
      console.log(`○ 跳过: ${filePath} (无需修改)`);
      return false;
    }
  } catch (error) {
    console.error(`✗ 错误: ${filePath}`);
    console.error(`  ${error.message}`);
    return false;
  }
}

// 主函数
function main() {
  console.log('========================================');
  console.log('批量修复 API 路由字段名');
  console.log('========================================\n');

  let fixedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  files.forEach(file => {
    const result = fixFile(file);
    if (result === true) {
      fixedCount++;
    } else if (result === false) {
      skippedCount++;
    } else {
      errorCount++;
    }
  });

  console.log('\n========================================');
  console.log('修复完成');
  console.log('========================================');
  console.log(`✓ 已修复: ${fixedCount} 个文件`);
  console.log(`○ 已跳过: ${skippedCount} 个文件`);
  console.log(`✗ 错误: ${errorCount} 个文件`);
  console.log('========================================\n');

  if (fixedCount > 0) {
    console.log('请重启开发服务器以应用更改：');
    console.log('  1. 按 Ctrl+C 停止当前服务器');
    console.log('  2. 运行: npm run dev');
  }
}

// 运行
main();
