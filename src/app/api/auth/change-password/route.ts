// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // 1. Verify user login
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not authenticated',
        },
        { status: 401 },
      )
    }

    // 2. Get request data
    const { currentPassword, newPassword, confirmPassword } =
      await request.json()

    // 3. Validate data
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please fill in all required fields',
        },
        { status: 400 },
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'Passwords do not match',
        },
        { status: 400 },
      )
    }

    // 4. Validate password strength
    const passwordValidation = validatePasswordStrength(newPassword)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: passwordValidation.message,
        },
        { status: 400 },
      )
    }

    // 5. Verify current password (by attempting login)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: session.user.email!,
      password: currentPassword,
    })

    if (signInError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Current password is incorrect',
        },
        { status: 400 },
      )
    }

    // 6. Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          error: updateError.message,
        },
        { status: 500 },
      )
    }

    // 7. Log password change history
    await supabase.from('password_reset_history').insert({
      user_id: session.user.id,
      reset_method: 'self',
      ip_address:
        request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
    })

    // 8. Log audit trail
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'change_password',
      resource_type: 'user',
      resource_id: session.user.id,
      details: { method: 'self' },
    })

    // TODO: Send password change notification email

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (error: any) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to change password, please try again later',
      },
      { status: 500 },
    )
  }
}

interface PasswordValidation {
  isValid: boolean
  message: string
  strength: 'weak' | 'medium' | 'strong'
}

function validatePasswordStrength(password: string): PasswordValidation {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  const passedChecks = Object.values(checks).filter(Boolean).length

  if (!checks.length) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters',
      strength: 'weak',
    }
  }

  if (!checks.uppercase) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter',
      strength: 'weak',
    }
  }

  if (!checks.lowercase) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter',
      strength: 'weak',
    }
  }

  if (!checks.number) {
    return {
      isValid: false,
      message: 'Password must contain at least one number',
      strength: 'weak',
    }
  }

  let strength: 'weak' | 'medium' | 'strong' = 'weak'
  if (passedChecks >= 5) {
    strength = 'strong'
  } else if (passedChecks >= 4) {
    strength = 'medium'
  }

  return {
    isValid: true,
    message: 'Password strength meets requirements',
    strength,
  }
}
