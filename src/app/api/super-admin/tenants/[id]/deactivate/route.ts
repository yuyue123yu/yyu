// Tenant Management API - Deactivate Tenant
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { logAuditEvent } from '@/lib/audit';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/super-admin/tenants/:id/deactivate
 * Deactivate a tenant
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
    // Prevent deactivation of default tenant
    if (id === '00000000-0000-0000-0000-000000000001') {
      return NextResponse.json(
        { error: 'Cannot deactivate default tenant' },
        { status: 403 }
      );
    }

    // Get current tenant
    const { data: currentTenant } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', id)
      .single();

    if (!currentTenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Update tenant status to inactive
    const { data: tenant, error: updateError } = await supabase
      .from('tenants')
      .update({
        status: 'inactive',
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
        action_type: 'tenant.deactivate',
        target_entity: 'tenants',
        target_id: id,
        changes: {
          previous_status: currentTenant.status,
          new_status: 'inactive',
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: 'Tenant deactivated successfully',
      tenant,
    });
  } catch (error) {
    console.error('Error deactivating tenant:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate tenant' },
      { status: 500 }
    );
  }
}
