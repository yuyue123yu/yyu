const fs = require('fs');
const path = require('path');

// Read the i18n checker output
const componentsDir = path.join(__dirname, '../src');

// Function to extract all t() calls from a file
function extractTranslationKeys(content) {
  const keys = new Set();
  
  // Match t('key') or t("key")
  const tFunctionRegex = /\bt\(['"]([^'"]+)['"]\)/g;
  let match;
  while ((match = tFunctionRegex.exec(content)) !== null) {
    keys.add(match[1]);
  }
  
  return Array.from(keys);
}

// Function to recursively scan directory
function scanDirectory(dir, keys = new Set()) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, .next, .git
      if (!['node_modules', '.next', '.git', '.kiro'].includes(file)) {
        scanDirectory(filePath, keys);
      }
    } else if (file.match(/\.(tsx?|jsx?)$/)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const fileKeys = extractTranslationKeys(content);
      fileKeys.forEach(key => keys.add(key));
    }
  }
  
  return keys;
}

// Scan all components
console.log('Scanning for translation keys...\n');
const allKeys = scanDirectory(componentsDir);

// Read existing translations
const contextPath = path.join(__dirname, '../src/contexts/LanguageContext.tsx');
const contextContent = fs.readFileSync(contextPath, 'utf-8');

// Extract existing keys from translations object
const zhKeysMatch = contextContent.match(/zh:\s*{([^}]+(?:}[^}]+)*?)},\s*en:/s);
const existingKeys = new Set();

if (zhKeysMatch) {
  const zhSection = zhKeysMatch[1];
  const keyRegex = /'([^']+)':/g;
  let match;
  while ((match = keyRegex.exec(zhSection)) !== null) {
    existingKeys.add(match[1]);
  }
}

// Find missing keys
const missingKeys = Array.from(allKeys).filter(key => !existingKeys.has(key));

console.log(`Total keys found in components: ${allKeys.size}`);
console.log(`Existing keys in translations: ${existingKeys.size}`);
console.log(`Missing keys: ${missingKeys.length}\n`);

// Group missing keys by prefix
const grouped = {};
missingKeys.forEach(key => {
  const prefix = key.split('.')[0];
  if (!grouped[prefix]) {
    grouped[prefix] = [];
  }
  grouped[prefix].push(key);
});

// Output grouped missing keys
console.log('=== MISSING TRANSLATION KEYS (GROUPED) ===\n');
Object.keys(grouped).sort().forEach(prefix => {
  console.log(`\n// ${prefix.toUpperCase()}`);
  grouped[prefix].sort().forEach(key => {
    console.log(`'${key}': '',`);
  });
});

// Save to file
const outputPath = path.join(__dirname, 'missing-keys.txt');
let output = '=== MISSING TRANSLATION KEYS ===\n\n';
output += `Total: ${missingKeys.length}\n\n`;

Object.keys(grouped).sort().forEach(prefix => {
  output += `\n// ${prefix.toUpperCase()}\n`;
  grouped[prefix].sort().forEach(key => {
    output += `'${key}': '',\n`;
  });
});

fs.writeFileSync(outputPath, output);
console.log(`\n\nMissing keys saved to: ${outputPath}`);
