// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';

/**
 * GET /api/super-admin/diagnostics/env
 * Check environment variables configuration
 */
export async function GET(request: NextRequest) {
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
    };

    const allConfigured = Object.values(envVars).every((v) => v === true);

    return NextResponse.json({
      success: allConfigured,
      message: allConfigured
        ? 'All environment variables are configured'
        : 'Some environment variables are missing',
      variables: envVars,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Check failed: ${error}`,
    });
  }
}
