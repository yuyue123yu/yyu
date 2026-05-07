// OEM Configuration API - Get and Update Settings
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { logAuditEvent } from '@/lib/audit';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/super-admin/tenants/:id/settings
 * Get all settings for a tenant
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
    // Verify tenant exists
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('id', id)
      .single();

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Get all settings for the tenant
    const { data: settings, error } = await supabase
      .from('tenant_settings')
      .select('*')
      .eq('tenant_id', id);

    if (error) {
      throw error;
    }

    // Convert array to object for easier access
    const settingsObject: Record<string, any> = {};
    settings?.forEach((setting: any) => {
      settingsObject[setting.setting_key] = setting.setting_value;
    });

    return NextResponse.json({
      success: true,
      settings: settingsObject,
    });
  } catch (error) {
    console.error('Error fetching tenant settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenant settings' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/super-admin/tenants/:id/settings/bulk
 * Bulk update settings
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
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Settings object is required' },
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

    // Prepare upsert data
    const upsertData = Object.entries(settings).map(([key, value]) => ({
      tenant_id: id,
      setting_key: key,
      setting_value: value,
      updated_at: new Date().toISOString(),
    }));

    // Upsert settings
    const { error: upsertError } = await supabase
      .from('tenant_settings')
      .upsert(upsertData, {
        onConflict: 'tenant_id,setting_key',
      });

    if (upsertError) {
      throw upsertError;
    }

    // Log audit event
    await logAuditEvent(
      {
        action_type: 'tenant.settings.bulk_update',
        target_entity: 'tenant_settings',
        target_id: id,
        changes: {
          updated_settings: Object.keys(settings),
          settings,
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      updated_count: upsertData.length,
    });
  } catch (error) {
    console.error('Error updating tenant settings:', error);
    return NextResponse.json(
      { error: 'Failed to update tenant settings' },
      { status: 500 }
    );
  }
}
