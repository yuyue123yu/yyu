const fs = require('fs')
const path = require('path')

const ROOT_DIR = path.join(__dirname, '..')

const CORRUPTED_FILES = [
  'src/app/api/public/tenant-config/route.ts',
  'src/app/api/super-admin/analytics/export/route.ts',
  'src/app/api/super-admin/diagnostics/database/route.ts',
  'src/app/api/super-admin/diagnostics/env/route.ts',
  'src/app/api/super-admin/diagnostics/rls/route.ts',
  'src/app/api/super-admin/diagnostics/tables/route.ts',
  'src/app/api/super-admin/setup-password/route.ts',
  'src/app/api/tenant/branding/route.ts',
  'src/app/api/tenant/branding/upload-logo/route.ts',
  'src/app/api/tenant/content/route.ts',
  'src/app/api/tenant/domain/route.ts',
  'src/app/api/tenant/domain/verify/route.ts',
  'src/app/api/tenant/features/route.ts',
  'src/app/api/tenant/notifications/route.ts',
  'src/app/api/tenant/notifications/test/route.ts',
  'src/app/api/tenant/pricing/route.ts',
  'src/app/api/tenant/seo/route.ts',
  'src/app/api/tenant/seo/upload-favicon/route.ts',
  'src/app/api/tenant/users/create/route.ts',
  'src/app/api/tenant/users/route.ts',
]

function fixFile(filePath) {
  try {
    const fullPath = path.join(ROOT_DIR, filePath)

    // Read as buffer first
    let buffer = fs.readFileSync(fullPath)

    // Try to convert to string, replacing invalid sequences
    let content = buffer.toString('utf8', 0, buffer.length)

    // Replace common corrupted patterns
    content = content.replace(/[\uFFFD\u0000-\u001F\u007F-\u009F]/g, '')

    // Fix unterminated strings by removing corrupted Chinese characters
    // Replace corrupted Chinese with English equivalents
    const replacements = {
      '未找到租户配�?': 'Tenant config not found',
      '指标,数�?': 'Metrics,Value',
      '总收�?': 'Total Revenue',
      '数据库连接正�?': 'Database connection successful',
      '所有必需的环境变量都已配�?': 'All required environment variables are configured',
      'RLS 策略已配�?': 'RLS policies configured',
      '所有核心表都存�?': 'All core tables exist',
      '邮箱和密码不能为�?': 'Email and password are required',
      '未登�?': 'Not authenticated',
    }

    for (const [corrupted, replacement] of Object.entries(replacements)) {
      content = content.replace(new RegExp(corrupted, 'g'), replacement)
    }

    // Write back as UTF-8
    fs.writeFileSync(fullPath, content, { encoding: 'utf8' })

    console.log(`✓ Fixed: ${filePath}`)
  } catch (err) {
    console.error(`✗ Failed: ${filePath}`)
    console.error(err.message)
  }
}

console.log('🔧 Fixing corrupted Chinese characters...')

for (const file of CORRUPTED_FILES) {
  fixFile(file)
}

console.log('✅ Corruption fix completed!')
