const fs = require('fs')
const path = require('path')

const ROOT = process.cwd()

const exts = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.json',
  '.mjs',
  '.cjs',
  '.css',
  '.scss',
  '.md',
])

const ignoreDirs = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  '.vercel',
])

function walk(dir) {
  const entries = fs.readdirSync(dir)

  for (const entry of entries) {
    const full = path.join(dir, entry)
    const stat = fs.statSync(full)

    if (stat.isDirectory()) {
      if (!ignoreDirs.has(entry)) {
        walk(full)
      }
      continue
    }

    const ext = path.extname(full)
    if (!exts.has(ext)) continue

    try {
      let content = fs.readFileSync(full)

      // Remove BOM
      if (
        content.length >= 3 &&
        content[0] === 0xef &&
        content[1] === 0xbb &&
        content[2] === 0xbf
      ) {
        content = content.slice(3)
      }

      // Force utf8 rewrite
      const text = Buffer.from(content).toString('utf8')
      fs.writeFileSync(full, text, {
        encoding: 'utf8',
      })

      console.log('FIXED:', full)
    } catch (err) {
      console.error('FAILED:', full)
      console.error(err.message)
    }
  }
}

console.log('START UTF8 NORMALIZE')
walk(ROOT)
console.log('DONE UTF8 NORMALIZE')
