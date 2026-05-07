// Tenant Comparison Analytics API
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/super-admin/analytics/compare?tenant_ids=id1,id2,id3
 * Compare metrics across multiple tenants
 */
export async function GET(request: NextRequest) {
  // Verify super admin authentication
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { supabase } = authResult;

  try {
    const { searchParams } = new URL(request.url);
    const tenantIdsParam = searchParams.get('tenant_ids');

    if (!tenantIdsParam) {
      return NextResponse.json(
        { error: 'tenant_ids parameter is required' },
        { status: 400 }
      );
    }

    const tenantIds = tenantIdsParam.split(',').map((id) => id.trim());

    if (tenantIds.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 tenant IDs are required for comparison' },
        { status: 400 }
      );
    }

    if (tenantIds.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 tenants can be compared at once' },
        { status: 400 }
      );
    }

    // Get tenant info
    const { data: tenants, error: tenantsError } = await supabase
      .from('tenants')
      .select('id, name, subdomain, status, created_at')
      .in('id', tenantIds);

    if (tenantsError || !tenants || tenants.length === 0) {
      return NextResponse.json(
        { error: 'No valid tenants found' },
        { status: 404 }
      );
    }

    // Fetch metrics for each tenant
    const comparisons = await Promise.all(
      tenants.map(async (tenant: { id: string; name: string; subdomain: string; status: string; created_at: string }) => {
        // User count
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', tenant.id);

        // Lawyer count
        const { count: lawyerCount } = await supabase
          .from('lawyers')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', tenant.id);

        // Consultation count
        const { count: consultationCount } = await supabase
          .from('consultations')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', tenant.id);

        // Order count
        const { count: orderCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', tenant.id);

        // Total revenue
        const { data: orders } = await supabase
          .from('orders')
          .select('total_amount')
          .eq('tenant_id', tenant.id)
          .eq('status', 'completed');

        const totalRevenue = (orders || []).reduce(
          (sum: number, order: any) => sum + (order.total_amount || 0),
          0
        );

        // Review count and average rating
        const { data: reviews } = await supabase
          .from('reviews')
          .select('rating')
          .eq('tenant_id', tenant.id);

        const reviewCount = reviews?.length || 0;
        const averageRating =
          reviewCount > 0
            ? reviews!.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewCount
            : 0;

        return {
          tenant: {
            id: tenant.id,
            name: tenant.name,
            subdomain: tenant.subdomain,
            status: tenant.status,
            created_at: tenant.created_at,
          },
          metrics: {
            users: userCount || 0,
            lawyers: lawyerCount || 0,
            consultations: consultationCount || 0,
            orders: orderCount || 0,
            revenue: totalRevenue,
            reviews: reviewCount,
            average_rating: parseFloat(averageRating.toFixed(2)),
          },
        };
      })
    );

    // Calculate aggregates
    const aggregates = {
      total_users: comparisons.reduce((sum, c) => sum + c.metrics.users, 0),
      total_lawyers: comparisons.reduce((sum, c) => sum + c.metrics.lawyers, 0),
      total_consultations: comparisons.reduce(
        (sum, c) => sum + c.metrics.consultations,
        0
      ),
      total_orders: comparisons.reduce((sum, c) => sum + c.metrics.orders, 0),
      total_revenue: comparisons.reduce((sum, c) => sum + c.metrics.revenue, 0),
      average_rating: parseFloat(
        (
          comparisons.reduce((sum, c) => sum + c.metrics.average_rating, 0) /
          comparisons.length
        ).toFixed(2)
      ),
    };

    return NextResponse.json({
      success: true,
      comparisons,
      aggregates,
      tenant_count: comparisons.length,
      calculated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error comparing tenant analytics:', error);
    return NextResponse.json(
      { error: 'Failed to compare tenant analytics' },
      { status: 500 }
    );
  }
}
