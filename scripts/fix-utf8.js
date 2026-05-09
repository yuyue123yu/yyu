const fs = require('fs')
const path = require('path')

const ROOT_DIR = path.join(__dirname, '..')

const TARGET_EXTENSIONS = [
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.json',
  '.md',
  '.mjs',
  '.cjs',
  '.css',
  '.scss',
  '.html',
]

const IGNORE_DIRS = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  '.vercel',
]

function shouldIgnore(filePath) {
  return IGNORE_DIRS.some((dir) => filePath.includes(path.sep + dir + path.sep))
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath)

    // Remove UTF-8 BOM
    if (
      content.length >= 3 &&
      content[0] === 0xef &&
      content[1] === 0xbb &&
      content[2] === 0xbf
    ) {
      content = content.slice(3)
    }

    // Convert to UTF-8 string safely
    const utf8Content = content.toString('utf8')

    // Rewrite file as UTF-8 without BOM
    fs.writeFileSync(filePath, utf8Content, {
      encoding: 'utf8',
    })

    console.log(`✓ Fixed UTF-8: ${filePath}`)
  } catch (err) {
    console.error(`✗ Failed: ${filePath}`)
    console.error(err.message)
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const fullPath = path.join(dir, file)

    if (shouldIgnore(fullPath)) {
      continue
    }

    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      walk(fullPath)
    } else {
      const ext = path.extname(fullPath)

      if (TARGET_EXTENSIONS.includes(ext)) {
        processFile(fullPath)
      }
    }
  }
}

console.log('🚀 Starting UTF-8 cleanup...')

walk(ROOT_DIR)

console.log('✅ UTF-8 cleanup completed!')
