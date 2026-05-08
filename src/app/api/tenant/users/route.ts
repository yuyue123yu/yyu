// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    // 1. 验证用户登录
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ 
        success: false,
        error: '未登�? 
      }, { status: 401 });
    }

    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('tenant_id, role, super_admin')
      .eq('id', session.user.id)
      .single();

    if (!adminProfile) {
      return NextResponse.json({ 
        success: false,
        error: '用户信息不存�? 
      }, { status: 404 });
    }

    // 2. 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const roleFilter = searchParams.get('role') || 'all';
    const statusFilter = searchParams.get('status') || 'all';

    // 3. 构建查询
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' });

    // Super Admin 可以看所有用�?
    if (!adminProfile.super_admin) {
      // 普通管理员只能看自己租户的用户
      query = query.eq('tenant_id', adminProfile.tenant_id);
    }

    // 搜索过滤
    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    // 角色过滤
    if (roleFilter !== 'all') {
      query = query.eq('role', roleFilter);
    }

    // 状态过�?
    if (statusFilter === 'active') {
      query = query.eq('is_active', true);
    } else if (statusFilter === 'inactive') {
      query = query.eq('is_active', false);
    }

    // 排除 super_admin
    query = query.eq('super_admin', false);

    // 分页
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // 排序
    query = query.order('created_at', { ascending: false });

    const { data: users, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      users: users || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({
      success: false,
      error: '获取用户列表失败',
    }, { status: 500 });
  }
}
