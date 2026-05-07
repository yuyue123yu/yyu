# 🚀 Execute Tenants Table Migration

## Quick Start (2 Minutes)

### Step 1: Open Supabase SQL Editor
Click this link or copy to your browser:
```
https://supabase.com/dashboard/project/ovtrvzbftinsfwytzgwy/sql/new
```

### Step 2: Copy the SQL
The SQL migration is in: `supabase/001_create_tenants_table.sql`

**OR** use one of these pre-copied files:
- `TENANTS_MIGRATION_SQL.txt`
- `EXECUTE_THIS_SQL.sql`

### Step 3: Paste and Run
1. Paste the SQL into the editor
2. Click the **"Run"** button (or press Ctrl+Enter)
3. Wait for "Success. No rows returned" message

### Step 4: Verify
Run this verification script:
```bash
node scripts/execute-tenants-migration.js
```

Should show: ✅ Tenants table already exists!

---

## What This Creates

### Tenants Table
A complete multi-tenant management table with:
- **12 columns** for tenant data
- **5 indexes** for performance
- **Row-Level Security** enabled
- **Automatic timestamps** via triggers
- **Data validation** via CHECK constraints

### Key Features
- ✅ Unique subdomains for each tenant
- ✅ Optional custom domains
- ✅ Subscription management (free/basic/premium/enterprise)
- ✅ Status tracking (active/inactive/suspended)
- ✅ Flexible metadata storage (JSONB)
- ✅ Audit trail (created_by, created_at, updated_at)
- ✅ User count tracking

---

## The SQL (Preview)

```sql
CREATE TABLE public.tenants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,
  primary_domain TEXT UNIQUE,
  status TEXT DEFAULT 'active' NOT NULL 
    CHECK (status IN ('active', 'inactive', 'suspended')),
  subscription_plan TEXT DEFAULT 'free' NOT NULL 
    CHECK (subscription_plan IN ('free', 'basic', 'premium', 'enterprise')),
  -- ... more columns ...
);

-- Plus indexes, RLS policies, triggers, and comments
```

Full SQL is in: `supabase/001_create_tenants_table.sql` (5KB, ~150 lines)

---

## After Execution

Once the migration is executed, you can:

### 1. View the Table
- Go to Supabase Dashboard → Table Editor
- Find `tenants` in the list
- Explore the schema

### 2. Insert Test Data
```sql
INSERT INTO public.tenants (name, subdomain, status, subscription_plan)
VALUES ('Test Tenant', 'test', 'active', 'free');
```

### 3. Query Tenants
```sql
SELECT id, name, subdomain, status, subscription_plan
FROM public.tenants;
```

### 4. Continue with Next Tasks
- Task 1.1.2: Add tenant_id and super_admin to profiles
- Task 1.2: Create tenant_settings table
- Task 1.3: Create audit_logs table

---

## Need Help?

### Detailed Instructions
See: `supabase/MIGRATION_INSTRUCTIONS.md`

### Troubleshooting
See: `TASK_1.1.1_SUMMARY.md`

### Verification
```bash
node scripts/execute-tenants-migration.js
```

---

## Why Manual Execution?

The Supabase JavaScript client doesn't support executing arbitrary SQL for security reasons. The Dashboard SQL Editor is the recommended method and provides:
- ✅ Full SQL capabilities
- ✅ Syntax validation
- ✅ Error reporting
- ✅ Transaction management
- ✅ Audit logging

---

## Ready to Execute?

1. Open: https://supabase.com/dashboard/project/ovtrvzbftinsfwytzgwy/sql/new
2. Copy SQL from: `supabase/001_create_tenants_table.sql`
3. Paste and click "Run"
4. Verify with: `node scripts/execute-tenants-migration.js`

**That's it!** 🎉

The tenants table will be ready for the Super Admin System.
