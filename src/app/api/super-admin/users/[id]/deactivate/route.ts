// User Management API - Deactivate User
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { logAuditEvent } from '@/lib/audit';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/super-admin/users/:id/deactivate
 * Toggle user account active status (activate/deactivate)
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

  const { supabase } = authResult;
  const { id } = params;

  try {
    // Get current user
    const { data: currentUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent deactivating super admins
    if (currentUser.super_admin) {
      return NextResponse.json(
        { error: 'Cannot deactivate super admin accounts' },
        { status: 403 }
      );
    }

    // Toggle active status
    const newActiveStatus = !currentUser.active;
    
    const { data: user, error: updateError } = await supabase
      .from('profiles')
      .update({
        active: newActiveStatus,
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
        action_type: newActiveStatus ? 'user.activate' : 'user.deactivate',
        target_entity: 'profiles',
        target_id: id,
        changes: {
          user_email: currentUser.email,
          user_type: currentUser.user_type,
          tenant_id: currentUser.tenant_id,
          active: newActiveStatus,
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: `User ${newActiveStatus ? 'activated' : 'deactivated'} successfully`,
      user,
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    return NextResponse.json(
      { error: 'Failed to toggle user status' },
      { status: 500 }
    );
  }
}
