// User Management API - Migrate User to Different Tenant
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { logAuditEvent } from '@/lib/audit';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/super-admin/users/:id/migrate
 * Migrate user to a different tenant
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
    const body = await request.json();
    const { target_tenant_id } = body;

    if (!target_tenant_id) {
      return NextResponse.json(
        { error: 'target_tenant_id is required' },
        { status: 400 }
      );
    }

    // Get current user
    const { data: currentUser } = await supabase
      .from('profiles')
      .select('*, tenants:tenant_id(name)')
      .eq('id', id)
      .single();

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify target tenant exists
    const { data: targetTenant } = await supabase
      .from('tenants')
      .select('id, name, status')
      .eq('id', target_tenant_id)
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

    // Check if already in target tenant
    if (currentUser.tenant_id === target_tenant_id) {
      return NextResponse.json(
        { error: 'User is already in the target tenant' },
        { status: 400 }
      );
    }

    // Update user's tenant_id
    const { data: user, error: updateError } = await supabase
      .from('profiles')
      .update({
        tenant_id: target_tenant_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Migrate related data
    let migratedDataCount = 0;

    // Migrate consultations
    const { error: consultationsError } = await supabase
      .from('consultations')
      .update({ tenant_id: target_tenant_id })
      .eq('user_id', id);

    if (!consultationsError) migratedDataCount++;

    // Migrate orders
    const { error: ordersError } = await supabase
      .from('orders')
      .update({ tenant_id: target_tenant_id })
      .eq('user_id', id);

    if (!ordersError) migratedDataCount++;

    // Migrate favorites
    const { error: favoritesError } = await supabase
      .from('favorites')
      .update({ tenant_id: target_tenant_id })
      .eq('user_id', id);

    if (!favoritesError) migratedDataCount++;

    // Migrate cart
    const { error: cartError } = await supabase
      .from('cart')
      .update({ tenant_id: target_tenant_id })
      .eq('user_id', id);

    if (!cartError) migratedDataCount++;

    // Log audit event
    await logAuditEvent(
      {
        action_type: 'user.migrate',
        target_entity: 'profiles',
        target_id: id,
        changes: {
          user_email: currentUser.email,
          from_tenant_id: currentUser.tenant_id,
          from_tenant_name: currentUser.tenants?.name,
          to_tenant_id: target_tenant_id,
          to_tenant_name: targetTenant.name,
          migrated_data_count: migratedDataCount,
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: 'User migrated successfully',
      user,
      migrated_data_count: migratedDataCount,
      from_tenant: {
        id: currentUser.tenant_id,
        name: currentUser.tenants?.name,
      },
      to_tenant: {
        id: targetTenant.id,
        name: targetTenant.name,
      },
    });
  } catch (error) {
    console.error('Error migrating user:', error);
    return NextResponse.json(
      { error: 'Failed to migrate user' },
      { status: 500 }
    );
  }
}
