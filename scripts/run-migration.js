/**
 * Migration Runner Script
 * Executes SQL migration files against Supabase database
 * 
 * Usage: node scripts/run-migration.js <migration-file>
 * Example: node scripts/run-migration.js supabase/001_create_tenants_table.sql
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

async function runMigration(migrationFile) {
  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing Supabase credentials in .env.local');
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // Create Supabase client with service role key (bypasses RLS)
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log('🔗 Connected to Supabase');

  // Read migration file
  const migrationPath = path.resolve(process.cwd(), migrationFile);
  
  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Error: Migration file not found: ${migrationPath}`);
    process.exit(1);
  }

  console.log(`📄 Reading migration: ${migrationFile}`);
  const sql = fs.readFileSync(migrationPath, 'utf8');

  // Execute migration
  console.log('⚙️  Executing migration...');
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      // If exec_sql function doesn't exist, try direct query
      if (error.message.includes('function') && error.message.includes('does not exist')) {
        console.log('⚠️  exec_sql function not found, attempting direct execution...');
        
        // Split SQL into individual statements and execute them
        const statements = sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'));
        
        for (let i = 0; i < statements.length; i++) {
          const statement = statements[i];
          if (statement) {
            console.log(`  Executing statement ${i + 1}/${statements.length}...`);
            const { error: stmtError } = await supabase.rpc('exec', { 
              sql: statement + ';' 
            });
            
            if (stmtError) {
              console.error(`❌ Error in statement ${i + 1}:`, stmtError.message);
              throw stmtError;
            }
          }
        }
        
        console.log('✅ Migration executed successfully (direct mode)');
      } else {
        throw error;
      }
    } else {
      console.log('✅ Migration executed successfully');
      if (data) {
        console.log('📊 Result:', data);
      }
    }
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    console.error('\n💡 Tip: You may need to run this SQL manually in the Supabase SQL Editor');
    console.error('   URL: https://supabase.com/dashboard/project/ovtrvzbftinsfwytzgwy/sql');
    process.exit(1);
  }
}

// Main execution
const migrationFile = process.argv[2];

if (!migrationFile) {
  console.error('❌ Error: Please provide a migration file path');
  console.error('Usage: node scripts/run-migration.js <migration-file>');
  console.error('Example: node scripts/run-migration.js supabase/001_create_tenants_table.sql');
  process.exit(1);
}

runMigration(migrationFile)
  .then(() => {
    console.log('🎉 Migration completed successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('💥 Unexpected error:', err);
    process.exit(1);
  });
