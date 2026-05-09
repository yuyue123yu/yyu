// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check storage service configuration
    const storageConfigured = !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    return NextResponse.json({
      success: true,
      available: storageConfigured,
      message: storageConfigured
        ? 'Storage service is configured'
        : 'Storage service not configured',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        available: false,
        message: 'Storage service check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
