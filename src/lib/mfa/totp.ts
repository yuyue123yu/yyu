import * as OTPAuth from 'otpauth';
import QRCode from 'qrcode';

/**
 * Generate MFA secret and QR code for a user
 */
export async function generateMFASecret(email: string) {
  // Generate a random secret
  const secret = new OTPAuth.Secret({ size: 20 });
  
  // Create TOTP instance
  const totp = new OTPAuth.TOTP({
    issuer: 'LegalMY Super Admin',
    label: email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: secret,
  });
  
  // Generate URI for QR code
  const uri = totp.toString();
  
  // Generate QR code as data URL
  const qrCode = await QRCode.toDataURL(uri);
  
  return {
    secret: secret.base32,
    qrCode,
    uri,
  };
}

/**
 * Verify MFA token against secret
 */
export function verifyMFAToken(secret: string, token: string): boolean {
  try {
    const totp = new OTPAuth.TOTP({
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    });
    
    // Validate token with a window of ±1 period (30 seconds)
    // This allows for slight time differences
    const delta = totp.validate({ token, window: 1 });
    
    return delta !== null;
  } catch (error) {
    console.error('Error verifying MFA token:', error);
    return false;
  }
}

/**
 * Generate current TOTP token (for testing)
 */
export function generateCurrentToken(secret: string): string {
  const totp = new OTPAuth.TOTP({
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  });
  
  return totp.generate();
}
