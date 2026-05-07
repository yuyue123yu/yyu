/**
 * Run Tenants Table Migration
 * Executes the migration by breaking it into individual statements
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

// Parse SQL into executable statements
function parseSQLStatements(sql) {
  const statements = [];
  let current = '';
  let inDollarQuote = false;
  let dollarTag = '';
  
  const lines = sql.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines and comments when not in a statement
    if (!current && (!trimmed || trimmed.startsWith('--'))) {
      continue;
    }
    
    // Check for dollar-quoted strings ($$, $body$, etc.)
    const dollarMatch = line.match(/\$([a-zA-Z_]*)\$/);
    if (dollarMatch) {
      if (!inDollarQuote) {
        inDollarQuote = true;
        dollarTag = dollarMatch[0];
      } else if (dollarMatch[0] === dollarTag) {
        inDollarQuote = false;
        dollarTag = '';
      }
    }
    
    current += line + '\n';
    
    // Check for statement end (semicolon not in dollar quote)
    if (!inDollarQuote && trimmed.endsWith(';')) {
      statements.push(current.trim());
      current = '';
    }
  }
  
  // Add any remaining statement
  if (current.trim()) {
    statements.push(current.trim());
  }
  
  return statements.filter(s => s.length > 0);
}

async function runMigration() {
  console.log('🚀 Running Tenants Table Migration...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
  }

  // Create admin client
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: 'public' }
  });

  console.log('✅ Connected to Supabase\n');

  // Read and parse migration
  const migrationPath = path.resolve(process.cwd(), 'supabase/001_create_tenants_table.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');
  const statements = parseSQLStatements(sql);

  console.log(`📄 Parsed ${statements.length} SQL statements\n`);

  // Execute each statement
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    const preview = statement.substring(0, 60).replace(/\n/g, ' ') + '...';
    
    process.stdout.write(`[${i + 1}/${statements.length}] ${preview} `);

    try {
      const { error } = await supabase.rpc('exec', { sql: statement });
      
      if (error) {
        // Try alternative method
        const { error: error2 } = await supabase.from('_').select('*').limit(0);
        
        // If it's a "function does not exist" error, we need to use raw query
        console.log('⚠️');
        console.log(`   Warning: Cannot execute via RPC`);
        console.log(`   Statement: ${preview}`);
        errorCount++;
      } else {
        console.log('✅');
        successCount++;
      }
    } catch (err) {
      console.log('❌');
      console.log(`   Error: ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Results: ${successCount} succeeded, ${errorCount} failed\n`);

  if (errorCount > 0) {
    console.log('⚠️  Some statements could not be executed via the Supabase client.');
    console.log('📝 Please execute the migration manually:\n');
    console.log('1. Go to: https://supabase.com/dashboard/project/ovtrvzbftinsfwytzgwy/sql/new');
    console.log('2. Copy contents from: supabase/001_create_tenants_table.sql');
    console.log('3. Paste and click "Run"\n');
  } else {
    console.log('🎉 Migration completed successfully!');
    
    // Verify table exists
    const { data, error } = await supabase
      .from('tenants')
      .select('id')
      .limit(1);
    
    if (!error) {
      console.log('✅ Tenants table verified and ready to use\n');
    }
  }
}

runMigration().catch(console.error);
