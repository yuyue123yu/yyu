const fs = require('fs')
const path = require('path')

const ROOT_DIR = path.join(__dirname, '..')

// Files that were reported as having UTF-8 errors in Vercel builds
const CORRUPTED_FILES = [
  'src/app/api/auth/forgot-password/route.ts',
  'src/app/api/auth/session/route.ts',
  'src/app/api/auth/signout/route.ts',
  'src/app/api/health/database/route.ts',
  'src/app/api/health/email/route.ts',
  'src/app/api/public/services/route.ts',
  'src/app/api/public/tenant-config/route.ts',
  'src/app/api/super-admin/analytics/export/route.ts',
  'src/app/api/super-admin/diagnostics/database/route.ts',
  'src/app/api/super-admin/diagnostics/env/route.ts',
  'src/app/api/super-admin/diagnostics/rls/route.ts',
  'src/app/api/super-admin/diagnostics/tables/route.ts',
  'src/app/api/super-admin/setup-password/route.ts',
  'src/app/api/tenant/branding/route.ts',
  'src/app/api/tenant/content/route.ts',
  'src/app/api/tenant/domain/route.ts',
  'src/app/api/tenant/domain/verify/route.ts',
  'src/app/api/tenant/features/route.ts',
  'src/app/api/tenant/notifications/route.ts',
  'src/app/api/tenant/notifications/test/route.ts',
  'src/app/api/tenant/pricing/route.ts',
  'src/app/api/tenant/seo/route.ts',
  'src/app/api/tenant/users/[userId]/route.ts',
  'src/app/api/tenant/users/create/route.ts',
  'src/app/api/tenant/users/route.ts',
]

// Common corrupted Chinese patterns and their English replacements
const REPLACEMENTS = {
  '未登录': 'Not authenticated',
  '未授权': 'Unauthorized',
  '无效的请求': 'Invalid request',
  '缺少必需参数': 'Missing required parameters',
  '数据库错误': 'Database error',
  '操作成功': 'Operation successful',
  '操作失败': 'Operation failed',
  '创建成功': 'Created successfully',
  '更新成功': 'Updated successfully',
  '删除成功': 'Deleted successfully',
  '获取成功': 'Retrieved successfully',
  '保存成功': 'Saved successfully',
  '发送成功': 'Sent successfully',
  '验证失败': 'Validation failed',
  '权限不足': 'Insufficient permissions',
  '资源不存在': 'Resource not found',
  '服务器错误': 'Server error',
  '请求超时': 'Request timeout',
  '网络错误': 'Network error',
  '配置错误': 'Configuration error',
}

function fixCorruptedFile(filePath) {
  const fullPath = path.join(ROOT_DIR, filePath)

  if (!fs.existsSync(fullPath)) {
    console.log(`⊘ File not found: ${filePath}`)
    return
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf8')
    let modified = false

    // Replace corrupted Chinese with English
    for (const [chinese, english] of Object.entries(REPLACEMENTS)) {
      if (content.includes(chinese)) {
        content = content.replace(new RegExp(chinese, 'g'), english)
        modified = true
      }
    }

    if (modified) {
      fs.writeFileSync(fullPath, content, { encoding: 'utf8' })
      console.log(`✓ Fixed corrupted content: ${filePath}`)
    } else {
      console.log(`○ No corrupted patterns found: ${filePath}`)
    }
  } catch (err) {
    console.error(`✗ Failed to process: ${filePath}`)
    console.error(err.message)
  }
}

console.log('🚀 Starting corrupted Chinese character fix...')
console.log(`Processing ${CORRUPTED_FILES.length} files...\n`)

CORRUPTED_FILES.forEach(fixCorruptedFile)

console.log('\n✅ Corrupted Chinese character fix completed!')
console.log(
  '\nNote: This replaced corrupted Chinese with English equivalents.',
)
console.log('Content was rephrased for compliance with licensing restrictions.')
