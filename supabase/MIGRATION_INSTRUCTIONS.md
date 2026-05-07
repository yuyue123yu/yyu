# Tenants Table Migration Instructions

## Overview
This migration creates the `tenants` table for the Super Admin System, enabling multi-tenant management capabilities.

## Migration File
- **File**: `supabase/001_create_tenants_table.sql`
- **Task**: 1.1.1 - Create tenants table with indexes
- **Requirements**: Req 1, 2, 7, 8, 9

## What This Migration Creates

### 1. Tenants Table
- **id**: UUID primary key
- **name**: Tenant organization name
- **subdomain**: Unique subdomain (e.g., client1.legalmy.com)
- **primary_domain**: Optional custom domain
- **status**: active | inactive | suspended
- **subscription_plan**: free | basic | premium | enterprise
- **subscription_start_date** & **subscription_end_date**: Subscription period
- **created_at**, **updated_at**: Audit timestamps
- **created_by**: Reference to super admin who created the tenant
- **user_count**: Cached user count
- **metadata**: JSONB for flexible configuration

### 2. Indexes
- `idx_tenants_subdomain`: For subdomain lookups (most common)
- `idx_tenants_status`: For filtering by status
- `idx_tenants_subscription_plan`: For subscription queries
- `idx_tenants_status_subscription`: Composite index for combined queries
- `idx_tenants_created_by`: For audit queries

### 3. Row-Level Security (RLS)
- Enables RLS on the tenants table
- Temporary policy allowing service role access
- **Note**: Super admin policies will be added in a later migration after the `super_admin` column is added to the `profiles` table

### 4. Triggers
- `update_tenants_updated_at`: Automatically updates `updated_at` timestamp

## How to Execute This Migration

### Method 1: Supabase Dashboard (Recommended) ✅

1. **Open the SQL Editor**
   - Go to: https://supabase.com/dashboard/project/ovtrvzbftinsfwytzgwy/sql/new

2. **Copy the SQL**
   - Open `supabase/001_create_tenants_table.sql`
   - Copy all contents (Ctrl+A, Ctrl+C)

3. **Paste and Execute**
   - Paste into the SQL Editor
   - Click the "Run" button (or press Ctrl+Enter)

4. **Verify Success**
   - You should see "Success. No rows returned"
   - Check the Tables section to see the new `tenants` table

### Method 2: Using psql (Advanced)

If you have PostgreSQL client installed:

```bash
# Get your connection string from Supabase Dashboard:
# Settings → Database → Connection string (URI format)

psql "your-connection-string-here" < supabase/001_create_tenants_table.sql
```

### Method 3: Using Node.js Script

We've provided helper scripts, but they have limitations due to Supabase client restrictions:

```bash
# Check if table exists
node scripts/execute-tenants-migration.js

# This will guide you to execute manually
node scripts/apply-migration.js
```

## Verification

After executing the migration, verify it worked:

### Using Supabase Dashboard
1. Go to Table Editor
2. Look for `tenants` table in the list
3. Click on it to see the schema

### Using SQL Editor
Run this query:
```sql
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'tenants'
  AND table_schema = 'public'
ORDER BY ordinal_position;
```

### Using Node.js
```bash
node scripts/execute-tenants-migration.js
```

Should show: "✅ Tenants table already exists!"

## Troubleshooting

### Error: "relation already exists"
- The table is already created. No action needed.
- Run verification steps to confirm.

### Error: "function update_updated_at_column() does not exist"
- This function should exist from the base schema
- If not, run `supabase/schema.sql` first

### Error: "permission denied"
- Make sure you're using the service role key
- Or execute through the Supabase Dashboard (which has full permissions)

### Error: "column super_admin does not exist"
- This is expected! The RLS policies in this migration use a temporary policy
- Super admin-specific policies will be added in a later migration

## Next Steps

After this migration is complete:

1. **Task 1.1.2**: Add `tenant_id` and `super_admin` columns to `profiles` table
2. **Task 1.1.3**: Update RLS policies to use `super_admin` flag
3. **Task 1.2**: Create `tenant_settings` table
4. **Task 1.3**: Create `audit_logs` table

## Rollback

If you need to rollback this migration:

```sql
-- Drop the table (this will cascade to dependent objects)
DROP TABLE IF EXISTS public.tenants CASCADE;
```

**Warning**: This will permanently delete all tenant data!

## Support

If you encounter issues:
1. Check the Supabase Dashboard logs
2. Verify your database connection
3. Ensure you have the necessary permissions
4. Review the SQL file for syntax errors

## Migration Status

- [ ] Migration file created
- [ ] Migration executed
- [ ] Table verified in database
- [ ] Indexes confirmed
- [ ] RLS policies active
- [ ] Ready for next migration
