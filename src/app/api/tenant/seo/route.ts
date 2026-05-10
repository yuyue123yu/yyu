import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', session.user.id)
      .single();

    if (!profile?.tenant_id) {
      return NextResponse.json(
        { error: 'User not associated with tenant' },
        { status: 400 }
      );
    }

    const { data: settings, error } = await supabase
      .from('tenant_settings')
      .select('setting_value')
      .eq('tenant_id', profile.tenant_id)
      .eq('setting_key', 'seo')
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch SEO settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      seo: settings?.setting_value || {},
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

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

    if (profile.user_type !== 'owner' && profile.user_type !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const seo = await request.json();

    const { error } = await supabase.from('tenant_settings').upsert(
      {
        tenant_id: profile.tenant_id,
        setting_key: 'seo',
        setting_value: seo,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'tenant_id,setting_key',
      }
    );

    if (error) {
      return NextResponse.json(
        { error: 'Failed to save SEO settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'SEO settings saved successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
