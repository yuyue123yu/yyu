// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { createClient } from '@/lib/supabase/server';
import { getTenantId } from '@/lib/tenant';
import { NextResponse } from 'next/server';

/**
 * Public services list API
 * No login required
 * Used for frontend page to display service list
 *
 * GET /api/public/services
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // Get tenant ID from Middleware (based on domain identification)
    const tenantId = await getTenantId();

    if (!tenantId) {
      console.error('Tenant not found');
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    // Get active service list
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (servicesError) {
      console.error('Failed to get service list:', servicesError);
      return NextResponse.json(
        { error: 'Failed to get service list' },
        { status: 500 }
      );
    }

    // Return service list (add cache headers)
    return NextResponse.json(
      { services: services || [] },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Failed to get service list:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
