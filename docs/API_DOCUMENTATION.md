# API Documentation

**Version**: 1.0.0
**Base URL**: `/api/super-admin`
**Authentication**: Required (Super Admin)

---

## Authentication

All API endpoints require super admin authentication. Include the Supabase session token in the request headers.

**Headers**:
```
Authorization: Bearer {supabase_access_token}
```

**Authentication Check**:
- User must be authenticated
- User must have `super_admin = true` in profiles table
- RLS bypass is enabled for super admins

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

---

## Tenant Management APIs

### 1. Create Tenant

**Endpoint**: `POST /api/super-admin/tenants`

**Description**: Create a new tenant with default admin account

**Request Body**:
```json
{
  "name": "Acme Corporation",
  "subdomain": "acme",
  "domain": "acme.com",
  "subscription_plan": "pro",
  "admin_email": "admin@acme.com",
  "admin_name": "John Doe",
  "admin_phone": "+60123456789"
}
```

**Response**:
```json
{
  "success": true,
  "tenant": {
    "id": "uuid",
    "name": "Acme Corporation",
    "subdomain": "acme",
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "admin": {
    "id": "uuid",
    "email": "admin@acme.com",
    "activation_link": "https://..."
  }
}
```

---

### 2. List Tenants

**Endpoint**: `GET /api/super-admin/tenants`

**Description**: Get paginated list of tenants

**Query Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `status` (string): Filter by status
- `search` (string): Search by name or subdomain

**Response**:
```json
{
  "success": true,
  "tenants": [...],
  "total": 100,
  "page": 1,
  "totalPages": 5
}
```

---

### 3. Get Tenant Details

**Endpoint**: `GET /api/super-admin/tenants/:id`

**Description**: Get detailed information about a tenant

**Response**:
```json
{
  "success": true,
  "tenant": {
    "id": "uuid",
    "name": "Acme Corporation",
    "subdomain": "acme",
    "domain": "acme.com",
    "status": "active",
    "subscription_plan": "pro",
    "user_count": 150,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### 4. Update Tenant

**Endpoint**: `PATCH /api/super-admin/tenants/:id`

**Description**: Update tenant information

**Request Body**:
```json
{
  "name": "Acme Corp",
  "domain": "acmecorp.com",
  "subscription_plan": "enterprise"
}
```

**Response**:
```json
{
  "success": true,
  "tenant": { ... }
}
```

---

### 5. Delete Tenant

**Endpoint**: `DELETE /api/super-admin/tenants/:id`

**Description**: Delete a tenant (archives data)

**Response**:
```json
{
  "success": true,
  "message": "Tenant deleted successfully"
}
```

---

### 6. Activate Tenant

**Endpoint**: `POST /api/super-admin/tenants/:id/activate`

**Description**: Activate a tenant

**Response**:
```json
{
  "success": true,
  "tenant": { ... }
}
```

---

### 7. Deactivate Tenant

**Endpoint**: `POST /api/super-admin/tenants/:id/deactivate`

**Description**: Deactivate a tenant

**Response**:
```json
{
  "success": true,
  "tenant": { ... }
}
```

---

## Tenant Settings APIs

### 8. Get Tenant Settings

**Endpoint**: `GET /api/super-admin/tenants/:id/settings`

**Description**: Get all settings for a tenant

**Response**:
```json
{
  "success": true,
  "settings": [
    {
      "key": "branding_primary_color",
      "value": "#f97316"
    },
    ...
  ]
}
```

---

### 9. Update Tenant Setting

**Endpoint**: `PUT /api/super-admin/tenants/:id/settings/:key`

**Description**: Update a specific setting

**Request Body**:
```json
{
  "value": "#dc2626"
}
```

**Response**:
```json
{
  "success": true,
  "setting": { ... }
}
```

---

### 10. Bulk Update Settings

**Endpoint**: `POST /api/super-admin/tenants/:id/settings/bulk`

**Description**: Update multiple settings at once

**Request Body**:
```json
{
  "settings": {
    "branding_primary_color": "#f97316",
    "branding_secondary_color": "#dc2626",
    "features_consultations": "true"
  }
}
```

**Response**:
```json
{
  "success": true,
  "updated": 3
}
```

---

## User Management APIs

### 11. List Users

**Endpoint**: `GET /api/super-admin/users`

**Description**: Get paginated list of users across all tenants

**Query Parameters**:
- `page` (number): Page number
- `limit` (number): Items per page
- `tenant_id` (uuid): Filter by tenant
- `user_type` (string): Filter by user type
- `search` (string): Search by email, name, phone

**Response**:
```json
{
  "success": true,
  "users": [...],
  "total": 500,
  "page": 1,
  "totalPages": 25
}
```

---

### 12. Get User Details

**Endpoint**: `GET /api/super-admin/users/:id`

**Description**: Get detailed user information

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "tenant_id": "uuid",
    "user_type": "client",
    "active": true
  },
  "activity": {
    "consultation_count": 5,
    "order_count": 3
  }
}
```

---

### 13. Update User

**Endpoint**: `PATCH /api/super-admin/users/:id`

**Description**: Update user information

**Request Body**:
```json
{
  "full_name": "Jane Doe",
  "phone": "+60123456789",
  "user_type": "lawyer"
}
```

**Response**:
```json
{
  "success": true,
  "user": { ... }
}
```

---

### 14. Migrate User

**Endpoint**: `POST /api/super-admin/users/:id/migrate`

**Description**: Migrate user to different tenant

**Request Body**:
```json
{
  "target_tenant_id": "uuid"
}
```

**Response**:
```json
{
  "success": true,
  "user": { ... },
  "migrated_data_count": 8
}
```

---

### 15. Impersonate User

**Endpoint**: `POST /api/super-admin/users/:id/impersonate`

**Description**: Create impersonation session for user

**Response**:
```json
{
  "success": true,
  "impersonation": {
    "user_id": "uuid",
    "email": "user@example.com",
    "expires_at": "2024-01-01T01:00:00Z"
  }
}
```

---

### 16. Deactivate User

**Endpoint**: `POST /api/super-admin/users/:id/deactivate`

**Description**: Toggle user active status

**Response**:
```json
{
  "success": true,
  "user": { ... }
}
```

---

## Admin Management APIs

### 17. Create Admin

**Endpoint**: `POST /api/super-admin/admins`

**Description**: Create tenant admin account

**Request Body**:
```json
{
  "email": "admin@example.com",
  "full_name": "Admin User",
  "phone": "+60123456789",
  "tenant_id": "uuid"
}
```

**Response**:
```json
{
  "success": true,
  "admin": { ... },
  "activation_link": "https://..."
}
```

---

### 18. List Admins

**Endpoint**: `GET /api/super-admin/admins`

**Description**: Get list of all tenant admins

**Query Parameters**:
- `limit` (number): Items per page
- `tenant_id` (uuid): Filter by tenant

**Response**:
```json
{
  "success": true,
  "admins": [...]
}
```

---

### 19. Reassign Admin

**Endpoint**: `PATCH /api/super-admin/admins/:id/reassign`

**Description**: Reassign admin to different tenant

**Request Body**:
```json
{
  "tenant_id": "uuid"
}
```

**Response**:
```json
{
  "success": true,
  "admin": { ... }
}
```

---

### 20. Revoke Admin

**Endpoint**: `DELETE /api/super-admin/admins/:id`

**Description**: Revoke admin privileges

**Response**:
```json
{
  "success": true,
  "message": "Admin privileges revoked"
}
```

---

## Password Reset APIs

### 21. Initiate Password Reset

**Endpoint**: `POST /api/super-admin/password-reset`

**Description**: Initiate password reset for user

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### 22. Get Reset History

**Endpoint**: `GET /api/super-admin/password-reset/history`

**Description**: Get password reset history

**Query Parameters**:
- `user_id` (uuid): Filter by user
- `limit` (number): Items to return

**Response**:
```json
{
  "success": true,
  "history": [...]
}
```

---

## Audit Log APIs

### 23. Query Audit Logs

**Endpoint**: `GET /api/super-admin/audit-logs`

**Description**: Query audit logs with filters

**Query Parameters**:
- `page` (number): Page number
- `limit` (number): Items per page
- `action_type` (string): Filter by action type
- `target_entity` (string): Filter by entity
- `user_id` (uuid): Filter by user
- `tenant_id` (uuid): Filter by tenant
- `start_date` (datetime): Start date
- `end_date` (datetime): End date

**Response**:
```json
{
  "success": true,
  "logs": [...],
  "total": 1000,
  "page": 1,
  "totalPages": 20
}
```

---

### 24. Export Audit Logs

**Endpoint**: `GET /api/super-admin/audit-logs/export`

**Description**: Export audit logs to CSV or JSON

**Query Parameters**:
- `format` (string): csv or json
- Same filters as query endpoint

**Response**: File download

---

## System Settings APIs

### 25. Get System Settings

**Endpoint**: `GET /api/super-admin/system-settings`

**Description**: Get all system settings

**Response**:
```json
{
  "success": true,
  "settings": [...]
}
```

---

### 26. Update System Setting

**Endpoint**: `PUT /api/super-admin/system-settings/:key`

**Description**: Update a system setting

**Request Body**:
```json
{
  "value": "true"
}
```

**Response**:
```json
{
  "success": true,
  "setting": { ... }
}
```

---

### 27. Toggle Maintenance Mode

**Endpoint**: `POST /api/super-admin/system-settings/maintenance-mode`

**Description**: Toggle maintenance mode

**Response**:
```json
{
  "success": true,
  "maintenance_mode": true
}
```

---

## Analytics APIs

### 28. Get Tenant Metrics

**Endpoint**: `GET /api/super-admin/analytics/tenants/:id`

**Description**: Get metrics for a tenant

**Response**:
```json
{
  "success": true,
  "metrics": {
    "user_count": 150,
    "consultation_count": 500,
    "order_count": 300,
    "revenue": 50000
  }
}
```

---

### 29. Compare Tenants

**Endpoint**: `GET /api/super-admin/analytics/compare`

**Description**: Compare metrics across tenants

**Query Parameters**:
- `tenant_ids` (array): Tenant IDs to compare

**Response**:
```json
{
  "success": true,
  "comparison": [...]
}
```

---

## MFA APIs

### 30. Generate MFA Secret

**Endpoint**: `POST /api/super-admin/mfa/generate`

**Description**: Generate MFA secret and QR code

**Response**:
```json
{
  "success": true,
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCodeUrl": "data:image/png;base64,...",
  "backupCodes": ["ABCD1234", ...]
}
```

---

### 31. Verify MFA Token

**Endpoint**: `POST /api/super-admin/mfa/verify`

**Description**: Verify MFA token and enable MFA

**Request Body**:
```json
{
  "token": "123456",
  "secret": "JBSWY3DPEHPK3PXP"
}
```

**Response**:
```json
{
  "success": true,
  "message": "MFA enabled successfully"
}
```

---

### 32. Check MFA Status

**Endpoint**: `GET /api/super-admin/mfa/check`

**Description**: Check if user has MFA enabled

**Response**:
```json
{
  "success": true,
  "mfaEnabled": true
}
```

---

### 33. Validate MFA Token

**Endpoint**: `POST /api/super-admin/mfa/validate`

**Description**: Validate MFA token during login

**Request Body**:
```json
{
  "token": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "MFA validation successful"
}
```

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| AUTHENTICATION_ERROR | 401 | Authentication failed |
| AUTHORIZATION_ERROR | 403 | Insufficient permissions |
| VALIDATION_ERROR | 400 | Validation failed |
| NOT_FOUND_ERROR | 404 | Resource not found |
| CONFLICT_ERROR | 409 | Resource conflict |
| RATE_LIMIT_ERROR | 429 | Rate limit exceeded |
| DATABASE_ERROR | 500 | Database operation failed |
| EXTERNAL_SERVICE_ERROR | 502 | External service error |
| SESSION_ERROR | 401 | Session error |
| MFA_ERROR | 401 | MFA verification failed |

---

## Rate Limiting

**Default Limits**:
- 60 requests per minute
- 1000 requests per hour
- 10000 requests per day

**Headers**:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1640000000
```

---

## Pagination

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response**:
```json
{
  "data": [...],
  "total": 500,
  "page": 1,
  "totalPages": 25,
  "hasNext": true,
  "hasPrev": false
}
```

---

## Filtering

**Common Filters**:
- `status`: Filter by status
- `search`: Search by text
- `start_date`: Start date (ISO 8601)
- `end_date`: End date (ISO 8601)
- `tenant_id`: Filter by tenant
- `user_id`: Filter by user

---

## Sorting

**Query Parameter**:
- `sort`: Field to sort by
- `order`: asc or desc (default: desc)

**Example**:
```
GET /api/super-admin/users?sort=created_at&order=desc
```

---

## Best Practices

1. **Always include error handling**
2. **Use pagination for large datasets**
3. **Filter by tenant_id when possible**
4. **Cache responses when appropriate**
5. **Log all API calls for audit**
6. **Use HTTPS in production**
7. **Validate input on client and server**
8. **Handle rate limiting gracefully**

---

*Last Updated: Current Session*
*Version: 1.0.0*
