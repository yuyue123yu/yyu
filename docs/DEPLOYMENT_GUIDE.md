# Deployment Guide

**Version**: 1.0.0
**Target Platform**: Vercel + Supabase

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Migration](#database-migration)
4. [Application Deployment](#application-deployment)
5. [Post-Deployment](#post-deployment)
6. [Monitoring](#monitoring)
7. [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

### Required Accounts

- [ ] Supabase account with project created
- [ ] Vercel account
- [ ] Resend account for email service
- [ ] Domain name (optional, for custom domain)

### Required Tools

- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] Git installed
- [ ] Supabase CLI (optional, for local development)

### Access Requirements

- [ ] Supabase project admin access
- [ ] Vercel project admin access
- [ ] Repository write access
- [ ] DNS management access (if using custom domain)

---

## Environment Setup

### 1. Supabase Configuration

#### Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Enter project details:
   - Name: malai-production
   - Database Password: (generate strong password)
   - Region: (choose closest to users)
4. Wait for project to be created

#### Get Supabase Credentials

1. Go to Project Settings → API
2. Copy the following:
   - Project URL: `https://xxx.supabase.co`
   - Anon/Public Key: `eyJhbGc...`
   - Service Role Key: `eyJhbGc...` (keep secret!)

### 2. Resend Configuration

#### Create Resend Account

1. Go to [Resend](https://resend.com)
2. Sign up for account
3. Verify email address

#### Get API Key

1. Go to API Keys
2. Click "Create API Key"
3. Name: malai-production
4. Copy API key: `re_xxxxx`

#### Add Domain (Optional)

1. Go to Domains
2. Click "Add Domain"
3. Enter your domain: `malai.com`
4. Add DNS records as instructed
5. Verify domain

### 3. Environment Variables

Create `.env.production` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Email Service (Resend)
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@malai.com

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://malai.com

# Optional: Custom Domain
NEXT_PUBLIC_CUSTOM_DOMAIN=malai.com
```

---

## Database Migration

### 1. Backup Existing Database

```bash
# Using Supabase CLI
supabase db dump -f backup-$(date +%Y%m%d).sql

# Or via Supabase Dashboard
# Go to Database → Backups → Create Backup
```

### 2. Run SQL Migrations

Execute SQL files in order via Supabase Dashboard:

1. Go to SQL Editor
2. Create new query
3. Copy content from each file:

```sql
-- 1. Create tenants table
-- Copy from: supabase/001_create_tenants_table.sql
-- Execute

-- 2. Create tenant_settings table
-- Copy from: supabase/002_create_tenant_settings_table.sql
-- Execute

-- 3. Create audit_logs table
-- Copy from: supabase/003_create_audit_logs_table.sql
-- Execute

-- 4. Create system_settings table
-- Copy from: supabase/004_create_system_settings_table.sql
-- Execute

-- 5. Create password_reset_tokens table
-- Copy from: supabase/005_create_password_reset_tokens_table.sql
-- Execute

-- 6. Add tenant columns
-- Copy from: supabase/006_add_tenant_columns.sql
-- Execute

-- 7. Create RLS policies
-- Copy from: supabase/007_create_rls_policies.sql
-- Execute

-- 8. Create helper functions
-- Copy from: supabase/008_create_helper_functions.sql
-- Execute

-- 9. Set tenant_id NOT NULL
-- Copy from: supabase/009_set_tenant_id_not_null.sql
-- Execute
```

### 3. Verify Migration

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check default tenant exists
SELECT * FROM tenants WHERE subdomain = 'default';

-- Check user counts
SELECT tenant_id, COUNT(*) as user_count
FROM profiles
GROUP BY tenant_id;
```

### 4. Create First Super Admin

```sql
-- Update existing user to super admin
UPDATE profiles
SET super_admin = true
WHERE email = 'your-email@example.com';

-- Or create new super admin
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('admin@malai.com', crypt('temporary-password', gen_salt('bf')), now());

INSERT INTO profiles (id, email, super_admin, tenant_id)
SELECT id, email, true, (SELECT id FROM tenants WHERE subdomain = 'default')
FROM auth.users
WHERE email = 'admin@malai.com';
```

---

## Application Deployment

### 1. Prepare Repository

```bash
# Clone repository
git clone https://github.com/your-org/malai.git
cd malai

# Install dependencies
npm install

# Build application
npm run build

# Test build locally
npm run start
```

### 2. Deploy to Vercel

#### Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import Git Repository
4. Select your repository
5. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
6. Add Environment Variables (from `.env.production`)
7. Click "Deploy"

### 3. Configure Environment Variables in Vercel

1. Go to Project Settings → Environment Variables
2. Add each variable:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (mark as sensitive)
   - `RESEND_API_KEY` (mark as sensitive)
   - `EMAIL_FROM`
   - `NODE_ENV` = production
   - `NEXT_PUBLIC_APP_URL`
3. Save changes
4. Redeploy if needed

### 4. Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add domain: `malai.com`
3. Add DNS records as instructed:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (up to 48 hours)
5. Verify domain is active

---

## Post-Deployment

### 1. Verify Deployment

#### Check Application

- [ ] Visit application URL
- [ ] Homepage loads correctly
- [ ] Super admin login page accessible
- [ ] Can log in with super admin account
- [ ] Dashboard displays correctly
- [ ] All navigation links work

#### Check API Endpoints

```bash
# Test health endpoint
curl https://malai.com/api/health

# Test super admin endpoint (with auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://malai.com/api/super-admin/tenants
```

#### Check Database

```sql
-- Verify RLS is working
SELECT * FROM tenants; -- Should work for super admin

-- Check audit logs
SELECT COUNT(*) FROM audit_logs;

-- Verify default tenant
SELECT * FROM tenants WHERE subdomain = 'default';
```

### 2. Configure MFA for Super Admin

1. Log in to super admin panel
2. Go to `/super-admin/mfa-setup`
3. Scan QR code with authenticator app
4. Save backup codes securely
5. Verify MFA code
6. Log out and log in again to test MFA

### 3. Create Test Tenant

1. Go to Tenants → Create New
2. Fill in test tenant information:
   - Name: Test Tenant
   - Subdomain: test
   - Subscription: Free
3. Create admin account
4. Copy activation link
5. Test activation link works
6. Verify tenant appears in list

### 4. Test Email Service

1. Create a test admin account
2. Check email is received
3. Verify email formatting
4. Test activation link
5. Test password reset email

### 5. Configure Monitoring

#### Vercel Analytics

1. Go to Project Settings → Analytics
2. Enable Web Analytics
3. Enable Speed Insights

#### Supabase Monitoring

1. Go to Project Settings → Database
2. Enable Connection Pooling
3. Set up Database Webhooks (optional)

#### Error Tracking (Optional)

Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Datadog for APM

---

## Monitoring

### Application Monitoring

#### Vercel Dashboard

Monitor:
- Deployment status
- Build logs
- Function logs
- Analytics
- Performance metrics

#### Supabase Dashboard

Monitor:
- Database size
- Active connections
- Query performance
- API usage
- Storage usage

### Health Checks

Set up automated health checks:

```bash
# Create health check script
cat > health-check.sh << 'EOF'
#!/bin/bash

# Check application
curl -f https://malai.com/api/health || exit 1

# Check super admin endpoint
curl -f https://malai.com/super-admin/login || exit 1

echo "Health check passed"
EOF

chmod +x health-check.sh

# Run every 5 minutes via cron
*/5 * * * * /path/to/health-check.sh
```

### Alerts

Set up alerts for:
- Application downtime
- High error rates
- Slow response times
- Database connection issues
- High memory usage
- Failed deployments

### Logs

#### View Vercel Logs

```bash
# Install Vercel CLI
npm install -g vercel

# View logs
vercel logs
```

#### View Supabase Logs

1. Go to Supabase Dashboard
2. Click on Logs
3. Filter by:
   - API logs
   - Database logs
   - Auth logs

### Performance Monitoring

Monitor key metrics:
- Page load time (< 2 seconds)
- API response time (< 500ms)
- Database query time (< 100ms)
- Error rate (< 1%)
- Uptime (> 99.9%)

---

## Rollback Procedures

### Application Rollback

#### Via Vercel Dashboard

1. Go to Deployments
2. Find previous working deployment
3. Click "..." menu
4. Click "Promote to Production"
5. Confirm rollback

#### Via Vercel CLI

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### Database Rollback

⚠️ **Warning**: Database rollback is complex and may result in data loss.

#### Restore from Backup

```bash
# Download backup
supabase db dump -f backup.sql

# Restore backup
psql -h db.xxx.supabase.co -U postgres -d postgres -f backup.sql
```

#### Manual Rollback

If you need to undo specific migrations:

```sql
-- Drop tables in reverse order
DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS tenant_settings CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;

-- Remove columns from existing tables
ALTER TABLE profiles DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE profiles DROP COLUMN IF EXISTS super_admin;
-- Repeat for other tables
```

### Emergency Procedures

#### Enable Maintenance Mode

```sql
-- Via SQL
INSERT INTO system_settings (key, value)
VALUES ('maintenance_mode', 'true')
ON CONFLICT (key) DO UPDATE SET value = 'true';
```

Or via Super Admin Panel:
1. Log in to super admin panel
2. Go to Settings
3. Enable Maintenance Mode

#### Disable All Access

```sql
-- Disable all RLS policies temporarily
ALTER TABLE tenants DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- Repeat for other tables

-- Re-enable after fix
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

---

## Troubleshooting

### Deployment Fails

**Problem**: Vercel deployment fails

**Solutions**:
1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Test build locally: `npm run build`
4. Check for TypeScript errors
5. Verify dependencies are installed

### Database Connection Issues

**Problem**: Cannot connect to database

**Solutions**:
1. Check Supabase project status
2. Verify connection string
3. Check IP whitelist (if enabled)
4. Test connection with psql
5. Check connection pooling settings

### Email Not Sending

**Problem**: Emails not being sent

**Solutions**:
1. Verify Resend API key
2. Check domain verification
3. Review Resend dashboard for errors
4. Check email logs
5. Verify EMAIL_FROM address

### RLS Policy Issues

**Problem**: Users cannot access data

**Solutions**:
1. Check RLS policies are enabled
2. Verify super_admin flag is set
3. Check tenant_id is set correctly
4. Review policy conditions
5. Test with RLS disabled temporarily

---

## Security Checklist

- [ ] All environment variables are set
- [ ] Service role key is kept secret
- [ ] HTTPS is enforced
- [ ] RLS policies are enabled
- [ ] MFA is enabled for all super admins
- [ ] Strong passwords are used
- [ ] Backup codes are stored securely
- [ ] Regular backups are configured
- [ ] Monitoring is set up
- [ ] Error tracking is configured
- [ ] Rate limiting is enabled
- [ ] CORS is configured correctly
- [ ] Security headers are set

---

## Maintenance Schedule

### Daily

- [ ] Check application health
- [ ] Review error logs
- [ ] Monitor performance metrics

### Weekly

- [ ] Review audit logs
- [ ] Check database size
- [ ] Verify backups
- [ ] Review security alerts

### Monthly

- [ ] Update dependencies
- [ ] Review and optimize queries
- [ ] Clean up old audit logs
- [ ] Review user access

### Quarterly

- [ ] Security audit
- [ ] Performance review
- [ ] Capacity planning
- [ ] Documentation update

---

## Support Contacts

### Technical Support

- **Email**: support@malai.com
- **Phone**: +60-XXX-XXXX
- **Hours**: 24/7

### Emergency Contacts

- **On-Call Engineer**: +60-XXX-XXXX
- **Database Admin**: +60-XXX-XXXX
- **Security Team**: security@malai.com

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Resend Documentation](https://resend.com/docs)

---

*Last Updated: Current Session*
*Version: 1.0.0*
