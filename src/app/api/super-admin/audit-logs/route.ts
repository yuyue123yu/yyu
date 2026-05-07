// Audit Logs Query API
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/super-admin/audit-logs
 * Query audit logs with filters
 */
export async function GET(request: NextRequest) {
  // Verify super admin authentication
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { supabase } = authResult;

  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Filters
    const action_type = searchParams.get('action_type');
    const target_entity = searchParams.get('target_entity');
    const target_id = searchParams.get('target_id');
    const user_id = searchParams.get('user_id');
    const tenant_id = searchParams.get('tenant_id');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');

    // Build query
    let query = supabase
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (action_type) {
      query = query.eq('action_type', action_type);
    }
    if (target_entity) {
      query = query.eq('target_entity', target_entity);
    }
    if (target_id) {
      query = query.eq('target_id', target_id);
    }
    if (user_id) {
      query = query.eq('user_id', user_id);
    }
    if (tenant_id) {
      query = query.eq('tenant_id', tenant_id);
    }
    if (start_date) {
      query = query.gte('created_at', start_date);
    }
    if (end_date) {
      query = query.lte('created_at', end_date);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching audit logs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch audit logs' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      logs: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
      filters: {
        action_type,
        target_entity,
        target_id,
        user_id,
        tenant_id,
        start_date,
        end_date,
      },
    });
  } catch (error) {
    console.error('Error querying audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to query audit logs' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/super-admin/audit-logs
 * Create a new audit log entry
 */
export async function POST(request: NextRequest) {
  // Verify super admin authentication
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { supabase, user } = authResult;

  try {
    const body = await request.json();
    const { action_type, target_entity, target_id, details } = body;

    // Validate required fields
    if (!action_type || !target_entity) {
      return NextResponse.json(
        { error: 'Missing required fields: action_type, target_entity' },
        { status: 400 }
      );
    }

    // Create audit log entry
    const { data, error } = await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action_type,
        target_entity,
        target_id: target_id || null,
        details: details || null,
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating audit log:', error);
      return NextResponse.json(
        { error: 'Failed to create audit log' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      log: data,
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
    return NextResponse.json(
      { error: 'Failed to create audit log' },
      { status: 500 }
    );
  }
}
