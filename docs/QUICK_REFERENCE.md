# Quick Reference Guide

**Version**: 1.0.0
**For**: Super Administrators

---

## 🚀 Quick Start

### Login
1. Go to `/super-admin/login`
2. Enter email + password
3. Enter MFA code
4. Access dashboard

### First Time Setup
1. Enable MFA → `/super-admin/mfa-setup`
2. Save backup codes
3. Create first tenant
4. Review system settings

---

## 📋 Common Tasks

### Create Tenant
```
Tenants → Create New → Fill 4 steps → Create
```

### Create Admin
```
Admins → Create Admin → Fill form → Copy activation link
```

### Migrate User
```
Users → Select user → Migrate Tenant → Choose tenant → Confirm
```

### View Audit Logs
```
Audit Logs → Apply filters → View/Export
```

### Toggle Maintenance Mode
```
Settings → Maintenance Mode → Enable/Disable
```

---

## 🔑 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Search |
| `Ctrl/Cmd + /` | Show shortcuts |
| `Esc` | Close modal |
| `Ctrl/Cmd + S` | Save |

---

## 🔐 Security

### MFA Setup
```
Settings → Security → Enable MFA → Scan QR → Verify
```

### Password Requirements
- 16+ characters
- Uppercase + lowercase
- Numbers + special chars

### Session Timeouts
- Inactivity: 15 minutes
- Absolute: 8 hours

---

## 📊 API Endpoints

### Tenants
```
GET    /api/super-admin/tenants
POST   /api/super-admin/tenants
GET    /api/super-admin/tenants/:id
PATCH  /api/super-admin/tenants/:id
DELETE /api/super-admin/tenants/:id
```

### Users
```
GET    /api/super-admin/users
GET    /api/super-admin/users/:id
PATCH  /api/super-admin/users/:id
POST   /api/super-admin/users/:id/migrate
POST   /api/super-admin/users/:id/impersonate
```

### Audit Logs
```
GET /api/super-admin/audit-logs
GET /api/super-admin/audit-logs/export
```

---

## 🗄️ Database

### Key Tables
- `tenants` - Tenant information
- `tenant_settings` - OEM configuration
- `audit_logs` - Action logs
- `system_settings` - System config
- `password_reset_tokens` - Reset tokens

### Helper Functions
```sql
get_tenant_id()        -- Get current tenant
is_super_admin()       -- Check super admin
log_audit_event()      -- Log action
```

---

## 🎨 Status Values

### Tenant Status
- `active` - Active
- `inactive` - Inactive
- `suspended` - Suspended

### Subscription Plans
- `free` - Free
- `basic` - Basic
- `pro` - Professional
- `enterprise` - Enterprise

### User Types
- `client` - Regular user
- `lawyer` - Lawyer
- `admin` - Tenant admin

---

## 📧 Email Templates

1. **Tenant Admin Welcome** - Activation link
2. **Password Reset** - Reset link
3. **User Migration** - Migration notice
4. **MFA Enabled** - Security confirmation

---

## 🔍 Filters

### Tenant Filters
- Status
- Subscription plan
- Search (name/subdomain)

### User Filters
- Tenant
- User type
- Search (email/name/phone)

### Audit Log Filters
- Date range
- Action type
- Entity type
- Tenant
- Search

---

## 📤 Export Formats

### CSV
- Spreadsheet compatible
- All fields included
- UTF-8 encoding

### JSON
- Programmatic access
- Nested data preserved
- Pretty formatted

---

## ⚠️ Common Issues

### Cannot Login
- Check credentials
- Verify MFA code is current
- Try backup code

### MFA Not Working
- Wait for code refresh (30s)
- Check device time sync
- Use backup code

### No Data Visible
- Clear filters
- Check super_admin flag
- Review RLS policies

### Export Fails
- Reduce date range
- Try different format
- Check browser console

---

## 🛠️ Troubleshooting

### Check Super Admin Status
```sql
SELECT super_admin FROM profiles WHERE email = 'your@email.com';
```

### Verify Tenant Context
```sql
SELECT get_tenant_id();
```

### Check RLS Policies
```sql
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### View Recent Audit Logs
```sql
SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10;
```

---

## 📞 Support

### Contact
- **Email**: support@malai.com
- **Phone**: +60-XXX-XXXX
- **Emergency**: +60-XXX-XXXX

### Documentation
- User Guide: `/docs/USER_GUIDE.md`
- API Docs: `/docs/API_DOCUMENTATION.md`
- Database: `/docs/DATABASE_SCHEMA.md`
- Deployment: `/docs/DEPLOYMENT_GUIDE.md`

---

## 🔗 Quick Links

### Dashboard
```
/super-admin
```

### Management
```
/super-admin/tenants
/super-admin/users
/super-admin/admins
```

### System
```
/super-admin/audit-logs
/super-admin/settings
```

### Security
```
/super-admin/mfa-setup
/super-admin/login
```

---

## 💡 Best Practices

1. ✅ Enable MFA immediately
2. ✅ Use strong passwords
3. ✅ Store backup codes securely
4. ✅ Log out when finished
5. ✅ Review audit logs regularly
6. ✅ Use impersonation sparingly
7. ✅ Keep browser updated
8. ✅ Don't share credentials

---

## 📈 Monitoring

### Key Metrics
- Total tenants
- Total users
- System health
- Error rate
- Response time

### Health Check
```bash
curl https://malai.com/api/health
```

---

## 🔄 Regular Tasks

### Daily
- Check system health
- Review error logs

### Weekly
- Review audit logs
- Check database size

### Monthly
- Update dependencies
- Optimize queries

---

*Last Updated: Current Session*
*Version: 1.0.0*
