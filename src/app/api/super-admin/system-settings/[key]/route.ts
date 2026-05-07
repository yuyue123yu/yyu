// System Settings Update API
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { logAuditEvent } from '@/lib/audit';
import { createClient } from '@/lib/supabase/server';

/**
 * PUT /api/super-admin/system-settings/:key
 * Update a system setting
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  // Verify super admin authentication
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { supabase } = authResult;

  try {
    const { key } = params;
    const body = await request.json();
    const { value, description } = body;

    if (value === undefined) {
      return NextResponse.json(
        { error: 'value is required' },
        { status: 400 }
      );
    }

    // Get current value for audit log
    const { data: currentSetting } = await supabase
      .from('system_settings')
      .select('*')
      .eq('setting_key', key)
      .single();

    // Validate setting value based on key
    const validationError = validateSettingValue(key, value);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Upsert setting
    const { data, error } = await supabase
      .from('system_settings')
      .upsert(
        {
          setting_key: key,
          setting_value: value,
          description: description || currentSetting?.description || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'setting_key' }
      )
      .select()
      .single();

    if (error) {
      console.error('Error updating system setting:', error);
      return NextResponse.json(
        { error: 'Failed to update system setting' },
        { status: 500 }
      );
    }

    // Log audit event
    await logAuditEvent(
      {
        action_type: 'system_settings.update',
        target_entity: 'system_settings',
        target_id: key,
        changes: {
          key,
          old_value: currentSetting?.setting_value,
          new_value: value,
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: 'System setting updated successfully',
      setting: data,
    });
  } catch (error) {
    console.error('Error updating system setting:', error);
    return NextResponse.json(
      { error: 'Failed to update system setting' },
      { status: 500 }
    );
  }
}

/**
 * Validate setting value based on key
 */
function validateSettingValue(key: string, value: any): string | null {
  switch (key) {
    case 'maintenance_mode':
      if (typeof value !== 'boolean') {
        return 'maintenance_mode must be a boolean';
      }
      break;

    case 'max_tenants':
      if (typeof value !== 'number' || value < 1) {
        return 'max_tenants must be a positive number';
      }
      break;

    case 'default_user_quota':
      if (typeof value !== 'number' || value < 1) {
        return 'default_user_quota must be a positive number';
      }
      break;

    case 'session_timeout_minutes':
      if (typeof value !== 'number' || value < 1 || value > 1440) {
        return 'session_timeout_minutes must be between 1 and 1440';
      }
      break;

    case 'password_min_length':
      if (typeof value !== 'number' || value < 8 || value > 128) {
        return 'password_min_length must be between 8 and 128';
      }
      break;

    case 'api_rate_limit':
      if (typeof value !== 'number' || value < 1) {
        return 'api_rate_limit must be a positive number';
      }
      break;

    default:
      // Allow any value for unknown keys
      break;
  }

  return null;
}
