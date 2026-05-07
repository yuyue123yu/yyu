// Password Reset Token Management
import { createClient } from '@/lib/supabase/server';
import { generateSecureToken } from '@/lib/mfa';

const TOKEN_EXPIRY_HOURS = 24;

/**
 * Create a password reset token
 * @param email - User email
 * @param ipAddress - IP address of requester
 * @returns Token string
 */
export async function createPasswordResetToken(
  email: string,
  ipAddress: string
): Promise<{ token: string; expiresAt: Date }> {
  const supabase = await createClient();

  // Generate cryptographically secure 256-bit token
  const token = generateSecureToken(32); // 32 bytes = 256 bits

  // Calculate expiry time (24 hours from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + TOKEN_EXPIRY_HOURS);

  // Get user by email
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (!profiles) {
    throw new Error('User not found');
  }

  // Store token in database
  const { error } = await supabase.from('password_reset_tokens').insert({
    user_id: profiles.id,
    token,
    expires_at: expiresAt.toISOString(),
    ip_address: ipAddress,
    used: false,
  });

  if (error) {
    throw new Error('Failed to create password reset token');
  }

  return { token, expiresAt };
}

/**
 * Validate a password reset token
 * @param token - Token string
 * @returns Object with isValid flag and user_id
 */
export async function validatePasswordResetToken(token: string): Promise<{
  isValid: boolean;
  userId?: string;
  reason?: string;
}> {
  const supabase = await createClient();

  // Get token from database
  const { data: tokenData, error } = await supabase
    .from('password_reset_tokens')
    .select('*')
    .eq('token', token)
    .single();

  if (error || !tokenData) {
    return { isValid: false, reason: 'Token not found' };
  }

  // Check if token has been used
  if (tokenData.used) {
    return { isValid: false, reason: 'Token already used' };
  }

  // Check if token has expired
  const now = new Date();
  const expiresAt = new Date(tokenData.expires_at);

  if (now > expiresAt) {
    return { isValid: false, reason: 'Token expired' };
  }

  return { isValid: true, userId: tokenData.user_id };
}

/**
 * Mark a password reset token as used
 * @param token - Token string
 */
export async function markTokenAsUsed(token: string): Promise<void> {
  const supabase = await createClient();

  await supabase
    .from('password_reset_tokens')
    .update({
      used: true,
      used_at: new Date().toISOString(),
    })
    .eq('token', token);
}

/**
 * Clean up expired tokens (should be run periodically)
 */
export async function cleanupExpiredTokens(): Promise<number> {
  const supabase = await createClient();

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('password_reset_tokens')
    .delete()
    .lt('expires_at', now)
    .select('id');

  if (error) {
    console.error('Error cleaning up expired tokens:', error);
    return 0;
  }

  return data?.length || 0;
}

/**
 * Get password reset history for a user
 * @param userId - User ID
 * @param limit - Number of records to return
 * @returns Array of password reset records
 */
export async function getPasswordResetHistory(
  userId: string,
  limit: number = 10
): Promise<any[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('password_reset_tokens')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching password reset history:', error);
    return [];
  }

  return data || [];
}

/**
 * Revoke all unused tokens for a user
 * @param userId - User ID
 */
export async function revokeUserTokens(userId: string): Promise<void> {
  const supabase = await createClient();

  await supabase
    .from('password_reset_tokens')
    .update({ used: true, used_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('used', false);
}
