// Maintenance Mode Toggle API
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { logAuditEvent } from '@/lib/audit';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/super-admin/system-settings/maintenance-mode
 * Toggle maintenance mode
 */
export async function POST(request: NextRequest) {
  // Verify super admin authentication
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { supabase } = authResult;

  try {
    const body = await request.json();
    const { enabled, message } = body;

    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'enabled must be a boolean' },
        { status: 400 }
      );
    }

    // Get current maintenance mode status
    const { data: currentSetting } = await supabase
      .from('system_settings')
      .select('*')
      .eq('setting_key', 'maintenance_mode')
      .single();

    // Create the maintenance mode object
    const maintenanceMode = {
      enabled,
      message: message || '',
    };

    // Update maintenance mode
    const { error: modeError } = await supabase
      .from('system_settings')
      .upsert(
        {
          setting_key: 'maintenance_mode',
          setting_value: maintenanceMode,
          description: 'System maintenance mode',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'setting_key' }
      );

    if (modeError) {
      console.error('Error updating maintenance mode:', modeError);
      return NextResponse.json(
        { error: 'Failed to update maintenance mode' },
        { status: 500 }
      );
    }

    // Log audit event
    await logAuditEvent(
      {
        action_type: 'system_settings.maintenance_mode',
        target_entity: 'system_settings',
        target_id: 'maintenance_mode',
        changes: {
          old_value: currentSetting?.setting_value,
          new_value: maintenanceMode,
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'} successfully`,
      maintenance_mode: maintenanceMode,
    });
  } catch (error) {
    console.error('Error toggling maintenance mode:', error);
    return NextResponse.json(
      { error: 'Failed to toggle maintenance mode' },
      { status: 500 }
    );
  }
}
