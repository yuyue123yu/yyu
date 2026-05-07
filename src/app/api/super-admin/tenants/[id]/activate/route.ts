// Tenant Management API - Activate Tenant
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { logAuditEvent } from '@/lib/audit';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/super-admin/tenants/:id/activate
 * Activate a tenant
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
    // Get current tenant
    const { data: currentTenant } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', id)
      .single();

    if (!currentTenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Update tenant status to active
    const { data: tenant, error: updateError } = await supabase
      .from('tenants')
      .update({
        status: 'active',
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
        action_type: 'tenant.activate',
        target_entity: 'tenants',
        target_id: id,
        changes: {
          previous_status: currentTenant.status,
          new_status: 'active',
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: 'Tenant activated successfully',
      tenant,
    });
  } catch (error) {
    console.error('Error activating tenant:', error);
    return NextResponse.json(
      { error: 'Failed to activate tenant' },
      { status: 500 }
    );
  }
}
