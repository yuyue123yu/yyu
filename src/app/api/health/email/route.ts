// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check email service configuration
    const emailConfigured = !!(
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER
    );

    return NextResponse.json({
      success: true, // Email service is optional, so always return success
      configured: emailConfigured,
      message: emailConfigured 
        ? 'Email service is configured' 
        : 'Email service not configured (optional)',
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      configured: false,
      message: 'Email service check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
