// MFA (Multi-Factor Authentication) utilities using TOTP
import { TOTP, Secret } from 'otpauth';
import QRCode from 'qrcode';

/**
 * Generate a new MFA secret for a user
 * @param email - User's email address
 * @returns Object containing secret and QR code data URL
 */
export async function generateMFASecret(email: string): Promise<{
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}> {
  // Create a new TOTP instance
  const totp = new TOTP({
    issuer: 'Malai Super Admin',
    label: email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
  });

  // Generate the secret
  const secret = totp.secret.base32;

  // Generate OTP Auth URL for QR code
  const otpauthUrl = totp.toString();

  // Generate QR code as data URL
  const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

  // Generate backup codes (8 codes, 8 characters each)
  const backupCodes = Array.from({ length: 8 }, () =>
    generateRandomCode(8)
  );

  return {
    secret,
    qrCodeUrl,
    backupCodes,
  };
}

/**
 * Verify a TOTP token against a secret
 * @param token - 6-digit token from authenticator app
 * @param secret - Base32 encoded secret
 * @returns true if token is valid, false otherwise
 */
export function verifyMFAToken(token: string, secret: string): boolean {
  try {
    // Create TOTP instance with the secret
    const totp = new TOTP({
      secret: Secret.fromBase32(secret),
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
    });

    // Validate the token (allows 1 period before and after for clock skew)
    const delta = totp.validate({
      token,
      window: 1,
    });

    // delta is null if invalid, or a number indicating the time step difference
    return delta !== null;
  } catch (error) {
    console.error('Error verifying MFA token:', error);
    return false;
  }
}

/**
 * Verify a backup code
 * @param code - Backup code to verify
 * @param backupCodes - Array of valid backup codes
 * @returns true if code is valid, false otherwise
 */
export function verifyBackupCode(
  code: string,
  backupCodes: string[]
): boolean {
  return backupCodes.includes(code.toUpperCase());
}

/**
 * Generate a random alphanumeric code
 * @param length - Length of the code
 * @returns Random code
 */
function generateRandomCode(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    code += chars[randomValues[i] % chars.length];
  }

  return code;
}

/**
 * Generate a cryptographically secure random token
 * @param bytes - Number of bytes (default 32 for 256-bit)
 * @returns Hex-encoded token
 */
export function generateSecureToken(bytes: number = 32): string {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Hash a password using Web Crypto API
 * @param password - Plain text password
 * @returns Hashed password (hex string)
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate password strength for super admin
 * @param password - Password to validate
 * @returns Object with isValid flag and error message
 */
export function validateSuperAdminPassword(password: string): {
  isValid: boolean;
  error?: string;
} {
  // Super admin passwords must be at least 16 characters
  if (password.length < 16) {
    return {
      isValid: false,
      error: 'Password must be at least 16 characters long',
    };
  }

  // Must contain at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter',
    };
  }

  // Must contain at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter',
    };
  }

  // Must contain at least one number
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one number',
    };
  }

  // Must contain at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one special character',
    };
  }

  return { isValid: true };
}
