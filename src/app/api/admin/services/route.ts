// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Get service list
 * GET /api/admin/services
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's tenant ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single()

    if (!profile?.tenant_id) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    // Get service list
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .eq('tenant_id', profile.tenant_id)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Failed to get service list:', error)
      return NextResponse.json(
        { error: 'Failed to get service list' },
        { status: 500 },
      )
    }

    return NextResponse.json({ services })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

/**
 * Create new service
 * POST /api/admin/services
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's tenant ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single()

    if (!profile?.tenant_id) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    // Parse request body
    const body = await request.json()

    // Create service
    const { data: service, error } = await supabase
      .from('services')
      .insert({
        tenant_id: profile.tenant_id,
        ...body,
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create service:', error)
      return NextResponse.json(
        { error: 'Failed to create service' },
        { status: 500 },
      )
    }

    return NextResponse.json({ service }, { status: 201 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
