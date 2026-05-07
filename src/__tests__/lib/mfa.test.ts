// MFA Functions Unit Tests
import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  generateMFASecret,
  verifyMFAToken,
  verifyBackupCode,
  validateSuperAdminPassword,
} from '@/lib/mfa';

describe('MFA Functions', () => {
  describe('generateMFASecret', () => {
    it('should generate a valid MFA secret', async () => {
      const email = 'test@example.com';
      const result = await generateMFASecret(email);

      expect(result).toHaveProperty('secret');
      expect(result).toHaveProperty('qrCodeUrl');
      expect(result).toHaveProperty('backupCodes');
      expect(result.secret).toBeTruthy();
      expect(result.qrCodeUrl).toMatch(/^data:image\/png;base64,/);
      expect(result.backupCodes).toHaveLength(8);
    });

    it('should generate unique secrets for each call', async () => {
      const email = 'test@example.com';
      const result1 = await generateMFASecret(email);
      const result2 = await generateMFASecret(email);

      expect(result1.secret).not.toBe(result2.secret);
    });

    it('should generate 8-character backup codes', async () => {
      const email = 'test@example.com';
      const result = await generateMFASecret(email);

      result.backupCodes.forEach((code) => {
        expect(code).toHaveLength(8);
        expect(code).toMatch(/^[A-Z0-9]+$/);
      });
    });
  });

  describe('verifyMFAToken', () => {
    it('should return false for invalid token', () => {
      const secret = 'JBSWY3DPEHPK3PXP';
      const invalidToken = '000000';

      const result = verifyMFAToken(invalidToken, secret);
      expect(result).toBe(false);
    });

    it('should return false for non-numeric token', () => {
      const secret = 'JBSWY3DPEHPK3PXP';
      const invalidToken = 'ABCDEF';

      const result = verifyMFAToken(invalidToken, secret);
      expect(result).toBe(false);
    });

    it('should return false for empty token', () => {
      const secret = 'JBSWY3DPEHPK3PXP';
      const emptyToken = '';

      const result = verifyMFAToken(emptyToken, secret);
      expect(result).toBe(false);
    });
  });

  describe('verifyBackupCode', () => {
    const backupCodes = ['ABCD1234', 'EFGH5678', 'IJKL9012'];

    it('should return true for valid backup code', () => {
      const result = verifyBackupCode('ABCD1234', backupCodes);
      expect(result).toBe(true);
    });

    it('should return true for valid backup code (case insensitive)', () => {
      const result = verifyBackupCode('abcd1234', backupCodes);
      expect(result).toBe(true);
    });

    it('should return false for invalid backup code', () => {
      const result = verifyBackupCode('INVALID0', backupCodes);
      expect(result).toBe(false);
    });

    it('should return false for empty backup code', () => {
      const result = verifyBackupCode('', backupCodes);
      expect(result).toBe(false);
    });
  });

  describe('validateSuperAdminPassword', () => {
    it('should accept valid password', () => {
      const password = 'SuperSecure123!@#';
      const result = validateSuperAdminPassword(password);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject password shorter than 16 characters', () => {
      const password = 'Short123!';
      const result = validateSuperAdminPassword(password);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('16 characters');
    });

    it('should reject password without uppercase letter', () => {
      const password = 'supersecure123!@#';
      const result = validateSuperAdminPassword(password);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('uppercase');
    });

    it('should reject password without lowercase letter', () => {
      const password = 'SUPERSECURE123!@#';
      const result = validateSuperAdminPassword(password);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('lowercase');
    });

    it('should reject password without number', () => {
      const password = 'SuperSecurePass!@#';
      const result = validateSuperAdminPassword(password);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('number');
    });

    it('should reject password without special character', () => {
      const password = 'SuperSecure12345';
      const result = validateSuperAdminPassword(password);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('special character');
    });
  });
});
