// Password Reset API - Initiate Reset
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { logAuditEvent } from '@/lib/audit';
import { createPasswordResetToken } from '@/lib/auth/password-reset';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/super-admin/password-reset
 * Initiate password reset for any user
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
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    // Get target user
    const { data: targetUser } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('id', user_id)
      .single();

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create password reset token
    const { token, expires_at, reset_link } = await createPasswordResetToken(
      user_id,
      user.id
    );

    // Extract IP address
    const ip_address =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Log audit event
    await logAuditEvent(
      {
        action_type: 'password.reset',
        target_entity: 'profiles',
        target_id: user_id,
        changes: {
          target_user_email: targetUser.email,
          ip_address,
          expires_at: expires_at.toISOString(),
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: 'Password reset initiated successfully',
      reset_token: token,
      reset_link,
      expires_at: expires_at.toISOString(),
      user: {
        id: targetUser.id,
        email: targetUser.email,
        full_name: targetUser.full_name,
      },
      note: 'Please send the reset link to the user via email',
    });
  } catch (error) {
    console.error('Error initiating password reset:', error);
    return NextResponse.json(
      { error: 'Failed to initiate password reset' },
      { status: 500 }
    );
  }
}
