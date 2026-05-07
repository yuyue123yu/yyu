// Backward Compatibility - Tenant Context Fallback
import { createClient } from '@/lib/supabase/server';

/**
 * Ensure tenant context is set for requests
 * Falls back to default tenant if no tenant context is found
 * This ensures existing functionality continues to work
 */
export async function ensureTenantContext(): Promise<{
  tenantId: string;
  isDefault: boolean;
}> {
  const supabase = await createClient();

  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      // No authenticated user, return default tenant
      return await getDefaultTenant();
    }

    // Get user's profile to check tenant_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', userData.user.id)
      .single();

    if (profileError || !profile || !profile.tenant_id) {
      // No tenant assigned, return default tenant
      return await getDefaultTenant();
    }

    // User has tenant assigned
    return {
      tenantId: profile.tenant_id,
      isDefault: false,
    };
  } catch (error) {
    console.error('Error ensuring tenant context:', error);
    // Fallback to default tenant on error
    return await getDefaultTenant();
  }
}

/**
 * Get default tenant ID
 * Creates default tenant if it doesn't exist
 */
async function getDefaultTenant(): Promise<{
  tenantId: string;
  isDefault: true;
}> {
  const supabase = await createClient();

  try {
    // Try to get existing default tenant
    const { data: existingTenant, error: fetchError } = await supabase
      .from('tenants')
      .select('id')
      .eq('subdomain', 'default')
      .single();

    if (!fetchError && existingTenant) {
      return {
        tenantId: existingTenant.id,
        isDefault: true,
      };
    }

    // Default tenant doesn't exist, create it
    const { data: newTenant, error: createError } = await supabase
      .from('tenants')
      .insert({
        name: 'Default Tenant',
        subdomain: 'default',
        domain: null,
        status: 'active',
        subscription_plan: 'free',
        subscription_status: 'active',
      })
      .select('id')
      .single();

    if (createError || !newTenant) {
      throw new Error('Failed to create default tenant');
    }

    return {
      tenantId: newTenant.id,
      isDefault: true,
    };
  } catch (error) {
    console.error('Error getting default tenant:', error);
    throw error;
  }
}

/**
 * Migrate user to default tenant if they don't have one
 * @param userId - User ID
 */
export async function migrateUserToDefaultTenant(userId: string): Promise<void> {
  const supabase = await createClient();

  try {
    const { tenantId } = await getDefaultTenant();

    // Update user's tenant_id
    await supabase
      .from('profiles')
      .update({ tenant_id: tenantId })
      .eq('id', userId)
      .is('tenant_id', null);

    console.log(`Migrated user ${userId} to default tenant ${tenantId}`);
  } catch (error) {
    console.error('Error migrating user to default tenant:', error);
    throw error;
  }
}

/**
 * Check if tenant context is required for a route
 * @param path - Request path
 * @returns true if tenant context is required
 */
export function isTenantContextRequired(path: string): boolean {
  // Super admin routes don't require tenant context
  if (path.startsWith('/api/super-admin')) {
    return false;
  }

  // Auth routes don't require tenant context
  if (path.startsWith('/api/auth')) {
    return false;
  }

  // Public routes don't require tenant context
  const publicRoutes = ['/api/health', '/api/status'];
  if (publicRoutes.includes(path)) {
    return false;
  }

  // All other routes require tenant context
  return true;
}

/**
 * Validate tenant exists and is active
 * @param tenantId - Tenant ID
 * @returns true if tenant is valid
 */
export async function validateTenant(tenantId: string): Promise<{
  isValid: boolean;
  tenant?: any;
  reason?: string;
}> {
  const supabase = await createClient();

  try {
    const { data: tenant, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single();

    if (error || !tenant) {
      return {
        isValid: false,
        reason: 'Tenant not found',
      };
    }

    if (tenant.status !== 'active') {
      return {
        isValid: false,
        tenant,
        reason: `Tenant is ${tenant.status}`,
      };
    }

    return {
      isValid: true,
      tenant,
    };
  } catch (error) {
    console.error('Error validating tenant:', error);
    return {
      isValid: false,
      reason: 'Validation error',
    };
  }
}
