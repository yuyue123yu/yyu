import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // 使用 service role key 来发送重置邮件
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 1. 获取请求数据
    const { email } = await request.json();

    // 2. 验证邮箱格式
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ 
        success: false,
        error: '请输入有效的邮箱地址' 
      }, { status: 400 });
    }

    // 3. 检查请求频率（防止滥用）
    // TODO: 实现 rate limiting（可以使用 Redis 或数据库）
    
    // 4. 查询用户是否存在（不透露给前端）
    const { data: user } = await supabase
      .from('profiles')
      .select('id, email, is_active')
      .eq('email', email)
      .single();

    // 5. 如果用户存在且激活，发送重置邮件
    if (user && user.is_active) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
      });

      if (error) {
        console.error('Error sending reset email:', error);
      }

      // 记录密码重置请求
      await supabase.from('password_reset_history').insert({
        user_id: user.id,
        reset_method: 'email',
        ip_address: request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
      });
    }

    // 6. 不管邮箱是否存在，都返回成功（安全考虑，防止邮箱枚举攻击）
    return NextResponse.json({
      success: true,
      message: '如果该邮箱已注册，您将收到密码重置邮件',
    });
  } catch (error: any) {
    console.error('Error in forgot password:', error);
    return NextResponse.json({
      success: true, // 即使出错也返回成功，不透露系统信息
      message: '如果该邮箱已注册，您将收到密码重置邮件',
    });
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
