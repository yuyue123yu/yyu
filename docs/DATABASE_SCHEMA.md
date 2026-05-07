# Database Schema Documentation

**Version**: 1.0.0
**Last Updated**: Current Session

---

## Overview

The Super Admin System uses a multi-tenant PostgreSQL database architecture with Row-Level Security (RLS) policies for data isolation. All tables include tenant_id columns (except system-wide tables) to ensure proper data segregation.

---

## Tables

### 1. tenants

**Purpose**: Store tenant (organization) information

**Columns**:
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | uuid_generate_v4() | Primary key |
| name | text | NO | - | Tenant name |
| subdomain | text | NO | - | Unique subdomain |
| domain | text | YES | NULL | Custom domain |
| status | text | NO | 'active' | Status: active, inactive, suspended |
| subscription_plan | text | NO | 'free' | Plan: free, basic, pro, enterprise |
| subscription_status | text | NO | 'active' | Subscription status |
| user_count | integer | NO | 0 | Number of users |
| created_at | timestamptz | NO | now() | Creation timestamp |
| updated_at | timestamptz | NO | now() | Last update timestamp |

**Indexes**:
- PRIMARY KEY: id
- UNIQUE: subdomain
- UNIQUE: domain (where domain IS NOT NULL)
- INDEX: status
- INDEX: subscription_plan

**RLS Policies**:
- Super admins: Full access
- Regular users: No access

---

### 2. tenant_settings

**Purpose**: Store OEM configuration for each tenant

**Columns**:
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | uuid_generate_v4() | Primary key |
| tenant_id | uuid | NO | - | Foreign key to tenants |
| key | text | NO | - | Setting key |
| value | text | YES | NULL | Setting value (JSON) |
| created_at | timestamptz | NO | now() | Creation timestamp |
| updated_at | timestamptz | NO | now() | Last update timestamp |

**Indexes**:
- PRIMARY KEY: id
- UNIQUE: (tenant_id, key)
- INDEX: tenant_id
- FOREIGN KEY: tenant_id → tenants(id) ON DELETE CASCADE

**RLS Policies**:
- Super admins: Full access
- Tenant admins: Read access for own tenant

**Common Settings**:
- `branding_primary_color`: Primary brand color
- `branding_secondary_color`: Secondary brand color
- `branding_logo_url`: Logo URL
- `features_consultations`: Enable consultations
- `features_orders`: Enable orders
- `features_reviews`: Enable reviews
- `language`: Default language (en, zh, ms)

---

### 3. audit_logs

**Purpose**: Immutable log of all super admin actions

**Columns**:
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | uuid_generate_v4() | Primary key |
| action_type | text | NO | - | Action type (e.g., tenant.create) |
| target_entity | text | NO | - | Target entity type |
| target_id | text | YES | NULL | Target entity ID |
| user_id | uuid | YES | NULL | User who performed action |
| tenant_id | uuid | YES | NULL | Related tenant ID |
| ip_address | text | YES | NULL | IP address |
| user_agent | text | YES | NULL | User agent string |
| changes | jsonb | YES | NULL | Changes made (before/after) |
| created_at | timestamptz | NO | now() | Action timestamp |

**Indexes**:
- PRIMARY KEY: id
- INDEX: action_type
- INDEX: target_entity
- INDEX: user_id
- INDEX: tenant_id
- INDEX: created_at (DESC)

**RLS Policies**:
- Super admins: Read-only access
- Regular users: No access
- INSERT: Allowed for all authenticated users
- UPDATE/DELETE: Denied for all users (immutable)

**Common Action Types**:
- `tenant.create`, `tenant.update`, `tenant.delete`
- `tenant.activate`, `tenant.deactivate`
- `user.create`, `user.update`, `user.delete`
- `user.migrate`, `user.impersonate`, `user.deactivate`
- `admin.create`, `admin.reassign`, `admin.revoke`
- `password.reset`, `mfa.enabled`, `mfa.login_success`
- `settings.update`, `audit_logs.export`

---

### 4. system_settings

**Purpose**: Store system-wide settings

**Columns**:
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | uuid_generate_v4() | Primary key |
| key | text | NO | - | Setting key |
| value | text | YES | NULL | Setting value |
| description | text | YES | NULL | Setting description |
| created_at | timestamptz | NO | now() | Creation timestamp |
| updated_at | timestamptz | NO | now() | Last update timestamp |

**Indexes**:
- PRIMARY KEY: id
- UNIQUE: key

**RLS Policies**:
- Super admins: Full access
- Regular users: No access

**Common Settings**:
- `maintenance_mode`: true/false
- `feature_multi_tenancy`: true/false
- `feature_user_impersonation`: true/false
- `feature_audit_logging`: true/false
- `feature_analytics`: true/false
- `feature_password_reset`: true/false
- `rate_limit_per_minute`: 60
- `rate_limit_per_hour`: 1000
- `rate_limit_per_day`: 10000
- `default_oem_config`: JSON string

---

### 5. password_reset_tokens

**Purpose**: Store password reset tokens

**Columns**:
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | uuid_generate_v4() | Primary key |
| user_id | uuid | NO | - | Foreign key to profiles |
| token | text | NO | - | 256-bit token (hex) |
| expires_at | timestamptz | NO | - | Expiration timestamp |
| used | boolean | NO | false | Whether token was used |
| used_at | timestamptz | YES | NULL | When token was used |
| ip_address | text | YES | NULL | Requester IP address |
| created_at | timestamptz | NO | now() | Creation timestamp |

**Indexes**:
- PRIMARY KEY: id
- UNIQUE: token
- INDEX: user_id
- INDEX: expires_at
- FOREIGN KEY: user_id → profiles(id) ON DELETE CASCADE

**RLS Policies**:
- Super admins: Full access
- Regular users: No access

**Token Properties**:
- Length: 64 characters (256 bits)
- Format: Hexadecimal
- Expiration: 24 hours
- Single-use: Yes

---

### 6. profiles (Modified)

**Purpose**: User profiles (existing table, modified for multi-tenancy)

**New Columns Added**:
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| tenant_id | uuid | NO | - | Foreign key to tenants |
| super_admin | boolean | NO | false | Super admin flag |
| mfa_enabled | boolean | NO | false | MFA enabled flag |

**Indexes Added**:
- INDEX: tenant_id
- INDEX: super_admin
- FOREIGN KEY: tenant_id → tenants(id) ON DELETE RESTRICT

**RLS Policies Updated**:
- Super admins: Full access (bypass RLS)
- Tenant users: Access only to own tenant data

---

### 7. Other Tables (Modified)

The following existing tables were modified to add tenant_id:
- lawyers
- consultations
- orders
- reviews
- templates
- articles
- favorites
- cart
- services

**Changes**:
- Added `tenant_id uuid NOT NULL` column
- Added INDEX on tenant_id
- Added FOREIGN KEY to tenants(id)
- Updated RLS policies to filter by tenant_id

---

## Helper Functions

### 1. get_tenant_id()

**Purpose**: Get current tenant ID from session

**Returns**: uuid

**Usage**:
```sql
SELECT get_tenant_id();
```

---

### 2. is_super_admin()

**Purpose**: Check if current user is super admin

**Returns**: boolean

**Usage**:
```sql
SELECT is_super_admin();
```

---

### 3. log_audit_event()

**Purpose**: Log an audit event (called by triggers)

**Parameters**:
- action_type: text
- target_entity: text
- target_id: text
- changes: jsonb

**Returns**: void

---

### 4. update_tenant_user_count()

**Purpose**: Update tenant user count (trigger function)

**Returns**: trigger

**Triggered On**: INSERT, UPDATE, DELETE on profiles

---

## Row-Level Security (RLS)

### Policy Types

1. **Super Admin Bypass**
   - Condition: `is_super_admin() = true`
   - Access: Full access to all data

2. **Tenant Isolation**
   - Condition: `tenant_id = get_tenant_id()`
   - Access: Only own tenant data

3. **Immutable Audit Logs**
   - INSERT: Allowed
   - UPDATE/DELETE: Denied

### Policy Naming Convention

- `{table}_super_admin_all` - Super admin full access
- `{table}_tenant_select` - Tenant read access
- `{table}_tenant_insert` - Tenant insert access
- `{table}_tenant_update` - Tenant update access
- `{table}_tenant_delete` - Tenant delete access

---

## Migration Order

Execute SQL files in this order:

1. `001_create_tenants_table.sql`
2. `002_create_tenant_settings_table.sql`
3. `003_create_audit_logs_table.sql`
4. `004_create_system_settings_table.sql`
5. `005_create_password_reset_tokens_table.sql`
6. `006_add_tenant_columns.sql`
7. `007_create_rls_policies.sql`
8. `008_create_helper_functions.sql`
9. `009_set_tenant_id_not_null.sql`

---

## Data Migration

### Default Tenant

A default tenant is automatically created:
- Name: "Default Tenant"
- Subdomain: "default"
- Status: "active"

### Existing Data

All existing data is migrated to the default tenant:
- All profiles assigned to default tenant
- All related data (lawyers, consultations, etc.) assigned to default tenant

---

## Performance Considerations

### Indexes

All tenant_id columns are indexed for fast filtering:
```sql
CREATE INDEX idx_{table}_tenant_id ON {table}(tenant_id);
```

### Query Optimization

Always include tenant_id in WHERE clauses:
```sql
SELECT * FROM profiles WHERE tenant_id = get_tenant_id();
```

### RLS Performance

RLS policies are optimized to use indexes:
- Super admin check is fast (single boolean)
- Tenant ID comparison uses index

---

## Backup & Recovery

### Backup Strategy

1. **Full Backup**: Daily at 2 AM UTC
2. **Incremental Backup**: Every 6 hours
3. **Retention**: 30 days

### Recovery Procedures

1. Restore from latest backup
2. Replay transaction logs
3. Verify data integrity
4. Update tenant user counts

---

## Monitoring

### Key Metrics

- Table sizes
- Index usage
- Query performance
- RLS policy hits
- Audit log growth rate

### Alerts

- Table size > 80% of limit
- Slow queries > 1 second
- Failed RLS policy checks
- Audit log export failures

---

## Security

### Access Control

- Super admins: Full database access
- Tenant admins: Limited to own tenant
- Regular users: Limited to own data

### Encryption

- At rest: Supabase encryption
- In transit: TLS 1.3
- Sensitive fields: Application-level encryption

### Audit Trail

All changes logged in audit_logs table:
- Who made the change
- What was changed
- When it was changed
- From where (IP address)

---

## Maintenance

### Regular Tasks

- **Daily**: Backup verification
- **Weekly**: Index maintenance
- **Monthly**: Vacuum and analyze
- **Quarterly**: Performance review

### Cleanup Tasks

- Delete expired password reset tokens
- Archive old audit logs (> 1 year)
- Remove inactive tenants (> 6 months)

---

## Troubleshooting

### Common Issues

1. **RLS Policy Denials**
   - Check super_admin flag
   - Verify tenant_id is set
   - Review policy conditions

2. **Slow Queries**
   - Check index usage
   - Analyze query plan
   - Consider adding indexes

3. **Data Isolation Issues**
   - Verify RLS policies
   - Check tenant_id values
   - Review helper functions

---

## References

- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Multi-Tenant Architecture Best Practices](https://docs.microsoft.com/en-us/azure/architecture/guide/multitenant/overview)

---

*Last Updated: Current Session*
*Version: 1.0.0*
