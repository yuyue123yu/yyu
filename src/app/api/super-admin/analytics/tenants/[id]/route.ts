// Tenant Analytics API
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/super-admin/analytics/tenants/:id
 * Get tenant metrics and analytics
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Verify super admin authentication
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { supabase } = authResult;

  try {
    const { id: tenantId } = params;

    // Get tenant info
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single();

    if (tenantError || !tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Get user count
    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId);

    // Get active user count (logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { count: activeUserCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .gte('last_sign_in_at', thirtyDaysAgo.toISOString());

    // Get lawyer count
    const { count: lawyerCount } = await supabase
      .from('lawyers')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId);

    // Get consultation count
    const { count: consultationCount } = await supabase
      .from('consultations')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId);

    // Get consultation count by status
    const { data: consultationsByStatus } = await supabase
      .from('consultations')
      .select('status')
      .eq('tenant_id', tenantId);

    const consultationStatusCounts = (consultationsByStatus || []).reduce(
      (acc: Record<string, number>, item: any) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      },
      {}
    );

    // Get order count
    const { count: orderCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId);

    // Get total revenue
    const { data: orders } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('tenant_id', tenantId)
      .eq('status', 'completed');

    const totalRevenue = (orders || []).reduce(
      (sum: number, order: any) => sum + (order.total_amount || 0),
      0
    );

    // Get review count and average rating
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('tenant_id', tenantId);

    const reviewCount = reviews?.length || 0;
    const averageRating =
      reviewCount > 0
        ? reviews!.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewCount
        : 0;

    // Get article count
    const { count: articleCount } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: newUsersLast7Days } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .gte('created_at', sevenDaysAgo.toISOString());

    const { count: newConsultationsLast7Days } = await supabase
      .from('consultations')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .gte('created_at', sevenDaysAgo.toISOString());

    const { count: newOrdersLast7Days } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .gte('created_at', sevenDaysAgo.toISOString());

    // Calculate growth rates (compared to previous 7 days)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const { count: newUsersPrevious7Days } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .gte('created_at', fourteenDaysAgo.toISOString())
      .lt('created_at', sevenDaysAgo.toISOString());

    const userGrowthRate =
      newUsersPrevious7Days && newUsersPrevious7Days > 0
        ? ((newUsersLast7Days! - newUsersPrevious7Days) / newUsersPrevious7Days) * 100
        : 0;

    return NextResponse.json({
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        status: tenant.status,
        created_at: tenant.created_at,
      },
      metrics: {
        users: {
          total: userCount || 0,
          active: activeUserCount || 0,
          new_last_7_days: newUsersLast7Days || 0,
          growth_rate: userGrowthRate.toFixed(2) + '%',
        },
        lawyers: {
          total: lawyerCount || 0,
        },
        consultations: {
          total: consultationCount || 0,
          by_status: consultationStatusCounts,
          new_last_7_days: newConsultationsLast7Days || 0,
        },
        orders: {
          total: orderCount || 0,
          new_last_7_days: newOrdersLast7Days || 0,
        },
        revenue: {
          total: totalRevenue,
          currency: 'CNY',
        },
        reviews: {
          total: reviewCount,
          average_rating: averageRating.toFixed(2),
        },
        articles: {
          total: articleCount || 0,
        },
      },
      calculated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching tenant analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenant analytics' },
      { status: 500 }
    );
  }
}
