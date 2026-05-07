// User Management API - Get and Update User
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { logAuditEvent } from '@/lib/audit';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/super-admin/users/:id
 * Get user details with tenant context
 */
export async function GET(
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
    // Get user details with tenant info
    const { data: user, error } = await supabase
      .from('profiles')
      .select(
        `
        *,
        tenants:tenant_id (
          id,
          name,
          subdomain,
          status,
          subscription_plan
        )
      `
      )
      .eq('id', id)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user activity stats
    const { count: consultationCount } = await supabase
      .from('consultations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', id);

    const { count: orderCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', id);

    return NextResponse.json({
      success: true,
      user,
      activity: {
        consultation_count: consultationCount || 0,
        order_count: orderCount || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/super-admin/users/:id
 * Update user details
 */
export async function PATCH(
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
    const body = await request.json();
    const { user_type, full_name, phone, avatar_url } = body;

    // Get current user data for audit log
    const { data: currentUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent changing super_admin flag through this endpoint
    if (body.super_admin !== undefined) {
      return NextResponse.json(
        { error: 'Cannot modify super_admin flag through this endpoint' },
        { status: 403 }
      );
    }

    // Build update object
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (user_type !== undefined) updates.user_type = user_type;
    if (full_name !== undefined) updates.full_name = full_name;
    if (phone !== undefined) updates.phone = phone;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;

    // Update user
    const { data: user, error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Log audit event
    await logAuditEvent(
      {
        action_type: 'user.update',
        target_entity: 'profiles',
        target_id: id,
        changes: {
          before: currentUser,
          after: user,
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
