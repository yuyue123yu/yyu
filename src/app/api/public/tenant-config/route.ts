// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Public tenant config API
 * No login required
 * Used for frontend pages to read tenant branding, pricing and other configs
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // Get the first active tenant (simplified approach)
    // TODO: In the future, identify tenant based on domain
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('id, name, subdomain')
      .eq('status', 'active')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (tenantError || !tenant) {
      console.error('Failed to get tenant:', tenantError);
      return NextResponse.json(
        { error: 'Tenant config not found' },
        { status: 404 }
      );
    }

    // Get all tenant settings
    const { data: settings, error: settingsError } = await supabase
      .from('tenant_settings')
      .select('setting_key, setting_value')
      .eq('tenant_id', tenant.id);

    if (settingsError) {
      console.error('Failed to get settings:', settingsError);
      return NextResponse.json(
        { error: 'Failed to get settings' },
        { status: 500 }
      );
    }

    // Convert settings to object format
    const config: Record<string, any> = {
      tenant: {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
      },
    };

    settings?.forEach((setting) => {
      try {
        config[setting.setting_key] = JSON.parse(setting.setting_value);
      } catch (e) {
        config[setting.setting_key] = setting.setting_value;
      }
    });

    // Return config (add cache headers)
    return NextResponse.json(config, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Failed to get tenant config:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
