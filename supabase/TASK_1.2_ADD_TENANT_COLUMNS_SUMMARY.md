# Task 1.2: Add Tenant Columns - Migration Summary

## Overview
This migration adds multi-tenant support to the LegalMY platform by adding `tenant_id` and `super_admin` columns to existing tables.

## Migration File
**File**: `supabase/006_add_tenant_columns.sql`

## What This Migration Does

### 1. Creates Default Tenant
- Checks if a default tenant exists (subdomain: 'default')
- Creates one if it doesn't exist
- All existing data will be assigned to this default tenant

### 2. Modifies Profiles Table
- Adds `tenant_id` column (UUID, references tenants.id)
- Adds `super_admin` column (BOOLEAN, default false)
- Creates indexes for performance
- Migrates existing profiles to default tenant

### 3. Adds tenant_id to Multi-Tenant Tables
The following tables receive the `tenant_id` column:
- ✅ lawyers
- ✅ consultations
- ✅ orders
- ✅ reviews
- ✅ templates
- ✅ articles
- ✅ favorites
- ✅ cart
- ✅ services

### 4. Foreign Key Constraints
All `tenant_id` columns have:
- Foreign key reference to `tenants(id)`
- `ON DELETE CASCADE` behavior
- Proper indexing for query performance

### 5. Indexes Created
Performance indexes on all tenant_id columns:
- `idx_profiles_tenant`
- `idx_profiles_super_admin` (partial index for super_admin = true)
- `idx_lawyers_tenant`
- `idx_consultations_tenant`
- `idx_orders_tenant`
- `idx_reviews_tenant`
- `idx_templates_tenant`
- `idx_articles_tenant`
- `idx_favorites_tenant`
- `idx_cart_tenant`
- `idx_services_tenant`

## Safety Features

### Idempotent Operations
- Uses `ADD COLUMN IF NOT EXISTS` to avoid conflicts
- Uses `DROP CONSTRAINT IF EXISTS` before adding constraints
- Uses `DROP INDEX IF EXISTS` before creating indexes
- Safe to run multiple times

### Data Preservation
- Existing data is preserved
- All existing records are migrated to the default tenant
- No data loss occurs during migration

### Validation
- Comprehensive validation at the end
- Checks all columns were added successfully
- Reports any missing columns
- Provides clear success/failure messages

## Prerequisites
- The `tenants` table must exist (run `001_create_tenants_table.sql` first)
- The `uuid-ossp` extension must be enabled

## How to Run

### Option 1: Supabase Dashboard
1. Go to Supabase Dashboard → SQL Editor
2. Copy the contents of `006_add_tenant_columns.sql`
3. Paste and run the migration
4. Check the output for success messages

### Option 2: Supabase CLI
```bash
supabase db push
```

### Option 3: psql Command Line
```bash
psql -h your-db-host -U postgres -d your-database -f supabase/006_add_tenant_columns.sql
```

## Expected Output
When successful, you should see:
```
NOTICE:  Created default tenant with id: [UUID]
NOTICE:  Profiles table updated with tenant_id and super_admin columns
NOTICE:  Updated existing profiles with default tenant_id
NOTICE:  Lawyers table updated with tenant_id column
NOTICE:  Updated existing lawyers with default tenant_id
... (similar messages for all tables)
NOTICE:  ✓ All tenant_id and super_admin columns added successfully
NOTICE:  ✓ All foreign key constraints created
NOTICE:  ✓ All indexes created
NOTICE:  ✓ Existing data migrated to default tenant
NOTICE:  Migration 006_add_tenant_columns completed successfully!
```

## Verification Queries

After running the migration, verify with these queries:

### Check Profiles Table
```sql
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' 
  AND column_name IN ('tenant_id', 'super_admin');
```

### Check All Tenant Columns
```sql
SELECT 
  table_name,
  column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name = 'tenant_id'
ORDER BY table_name;
```

### Check Indexes
```sql
SELECT 
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE '%tenant%'
ORDER BY tablename;
```

### Check Foreign Keys
```sql
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND kcu.column_name = 'tenant_id'
ORDER BY tc.table_name;
```

### Check Default Tenant
```sql
SELECT 
  id,
  name,
  subdomain,
  status,
  metadata
FROM public.tenants
WHERE subdomain = 'default';
```

## Rollback (If Needed)

If you need to rollback this migration:

```sql
-- Remove tenant_id columns
ALTER TABLE public.profiles DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS super_admin;
ALTER TABLE public.lawyers DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE public.consultations DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE public.orders DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE public.reviews DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE public.templates DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE public.articles DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE public.favorites DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE public.cart DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE public.services DROP COLUMN IF EXISTS tenant_id;

-- Indexes will be automatically dropped with the columns
```

## Next Steps

After this migration:
1. ✅ Task 1.2 is complete
2. Next: Task 1.3 - Update RLS policies for tenant scoping
3. Then: Task 1.4 - Create super admin helper functions

## Task Completion Checklist

- [x] 1.2.1 Add tenant_id column to profiles table
- [x] 1.2.2 Add super_admin column to profiles table
- [x] 1.2.3 Add tenant_id to lawyers, consultations, orders tables
- [x] 1.2.4 Add tenant_id to reviews, templates, articles tables
- [x] 1.2.5 Add tenant_id to favorites, cart, services tables
- [x] 1.2.6 Create indexes on all tenant_id columns

## Requirements Satisfied
- ✅ Requirement 7: Data Isolation and Tenant Scoping
- ✅ All tables have tenant_id column
- ✅ Profiles table has super_admin column
- ✅ All indexes created successfully
- ✅ Existing data is preserved
- ✅ Foreign key constraints added

## Notes
- The migration is **idempotent** - safe to run multiple times
- All existing data is migrated to a "default" tenant
- The `tenant_id` columns initially allow NULL but are populated with default tenant
- Future migrations will add NOT NULL constraints after data migration is complete
- The super_admin column defaults to false for all existing users
