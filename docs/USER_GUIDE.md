# Super Admin Panel - User Guide

**Version**: 1.0.0
**Audience**: Super Administrators

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard](#dashboard)
3. [Tenant Management](#tenant-management)
4. [User Management](#user-management)
5. [Admin Management](#admin-management)
6. [Audit Logs](#audit-logs)
7. [System Settings](#system-settings)
8. [Security](#security)
9. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing the Super Admin Panel

1. Navigate to `/super-admin/login`
2. Enter your super admin email and password
3. Enter your 6-digit MFA code from your authenticator app
4. Click "Sign In"

### First-Time Setup

If this is your first time logging in:

1. **Enable MFA** (Required)
   - Go to Settings → Security
   - Click "Enable MFA"
   - Scan the QR code with your authenticator app
   - Save your backup codes in a secure location
   - Enter a verification code to confirm

2. **Review System Settings**
   - Check maintenance mode status
   - Review feature flags
   - Verify rate limits

3. **Create First Tenant** (if needed)
   - Go to Tenants → Create New
   - Follow the 4-step wizard

---

## Dashboard

The dashboard provides an overview of your system.

### Key Metrics

- **Total Tenants**: Number of active tenants
- **Total Users**: Number of users across all tenants
- **Total Consultations**: Number of consultations
- **System Health**: Overall system status

### Quick Actions

- **Create Tenant**: Start tenant creation wizard
- **View Audit Logs**: Access recent activity
- **System Settings**: Manage system configuration
- **User Management**: Access user management

### Recent Activity

View the latest super admin actions:
- Tenant creations
- User migrations
- System changes

---

## Tenant Management

### Viewing Tenants

1. Click "Tenants" in the sidebar
2. Use filters to find specific tenants:
   - **Status**: Active, Inactive, Suspended
   - **Subscription Plan**: Free, Basic, Pro, Enterprise
   - **Search**: By name or subdomain

### Creating a Tenant

1. Click "Create Tenant" button
2. **Step 1: Basic Information**
   - Enter tenant name
   - Choose subdomain (must be unique)
   - Optionally add custom domain
   - Select subscription plan

3. **Step 2: OEM Configuration**
   - Set primary and secondary brand colors
   - Upload logo (optional)
   - Enable/disable features:
     - Consultations
     - Orders
     - Reviews
   - Select default language

4. **Step 3: Admin Account**
   - Enter admin email
   - Enter admin full name
   - Enter admin phone (optional)
   - System will generate activation link

5. **Step 4: Review & Confirm**
   - Review all information
   - Click "Create Tenant"
   - Copy activation link to send to admin

### Editing a Tenant

1. Click on a tenant card or name
2. Click "Edit" button
3. Modify fields as needed
4. Click "Save Changes"

### OEM Configuration

Customize the tenant's branding and features:

1. Go to tenant details
2. Click "Settings" tab
3. **Branding**:
   - Primary Color: Main brand color
   - Secondary Color: Accent color
   - Logo URL: Link to logo image

4. **Features**:
   - Toggle features on/off
   - Changes apply immediately

5. **Language**:
   - Select default language
   - Options: English, Chinese, Malay

6. **Business Rules**:
   - Configure tenant-specific rules
   - Set limits and quotas

### Activating/Deactivating Tenants

**To Deactivate**:
1. Go to tenant details
2. Click "Deactivate" button
3. Confirm action
4. Users will no longer be able to access

**To Activate**:
1. Go to tenant details
2. Click "Activate" button
3. Confirm action
4. Users can access again

### Deleting a Tenant

⚠️ **Warning**: This action archives the tenant and all related data.

1. Go to tenant details
2. Click "Delete" button
3. Type tenant name to confirm
4. Click "Confirm Delete"
5. Data is archived (not permanently deleted)

---

## User Management

### Viewing Users

1. Click "Users" in the sidebar
2. Use filters to find users:
   - **Tenant**: Filter by specific tenant
   - **User Type**: Client, Lawyer, Admin
   - **Search**: By email, name, or phone

### User Details

Click on a user to view:
- Personal information
- Tenant assignment
- User type
- Account status
- Activity statistics (consultations, orders)

### Editing Users

1. Go to user details
2. Click "Edit User" button
3. Modify:
   - Full name
   - Phone number
   - User type
4. Click "Save Changes"

### Migrating Users

Move a user to a different tenant:

1. Go to user details
2. Click "Migrate Tenant" button
3. Select target tenant
4. Review impact preview:
   - User will be moved
   - All data will be migrated
   - User will receive notification email
5. Click "Migrate User"
6. Confirm action

### Impersonating Users

Temporarily access the system as a user:

1. Go to user details
2. Click "Impersonate" button
3. Confirm action
4. You'll be logged in as that user
5. Session expires after 1 hour
6. All actions are logged

⚠️ **Note**: Cannot impersonate other super admins

### Deactivating/Activating Users

**To Deactivate**:
1. Go to user details
2. Click "Deactivate" button
3. Confirm action
4. User cannot log in

**To Activate**:
1. Go to user details
2. Click "Activate" button
3. User can log in again

---

## Admin Management

### Viewing Admins

1. Click "Admins" in the sidebar
2. Admins are grouped by tenant
3. Use search to find specific admins

### Creating an Admin

1. Click "Create Admin" button
2. Enter admin information:
   - Email address
   - Full name
   - Phone number (optional)
   - Select tenant
3. Click "Create Admin"
4. Copy activation link
5. Send link to admin via email

**Activation Link**:
- Valid for 24 hours
- Single-use only
- Admin sets their own password

### Reassigning an Admin

Move an admin to a different tenant:

1. Find admin in list
2. Click "Reassign" button
3. Select new tenant
4. Confirm action
5. Admin's tenant_id is updated

### Revoking Admin Privileges

Remove admin access:

1. Find admin in list
2. Click "Revoke" button
3. Confirm action
4. User becomes regular user
5. Admin privileges removed

---

## Audit Logs

### Viewing Audit Logs

1. Click "Audit Logs" in the sidebar
2. All super admin actions are logged

### Filtering Logs

Use filters to find specific logs:

1. **Date Range**:
   - Start date
   - End date

2. **Action Type**:
   - Tenant operations
   - User operations
   - Admin operations
   - System changes

3. **Entity Type**:
   - Tenants
   - Profiles
   - Users
   - Admins
   - Settings

4. **Tenant**: Filter by specific tenant

5. **Search**: By user email or entity ID

### Viewing Log Details

Click on a log entry to expand:
- Full change details (JSON)
- User agent information
- IP address
- Timestamp

### Exporting Logs

1. Apply desired filters
2. Click "Export" button
3. Choose format:
   - **CSV**: For spreadsheets
   - **JSON**: For programmatic access
4. File downloads automatically

**Export includes**:
- All filtered logs
- All fields
- Timestamp
- User information
- Changes made

---

## System Settings

### Maintenance Mode

Put the system in maintenance mode:

1. Go to Settings
2. Find "Maintenance Mode" section
3. Click "Enable Maintenance" button
4. Confirm action

**Effects**:
- Only super admins can access
- All other users see maintenance message
- No data is affected

**To Disable**:
- Click "Disable Maintenance" button

### Feature Flags

Enable/disable system features:

1. Go to Settings
2. Find "Feature Flags" section
3. Toggle features:
   - Multi-tenancy
   - User impersonation
   - Audit logging
   - Analytics
   - Password reset
4. Click "Save Feature Flags"

**Changes apply immediately**

### API Rate Limits

Configure API rate limits:

1. Go to Settings
2. Find "API Rate Limits" section
3. Set limits:
   - Requests per minute
   - Requests per hour
   - Requests per day
4. Click "Save Rate Limits"

**Recommended Values**:
- Per minute: 60
- Per hour: 1000
- Per day: 10000

### Default OEM Configuration

Set default configuration for new tenants:

1. Go to Settings
2. Find "Default OEM Configuration" section
3. Edit JSON configuration:
   ```json
   {
     "branding": {
       "primary_color": "#f97316",
       "secondary_color": "#dc2626",
       "logo_url": ""
     },
     "features": {
       "consultations": true,
       "orders": true,
       "reviews": true
     },
     "language": "en"
   }
   ```
4. Click "Save OEM Configuration"

**Validation**:
- Must be valid JSON
- Required fields must be present

---

## Security

### Multi-Factor Authentication (MFA)

#### Setting Up MFA

1. Go to Settings → Security
2. Click "Enable MFA"
3. Scan QR code with authenticator app:
   - Google Authenticator
   - Authy
   - Microsoft Authenticator
4. Save backup codes securely
5. Enter verification code
6. Click "Verify and Enable"

#### Using MFA

1. Log in with email and password
2. Enter 6-digit code from authenticator app
3. Click "Sign In"

#### Backup Codes

- 8 codes provided
- Single-use only
- Use if you lose your device
- Store securely (password manager recommended)

### Session Management

**Session Timeouts**:
- **Inactivity**: 15 minutes
- **Absolute**: 8 hours

**After Timeout**:
- Automatically logged out
- Must log in again
- MFA required

### Password Security

**Requirements for Super Admins**:
- Minimum 16 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Password Reset**:
1. Click "Forgot Password" on login page
2. Enter email address
3. Check email for reset link
4. Link valid for 24 hours
5. Set new password
6. Log in with new password

### Best Practices

1. **Enable MFA immediately**
2. **Use strong, unique passwords**
3. **Store backup codes securely**
4. **Log out when finished**
5. **Don't share credentials**
6. **Review audit logs regularly**
7. **Use impersonation sparingly**
8. **Keep browser updated**

---

## Troubleshooting

### Cannot Log In

**Problem**: Login fails

**Solutions**:
1. Check email and password
2. Verify MFA code is current (refreshes every 30 seconds)
3. Try backup code if MFA code doesn't work
4. Check if account is active
5. Contact system administrator

### MFA Code Not Working

**Problem**: MFA code rejected

**Solutions**:
1. Wait for code to refresh (30 seconds)
2. Check device time is synchronized
3. Use backup code instead
4. Contact system administrator to reset MFA

### Cannot See Tenants/Users

**Problem**: No data visible

**Solutions**:
1. Check filters are not too restrictive
2. Click "Clear Filters"
3. Verify super_admin flag is set
4. Check RLS policies
5. Review browser console for errors

### Export Not Working

**Problem**: Export fails or downloads empty file

**Solutions**:
1. Check filters are not excluding all data
2. Try smaller date range
3. Check browser download settings
4. Try different format (CSV vs JSON)
5. Check browser console for errors

### Slow Performance

**Problem**: Pages load slowly

**Solutions**:
1. Use filters to reduce data
2. Reduce page size (limit parameter)
3. Check internet connection
4. Clear browser cache
5. Contact system administrator

### Email Not Received

**Problem**: Activation/reset emails not arriving

**Solutions**:
1. Check spam/junk folder
2. Verify email address is correct
3. Wait a few minutes (may be delayed)
4. Check email service status
5. Contact system administrator

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Search |
| `Ctrl/Cmd + /` | Show shortcuts |
| `Esc` | Close modal |
| `Ctrl/Cmd + S` | Save (when editing) |

---

## Support

### Getting Help

1. **Documentation**: Check this guide first
2. **Troubleshooting**: See troubleshooting section
3. **Contact**: Email support@malai.com
4. **Emergency**: Call +60-XXX-XXXX

### Reporting Issues

When reporting issues, include:
- What you were trying to do
- What happened instead
- Error messages (if any)
- Screenshots (if applicable)
- Browser and version
- Timestamp of issue

---

## Glossary

- **Tenant**: An organization using the platform
- **OEM**: Original Equipment Manufacturer (branding customization)
- **RLS**: Row-Level Security (data isolation)
- **MFA**: Multi-Factor Authentication
- **TOTP**: Time-based One-Time Password
- **Impersonation**: Accessing system as another user
- **Audit Log**: Record of all actions
- **Super Admin**: System administrator with full access

---

## Appendix

### Common Action Types

- `tenant.create` - Tenant created
- `tenant.update` - Tenant updated
- `tenant.delete` - Tenant deleted
- `tenant.activate` - Tenant activated
- `tenant.deactivate` - Tenant deactivated
- `user.create` - User created
- `user.update` - User updated
- `user.migrate` - User migrated
- `user.impersonate` - User impersonated
- `admin.create` - Admin created
- `admin.reassign` - Admin reassigned
- `admin.revoke` - Admin revoked
- `password.reset` - Password reset
- `mfa.enabled` - MFA enabled
- `settings.update` - Settings updated

### Status Values

**Tenant Status**:
- `active` - Tenant is active
- `inactive` - Tenant is inactive
- `suspended` - Tenant is suspended

**Subscription Plans**:
- `free` - Free plan
- `basic` - Basic plan
- `pro` - Professional plan
- `enterprise` - Enterprise plan

**User Types**:
- `client` - Regular user
- `lawyer` - Lawyer user
- `admin` - Tenant administrator

---

*Last Updated: Current Session*
*Version: 1.0.0*
