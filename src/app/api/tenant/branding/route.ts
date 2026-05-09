// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/tenant/branding
 * Get tenant branding settings
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify user authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user's tenant information
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id, user_type')
      .eq('id', session.user.id)
      .single();

    if (!profile?.tenant_id) {
      return NextResponse.json(
        { error: 'User not associated with tenant' },
        { status: 400 }
      );
    }

    // Get branding settings
    const { data: settings, error } = await supabase
      .from('tenant_settings')
      .select('setting_value')
      .eq('tenant_id', profile.tenant_id)
      .eq('setting_key', 'branding')
      .maybeSingle();

    if (error) {
      console.error('Error fetching branding settings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch settings' },
        { status: 500 }
      );
    }

    // Return default values or saved settings
    const defaultBranding = {
      logo_url: '',
      primary_color: '#1E40AF',
      secondary_color: '#F59E0B',
      company_name: '',
      company_description: '',
      contact_phone: '',
      contact_email: '',
      contact_address: '',
      social_links: {
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: '',
      },
    };

    return NextResponse.json({
      success: true,
      branding: settings?.setting_value || defaultBranding,
    });
  } catch (error: any) {
    console.error('Error in GET /api/tenant/branding:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/**
 * PUT /api/tenant/branding
 * Update tenant branding settings
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify user authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user's tenant information and permissions
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id, user_type')
      .eq('id', session.user.id)
      .single();

    if (!profile?.tenant_id) {
      return NextResponse.json(
        { error: 'User not associated with tenant' },
        { status: 400 }
      );
    }

    // Check permissions: must be owner or admin
    if (profile.user_type !== 'owner' && profile.user_type !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get request data
    const branding = await request.json();

    // Validate required fields
    if (!branding.company_name) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    // Validate color format
    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!colorRegex.test(branding.primary_color)) {
      return NextResponse.json(
        { error: 'Invalid primary color format' },
        { status: 400 }
      );
    }
    if (!colorRegex.test(branding.secondary_color)) {
      return NextResponse.json(
        { error: 'Invalid secondary color format' },
        { status: 400 }
      );
    }

    // Save or update branding settings
    const { error } = await supabase.from('tenant_settings').upsert(
      {
        tenant_id: profile.tenant_id,
        setting_key: 'branding',
        setting_value: branding,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'tenant_id,setting_key',
      }
    );

    if (error) {
      console.error('Error updating branding settings:', error);
      return NextResponse.json(
        { error: 'Failed to save settings' },
        { status: 500 }
      );
    }

    // Log audit trail
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'update_branding',
      resource_type: 'tenant_settings',
      resource_id: profile.tenant_id,
      details: { updated_fields: Object.keys(branding) },
    });

    return NextResponse.json({
      success: true,
      message: 'Branding settings saved successfully',
    });
  } catch (error: any) {
    console.error('Error in PUT /api/tenant/branding:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
