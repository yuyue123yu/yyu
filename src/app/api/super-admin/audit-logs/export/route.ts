// Audit Logs Export API
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { createClient } from '@/lib/supabase/server';
import { logAuditEvent } from '@/lib/audit';

/**
 * GET /api/super-admin/audit-logs/export?format=csv|json
 * Export audit logs
 */
export async function GET(request: NextRequest) {
  // Verify super admin authentication
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user, supabase } = authResult;

  try {
    const { searchParams } = new URL(request.url);
    
    // Export format
    const format = searchParams.get('format') || 'csv';
    if (!['csv', 'json'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Use csv or json' },
        { status: 400 }
      );
    }

    // Filters (same as query endpoint)
    const action_type = searchParams.get('action_type');
    const target_entity = searchParams.get('target_entity');
    const target_id = searchParams.get('target_id');
    const user_id = searchParams.get('user_id');
    const tenant_id = searchParams.get('tenant_id');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');

    // Build query (no pagination for export)
    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10000); // Safety limit

    // Apply filters
    if (action_type) query = query.eq('action_type', action_type);
    if (target_entity) query = query.eq('target_entity', target_entity);
    if (target_id) query = query.eq('target_id', target_id);
    if (user_id) query = query.eq('user_id', user_id);
    if (tenant_id) query = query.eq('tenant_id', tenant_id);
    if (start_date) query = query.gte('created_at', start_date);
    if (end_date) query = query.lte('created_at', end_date);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching audit logs for export:', error);
      return NextResponse.json(
        { error: 'Failed to fetch audit logs' },
        { status: 500 }
      );
    }

    // Log export action
    await logAuditEvent(
      {
        action_type: 'audit_logs.export',
        target_entity: 'audit_logs',
        target_id: undefined,
        changes: {
          format,
          record_count: data?.length || 0,
          filters: {
            action_type,
            target_entity,
            target_id,
            user_id,
            tenant_id,
            start_date,
            end_date,
          },
        },
      },
      request
    );

    if (format === 'json') {
      // JSON export
      return NextResponse.json(data || [], {
        headers: {
          'Content-Disposition': `attachment; filename="audit-logs-${Date.now()}.json"`,
          'Content-Type': 'application/json',
        },
      });
    } else {
      // CSV export
      const logs = data || [];
      
      if (logs.length === 0) {
        return new NextResponse('No data to export', {
          status: 200,
          headers: {
            'Content-Disposition': `attachment; filename="audit-logs-${Date.now()}.csv"`,
            'Content-Type': 'text/csv',
          },
        });
      }

      // CSV headers
      const headers = [
        'id',
        'action_type',
        'target_entity',
        'target_id',
        'user_id',
        'tenant_id',
        'ip_address',
        'user_agent',
        'changes',
        'created_at',
      ];

      // CSV rows
      const rows = logs.map((log: any) => [
        log.id,
        log.action_type,
        log.target_entity,
        log.target_id || '',
        log.user_id || '',
        log.tenant_id || '',
        log.ip_address || '',
        log.user_agent || '',
        JSON.stringify(log.changes || {}),
        log.created_at,
      ]);

      // Build CSV
      const csv = [
        headers.join(','),
        ...rows.map((row: any[]) =>
          row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ),
      ].join('\n');

      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Disposition': `attachment; filename="audit-logs-${Date.now()}.csv"`,
          'Content-Type': 'text/csv',
        },
      });
    }
  } catch (error) {
    console.error('Error exporting audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to export audit logs' },
      { status: 500 }
    );
  }
}
