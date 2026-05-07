import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { verifyMFAToken } from '@/lib/mfa/totp';
import { logAuditEvent } from '@/lib/audit';

/**
 * POST /api/super-admin/mfa/disable
 * Disable MFA for user (requires current MFA token for security)
 */
export async function POST(request: NextRequest) {
  // Verify super admin authentication
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user, supabase } = authResult;

  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Current MFA token is required to disable MFA' },
        { status: 400 }
      );
    }

    // Get user's MFA secret
    const { data: userData } = await supabase.auth.getUser();
    const mfaSecret = userData.user?.user_metadata?.mfa_secret;
    const mfaEnabled = userData.user?.user_metadata?.mfa_enabled;

    if (!mfaEnabled) {
      return NextResponse.json(
        { error: 'MFA is not enabled' },
        { status: 400 }
      );
    }

    // Verify token before disabling
    const isValid = verifyMFAToken(mfaSecret, token);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid MFA token' },
        { status: 400 }
      );
    }

    // Disable MFA
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        mfa_enabled: false,
        mfa_secret: null, // Remove secret
      },
    });

    if (updateError) {
      throw updateError;
    }

    // Log MFA disabled
    await logAuditEvent(
      {
        action_type: 'mfa.disabled',
        target_entity: 'user',
        target_id: user.id,
        changes: {
          mfa_enabled: false,
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: 'MFA disabled successfully',
    });
  } catch (error) {
    console.error('Error disabling MFA:', error);
    return NextResponse.json(
      { error: 'Failed to disable MFA' },
      { status: 500 }
    );
  }
}
