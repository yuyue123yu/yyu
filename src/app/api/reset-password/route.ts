// Public Password Reset Completion API
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  validatePasswordResetToken,
  markTokenAsUsed,
  validatePasswordStrength,
} from '@/lib/auth/password-reset';
import { logAuditEvent } from '@/lib/audit';

/**
 * POST /api/reset-password
 * Complete password reset (public endpoint)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, new_password } = body;

    if (!token || !new_password) {
      return NextResponse.json(
        { error: 'token and new_password are required' },
        { status: 400 }
      );
    }

    // Validate token
    const tokenValidation = await validatePasswordResetToken(token);

    if (!tokenValidation.valid) {
      let message = 'Invalid or expired reset token';
      if (tokenValidation.reason === 'expired') {
        message = 'Reset token has expired. Please request a new one.';
      } else if (tokenValidation.reason === 'invalid_token') {
        message = 'Invalid reset token. Please check the link and try again.';
      }

      return NextResponse.json({ error: message }, { status: 400 });
    }

    const tokenData = tokenValidation.data;
    const userId = tokenData.user_id;

    // Get user to check if super admin
    const supabase = await createClient();
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('super_admin, email')
      .eq('id', userId)
      .single();

    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(
      new_password,
      userProfile.super_admin || false
    );

    if (!passwordValidation.valid) {
      return NextResponse.json(
        {
          error: 'Password does not meet requirements',
          details: passwordValidation.errors,
        },
        { status: 400 }
      );
    }

    // Update password in Supabase Auth
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      { password: new_password }
    );

    if (updateError) {
      console.error('Error updating password:', updateError);
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    // Mark token as used
    await markTokenAsUsed(token);

    // Extract IP address
    const ip_address =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Log audit event
    await logAuditEvent(
      {
        action_type: 'password.reset_complete',
        target_entity: 'profiles',
        target_id: userId,
        changes: {
          user_email: userProfile.email,
          ip_address,
          timestamp: new Date().toISOString(),
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Error completing password reset:', error);
    return NextResponse.json(
      { error: 'Failed to complete password reset' },
      { status: 500 }
    );
  }
}
