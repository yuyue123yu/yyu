// Admin Management API - Revoke Admin Privileges
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { logAuditEvent } from '@/lib/audit';
import { createClient } from '@/lib/supabase/server';

/**
 * DELETE /api/super-admin/admins/:id
 * Revoke admin privileges (convert to regular user)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Verify super admin authentication
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { supabase } = authResult;
  const { id } = params;

  try {
    // Get current admin
    const { data: currentAdmin } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (!currentAdmin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Verify user is an admin (not super admin)
    if (currentAdmin.user_type !== 'admin' || currentAdmin.super_admin) {
      return NextResponse.json(
        { error: 'User is not a tenant admin or is a super admin' },
        { status: 400 }
      );
    }

    // Revoke admin privileges by changing user_type to 'client'
    const { data: user, error: updateError } = await supabase
      .from('profiles')
      .update({
        user_type: 'client',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Log audit event
    await logAuditEvent(
      {
        action_type: 'admin.revoke',
        target_entity: 'profiles',
        target_id: id,
        changes: {
          admin_email: currentAdmin.email,
          previous_user_type: 'admin',
          new_user_type: 'client',
          tenant_id: currentAdmin.tenant_id,
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: 'Admin privileges revoked successfully',
      user,
    });
  } catch (error) {
    console.error('Error revoking admin privileges:', error);
    return NextResponse.json(
      { error: 'Failed to revoke admin privileges' },
      { status: 500 }
    );
  }
}
