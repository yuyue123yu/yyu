// Email Service using Resend
import { Resend } from 'resend';

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@malai.com';
const COMPANY_NAME = 'Malai';

/**
 * Send welcome email to new tenant admin
 * @param email - Admin email address
 * @param tenantName - Tenant name
 * @param activationLink - Activation link
 * @param ipAddress - IP address of requester
 */
export async function sendTenantAdminWelcome(
  email: string,
  tenantName: string,
  activationLink: string,
  ipAddress: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Welcome to ${COMPANY_NAME} - Tenant Admin Account Created`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to ${COMPANY_NAME}</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Welcome to ${COMPANY_NAME}</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #f97316;">Tenant Admin Account Created</h2>
              
              <p>Hello,</p>
              
              <p>A tenant administrator account has been created for you for <strong>${tenantName}</strong>.</p>
              
              <p>To activate your account and set your password, please click the button below:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${activationLink}" 
                   style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 5px; 
                          display: inline-block;
                          font-weight: bold;">
                  Activate Account
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                Or copy and paste this link into your browser:<br>
                <a href="${activationLink}" style="color: #f97316; word-break: break-all;">${activationLink}</a>
              </p>
              
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #856404;">
                  <strong>Security Notice:</strong> This activation link will expire in 24 hours. 
                  If you did not request this account, please ignore this email.
                </p>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
                <p><strong>Request Details:</strong></p>
                <ul style="list-style: none; padding: 0;">
                  <li>IP Address: ${ipAddress}</li>
                  <li>Timestamp: ${timestamp} UTC</li>
                </ul>
              </div>
              
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Best regards,<br>
                The ${COMPANY_NAME} Team
              </p>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending tenant admin welcome email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * Send password reset email
 * @param email - User email address
 * @param resetLink - Password reset link
 * @param ipAddress - IP address of requester
 */
export async function sendPasswordResetEmail(
  email: string,
  resetLink: string,
  ipAddress: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `${COMPANY_NAME} - Password Reset Request`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Password Reset</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #f97316;">Reset Your Password</h2>
              
              <p>Hello,</p>
              
              <p>We received a request to reset your password for your ${COMPANY_NAME} account.</p>
              
              <p>To reset your password, please click the button below:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" 
                   style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 5px; 
                          display: inline-block;
                          font-weight: bold;">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                Or copy and paste this link into your browser:<br>
                <a href="${resetLink}" style="color: #f97316; word-break: break-all;">${resetLink}</a>
              </p>
              
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #856404;">
                  <strong>Security Notice:</strong> This password reset link will expire in 24 hours. 
                  If you did not request this password reset, please ignore this email and your password will remain unchanged.
                </p>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
                <p><strong>Request Details:</strong></p>
                <ul style="list-style: none; padding: 0;">
                  <li>IP Address: ${ipAddress}</li>
                  <li>Timestamp: ${timestamp} UTC</li>
                </ul>
              </div>
              
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Best regards,<br>
                The ${COMPANY_NAME} Team
              </p>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * Send user migration notification email
 * @param email - User email address
 * @param oldTenantName - Old tenant name
 * @param newTenantName - New tenant name
 * @param migratedBy - Email of super admin who performed migration
 */
export async function sendUserMigrationNotification(
  email: string,
  oldTenantName: string,
  newTenantName: string,
  migratedBy: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `${COMPANY_NAME} - Your Account Has Been Migrated`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account Migration</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Account Migration</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #f97316;">Your Account Has Been Migrated</h2>
              
              <p>Hello,</p>
              
              <p>Your ${COMPANY_NAME} account has been migrated to a different organization.</p>
              
              <div style="background: white; border: 2px solid #f97316; border-radius: 5px; padding: 20px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>From:</strong></td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${oldTenantName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px;"><strong>To:</strong></td>
                    <td style="padding: 10px;">${newTenantName}</td>
                  </tr>
                </table>
              </div>
              
              <p>All your data, including consultations, orders, and preferences, have been migrated to the new organization.</p>
              
              <div style="background: #d1ecf1; border-left: 4px solid #0c5460; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #0c5460;">
                  <strong>What This Means:</strong> You will now access your account under the new organization. 
                  Your login credentials remain the same.
                </p>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
                <p><strong>Migration Details:</strong></p>
                <ul style="list-style: none; padding: 0;">
                  <li>Migrated By: ${migratedBy}</li>
                  <li>Timestamp: ${timestamp} UTC</li>
                </ul>
              </div>
              
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                If you have any questions about this migration, please contact your administrator.
              </p>
              
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Best regards,<br>
                The ${COMPANY_NAME} Team
              </p>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending user migration notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * Send MFA enabled notification email
 * @param email - User email address
 */
export async function sendMFAEnabledNotification(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `${COMPANY_NAME} - Two-Factor Authentication Enabled`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>MFA Enabled</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">🔒 Security Update</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #f97316;">Two-Factor Authentication Enabled</h2>
              
              <p>Hello,</p>
              
              <p>Two-factor authentication (MFA) has been successfully enabled for your ${COMPANY_NAME} super admin account.</p>
              
              <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #155724;">
                  <strong>Your Account is Now More Secure!</strong><br>
                  You will need to enter a code from your authenticator app each time you log in.
                </p>
              </div>
              
              <p><strong>Important:</strong> Make sure you have saved your backup codes in a safe place. You can use them to access your account if you lose your authenticator device.</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
                <p><strong>Enabled At:</strong> ${timestamp} UTC</p>
              </div>
              
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                If you did not enable MFA, please contact support immediately.
              </p>
              
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Best regards,<br>
                The ${COMPANY_NAME} Team
              </p>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending MFA enabled notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}
