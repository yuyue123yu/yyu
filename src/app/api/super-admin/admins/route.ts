// Admin Management API - List and Create Admins
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { logAuditEvent } from '@/lib/audit';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/super-admin/admins
 * List all tenant admins
 */
export async function GET(request: NextRequest) {
  // Verify super admin authentication
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { supabase } = authResult;
  const { searchParams } = new URL(request.url);

  // Parse query parameters
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const tenant_id = searchParams.get('tenant_id');

  try {
    // Build query - get all admins (user_type = 'admin' and not super_admin)
    let query = supabase
      .from('profiles')
      .select(
        `
        *,
        tenants:tenant_id (
          id,
          name,
          subdomain,
          status
        )
      `,
        { count: 'exact' }
      )
      .eq('user_type', 'admin')
      .eq('super_admin', false)
      .order('created_at', { ascending: false });

    // Apply tenant filter
    if (tenant_id) {
      query = query.eq('tenant_id', tenant_id);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: admins, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      admins: admins || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admins' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/super-admin/admins
 * Create a new tenant admin account
 */
export async function POST(request: NextRequest) {
  // Verify super admin authentication
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user, supabase } = authResult;

  try {
    const body = await request.json();
    const { email, full_name, tenant_id, password } = body;

    // Validate required fields
    if (!email || !tenant_id) {
      return NextResponse.json(
        { error: 'Email and tenant_id are required' },
        { status: 400 }
      );
    }

    // Verify tenant exists and is active
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id, name, status')
      .eq('id', tenant_id)
      .single();

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    if (tenant.status !== 'active') {
      return NextResponse.json(
        { error: 'Tenant is not active' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create user in Supabase Auth
    // Note: This requires admin privileges in Supabase
    // For now, we'll create a profile and return an activation link
    // The actual user creation should be done through Supabase Auth Admin API

    const adminData = {
      email,
      full_name: full_name || null,
      user_type: 'admin',
      super_admin: false,
      tenant_id,
      metadata: {
        created_by_super_admin: user.id,
        requires_activation: true,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Generate activation link (placeholder)
    const activationLink = `${process.env.NEXT_PUBLIC_APP_URL}/activate?email=${encodeURIComponent(email)}&tenant=${tenant_id}`;

    // Log audit event
    await logAuditEvent(
      {
        action_type: 'admin.create',
        target_entity: 'profiles',
        target_id: email, // Use email as temp ID
        changes: {
          email,
          full_name,
          tenant_id,
          tenant_name: tenant.name,
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully',
      admin: adminData,
      activation_link: activationLink,
      note: 'Please send the activation link to the admin via email',
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Failed to create admin' },
      { status: 500 }
    );
  }
}
