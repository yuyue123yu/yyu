import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/super-admin/analytics/export
 * Export analytics data in CSV or PDF format
 */
export async function POST(request: NextRequest) {
  // Verify super admin authentication
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'csv';
  const dateRange = searchParams.get('dateRange') || 'monthly';
  const tenant = searchParams.get('tenant') || 'all';

  try {
    // TODO: Fetch actual analytics data from database
    const analyticsData = {
      systemMetrics: {
        totalUsers: 1250,
        totalConsultations: 3450,
        totalRevenue: 875000,
        activeLawyers: 85,
      },
      tenantMetrics: [
        {
          tenantName: 'Tenant A',
          userCount: 450,
          consultationCount: 1200,
          revenue: 320000,
          activeLawyers: 30,
        },
        {
          tenantName: 'Tenant B',
          userCount: 380,
          consultationCount: 980,
          revenue: 245000,
          activeLawyers: 25,
        },
      ],
    };

    if (format === 'csv') {
      // Generate CSV
      const csv = generateCSV(analyticsData);

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="analytics-${Date.now()}.csv"`,
        },
      });
    } else if (format === 'pdf') {
      // For PDF, we would use a library like jsPDF or pdfkit
      // For now, return a simple text file as placeholder
      const text = generateTextReport(analyticsData);

      return new NextResponse(text, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="analytics-${Date.now()}.txt"`,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
  } catch (error) {
    console.error('Error exporting analytics:', error);
    return NextResponse.json(
      { error: 'Failed to export analytics' },
      { status: 500 }
    );
  }
}

function generateCSV(data: any): string {
  const lines: string[] = [];

  // System Metrics
  lines.push('System Metrics');
  lines.push('Metrics,Value');
  lines.push(`Total Users,${data.systemMetrics.totalUsers}`);
  lines.push(`Total Consultations,${data.systemMetrics.totalConsultations}`);
  lines.push(`Total Revenue,${data.systemMetrics.totalRevenue}`);
  lines.push(`Active Lawyers,${data.systemMetrics.activeLawyers}`);
  lines.push('');

  // Tenant Metrics
  lines.push('Tenant Metrics');
  lines.push('Tenant Name,User Count,Consultation Count,Revenue,Active Lawyers');
  data.tenantMetrics.forEach((tenant: any) => {
    lines.push(
      `${tenant.tenantName},${tenant.userCount},${tenant.consultationCount},${tenant.revenue},${tenant.activeLawyers}`
    );
  });

  return lines.join('\n');
}

function generateTextReport(data: any): string {
  const lines: string[] = [];

  lines.push('='.repeat(60));
  lines.push('Analytics Report');
  lines.push('Generated: ' + new Date().toLocaleString('en-US'));
  lines.push('='.repeat(60));
  lines.push('');

  lines.push('System Metrics:');
  lines.push(`  Total Users: ${data.systemMetrics.totalUsers.toLocaleString()}`);
  lines.push(`  Total Consultations: ${data.systemMetrics.totalConsultations.toLocaleString()}`);
  lines.push(`  Total Revenue: $${data.systemMetrics.totalRevenue.toLocaleString()}`);
  lines.push(`  Active Lawyers: ${data.systemMetrics.activeLawyers}`);
  lines.push('');

  lines.push('Tenant Metrics:');
  data.tenantMetrics.forEach((tenant: any, index: number) => {
    lines.push(`  ${index + 1}. ${tenant.tenantName}`);
    lines.push(`     User Count: ${tenant.userCount.toLocaleString()}`);
    lines.push(`     Consultation Count: ${tenant.consultationCount.toLocaleString()}`);
    lines.push(`     Revenue: $${tenant.revenue.toLocaleString()}`);
    lines.push(`     Active Lawyers: ${tenant.activeLawyers}`);
    lines.push('');
  });

  lines.push('='.repeat(60));

  return lines.join('\n');
}
