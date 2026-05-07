/**
 * Direct Migration Execution
 * Attempts to execute SQL using Supabase client's query method
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const match = trimmed.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/i);
      if (match) {
        process.env[match[1]] = match[2].replace(/^["'](.*)["']$/, '$1');
      }
    });
  }
}

loadEnv();

async function executeMigration() {
  console.log('🚀 Executing Tenants Table Migration...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  // Read migration file
  const migrationPath = path.resolve(process.cwd(), 'supabase/001_create_tenants_table.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  console.log('📄 Migration SQL loaded\n');
  console.log('⚙️  Attempting to execute migration...\n');

  // Try to execute using raw SQL
  try {
    // Method 1: Try using the REST API directly
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      },
      body: JSON.stringify({ query: sql })
    });

    if (response.ok) {
      console.log('✅ Migration executed successfully!\n');
      
      // Verify table exists
      const { data, error } = await supabase
        .from('tenants')
        .select('id')
        .limit(1);
      
      if (!error) {
        console.log('✅ Tenants table verified and ready to use\n');
        return true;
      }
    } else {
      const errorText = await response.text();
      console.log('⚠️  REST API method failed:', response.status, errorText, '\n');
    }
  } catch (err) {
    console.log('⚠️  Direct execution not supported:', err.message, '\n');
  }

  // If we get here, direct execution failed
  console.log('📝 Please execute the migration manually using the Supabase Dashboard:\n');
  console.log('1. Open: https://supabase.com/dashboard/project/ovtrvzbftinsfwytzgwy/sql/new');
  console.log('2. Copy the SQL from: supabase/001_create_tenants_table.sql');
  console.log('3. Paste it into the SQL Editor');
  console.log('4. Click "Run" to execute\n');

  // Create a copy for easy access
  const copyPath = path.resolve(process.cwd(), 'TENANTS_MIGRATION_SQL.txt');
  fs.writeFileSync(copyPath, sql);
  console.log(`✅ SQL copied to: ${copyPath}`);
  console.log('   Open this file to copy the SQL easily\n');

  return false;
}

executeMigration()
  .then((success) => {
    if (success) {
      console.log('🎉 Migration completed successfully!');
      process.exit(0);
    } else {
      console.log('⏸️  Manual execution required');
      process.exit(0);
    }
  })
  .catch((err) => {
    console.error('💥 Error:', err.message);
    process.exit(1);
  });
