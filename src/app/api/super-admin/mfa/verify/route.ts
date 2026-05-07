import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { verifyMFAToken } from '@/lib/mfa/totp';
import { logAuditEvent } from '@/lib/audit';

/**
 * POST /api/super-admin/mfa/verify
 * Verify MFA token and enable MFA for user
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
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Get user's MFA secret
    const { data: userData } = await supabase.auth.getUser();
    const mfaSecret = userData.user?.user_metadata?.mfa_secret;

    if (!mfaSecret) {
      return NextResponse.json(
        { error: 'MFA not set up. Please set up MFA first.' },
        { status: 400 }
      );
    }

    // Verify token
    const isValid = verifyMFAToken(mfaSecret, token);

    if (!isValid) {
      // Log failed attempt
      await logAuditEvent(
        {
          action_type: 'mfa.verification_failed',
          target_entity: 'user',
          target_id: user.id,
          changes: {
            reason: 'invalid_token',
          },
        },
        request
      );

      return NextResponse.json(
        { error: 'Invalid MFA token' },
        { status: 400 }
      );
    }

    // Enable MFA for user
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        mfa_enabled: true,
      },
    });

    if (updateError) {
      throw updateError;
    }

    // Log successful verification
    await logAuditEvent(
      {
        action_type: 'mfa.enabled',
        target_entity: 'user',
        target_id: user.id,
        changes: {
          mfa_enabled: true,
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: 'MFA enabled successfully',
    });
  } catch (error) {
    console.error('Error verifying MFA:', error);
    return NextResponse.json(
      { error: 'Failed to verify MFA' },
      { status: 500 }
    );
  }
}
