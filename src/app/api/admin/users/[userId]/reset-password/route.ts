import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
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
        error: '权限不足' 
      }, { status: 403 });
    }

    // 2. 获取目标用户信息
    const { data: targetUser } = await supabase
      .from('profiles')
      .select('id, email, tenant_id, role, super_admin')
      .eq('id', params.userId)
      .single();

    if (!targetUser) {
      return NextResponse.json({ 
        success: false,
        error: '目标用户不存在' 
      }, { status: 404 });
    }

    // 3. 验证租户隔离（非 super_admin 只能重置自己租户的用户）
    if (!adminProfile.super_admin) {
      if (targetUser.tenant_id !== adminProfile.tenant_id) {
        return NextResponse.json({ 
          success: false,
          error: '无权操作其他租户的用户' 
        }, { status: 403 });
      }

      // owner 不能重置其他 owner 的密码
      if (targetUser.role === 'owner' && adminProfile.role !== 'owner') {
        return NextResponse.json({ 
          success: false,
          error: '无权重置所有者账号的密码' 
        }, { status: 403 });
      }
    }

    // 4. 获取重置方式
    const { method } = await request.json();

    if (method === 'email') {
      // 方式 1：发送重置邮件
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

      const { error } = await supabaseAdmin.auth.resetPasswordForEmail(
        targetUser.email,
        {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
        }
      );

      if (error) {
        return NextResponse.json({ 
          success: false,
          error: '发送重置邮件失败' 
        }, { status: 500 });
      }

      // 记录密码重置历史
      await supabase.from('password_reset_history').insert({
        user_id: targetUser.id,
        reset_method: 'admin',
        reset_by: session.user.id,
        ip_address: request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
      });

      // 记录审计日志
      await supabase.from('audit_logs').insert({
        user_id: session.user.id,
        action: 'reset_user_password',
        resource_type: 'user',
        resource_id: targetUser.id,
        details: { method: 'email', target_email: targetUser.email },
      });

      return NextResponse.json({
        success: true,
        message: '重置邮件已发送',
      });
    } else if (method === 'temporary') {
      // 方式 2：生成临时密码
      const temporaryPassword = generateTemporaryPassword();

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

      const { error } = await supabaseAdmin.auth.admin.updateUserById(
        targetUser.id,
        { password: temporaryPassword }
      );

      if (error) {
        return NextResponse.json({ 
          success: false,
          error: '生成临时密码失败' 
        }, { status: 500 });
      }

      // 记录密码重置历史
      await supabase.from('password_reset_history').insert({
        user_id: targetUser.id,
        reset_method: 'admin',
        reset_by: session.user.id,
        ip_address: request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
      });

      // 记录审计日志
      await supabase.from('audit_logs').insert({
        user_id: session.user.id,
        action: 'reset_user_password',
        resource_type: 'user',
        resource_id: targetUser.id,
        details: { method: 'temporary', target_email: targetUser.email },
      });

      return NextResponse.json({
        success: true,
        message: '临时密码已生成',
        temporaryPassword, // 仅显示一次
      });
    } else {
      return NextResponse.json({ 
        success: false,
        error: '无效的重置方式' 
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error resetting password:', error);
    return NextResponse.json({
      success: false,
      error: '重置密码失败，请稍后重试',
    }, { status: 500 });
  }
}

function generateTemporaryPassword(length: number = 12): string {
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
