// Tenant Management API - Get, Update, Delete Tenant
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { logAuditEvent } from '@/lib/audit';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/super-admin/tenants/:id
 * Get tenant details
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
    // Get tenant details
    const { data: tenant, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Get tenant settings
    const { data: settings } = await supabase
      .from('tenant_settings')
      .select('*')
      .eq('tenant_id', id);

    // Get tenant stats
    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', id);

    return NextResponse.json({
      success: true,
      tenant,
      settings: settings || [],
      stats: {
        user_count: userCount || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching tenant:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenant' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/super-admin/tenants/:id
 * Update tenant configuration
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
    const { name, subdomain, primary_domain, status, subscription_plan, metadata } =
      body;

    // Get current tenant data for audit log
    const { data: currentTenant } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', id)
      .single();

    if (!currentTenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Check subdomain uniqueness if changed
    if (subdomain && subdomain !== currentTenant.subdomain) {
      const { data: existingTenant } = await supabase
        .from('tenants')
        .select('id')
        .eq('subdomain', subdomain)
        .neq('id', id)
        .single();

      if (existingTenant) {
        return NextResponse.json(
          { error: 'Subdomain already exists' },
          { status: 409 }
        );
      }
    }

    // Check primary_domain uniqueness if changed
    if (primary_domain && primary_domain !== currentTenant.primary_domain) {
      const { data: existingDomain } = await supabase
        .from('tenants')
        .select('id')
        .eq('primary_domain', primary_domain)
        .neq('id', id)
        .single();

      if (existingDomain) {
        return NextResponse.json(
          { error: 'Primary domain already exists' },
          { status: 409 }
        );
      }
    }

    // Build update object
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updates.name = name;
    if (subdomain !== undefined) updates.subdomain = subdomain;
    if (primary_domain !== undefined) updates.primary_domain = primary_domain;
    if (status !== undefined) updates.status = status;
    if (subscription_plan !== undefined)
      updates.subscription_plan = subscription_plan;
    if (metadata !== undefined) updates.metadata = metadata;

    // Update tenant
    const { data: tenant, error: updateError } = await supabase
      .from('tenants')
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
        action_type: 'tenant.update',
        target_entity: 'tenants',
        target_id: id,
        changes: {
          before: currentTenant,
          after: tenant,
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: 'Tenant updated successfully',
      tenant,
    });
  } catch (error) {
    console.error('Error updating tenant:', error);
    return NextResponse.json(
      { error: 'Failed to update tenant' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/super-admin/tenants/:id
 * Delete tenant (with confirmation)
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
    // Get tenant data before deletion for audit log
    const { data: tenant } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', id)
      .single();

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Prevent deletion of default tenant
    if (id === '00000000-0000-0000-0000-000000000001') {
      return NextResponse.json(
        { error: 'Cannot delete default tenant' },
        { status: 403 }
      );
    }

    // Delete tenant (CASCADE will handle related data)
    const { error: deleteError } = await supabase
      .from('tenants')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    // Log audit event
    await logAuditEvent(
      {
        action_type: 'tenant.delete',
        target_entity: 'tenants',
        target_id: id,
        changes: {
          deleted_tenant: tenant,
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: 'Tenant deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting tenant:', error);
    return NextResponse.json(
      { error: 'Failed to delete tenant' },
      { status: 500 }
    );
  }
}
