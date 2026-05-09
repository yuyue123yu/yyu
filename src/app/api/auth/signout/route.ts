// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const supabase = await createServerClient()

    // Sign out from Supabase session
    await supabase.auth.signOut()

    // Clear custom cookies
    const cookieStore = await cookies()
    cookieStore.delete('sb-access-token')
    cookieStore.delete('sb-refresh-token')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Signout error:', error)
    return NextResponse.json({ error: 'Signout failed' }, { status: 500 })
  }
}

export async function GET() {
  // Support GET request (for form action)
  return POST()
}
