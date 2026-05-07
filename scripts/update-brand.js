/**
 * 品牌名批量更新脚本
 * 使用方法：node scripts/update-brand.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 当前品牌信息
const CURRENT_BRAND = {
  name: 'LegalMY',
  companyName: 'LegalMY Sdn Bhd',
  email: 'legalmy.com',
  registrationNumber: '202401234567',
};

// 需要更新的文件列表
const FILES_TO_UPDATE = [
  'src/config/brand.ts',
  'src/components/layout/Header.tsx',
  'components/Header.tsx',
  'src/app/admin/layout.tsx',
  'src/app/admin/login/page.tsx',
  'src/app/admin/page.tsx',
  'src/app/admin/settings/page.tsx',
  'src/app/api/super-admin/system-settings/route.ts',
];

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('\n🏷️  品牌名批量更新工具\n');
  console.log('当前品牌信息：');
  console.log(`  品牌名：${CURRENT_BRAND.name}`);
  console.log(`  公司名：${CURRENT_BRAND.companyName}`);
  console.log(`  邮箱域名：${CURRENT_BRAND.email}`);
  console.log(`  注册号：${CURRENT_BRAND.registrationNumber}\n`);

  // 获取新的品牌信息
  const newBrandName = await question('请输入新的品牌名（例如：法律通）: ');
  if (!newBrandName.trim()) {
    console.log('❌ 品牌名不能为空');
    rl.close();
    return;
  }

  const newCompanyName = await question('请输入新的公司全称（例如：法律通有限公司）: ');
  const newEmailDomain = await question('请输入新的邮箱域名（例如：falvtong.com）: ');
  const newRegistrationNumber = await question('请输入新的公司注册号（可选，按回车跳过）: ');

  console.log('\n📋 将要进行以下替换：');
  console.log(`  ${CURRENT_BRAND.name} → ${newBrandName}`);
  if (newCompanyName.trim()) {
    console.log(`  ${CURRENT_BRAND.companyName} → ${newCompanyName}`);
  }
  if (newEmailDomain.trim()) {
    console.log(`  ${CURRENT_BRAND.email} → ${newEmailDomain}`);
  }
  if (newRegistrationNumber.trim()) {
    console.log(`  ${CURRENT_BRAND.registrationNumber} → ${newRegistrationNumber}`);
  }

  const confirm = await question('\n确认要执行替换吗？(y/n): ');
  if (confirm.toLowerCase() !== 'y') {
    console.log('❌ 已取消操作');
    rl.close();
    return;
  }

  // 执行替换
  let updatedFiles = 0;
  let totalReplacements = 0;

  console.log('\n🔄 开始更新文件...\n');

  for (const filePath of FILES_TO_UPDATE) {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  文件不存在: ${filePath}`);
      continue;
    }

    try {
      let content = fs.readFileSync(fullPath, 'utf8');
      let replacements = 0;

      // 替换品牌名
      const brandNameRegex = new RegExp(CURRENT_BRAND.name, 'g');
      const brandMatches = content.match(brandNameRegex);
      if (brandMatches) {
        content = content.replace(brandNameRegex, newBrandName);
        replacements += brandMatches.length;
      }

      // 替换公司名
      if (newCompanyName.trim()) {
        const companyNameRegex = new RegExp(CURRENT_BRAND.companyName, 'g');
        const companyMatches = content.match(companyNameRegex);
        if (companyMatches) {
          content = content.replace(companyNameRegex, newCompanyName);
          replacements += companyMatches.length;
        }
      }

      // 替换邮箱域名
      if (newEmailDomain.trim()) {
        const emailRegex = new RegExp(CURRENT_BRAND.email, 'g');
        const emailMatches = content.match(emailRegex);
        if (emailMatches) {
          content = content.replace(emailRegex, newEmailDomain);
          replacements += emailMatches.length;
        }
      }

      // 替换注册号
      if (newRegistrationNumber.trim()) {
        const regNumRegex = new RegExp(CURRENT_BRAND.registrationNumber, 'g');
        const regNumMatches = content.match(regNumRegex);
        if (regNumMatches) {
          content = content.replace(regNumRegex, newRegistrationNumber);
          replacements += regNumMatches.length;
        }
      }

      if (replacements > 0) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ ${filePath} (${replacements} 处替换)`);
        updatedFiles++;
        totalReplacements += replacements;
      } else {
        console.log(`⏭️  ${filePath} (无需替换)`);
      }
    } catch (error) {
      console.log(`❌ 更新失败: ${filePath}`);
      console.error(error.message);
    }
  }

  console.log('\n✨ 更新完成！');
  console.log(`📊 统计：更新了 ${updatedFiles} 个文件，共 ${totalReplacements} 处替换\n`);
  console.log('⚠️  注意事项：');
  console.log('1. 请检查更新后的文件是否正确');
  console.log('2. 建议使用 git diff 查看具体修改');
  console.log('3. 重启开发服务器：npm run dev');
  console.log('4. 清除浏览器缓存后测试\n');
  console.log('📖 详细修改指南请查看：品牌名修改指南.md\n');

  rl.close();
}

main().catch(error => {
  console.error('❌ 发生错误:', error);
  rl.close();
  process.exit(1);
});
