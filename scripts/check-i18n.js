#!/usr/bin/env node

/**
 * i18n Translation Key Checker
 * 
 * This script scans all React components for translation keys (t('key'))
 * and checks if they exist in LanguageContext.tsx
 */

const fs = require('fs');
const path = require('path');

// Directories to scan
const SCAN_DIRS = [
  'src/components',
  'src/app',
];

// Translation file
const TRANSLATION_FILE = 'src/contexts/LanguageContext.tsx';

// Regex to find t('key') or t("key")
const T_FUNCTION_REGEX = /t\(['"]([^'"]+)['"]\)/g;

// Store found keys
const foundKeys = new Set();
const existingKeys = {
  zh: new Set(),
  en: new Set(),
  ms: new Set(),
};

/**
 * Recursively scan directory for .tsx and .ts files
 */
function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      scanFile(filePath);
    }
  });
}

/**
 * Scan a single file for translation keys
 */
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let match;
  
  while ((match = T_FUNCTION_REGEX.exec(content)) !== null) {
    foundKeys.add(match[1]);
  }
}

/**
 * Parse LanguageContext.tsx to extract existing keys
 */
function parseTranslationFile() {
  const content = fs.readFileSync(TRANSLATION_FILE, 'utf-8');
  
  // Extract keys from each language section
  const languages = ['zh', 'en', 'ms'];
  
  languages.forEach(lang => {
    // Find the language section
    const langRegex = new RegExp(`${lang}:\\s*{([^}]+(?:{[^}]*}[^}]*)*)`, 'gs');
    const langMatch = langRegex.exec(content);
    
    if (langMatch) {
      // Extract all keys from this section
      const keyRegex = /'([^']+)':/g;
      let keyMatch;
      
      while ((keyMatch = keyRegex.exec(langMatch[1])) !== null) {
        existingKeys[lang].add(keyMatch[1]);
      }
    }
  });
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Scanning for translation keys...\n');
  
  // Scan all directories
  SCAN_DIRS.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`📁 Scanning ${dir}...`);
      scanDirectory(dir);
    }
  });
  
  console.log(`\n✅ Found ${foundKeys.size} unique translation keys in components\n`);
  
  // Parse translation file
  console.log('📖 Parsing LanguageContext.tsx...\n');
  parseTranslationFile();
  
  console.log(`✅ Found ${existingKeys.zh.size} Chinese translations`);
  console.log(`✅ Found ${existingKeys.en.size} English translations`);
  console.log(`✅ Found ${existingKeys.ms.size} Malay translations\n`);
  
  // Find missing keys
  const missingInZh = [];
  const missingInEn = [];
  const missingInMs = [];
  
  foundKeys.forEach(key => {
    if (!existingKeys.zh.has(key)) missingInZh.push(key);
    if (!existingKeys.en.has(key)) missingInEn.push(key);
    if (!existingKeys.ms.has(key)) missingInMs.push(key);
  });
  
  // Report results
  console.log('=' .repeat(60));
  console.log('📊 TRANSLATION COVERAGE REPORT');
  console.log('='.repeat(60));
  
  if (missingInZh.length === 0 && missingInEn.length === 0 && missingInMs.length === 0) {
    console.log('\n✅ All translation keys are covered in all languages!\n');
  } else {
    console.log('\n❌ Missing translations found:\n');
    
    if (missingInZh.length > 0) {
      console.log(`🇨🇳 Missing in Chinese (${missingInZh.length}):`);
      missingInZh.forEach(key => console.log(`   - ${key}`));
      console.log('');
    }
    
    if (missingInEn.length > 0) {
      console.log(`🇬🇧 Missing in English (${missingInEn.length}):`);
      missingInEn.forEach(key => console.log(`   - ${key}`));
      console.log('');
    }
    
    if (missingInMs.length > 0) {
      console.log(`🇲🇾 Missing in Malay (${missingInMs.length}):`);
      missingInMs.forEach(key => console.log(`   - ${key}`));
      console.log('');
    }
    
    // Generate missing keys list
    const allMissingKeys = new Set([...missingInZh, ...missingInEn, ...missingInMs]);
    
    console.log('='.repeat(60));
    console.log(`📝 MISSING KEYS TO ADD (${allMissingKeys.size} total):`);
    console.log('='.repeat(60));
    console.log('');
    
    allMissingKeys.forEach(key => {
      console.log(`'${key}': '',`);
    });
    console.log('');
  }
  
  // Summary
  console.log('='.repeat(60));
  console.log('📈 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total keys used in components: ${foundKeys.size}`);
  console.log(`Chinese coverage: ${existingKeys.zh.size}/${foundKeys.size} (${Math.round(existingKeys.zh.size / foundKeys.size * 100)}%)`);
  console.log(`English coverage: ${existingKeys.en.size}/${foundKeys.size} (${Math.round(existingKeys.en.size / foundKeys.size * 100)}%)`);
  console.log(`Malay coverage: ${existingKeys.ms.size}/${foundKeys.size} (${Math.round(existingKeys.ms.size / foundKeys.size * 100)}%)`);
  console.log('');
}

// Run the script
main();
