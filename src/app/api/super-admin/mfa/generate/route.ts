// MFA Generate Secret API
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { generateMFASecret } from '@/lib/mfa';
import { logAuditEvent } from '@/lib/audit';

/**
 * POST /api/super-admin/mfa/generate
 * Generate MFA secret and QR code for super admin
 */
export async function POST(request: NextRequest) {
  // Verify super admin authentication
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { supabase, user } = authResult;

  try {
    // Generate MFA secret
    const { secret, qrCodeUrl, backupCodes } = await generateMFASecret(
      user.email || ''
    );

    // Store secret and backup codes in user metadata (not yet enabled)
    await supabase.auth.updateUser({
      data: {
        mfa_secret_pending: secret,
        mfa_backup_codes: backupCodes,
        mfa_enabled: false,
      },
    });

    // Log audit event
    await logAuditEvent(
      {
        action_type: 'mfa.generate',
        target_entity: 'profiles',
        target_id: user.id,
        changes: {
          user_email: user.email,
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      secret,
      qrCodeUrl,
      backupCodes,
    });
  } catch (error) {
    console.error('Error generating MFA secret:', error);
    return NextResponse.json(
      { error: 'Failed to generate MFA secret' },
      { status: 500 }
    );
  }
}
