// User Management API - List Users
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/super-admin/users
 * List all users across tenants with filters
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
  const user_type = searchParams.get('user_type');
  const search = searchParams.get('search');

  try {
    // Build query - select from profiles with tenant info
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
      .order('created_at', { ascending: false });

    // Apply filters
    if (tenant_id) {
      query = query.eq('tenant_id', tenant_id);
    }

    if (user_type) {
      query = query.eq('user_type', user_type);
    }

    if (search) {
      query = query.or(
        `email.ilike.%${search}%,full_name.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: users, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      users: users || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
