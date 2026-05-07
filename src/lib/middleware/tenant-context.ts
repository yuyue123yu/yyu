// Tenant Context Middleware
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export interface TenantContextResult {
  user: any;
  profile: any;
  supabase: any;
  tenantId: string | null;
}

/**
 * Set tenant context for all requests
 * Extracts tenant_id from user profile and sets it in session
 */
export async function setTenantContext(
  request: Request
): Promise<NextResponse | TenantContextResult> {
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

  // Get user's tenant_id
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('tenant_id, super_admin, user_type')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json(
      { error: 'Profile not found' },
      { status: 404 }
    );
  }

  // Set tenant context in session if tenant_id exists
  if (profile.tenant_id) {
    try {
      await supabase.rpc('set_config', {
        setting: 'app.current_tenant_id',
        value: profile.tenant_id,
      });
    } catch (error) {
      console.error('Failed to set tenant context:', error);
      // Continue anyway - some operations might not need tenant context
    }
  } else if (!profile.super_admin) {
    // Non-super-admin users must have a tenant_id
    // Fallback to default tenant if needed
    console.warn(`User ${user.id} has no tenant_id, using default tenant`);
    try {
      await supabase.rpc('set_config', {
        setting: 'app.current_tenant_id',
        value: '00000000-0000-0000-0000-000000000001', // Default tenant
      });
    } catch (error) {
      console.error('Failed to set default tenant context:', error);
    }
  }

  // Set bypass flag for super admins (default to false)
  if (profile.super_admin) {
    try {
      await supabase.rpc('set_config', {
        setting: 'app.bypass_rls',
        value: 'false', // Default to false, explicitly enable when needed
      });
    } catch (error) {
      console.error('Failed to set bypass flag:', error);
    }
  }

  return {
    user,
    profile,
    supabase,
    tenantId: profile.tenant_id,
  };
}

/**
 * Get current tenant ID from session
 */
export async function getCurrentTenantId(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('get_tenant_id');

    if (error) {
      console.error('Failed to get tenant ID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error getting tenant ID:', error);
    return null;
  }
}

/**
 * Ensure tenant context is set, fallback to default tenant if needed
 * Used for backward compatibility with existing code
 */
export async function ensureTenantContext(): Promise<void> {
  try {
    const supabase = await createClient();
    const tenantId = await getCurrentTenantId();

    if (!tenantId) {
      // Fallback to default tenant
      await supabase.rpc('set_config', {
        setting: 'app.current_tenant_id',
        value: '00000000-0000-0000-0000-000000000001',
      });
    }
  } catch (error) {
    console.error('Failed to ensure tenant context:', error);
    // Log to monitoring service in production
  }
}
