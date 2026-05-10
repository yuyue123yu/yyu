import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { createClient } from '@/lib/supabase/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/super-admin/diagnostics/database
 * Test database connection and basic queries
 */
export async function GET(request: NextRequest) {
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { supabase } = authResult;

  try {
    // Test database connection by querying tenants table
    const { data, error } = await supabase
      .from('tenants')
      .select('count')
      .limit(1);

    if (error) {
      return NextResponse.json({
        success: false,
        message: `Database connection failed: ${error.message}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Check failed: ${error}`,
    });
  }
}
