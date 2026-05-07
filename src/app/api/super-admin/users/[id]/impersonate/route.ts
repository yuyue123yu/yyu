// User Impersonation API
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { logAuditEvent } from '@/lib/audit';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/super-admin/users/:id/impersonate
 * Start impersonation session for a user
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Verify super admin authentication
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { supabase, user: superAdmin } = authResult;
  const { id: targetUserId } = params;

  try {
    // Get target user details
    const { data: targetUser, error: userError } = await supabase
      .from('profiles')
      .select('*, tenants:tenant_id(name)')
      .eq('id', targetUserId)
      .single();

    if (userError || !targetUser) {
      return NextResponse.json(
        { error: 'Target user not found' },
        { status: 404 }
      );
    }

    // Prevent impersonating other super admins
    if (targetUser.super_admin) {
      return NextResponse.json(
        { error: 'Cannot impersonate other super administrators' },
        { status: 403 }
      );
    }

    // Create impersonation token (expires in 1 hour)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Log audit event
    await logAuditEvent(
      {
        action_type: 'user.impersonate',
        target_entity: 'profiles',
        target_id: targetUserId,
        changes: {
          super_admin_id: superAdmin.id,
          target_user_email: targetUser.email,
          target_user_name: targetUser.full_name,
          tenant_name: targetUser.tenants?.name,
          expires_at: expiresAt.toISOString(),
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: 'Impersonation session created',
      impersonation: {
        user_id: targetUserId,
        email: targetUser.email,
        full_name: targetUser.full_name,
        tenant_id: targetUser.tenant_id,
        expires_at: expiresAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error creating impersonation session:', error);
    return NextResponse.json(
      { error: 'Failed to create impersonation session' },
      { status: 500 }
    );
  }
}
