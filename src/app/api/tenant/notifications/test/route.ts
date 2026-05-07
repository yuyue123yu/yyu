import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// POST - 测试通知发送
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    // 验证用户登录
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    // 获取用户的租户信息和权限
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id, user_type')
      .eq('id', session.user.id)
      .single();

    if (!profile?.tenant_id) {
      return NextResponse.json({ error: '用户未关联租户' }, { status: 400 });
    }

    // 检查权限
    if (profile.user_type !== 'owner' && profile.user_type !== 'admin') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 });
    }

    // 获取请求数据
    const { type, recipient } = await request.json(); // type: 'email' or 'sms'

    // 获取通知配置
    const { data: settings } = await supabase
      .from('tenant_settings')
      .select('setting_value')
      .eq('tenant_id', profile.tenant_id)
      .eq('setting_key', 'notifications')
      .single();

    if (!settings?.setting_value) {
      return NextResponse.json({ error: '通知配置不存在' }, { status: 400 });
    }

    const config = settings.value;

    // 模拟发送测试通知
    // 实际项目中需要真实的邮件/短信发送逻辑
    if (type === 'email') {
      if (!config.email?.enabled) {
        return NextResponse.json({ error: '邮件通知未启用' }, { status: 400 });
      }

      // 模拟邮件发送
      console.log('Sending test email to:', recipient);
      console.log('SMTP Config:', config.email.smtp);
      
      // 这里应该使用 nodemailer 或其他邮件库发送真实邮件
      // const transporter = nodemailer.createTransport(config.email.smtp);
      // await transporter.sendMail({
      //   from: `${config.email.from.name} <${config.email.from.email}>`,
      //   to: recipient,
      //   subject: '测试邮件',
      //   text: '这是一封测试邮件，如果您收到此邮件，说明邮件配置正确。',
      // });

      return NextResponse.json({
        success: true,
        message: '测试邮件已发送（模拟）',
      });
    } else if (type === 'sms') {
      if (!config.sms?.enabled) {
        return NextResponse.json({ error: '短信通知未启用' }, { status: 400 });
      }

      // 模拟短信发送
      console.log('Sending test SMS to:', recipient);
      console.log('SMS Config:', config.sms.config);
      
      // 这里应该使用 Twilio 或其他短信服务发送真实短信
      // const client = twilio(config.sms.config.account_sid, config.sms.config.auth_token);
      // await client.messages.create({
      //   body: '这是一条测试短信，如果您收到此短信，说明短信配置正确。',
      //   from: config.sms.config.from_number,
      //   to: recipient,
      // });

      return NextResponse.json({
        success: true,
        message: '测试短信已发送（模拟）',
      });
    }

    return NextResponse.json({ error: '无效的通知类型' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in POST /api/tenant/notifications/test:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
