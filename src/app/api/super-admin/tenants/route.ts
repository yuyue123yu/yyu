// Tenant Management API - List and Create Tenants
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { logAuditEvent } from '@/lib/audit';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/super-admin/tenants
 * List all tenants with pagination and filters
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
  const limit = parseInt(searchParams.get('limit') || '10');
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  try {
    // Build query
    let query = supabase
      .from('tenants')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,subdomain.ilike.%${search}%,primary_domain.ilike.%${search}%`
      );
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: tenants, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      tenants: tenants || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenants' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/super-admin/tenants
 * Create a new tenant
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
    const { name, subdomain, primary_domain, subscription_plan, metadata } =
      body;

    // Validate required fields
    if (!name || !subdomain) {
      return NextResponse.json(
        { error: 'Name and subdomain are required' },
        { status: 400 }
      );
    }

    // Check if subdomain is unique
    const { data: existingTenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('subdomain', subdomain)
      .single();

    if (existingTenant) {
      return NextResponse.json(
        { error: 'Subdomain already exists' },
        { status: 409 }
      );
    }

    // Check if primary_domain is unique (if provided)
    if (primary_domain) {
      const { data: existingDomain } = await supabase
        .from('tenants')
        .select('id')
        .eq('primary_domain', primary_domain)
        .single();

      if (existingDomain) {
        return NextResponse.json(
          { error: 'Primary domain already exists' },
          { status: 409 }
        );
      }
    }

    // Create tenant
    const { data: tenant, error: createError } = await supabase
      .from('tenants')
      .insert({
        name,
        subdomain,
        primary_domain: primary_domain || null,
        subscription_plan: subscription_plan || 'free',
        status: 'active',
        created_by: user.id,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    // Log audit event
    await logAuditEvent(
      {
        action_type: 'tenant.create',
        target_entity: 'tenants',
        target_id: tenant.id,
        changes: {
          name: tenant.name,
          subdomain: tenant.subdomain,
          primary_domain: tenant.primary_domain,
          subscription_plan: tenant.subscription_plan,
        },
      },
      request
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Tenant created successfully',
        tenant,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating tenant:', error);
    return NextResponse.json(
      { error: 'Failed to create tenant' },
      { status: 500 }
    );
  }
}
