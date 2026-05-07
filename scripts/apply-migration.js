/**
 * Apply Migration Directly to Supabase
 * Uses Supabase REST API to execute SQL
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split(/\r?\n/);
    
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      
      const match = trimmed.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/i);
      if (match) {
        const key = match[1];
        let value = match[2].replace(/^["'](.*)["']$/, '$1');
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

async function executeSQL(sql) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase credentials');
  }

  // Extract project ref from URL
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)[1];
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: `${projectRef}.supabase.co`,
      port: 443,
      path: '/rest/v1/rpc/exec',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Prefer': 'return=representation'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data: data });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(JSON.stringify({ sql: sql }));
    req.end();
  });
}

async function main() {
  console.log('🚀 Applying Tenants Table Migration...\n');

  // Read the migration file
  const migrationPath = path.resolve(process.cwd(), 'supabase/001_create_tenants_table.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  console.log('📄 Migration SQL loaded');
  console.log('📊 SQL length:', sql.length, 'characters\n');

  // Since Supabase doesn't have a built-in exec RPC, we'll need to use psql or the dashboard
  console.log('⚠️  Direct SQL execution via API is not available.');
  console.log('📝 Please execute the migration using one of these methods:\n');
  
  console.log('METHOD 1: Supabase Dashboard (Recommended)');
  console.log('─'.repeat(50));
  console.log('1. Open: https://supabase.com/dashboard/project/ovtrvzbftinsfwytzgwy/sql/new');
  console.log('2. Copy the contents of: supabase/001_create_tenants_table.sql');
  console.log('3. Paste into the SQL Editor');
  console.log('4. Click "Run" button\n');

  console.log('METHOD 2: Using psql (if you have PostgreSQL client)');
  console.log('─'.repeat(50));
  console.log('Get your database connection string from Supabase Dashboard:');
  console.log('Settings → Database → Connection string');
  console.log('Then run:');
  console.log('psql "your-connection-string" < supabase/001_create_tenants_table.sql\n');

  // Write a copy for easy access
  const copyPath = path.resolve(process.cwd(), 'EXECUTE_THIS_SQL.sql');
  fs.writeFileSync(copyPath, sql);
  console.log(`✅ SQL copied to: ${copyPath}`);
  console.log('   You can open this file and copy its contents\n');

  console.log('💡 After executing the SQL, run this script again to verify:');
  console.log('   node scripts/execute-tenants-migration.js\n');
}

main().catch(console.error);
