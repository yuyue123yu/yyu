// MFA Validate API - Validate MFA token during login
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyMFAToken, verifyBackupCode } from '@/lib/mfa';
import { logAuditEvent } from '@/lib/audit';
import { createSuperAdminSession } from '@/lib/session/super-admin-session';

/**
 * POST /api/super-admin/mfa/validate
 * Validate MFA token during login
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  try {
    const { data: userData, error } = await supabase.auth.getUser();

    if (error || !userData.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const mfaSecret = userData.user.user_metadata?.mfa_secret;
    const backupCodes = userData.user.user_metadata?.mfa_backup_codes || [];

    if (!mfaSecret) {
      return NextResponse.json(
        { error: 'MFA not enabled for this user' },
        { status: 400 }
      );
    }

    let isValid = false;
    let usedBackupCode = false;

    // Try to verify as TOTP token first
    if (token.length === 6 && /^\d+$/.test(token)) {
      isValid = verifyMFAToken(token, mfaSecret);
    }

    // If not valid, try as backup code
    if (!isValid && token.length === 8) {
      isValid = verifyBackupCode(token, backupCodes);
      usedBackupCode = isValid;
    }

    if (!isValid) {
      // Log failed attempt
      await logAuditEvent(
        {
          action_type: 'mfa.login_failed',
          target_entity: 'profiles',
          target_id: userData.user.id,
          changes: {
            user_email: userData.user.email,
            reason: 'Invalid MFA token',
          },
        },
        request
      );

      return NextResponse.json(
        { error: 'Invalid MFA code' },
        { status: 400 }
      );
    }

    // If backup code was used, remove it from the list
    if (usedBackupCode) {
      const updatedBackupCodes = backupCodes.filter((code: string) => code !== token.toUpperCase());
      await supabase.auth.updateUser({
        data: {
          mfa_backup_codes: updatedBackupCodes,
        },
      });
    }

    // Create super admin session
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await createSuperAdminSession(userData.user.id, ipAddress, userAgent);

    // Log successful login
    await logAuditEvent(
      {
        action_type: 'mfa.login_success',
        target_entity: 'profiles',
        target_id: userData.user.id,
        changes: {
          user_email: userData.user.email,
          used_backup_code: usedBackupCode,
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: 'MFA validation successful',
      usedBackupCode,
      remainingBackupCodes: usedBackupCode ? backupCodes.length - 1 : backupCodes.length,
    });
  } catch (error) {
    console.error('Error validating MFA token:', error);
    return NextResponse.json(
      { error: 'Failed to validate MFA token' },
      { status: 500 }
    );
  }
}
