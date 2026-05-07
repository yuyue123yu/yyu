// Super Admin Authentication Middleware
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export interface SuperAdminAuthResult {
  user: any;
  profile: any;
  supabase: any;
}

/**
 * Middleware to verify super admin access
 * Checks if the user has super_admin flag set to true
 * Enables RLS bypass for super admin operations
 */
export async function requireSuperAdmin(
  request: Request
): Promise<NextResponse | SuperAdminAuthResult> {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized: Authentication required' },
      { status: 401 }
    );
  }

  // Check super_admin flag
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('super_admin, tenant_id, user_type')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json(
      { error: 'Profile not found' },
      { status: 404 }
    );
  }

  if (!profile.super_admin) {
    return NextResponse.json(
      { error: 'Forbidden: Super admin access required' },
      { status: 403 }
    );
  }

  // Enable RLS bypass for super admin
  try {
    await supabase.rpc('set_config', {
      setting: 'app.bypass_rls',
      value: 'true',
    });
  } catch (error) {
    console.error('Failed to enable RLS bypass:', error);
    // Continue anyway - the RLS bypass is optional for some operations
  }

  return { user, profile, supabase };
}

/**
 * Check if the current user is a super admin
 * Returns boolean without throwing errors
 */
export async function isSuperAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return false;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('super_admin')
      .eq('id', user.id)
      .single();

    return profile?.super_admin === true;
  } catch (error) {
    console.error('Error checking super admin status:', error);
    return false;
  }
}

/**
 * Enable RLS bypass for super admin operations
 * Should be called after verifying super admin status
 */
export async function enableRLSBypass(): Promise<void> {
  const supabase = await createClient();

  try {
    await supabase.rpc('set_config', {
      setting: 'app.bypass_rls',
      value: 'true',
    });
  } catch (error) {
    console.error('Failed to enable RLS bypass:', error);
    throw new Error('Failed to enable RLS bypass');
  }
}

/**
 * Disable RLS bypass after super admin operations
 * Should be called to restore normal RLS behavior
 */
export async function disableRLSBypass(): Promise<void> {
  const supabase = await createClient();

  try {
    await supabase.rpc('set_config', {
      setting: 'app.bypass_rls',
      value: 'false',
    });
  } catch (error) {
    console.error('Failed to disable RLS bypass:', error);
    // Don't throw - this is cleanup
  }
}
