import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { generateMFASecret } from '@/lib/mfa/totp';
import { logAuditEvent } from '@/lib/audit';

/**
 * POST /api/super-admin/mfa/setup
 * Generate MFA secret and QR code for super admin
 */
export async function POST(request: NextRequest) {
  // Verify super admin authentication
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user, supabase } = authResult;

  try {
    // Generate MFA secret
    const { secret, qrCode, uri } = await generateMFASecret(user.email || '');

    // Store secret in user metadata (encrypted in production)
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        mfa_secret: secret,
        mfa_enabled: false, // Not enabled until verified
      },
    });

    if (updateError) {
      throw updateError;
    }

    // Log audit event
    await logAuditEvent(
      {
        action_type: 'mfa.setup_initiated',
        target_entity: 'user',
        target_id: user.id,
        changes: {
          mfa_setup: true,
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      secret,
      qrCode,
      uri,
    });
  } catch (error) {
    console.error('Error setting up MFA:', error);
    return NextResponse.json(
      { error: 'Failed to setup MFA' },
      { status: 500 }
    );
  }
}
