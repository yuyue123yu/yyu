// Admin Management API - Reassign Admin to Different Tenant
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { logAuditEvent } from '@/lib/audit';
import { createClient } from '@/lib/supabase/server';

/**
 * PATCH /api/super-admin/admins/:id/reassign
 * Reassign admin to a different tenant
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
    const { tenant_id } = body;

    if (!tenant_id) {
      return NextResponse.json(
        { error: 'tenant_id is required' },
        { status: 400 }
      );
    }

    // Get current admin
    const { data: currentAdmin } = await supabase
      .from('profiles')
      .select('*, tenants:tenant_id(name)')
      .eq('id', id)
      .single();

    if (!currentAdmin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Verify user is an admin (not super admin)
    if (currentAdmin.user_type !== 'admin' || currentAdmin.super_admin) {
      return NextResponse.json(
        { error: 'User is not a tenant admin' },
        { status: 400 }
      );
    }

    // Verify target tenant exists
    const { data: targetTenant } = await supabase
      .from('tenants')
      .select('id, name, status')
      .eq('id', tenant_id)
      .single();

    if (!targetTenant) {
      return NextResponse.json(
        { error: 'Target tenant not found' },
        { status: 404 }
      );
    }

    if (targetTenant.status !== 'active') {
      return NextResponse.json(
        { error: 'Target tenant is not active' },
        { status: 400 }
      );
    }

    // Check if already assigned to target tenant
    if (currentAdmin.tenant_id === tenant_id) {
      return NextResponse.json(
        { error: 'Admin is already assigned to this tenant' },
        { status: 400 }
      );
    }

    // Reassign admin
    const { data: admin, error: updateError } = await supabase
      .from('profiles')
      .update({
        tenant_id,
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
        action_type: 'admin.reassign',
        target_entity: 'profiles',
        target_id: id,
        changes: {
          admin_email: currentAdmin.email,
          from_tenant_id: currentAdmin.tenant_id,
          from_tenant_name: currentAdmin.tenants?.name,
          to_tenant_id: tenant_id,
          to_tenant_name: targetTenant.name,
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: 'Admin reassigned successfully',
      admin,
      from_tenant: {
        id: currentAdmin.tenant_id,
        name: currentAdmin.tenants?.name,
      },
      to_tenant: {
        id: targetTenant.id,
        name: targetTenant.name,
      },
    });
  } catch (error) {
    console.error('Error reassigning admin:', error);
    return NextResponse.json(
      { error: 'Failed to reassign admin' },
      { status: 500 }
    );
  }
}
