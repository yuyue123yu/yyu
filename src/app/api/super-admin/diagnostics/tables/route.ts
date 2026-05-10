import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/super-admin/diagnostics/tables
 * Check if all required database tables exist
 */
export async function GET(request: NextRequest) {
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { supabase } = authResult;

  try {
    const requiredTables = [
      'profiles',
      'tenants',
      'tenant_settings',
      'audit_logs',
    ];

    const tableStatus: Record<string, boolean> = {};

    for (const table of requiredTables) {
      const { error } = await supabase.from(table).select('id').limit(1);
      tableStatus[table] = !error;
    }

    const allTablesExist = Object.values(tableStatus).every((v) => v === true);

    return NextResponse.json({
      success: allTablesExist,
      message: allTablesExist
        ? 'All required tables exist'
        : 'Some required tables are missing',
      tables: tableStatus,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Check failed: ${error}`,
    });
  }
}
