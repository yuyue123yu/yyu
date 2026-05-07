# Requirements Document: Super Admin System

## Introduction

The Super Admin System enables multi-tenant management for the LegalMY platform, allowing different clients to operate branded instances while maintaining centralized control. The system provides super administrators with capabilities to manage tenants, create tenant-specific admin accounts, reset passwords across all tenants, and configure system-level settings. This enables white-label/OEM offerings while ensuring data isolation and security.

## Glossary

- **Super_Admin**: A privileged user with system-wide access to manage all tenants, users, and global configurations
- **Tenant**: An isolated instance of the platform for a specific client/organization with its own branding and data
- **Tenant_Admin**: An administrator with management privileges limited to a single tenant
- **Regular_Admin**: The existing admin role (user_type='admin') that manages users within their tenant
- **OEM_Configuration**: Customizable settings per tenant including branding, domain, features, and business rules
- **Super_Admin_Panel**: A separate administrative interface accessible only to super administrators
- **Audit_Log**: A tamper-proof record of all super admin actions for compliance and security
- **Data_Isolation**: Architectural guarantee that tenant data cannot be accessed by other tenants
- **Password_Reset_Token**: A time-limited, single-use token for secure password recovery
- **Tenant_Scope**: The boundary within which a user or admin can operate
- **System_Settings**: Global configuration that applies across all tenants
- **Tenant_Settings**: Configuration specific to a single tenant instance

## Requirements

### Requirement 1: Tenant Management

**User Story:** As a Super_Admin, I want to create and manage multiple tenants, so that I can offer white-label instances to different clients.

#### Acceptance Criteria

1. THE Super_Admin_Panel SHALL provide a tenant creation interface
2. WHEN creating a tenant, THE Super_Admin SHALL specify tenant name, subdomain, primary domain, and initial configuration
3. THE System SHALL validate that subdomain and domain values are unique across all tenants
4. THE System SHALL create isolated database schemas or row-level security policies for each tenant
5. WHEN a tenant is created, THE System SHALL generate a default Tenant_Admin account
6. THE Super_Admin SHALL be able to view a list of all tenants with status, creation date, and user count
7. THE Super_Admin SHALL be able to activate or deactivate tenants
8. WHEN a tenant is deactivated, THE System SHALL prevent all users within that tenant from accessing the platform
9. THE Super_Admin SHALL be able to delete tenants with confirmation
10. WHEN a tenant is deleted, THE System SHALL archive all tenant data before removal

### Requirement 2: OEM Configuration Management

**User Story:** As a Super_Admin, I want to configure branding and features per tenant, so that each client can have a customized experience.

#### Acceptance Criteria

1. THE Super_Admin SHALL be able to configure tenant-specific branding including logo, color scheme, and site name
2. THE Super_Admin SHALL be able to set custom domains for each tenant
3. THE Super_Admin SHALL be able to enable or disable features per tenant (e.g., e-commerce, templates, articles)
4. THE Super_Admin SHALL be able to configure language preferences per tenant
5. THE Super_Admin SHALL be able to set business rules per tenant (e.g., consultation pricing, service availability)
6. WHEN OEM_Configuration is updated, THE System SHALL apply changes immediately to the tenant
7. THE System SHALL store OEM_Configuration in a tenant_settings table with tenant_id foreign key
8. THE System SHALL provide default OEM_Configuration values for new tenants

### Requirement 3: Cross-Tenant User Management

**User Story:** As a Super_Admin, I want to view and manage users across all tenants, so that I can provide support and oversight.

#### Acceptance Criteria

1. THE Super_Admin_Panel SHALL display a unified user list across all tenants
2. THE Super_Admin SHALL be able to filter users by tenant, user_type, and status
3. THE Super_Admin SHALL be able to search users by email, name, or phone across all tenants
4. THE Super_Admin SHALL be able to view detailed user information including tenant affiliation
5. THE Super_Admin SHALL be able to change user_type for any user (client, lawyer, admin)
6. THE Super_Admin SHALL be able to deactivate or reactivate user accounts
7. THE System SHALL prevent Super_Admin from accidentally deleting users without confirmation
8. WHEN viewing user details, THE Super_Admin_Panel SHALL display the user's tenant context

### Requirement 4: Tenant Admin Management

**User Story:** As a Super_Admin, I want to create and manage Tenant_Admin accounts, so that each tenant can have dedicated administrators.

#### Acceptance Criteria

1. THE Super_Admin SHALL be able to create Tenant_Admin accounts for specific tenants
2. WHEN creating a Tenant_Admin, THE Super_Admin SHALL specify email, name, and tenant assignment
3. THE System SHALL send an account activation email to the new Tenant_Admin
4. THE Super_Admin SHALL be able to view all Tenant_Admin accounts grouped by tenant
5. THE Super_Admin SHALL be able to reassign a Tenant_Admin to a different tenant
6. THE Super_Admin SHALL be able to revoke Tenant_Admin privileges
7. THE System SHALL enforce that Tenant_Admin can only access data within their assigned tenant
8. THE System SHALL store tenant assignment in the profiles table with a tenant_id column

### Requirement 5: Password Recovery System

**User Story:** As a Super_Admin, I want to reset passwords for any user, so that I can resolve account access issues quickly.

#### Acceptance Criteria

1. THE Super_Admin SHALL be able to initiate password reset for any user account
2. WHEN initiating password reset, THE System SHALL generate a Password_Reset_Token
3. THE System SHALL send a password reset email to the user with the Password_Reset_Token
4. THE Password_Reset_Token SHALL expire after 24 hours
5. THE Password_Reset_Token SHALL be single-use and invalidated after successful password change
6. THE Super_Admin SHALL be able to view password reset history for audit purposes
7. THE System SHALL log all password reset actions in the Audit_Log
8. WHEN a user clicks the reset link, THE System SHALL verify the token and allow password change

### Requirement 6: Super Admin Authentication and Authorization

**User Story:** As a system architect, I want super admin access to be highly secure, so that unauthorized users cannot access system-wide controls.

#### Acceptance Criteria

1. THE System SHALL require multi-factor authentication (MFA) for all Super_Admin accounts
2. THE System SHALL enforce strong password requirements for Super_Admin accounts (minimum 16 characters, complexity rules)
3. THE Super_Admin_Panel SHALL be accessible only at a dedicated route (e.g., /super-admin)
4. THE System SHALL verify Super_Admin role before granting access to the Super_Admin_Panel
5. THE System SHALL implement a super_admin boolean flag in the profiles table
6. THE System SHALL log all Super_Admin login attempts in the Audit_Log
7. WHEN a Super_Admin session is inactive for 15 minutes, THE System SHALL require re-authentication
8. THE System SHALL prevent privilege escalation from Regular_Admin to Super_Admin

### Requirement 7: Data Isolation and Tenant Scoping

**User Story:** As a system architect, I want tenant data to be completely isolated, so that data breaches are contained to a single tenant.

#### Acceptance Criteria

1. THE System SHALL implement row-level security (RLS) policies that filter data by tenant_id
2. THE System SHALL add a tenant_id column to all multi-tenant tables (profiles, lawyers, consultations, orders, etc.)
3. WHEN a user authenticates, THE System SHALL set the tenant_id in the session context
4. THE System SHALL enforce that all database queries include tenant_id filtering
5. THE System SHALL prevent cross-tenant data access through API endpoints
6. THE System SHALL validate tenant_id on all write operations
7. THE Super_Admin SHALL be able to bypass tenant_id filtering for cross-tenant operations
8. THE System SHALL audit all cross-tenant data access by Super_Admin

### Requirement 8: Audit Trail and Compliance

**User Story:** As a compliance officer, I want all super admin actions to be logged, so that I can audit system changes and investigate incidents.

#### Acceptance Criteria

1. THE System SHALL create an audit_logs table with columns: id, super_admin_id, action_type, target_entity, target_id, changes, ip_address, timestamp
2. THE System SHALL log all Super_Admin actions including tenant creation, user modifications, password resets, and configuration changes
3. THE Audit_Log SHALL be immutable (no updates or deletes allowed)
4. THE Super_Admin SHALL be able to view and search the Audit_Log
5. THE Super_Admin SHALL be able to filter audit logs by date range, action type, and target entity
6. THE System SHALL retain audit logs for a minimum of 7 years
7. THE System SHALL export audit logs in CSV or JSON format for external analysis
8. WHEN a security incident occurs, THE Audit_Log SHALL provide complete traceability

### Requirement 9: System-Level Configuration

**User Story:** As a Super_Admin, I want to manage global system settings, so that I can control platform-wide behavior.

#### Acceptance Criteria

1. THE Super_Admin SHALL be able to configure global settings including maintenance mode, feature flags, and API rate limits
2. THE Super_Admin SHALL be able to set default OEM_Configuration values for new tenants
3. THE Super_Admin SHALL be able to configure email templates for system notifications
4. THE Super_Admin SHALL be able to manage Supabase authentication settings
5. THE System SHALL store system settings in a system_settings table separate from tenant_settings
6. WHEN maintenance mode is enabled, THE System SHALL display a maintenance page to all non-super-admin users
7. THE Super_Admin SHALL be able to configure backup schedules and retention policies
8. THE System SHALL validate system settings before applying changes

### Requirement 10: Super Admin Panel User Interface

**User Story:** As a Super_Admin, I want an intuitive admin panel, so that I can efficiently manage the platform.

#### Acceptance Criteria

1. THE Super_Admin_Panel SHALL provide a dashboard with key metrics (total tenants, total users, active consultations, system health)
2. THE Super_Admin_Panel SHALL have navigation for Tenants, Users, Admins, Audit Logs, and System Settings
3. THE Super_Admin_Panel SHALL use a distinct visual theme to differentiate from the Regular_Admin panel
4. THE Super_Admin_Panel SHALL display the current Super_Admin's name and email
5. THE Super_Admin_Panel SHALL provide quick actions for common tasks (create tenant, reset password, view logs)
6. THE Super_Admin_Panel SHALL be responsive and accessible on desktop and tablet devices
7. THE Super_Admin_Panel SHALL display real-time notifications for critical system events
8. THE Super_Admin_Panel SHALL provide contextual help and documentation links

### Requirement 11: Tenant User Migration

**User Story:** As a Super_Admin, I want to migrate users between tenants, so that I can handle organizational changes and mergers.

#### Acceptance Criteria

1. THE Super_Admin SHALL be able to select one or more users and reassign them to a different tenant
2. WHEN migrating users, THE System SHALL update the tenant_id in the profiles table
3. THE System SHALL migrate all related data (consultations, orders, favorites, cart) to the new tenant context
4. THE Super_Admin SHALL be able to preview the impact of user migration before confirming
5. THE System SHALL log all user migrations in the Audit_Log
6. WHEN a user is migrated, THE System SHALL send a notification email to the user
7. THE System SHALL prevent migration if it would violate data integrity constraints
8. THE Super_Admin SHALL be able to rollback a migration within 24 hours

### Requirement 12: Tenant Analytics and Reporting

**User Story:** As a Super_Admin, I want to view analytics per tenant, so that I can monitor usage and identify growth opportunities.

#### Acceptance Criteria

1. THE Super_Admin_Panel SHALL display tenant-specific metrics (user count, consultation count, revenue, active lawyers)
2. THE Super_Admin SHALL be able to compare metrics across tenants
3. THE Super_Admin SHALL be able to view trends over time (daily, weekly, monthly)
4. THE Super_Admin SHALL be able to export reports in CSV or PDF format
5. THE System SHALL calculate metrics in real-time or with minimal delay (< 5 minutes)
6. THE Super_Admin_Panel SHALL display charts and graphs for visual analysis
7. THE Super_Admin SHALL be able to set up automated reports delivered via email
8. THE System SHALL provide drill-down capabilities to view detailed data

### Requirement 13: Emergency Access and Override

**User Story:** As a Super_Admin, I want emergency access capabilities, so that I can resolve critical issues quickly.

#### Acceptance Criteria

1. THE Super_Admin SHALL be able to impersonate any user account for troubleshooting purposes
2. WHEN impersonating a user, THE System SHALL display a prominent banner indicating impersonation mode
3. THE System SHALL log all impersonation sessions in the Audit_Log with start and end times
4. THE Super_Admin SHALL be able to exit impersonation mode at any time
5. THE Super_Admin SHALL be able to force-logout any user session
6. THE Super_Admin SHALL be able to unlock locked accounts
7. THE Super_Admin SHALL be able to bypass tenant-specific feature restrictions for emergency fixes
8. THE System SHALL require additional authentication for emergency access features

### Requirement 14: Tenant Onboarding Workflow

**User Story:** As a Super_Admin, I want a guided tenant onboarding process, so that new clients can be set up quickly and consistently.

#### Acceptance Criteria

1. THE Super_Admin_Panel SHALL provide a step-by-step tenant creation wizard
2. THE wizard SHALL collect tenant information (name, domain, contact details, subscription plan)
3. THE wizard SHALL configure initial OEM_Configuration (branding, features, settings)
4. THE wizard SHALL create the default Tenant_Admin account
5. THE wizard SHALL send welcome emails to the Tenant_Admin with setup instructions
6. THE System SHALL validate all inputs before creating the tenant
7. THE Super_Admin SHALL be able to save progress and resume the wizard later
8. WHEN onboarding is complete, THE System SHALL mark the tenant as active

### Requirement 15: Subscription and Billing Management

**User Story:** As a Super_Admin, I want to manage tenant subscriptions, so that I can control access based on payment status.

#### Acceptance Criteria

1. THE Super_Admin SHALL be able to assign subscription plans to tenants (free, basic, premium, enterprise)
2. THE Super_Admin SHALL be able to set subscription start and end dates
3. THE System SHALL enforce feature limits based on subscription plan
4. WHEN a subscription expires, THE System SHALL downgrade the tenant to a limited access mode
5. THE Super_Admin SHALL be able to view billing history per tenant
6. THE Super_Admin SHALL be able to generate invoices for tenants
7. THE System SHALL send subscription renewal reminders to Tenant_Admin
8. THE Super_Admin SHALL be able to apply discounts or promotional pricing

### Requirement 16: Multi-Language Support for Super Admin Panel

**User Story:** As a Super_Admin, I want the super admin panel to support multiple languages, so that international administrators can use the system effectively.

#### Acceptance Criteria

1. THE Super_Admin_Panel SHALL support English, Chinese, and Malay languages
2. THE Super_Admin SHALL be able to switch languages from the user menu
3. THE System SHALL persist language preference in the Super_Admin profile
4. THE System SHALL translate all UI elements, labels, and messages
5. THE System SHALL display dates and times in the Super_Admin's locale format
6. THE System SHALL support right-to-left (RTL) languages for future expansion
7. WHEN language is changed, THE Super_Admin_Panel SHALL update immediately without page reload
8. THE System SHALL provide translation management tools for adding new languages

### Requirement 17: Security Monitoring and Alerts

**User Story:** As a Super_Admin, I want to receive security alerts, so that I can respond to threats quickly.

#### Acceptance Criteria

1. THE System SHALL detect and alert on suspicious activities (multiple failed logins, unusual access patterns, privilege escalation attempts)
2. THE Super_Admin SHALL receive real-time notifications for critical security events
3. THE System SHALL provide a security dashboard with threat indicators
4. THE Super_Admin SHALL be able to configure alert thresholds and notification preferences
5. THE System SHALL integrate with external security monitoring tools via webhooks
6. WHEN a security incident is detected, THE System SHALL automatically log details in the Audit_Log
7. THE Super_Admin SHALL be able to block IP addresses or user accounts from the security dashboard
8. THE System SHALL generate weekly security summary reports

### Requirement 18: Backup and Disaster Recovery

**User Story:** As a Super_Admin, I want to manage backups and recovery, so that I can restore data in case of failures.

#### Acceptance Criteria

1. THE Super_Admin SHALL be able to initiate manual backups for specific tenants or the entire system
2. THE System SHALL perform automated daily backups of all tenant data
3. THE Super_Admin SHALL be able to view backup history with timestamps and sizes
4. THE Super_Admin SHALL be able to restore a tenant from a backup point
5. THE System SHALL validate backup integrity before allowing restoration
6. WHEN restoring a backup, THE System SHALL create a snapshot of current data before overwriting
7. THE Super_Admin SHALL be able to download backups for offline storage
8. THE System SHALL retain backups for a configurable retention period (default 90 days)

### Requirement 19: API Access Management

**User Story:** As a Super_Admin, I want to manage API access for tenants, so that I can control integrations and rate limits.

#### Acceptance Criteria

1. THE Super_Admin SHALL be able to generate API keys for tenants
2. THE Super_Admin SHALL be able to set rate limits per tenant or per API key
3. THE Super_Admin SHALL be able to revoke API keys immediately
4. THE System SHALL log all API requests with tenant_id, endpoint, and response status
5. THE Super_Admin SHALL be able to view API usage statistics per tenant
6. THE Super_Admin SHALL be able to configure API endpoint access per tenant (enable/disable specific endpoints)
7. WHEN rate limits are exceeded, THE System SHALL return HTTP 429 status and log the event
8. THE Super_Admin SHALL be able to whitelist IP addresses for specific tenants

### Requirement 20: Tenant Data Export and Portability

**User Story:** As a Super_Admin, I want to export tenant data, so that clients can migrate to other platforms if needed.

#### Acceptance Criteria

1. THE Super_Admin SHALL be able to export all data for a specific tenant
2. THE System SHALL export data in standard formats (JSON, CSV, SQL dump)
3. THE export SHALL include all tenant-specific data (users, consultations, orders, settings)
4. THE System SHALL exclude sensitive system data (passwords, API keys) from exports
5. THE Super_Admin SHALL be able to schedule automated exports
6. THE System SHALL encrypt exported data files
7. THE Super_Admin SHALL receive a download link when export is complete
8. THE System SHALL log all data export operations in the Audit_Log

---

## Special Requirements: Parser and Serializer

### Requirement 21: OEM Configuration Parser and Serializer

**User Story:** As a developer, I want to parse and serialize OEM_Configuration, so that tenant settings can be stored and retrieved reliably.

#### Acceptance Criteria

1. WHEN a valid OEM_Configuration JSON is provided, THE Configuration_Parser SHALL parse it into an OEM_Configuration object
2. WHEN an invalid OEM_Configuration JSON is provided, THE Configuration_Parser SHALL return a descriptive error with the invalid field
3. THE Configuration_Serializer SHALL format OEM_Configuration objects back into valid JSON
4. FOR ALL valid OEM_Configuration objects, parsing then serializing then parsing SHALL produce an equivalent object (round-trip property)
5. THE Configuration_Parser SHALL validate required fields (tenant_id, site_name, primary_color)
6. THE Configuration_Parser SHALL apply default values for optional fields
7. THE Configuration_Serializer SHALL produce human-readable JSON with proper indentation
8. THE System SHALL use the Configuration_Parser for all OEM_Configuration read operations

### Requirement 22: Audit Log Parser and Serializer

**User Story:** As a developer, I want to parse and serialize Audit_Log entries, so that audit data can be exported and imported reliably.

#### Acceptance Criteria

1. WHEN a valid Audit_Log JSON is provided, THE Audit_Parser SHALL parse it into an Audit_Log object
2. WHEN an invalid Audit_Log JSON is provided, THE Audit_Parser SHALL return a descriptive error
3. THE Audit_Serializer SHALL format Audit_Log objects back into valid JSON
4. FOR ALL valid Audit_Log objects, parsing then serializing then parsing SHALL produce an equivalent object (round-trip property)
5. THE Audit_Parser SHALL preserve timestamp precision (milliseconds)
6. THE Audit_Serializer SHALL include all fields required for compliance (action_type, target_entity, changes, ip_address)
7. THE System SHALL use the Audit_Serializer for all audit log export operations
8. THE Audit_Parser SHALL handle large change payloads (up to 1MB) without performance degradation

---

## Notes

- **Security Priority**: Super admin access is the highest privilege level and must be protected with defense-in-depth strategies
- **Data Isolation**: Tenant data isolation is critical for compliance and trust; all database queries must be tenant-scoped
- **Scalability**: The system should support at least 100 tenants initially with the ability to scale to 1000+ tenants
- **Backward Compatibility**: Existing admin panel functionality should remain unchanged; super admin is an additive feature
- **Migration Path**: Existing users should be assigned to a default tenant during migration
- **Performance**: Super admin operations should not impact tenant user experience
- **Compliance**: Audit logging must meet SOC 2, GDPR, and PDPA requirements
