// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    // Use service role key to send reset email
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )

    // 1. Get request data
    const { email } = await request.json()

    // 2. Validate email format
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter a valid email address',
        },
        { status: 400 },
      )
    }

    // 3. Check request frequency (prevent abuse)
    // TODO: Implement rate limiting (can use Redis or database)

    // 4. Check if user exists (don't reveal to frontend)
    const { data: user } = await supabase
      .from('profiles')
      .select('id, email, is_active')
      .eq('email', email)
      .single()

    // 5. If user exists and is active, send reset email
    if (user && user.is_active) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
      })

      if (error) {
        console.error('Error sending reset email:', error)
      }

      // Log password reset request
      await supabase.from('password_reset_history').insert({
        user_id: user.id,
        reset_method: 'email',
        ip_address:
          request.headers.get('x-forwarded-for') ||
          request.headers.get('x-real-ip') ||
          'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
      })
    }

    // 6. Always return success regardless of email existence (security consideration, prevent email enumeration)
    return NextResponse.json({
      success: true,
      message:
        'If the email is registered, you will receive a password reset email',
    })
  } catch (error: any) {
    console.error('Error in forgot password:', error)
    return NextResponse.json({
      success: true, // Return success even on error, don't reveal system info
      message:
        'If the email is registered, you will receive a password reset email',
    })
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
