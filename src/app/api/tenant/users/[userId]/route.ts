import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

// GET - 获取用户详情
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const supabase = await createServerClient();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ 
        success: false,
        error: '未登录' 
      }, { status: 401 });
    }

    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', params.userId)
      .single();

    if (error || !user) {
      return NextResponse.json({ 
        success: false,
        error: '用户不存在' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json({
      success: false,
      error: '获取用户信息失败',
    }, { status: 500 });
  }
}

// PATCH - 更新用户信息
export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const supabase = await createServerClient();
    
    // 1. 验证权限
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ 
        success: false,
        error: '未登录' 
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
        error: '用户信息不存在' 
      }, { status: 404 });
    }

    const hasPermission = 
      adminProfile.super_admin || 
      adminProfile.role === 'owner' || 
      adminProfile.role === 'admin';

    if (!hasPermission) {
      return NextResponse.json({ 
        success: false,
        error: '权限不足' 
      }, { status: 403 });
    }

    // 2. 获取目标用户
    const { data: targetUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', params.userId)
      .single();

    if (!targetUser) {
      return NextResponse.json({ 
        success: false,
        error: '目标用户不存在' 
      }, { status: 404 });
    }

    // 3. 验证租户隔离
    if (!adminProfile.super_admin) {
      if (targetUser.tenant_id !== adminProfile.tenant_id) {
        return NextResponse.json({ 
          success: false,
          error: '无权操作其他租户的用户' 
        }, { status: 403 });
      }
    }

    // 4. 获取更新数据
    const { full_name, role, permissions, is_active } = await request.json();

    const updates: any = {};
    if (full_name !== undefined) updates.full_name = full_name;
    if (role !== undefined) {
      // 验证角色
      const validRoles = ['owner', 'admin', 'manager', 'user'];
      if (!validRoles.includes(role)) {
        return NextResponse.json({ 
          success: false,
          error: '无效的角色' 
        }, { status: 400 });
      }
      updates.role = role;
    }
    if (permissions !== undefined) updates.permissions = permissions;
    if (is_active !== undefined) updates.is_active = is_active;

    updates.updated_at = new Date().toISOString();

    // 5. 更新用户
    const { error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', params.userId);

    if (updateError) {
      throw updateError;
    }

    // 6. 记录审计日志
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'update_user',
      resource_type: 'user',
      resource_id: params.userId,
      details: { updates },
    });

    // 7. 获取更新后的用户信息
    const { data: updatedUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', params.userId)
      .single();

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: '用户信息更新成功',
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json({
      success: false,
      error: '更新用户信息失败',
    }, { status: 500 });
  }
}

// DELETE - 删除用户
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const supabase = await createServerClient();
    
    // 1. 验证权限
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ 
        success: false,
        error: '未登录' 
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
        error: '用户信息不存在' 
      }, { status: 404 });
    }

    // 只有 owner 和 super_admin 可以删除用户
    const hasPermission = 
      adminProfile.super_admin || 
      adminProfile.role === 'owner';

    if (!hasPermission) {
      return NextResponse.json({ 
        success: false,
        error: '权限不足，只有所有者可以删除用户' 
      }, { status: 403 });
    }

    // 2. 获取目标用户
    const { data: targetUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', params.userId)
      .single();

    if (!targetUser) {
      return NextResponse.json({ 
        success: false,
        error: '目标用户不存在' 
      }, { status: 404 });
    }

    // 3. 验证租户隔离
    if (!adminProfile.super_admin) {
      if (targetUser.tenant_id !== adminProfile.tenant_id) {
        return NextResponse.json({ 
          success: false,
          error: '无权操作其他租户的用户' 
        }, { status: 403 });
      }
    }

    // 4. 不能删除 owner 角色（除非是 super_admin）
    if (targetUser.role === 'owner' && !adminProfile.super_admin) {
      return NextResponse.json({ 
        success: false,
        error: '不能删除所有者账号' 
      }, { status: 403 });
    }

    // 5. 不能删除自己
    if (targetUser.id === session.user.id) {
      return NextResponse.json({ 
        success: false,
        error: '不能删除自己的账号' 
      }, { status: 403 });
    }

    // 6. 删除 Auth 用户
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(params.userId);

    if (authError) {
      console.error('Auth delete error:', authError);
      return NextResponse.json({ 
        success: false,
        error: '删除用户失败' 
      }, { status: 500 });
    }

    // 7. Profile 会通过 CASCADE 自动删除

    // 8. 记录审计日志
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'delete_user',
      resource_type: 'user',
      resource_id: params.userId,
      details: { 
        email: targetUser.email,
        full_name: targetUser.full_name,
        role: targetUser.role,
      },
    });

    return NextResponse.json({
      success: true,
      message: '用户删除成功',
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json({
      success: false,
      error: '删除用户失败',
    }, { status: 500 });
  }
}
