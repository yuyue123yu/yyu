/**
 * Execute Tenants Table Migration
 * Creates the tenants table with indexes and constraints
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  console.log('📂 Looking for .env.local at:', envPath);
  
  if (fs.existsSync(envPath)) {
    console.log('✅ Found .env.local file');
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log('📄 File content length:', envContent.length, 'bytes\n');
    
    let loadedCount = 0;
    const lines = envContent.split(/\r?\n/); // Handle both Unix and Windows line endings
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Skip comments and empty lines
      if (!trimmed || trimmed.startsWith('#')) {
        return;
      }
      
      // Match KEY=VALUE pattern
      const match = trimmed.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/i);
      if (match) {
        const key = match[1];
        let value = match[2];
        // Remove surrounding quotes if present
        value = value.replace(/^["'](.*)["']$/, '$1');
        process.env[key] = value;
        loadedCount++;
        console.log(`   ✓ ${key}`);
      }
    });
    
    console.log(`\n✅ Loaded ${loadedCount} environment variables\n`);
  } else {
    console.error('❌ .env.local file not found at:', envPath);
    process.exit(1);
  }
}

loadEnv();

async function executeMigration() {
  console.log('🚀 Starting Tenants Table Migration...\n');

  // Debug: Show what was loaded
  console.log('🔍 Debug - Environment variables loaded:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Found' : 'Missing');
  console.log('   SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Found' : 'Missing');
  console.log('');

  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing Supabase credentials in .env.local');
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // Create Supabase client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log('✅ Connected to Supabase\n');

  // Read migration file
  const migrationPath = path.resolve(process.cwd(), 'supabase/001_create_tenants_table.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  console.log('📄 Migration file loaded\n');
  console.log('⚠️  Note: Due to Supabase client limitations, complex SQL migrations');
  console.log('   should be executed through the Supabase Dashboard SQL Editor.\n');
  console.log('📋 Please follow these steps:\n');
  console.log('1. Go to: https://supabase.com/dashboard/project/ovtrvzbftinsfwytzgwy/sql/new');
  console.log('2. Copy the SQL from: supabase/001_create_tenants_table.sql');
  console.log('3. Paste it into the SQL Editor');
  console.log('4. Click "Run" to execute the migration\n');

  // Try to check if table already exists
  console.log('🔍 Checking if tenants table already exists...\n');
  
  const { data, error } = await supabase
    .from('tenants')
    .select('id')
    .limit(1);

  if (error) {
    if (error.message.includes('relation "public.tenants" does not exist')) {
      console.log('❌ Tenants table does not exist yet');
      console.log('📝 Please execute the migration SQL manually as described above\n');
      
      // Write SQL to a temporary file for easy copying
      const outputPath = path.resolve(process.cwd(), 'TENANTS_MIGRATION.sql');
      fs.writeFileSync(outputPath, sql);
      console.log(`✅ SQL has been written to: ${outputPath}`);
      console.log('   You can copy this file content to the Supabase SQL Editor\n');
    } else {
      console.error('❌ Error checking table:', error.message);
    }
  } else {
    console.log('✅ Tenants table already exists!');
    console.log('📊 Table is ready for use\n');
  }
}

executeMigration()
  .then(() => {
    console.log('🎉 Migration check completed');
  })
  .catch((err) => {
    console.error('💥 Unexpected error:', err);
    process.exit(1);
  });
