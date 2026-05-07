import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    // 1. 验证当前用户权限
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

    // 检查权限：必须是 owner/admin 或 super_admin
    const hasPermission = 
      adminProfile.super_admin || 
      adminProfile.role === 'owner' || 
      adminProfile.role === 'admin';

    if (!hasPermission) {
      return NextResponse.json({ 
        success: false,
        error: '权限不足，只有管理员可以创建子账号' 
      }, { status: 403 });
    }

    // 2. 获取请求数据
    const { email, full_name, role, permissions } = await request.json();

    // 3. 验证数据
    if (!email || !full_name || !role) {
      return NextResponse.json({ 
        success: false,
        error: '请填写所有必填字段' 
      }, { status: 400 });
    }

    // 验证邮箱格式
    if (!isValidEmail(email)) {
      return NextResponse.json({ 
        success: false,
        error: '邮箱格式不正确' 
      }, { status: 400 });
    }

    // 验证角色
    const validRoles = ['admin', 'manager', 'user'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ 
        success: false,
        error: '无效的角色' 
      }, { status: 400 });
    }

    // 4. 检查邮箱是否已存在
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ 
        success: false,
        error: '该邮箱已被使用' 
      }, { status: 400 });
    }

    // 5. 生成随机密码
    const temporaryPassword = generateRandomPassword();

    // 6. 使用 service role 创建 Supabase Auth 用户
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

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true, // 自动确认邮箱
      user_metadata: {
        full_name,
      },
    });

    if (authError || !authUser.user) {
      console.error('Auth error:', authError);
      return NextResponse.json({ 
        success: false,
        error: authError?.message || '创建用户失败' 
      }, { status: 500 });
    }

    // 7. 创建 profile 记录
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authUser.user.id,
        email,
        full_name,
        user_type: 'user',
        role,
        tenant_id: adminProfile.tenant_id,
        parent_user_id: session.user.id,
        permissions: permissions || {},
        is_active: true,
      });

    if (profileError) {
      console.error('Profile error:', profileError);
      // 回滚：删除 Auth 用户
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      return NextResponse.json({ 
        success: false,
        error: '创建用户资料失败' 
      }, { status: 500 });
    }

    // 8. 发送欢迎邮件（包含临时密码）
    // TODO: 实现邮件发送
    console.log(`Welcome email should be sent to ${email} with password: ${temporaryPassword}`);

    // 9. 记录审计日志
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'create_sub_account',
      resource_type: 'user',
      resource_id: authUser.user.id,
      details: { 
        email, 
        full_name, 
        role,
        tenant_id: adminProfile.tenant_id,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: authUser.user.id,
        email,
        full_name,
        role,
      },
      temporaryPassword, // 仅在响应中显示一次
      message: '子账号创建成功',
    });
  } catch (error: any) {
    console.error('Error creating sub-account:', error);
    return NextResponse.json({
      success: false,
      error: '创建子账号失败，请稍后重试',
    }, { status: 500 });
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function generateRandomPassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';
  const all = uppercase + lowercase + numbers + special;

  let password = '';
  
  // 确保包含每种类型的字符
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // 填充剩余长度
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  // 打乱顺序
  return password.split('').sort(() => Math.random() - 0.5).join('');
}
