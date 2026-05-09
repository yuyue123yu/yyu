// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          success: false,
          message: 'Environment variables not configured',
          details: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY',
        },
        { status: 500 },
      )
    }

    // Check database connection
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { error } = await supabase.from('tenants').select('count').limit(1)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Database connection failed',
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'System health check passed',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
