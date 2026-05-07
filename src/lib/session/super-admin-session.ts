// Super Admin Session Management
import { createClient } from '@/lib/supabase/server';

export interface SuperAdminSession {
  user_id: string;
  session_id: string;
  created_at: string;
  last_activity: string;
  expires_at: string;
  ip_address: string;
  user_agent: string;
}

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
const ABSOLUTE_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

/**
 * Create a new super admin session
 * @param userId - User ID
 * @param ipAddress - IP address
 * @param userAgent - User agent string
 * @returns Session object
 */
export async function createSuperAdminSession(
  userId: string,
  ipAddress: string,
  userAgent: string
): Promise<SuperAdminSession> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ABSOLUTE_TIMEOUT);

  const session: SuperAdminSession = {
    user_id: userId,
    session_id: generateSessionId(),
    created_at: now.toISOString(),
    last_activity: now.toISOString(),
    expires_at: expiresAt.toISOString(),
    ip_address: ipAddress,
    user_agent: userAgent,
  };

  // Store session in user metadata
  const supabase = await createClient();
  await supabase.auth.updateUser({
    data: {
      super_admin_session: session,
    },
  });

  return session;
}

/**
 * Validate a super admin session
 * @param userId - User ID
 * @returns Object with isValid flag and session data
 */
export async function validateSuperAdminSession(userId: string): Promise<{
  isValid: boolean;
  session?: SuperAdminSession;
  reason?: string;
}> {
  const supabase = await createClient();

  // Get user data
  const { data: userData, error } = await supabase.auth.getUser();

  if (error || !userData.user) {
    return { isValid: false, reason: 'User not found' };
  }

  const session = userData.user.user_metadata
    ?.super_admin_session as SuperAdminSession;

  if (!session) {
    return { isValid: false, reason: 'No session found' };
  }

  const now = new Date();
  const lastActivity = new Date(session.last_activity);
  const expiresAt = new Date(session.expires_at);

  // Check absolute timeout
  if (now > expiresAt) {
    return { isValid: false, reason: 'Session expired (absolute timeout)' };
  }

  // Check inactivity timeout
  const inactivityDuration = now.getTime() - lastActivity.getTime();
  if (inactivityDuration > INACTIVITY_TIMEOUT) {
    return {
      isValid: false,
      reason: 'Session expired (inactivity timeout)',
    };
  }

  return { isValid: true, session };
}

/**
 * Update session activity timestamp
 * @param userId - User ID
 */
export async function updateSessionActivity(userId: string): Promise<void> {
  const supabase = await createClient();

  // Get current session
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  const session = userData.user.user_metadata
    ?.super_admin_session as SuperAdminSession;
  if (!session) return;

  // Update last activity
  session.last_activity = new Date().toISOString();

  await supabase.auth.updateUser({
    data: {
      super_admin_session: session,
    },
  });
}

/**
 * Destroy a super admin session
 * @param userId - User ID
 */
export async function destroySuperAdminSession(userId: string): Promise<void> {
  const supabase = await createClient();

  await supabase.auth.updateUser({
    data: {
      super_admin_session: null,
    },
  });
}

/**
 * Generate a unique session ID
 * @returns Session ID
 */
function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomPart}`;
}

/**
 * Get session timeout information
 * @param session - Session object
 * @returns Object with timeout information
 */
export function getSessionTimeoutInfo(session: SuperAdminSession): {
  inactivityTimeoutIn: number;
  absoluteTimeoutIn: number;
  inactivityTimeoutAt: Date;
  absoluteTimeoutAt: Date;
} {
  const now = new Date();
  const lastActivity = new Date(session.last_activity);
  const expiresAt = new Date(session.expires_at);

  const inactivityTimeoutAt = new Date(
    lastActivity.getTime() + INACTIVITY_TIMEOUT
  );
  const inactivityTimeoutIn = inactivityTimeoutAt.getTime() - now.getTime();
  const absoluteTimeoutIn = expiresAt.getTime() - now.getTime();

  return {
    inactivityTimeoutIn: Math.max(0, inactivityTimeoutIn),
    absoluteTimeoutIn: Math.max(0, absoluteTimeoutIn),
    inactivityTimeoutAt,
    absoluteTimeoutAt: expiresAt,
  };
}
