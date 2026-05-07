// MFA Check API - Check if user has MFA enabled
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/super-admin/mfa/check
 * Check if current user has MFA enabled
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  try {
    const { data: userData, error } = await supabase.auth.getUser();

    if (error || !userData.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const mfaEnabled = userData.user.user_metadata?.mfa_enabled === true;

    return NextResponse.json({
      success: true,
      mfaEnabled,
    });
  } catch (error) {
    console.error('Error checking MFA status:', error);
    return NextResponse.json(
      { error: 'Failed to check MFA status' },
      { status: 500 }
    );
  }
}
