// OEM Configuration API - Update Single Setting
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { logAuditEvent } from '@/lib/audit';
import { createClient } from '@/lib/supabase/server';

/**
 * PUT /api/super-admin/tenants/:id/settings/:key
 * Update a specific setting
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; key: string } }
) {
  // Verify super admin authentication
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { supabase } = authResult;
  const { id, key } = params;

  try {
    const body = await request.json();
    const { value } = body;

    if (value === undefined) {
      return NextResponse.json(
        { error: 'Value is required' },
        { status: 400 }
      );
    }

    // Verify tenant exists
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('id', id)
      .single();

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Get current setting value for audit log
    const { data: currentSetting } = await supabase
      .from('tenant_settings')
      .select('setting_value')
      .eq('tenant_id', id)
      .eq('setting_key', key)
      .single();

    // Upsert setting
    const { data: setting, error: upsertError } = await supabase
      .from('tenant_settings')
      .upsert(
        {
          tenant_id: id,
          setting_key: key,
          setting_value: value,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'tenant_id,setting_key',
        }
      )
      .select()
      .single();

    if (upsertError) {
      throw upsertError;
    }

    // Log audit event
    await logAuditEvent(
      {
        action_type: 'tenant.settings.update',
        target_entity: 'tenant_settings',
        target_id: id,
        changes: {
          setting_key: key,
          previous_value: currentSetting?.setting_value,
          new_value: value,
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: 'Setting updated successfully',
      setting,
    });
  } catch (error) {
    console.error('Error updating tenant setting:', error);
    return NextResponse.json(
      { error: 'Failed to update tenant setting' },
      { status: 500 }
    );
  }
}
