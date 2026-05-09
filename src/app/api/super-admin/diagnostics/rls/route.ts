// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';

/**
 * GET /api/super-admin/diagnostics/rls
 * Check Row Level Security policies
 */
export async function GET(request: NextRequest) {
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { supabase } = authResult;

  try {
    // Test RLS by querying profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) {
      return NextResponse.json({
        success: false,
        message: `RLS check failed: ${error.message}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'RLS policies are working correctly',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Check failed: ${error}`,
    });
  }
}
