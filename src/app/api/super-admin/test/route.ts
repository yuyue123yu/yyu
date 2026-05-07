// Test endpoint for Phase 2 - Super Admin Authentication & Middleware
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { setTenantContext } from '@/lib/middleware/tenant-context';
import { logAuditEvent } from '@/lib/audit';

/**
 * Test endpoint to verify super admin authentication
 * GET /api/super-admin/test
 */
export async function GET(request: NextRequest) {
  // Test super admin authentication
  const authResult = await requireSuperAdmin(request);

  // If authResult is a NextResponse, it means authentication failed
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user, profile, supabase } = authResult;

  // Log audit event
  await logAuditEvent(
    {
      action_type: 'test.access',
      target_entity: 'system',
      target_id: user.id,
      changes: {
        message: 'Super admin test endpoint accessed',
        profile: {
          id: profile.id,
          super_admin: profile.super_admin,
          tenant_id: profile.tenant_id,
        },
      },
    },
    request
  );

  return NextResponse.json({
    success: true,
    message: 'Super admin authentication successful',
    user: {
      id: user.id,
      email: user.email,
    },
    profile: {
      super_admin: profile.super_admin,
      tenant_id: profile.tenant_id,
      user_type: profile.user_type,
    },
    rls_bypass_enabled: true,
  });
}

/**
 * Test endpoint to verify tenant context
 * POST /api/super-admin/test
 */
export async function POST(request: NextRequest) {
  // Test tenant context
  const contextResult = await setTenantContext(request);

  // If contextResult is a NextResponse, it means authentication failed
  if (contextResult instanceof NextResponse) {
    return contextResult;
  }

  const { user, profile, tenantId } = contextResult;

  return NextResponse.json({
    success: true,
    message: 'Tenant context set successfully',
    user: {
      id: user.id,
      email: user.email,
    },
    profile: {
      super_admin: profile.super_admin,
      tenant_id: profile.tenant_id,
      user_type: profile.user_type,
    },
    tenant_context: {
      current_tenant_id: tenantId,
    },
  });
}
