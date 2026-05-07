import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    // 1. 验证用户登录
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ 
        success: false,
        error: '未登录' 
      }, { status: 401 });
    }

    // 2. 获取请求数据
    const { currentPassword, newPassword, confirmPassword } = await request.json();

    // 3. 验证数据
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ 
        success: false,
        error: '请填写所有必填字段' 
      }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ 
        success: false,
        error: '两次输入的密码不一致' 
      }, { status: 400 });
    }

    // 4. 验证密码强度
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json({ 
        success: false,
        error: passwordValidation.message 
      }, { status: 400 });
    }

    // 5. 验证当前密码（通过尝试登录）
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: session.user.email!,
      password: currentPassword,
    });

    if (signInError) {
      return NextResponse.json({ 
        success: false,
        error: '当前密码不正确' 
      }, { status: 400 });
    }

    // 6. 更新密码
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return NextResponse.json({ 
        success: false,
        error: updateError.message 
      }, { status: 500 });
    }

    // 7. 记录密码修改历史
    await supabase.from('password_reset_history').insert({
      user_id: session.user.id,
      reset_method: 'self',
      ip_address: request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
    });

    // 8. 记录审计日志
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'change_password',
      resource_type: 'user',
      resource_id: session.user.id,
      details: { method: 'self' },
    });

    // TODO: 发送密码修改通知邮件

    return NextResponse.json({
      success: true,
      message: '密码修改成功',
    });
  } catch (error: any) {
    console.error('Error changing password:', error);
    return NextResponse.json({
      success: false,
      error: '密码修改失败，请稍后重试',
    }, { status: 500 });
  }
}

interface PasswordValidation {
  isValid: boolean;
  message: string;
  strength: 'weak' | 'medium' | 'strong';
}

function validatePasswordStrength(password: string): PasswordValidation {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;

  if (!checks.length) {
    return {
      isValid: false,
      message: '密码至少需要 8 个字符',
      strength: 'weak',
    };
  }

  if (!checks.uppercase) {
    return {
      isValid: false,
      message: '密码必须包含至少一个大写字母',
      strength: 'weak',
    };
  }

  if (!checks.lowercase) {
    return {
      isValid: false,
      message: '密码必须包含至少一个小写字母',
      strength: 'weak',
    };
  }

  if (!checks.number) {
    return {
      isValid: false,
      message: '密码必须包含至少一个数字',
      strength: 'weak',
    };
  }

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (passedChecks >= 5) {
    strength = 'strong';
  } else if (passedChecks >= 4) {
    strength = 'medium';
  }

  return {
    isValid: true,
    message: '密码强度符合要求',
    strength,
  };
}
