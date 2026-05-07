// Password Reset Utilities
import { createClient } from '@/lib/supabase/server';
import { randomBytes } from 'crypto';

/**
 * Create a password reset token for a user
 */
export async function createPasswordResetToken(
  userId: string,
  createdBy: string
): Promise<{
  token: string;
  expires_at: Date;
  reset_link: string;
}> {
  const supabase = await createClient();

  // Generate secure random token (256-bit)
  const token = randomBytes(32).toString('hex');

  // Set expiration to 24 hours from now
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  // Store token in database
  const { data, error } = await supabase
    .from('password_reset_tokens')
    .insert({
      user_id: userId,
      token,
      expires_at: expiresAt.toISOString(),
      created_by: createdBy,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create password reset token: ${error.message}`);
  }

  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  return {
    token,
    expires_at: expiresAt,
    reset_link: resetLink,
  };
}

/**
 * Validate a password reset token
 */
export async function validatePasswordResetToken(token: string): Promise<{
  valid: boolean;
  reason?: string;
  data?: any;
}> {
  const supabase = await createClient();

  // Get token from database
  const { data, error } = await supabase
    .from('password_reset_tokens')
    .select('*')
    .eq('token', token)
    .is('used_at', null)
    .single();

  if (error || !data) {
    return { valid: false, reason: 'invalid_token' };
  }

  // Check if token has expired
  const now = new Date();
  const expiresAt = new Date(data.expires_at);

  if (now > expiresAt) {
    return { valid: false, reason: 'expired' };
  }

  return { valid: true, data };
}

/**
 * Mark a password reset token as used
 */
export async function markTokenAsUsed(token: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('password_reset_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('token', token);

  if (error) {
    throw new Error(`Failed to mark token as used: ${error.message}`);
  }
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(
  password: string,
  isSuperAdmin: boolean = false
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Minimum length
  const minLength = isSuperAdmin ? 16 : 8;
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }

  // Must contain uppercase
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Must contain lowercase
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Must contain number
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Must contain special character (for super admin)
  if (isSuperAdmin && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get password reset history for a user
 */
export async function getPasswordResetHistory(
  userId: string,
  page: number = 1,
  limit: number = 10
) {
  const supabase = await createClient();

  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from('password_reset_tokens')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to get password reset history: ${error.message}`);
  }

  return {
    resets: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}
