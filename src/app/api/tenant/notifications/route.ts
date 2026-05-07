import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// GET - 获取通知配置
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    // 验证用户登录
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    // 获取用户的租户信息
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id, user_type')
      .eq('id', session.user.id)
      .single();

    if (!profile?.tenant_id) {
      return NextResponse.json({ error: '用户未关联租户' }, { status: 400 });
    }

    // 获取通知配置
    const { data: settings, error } = await supabase
      .from('tenant_settings')
      .select('setting_value')
      .eq('tenant_id', profile.tenant_id)
      .eq('setting_key', 'notifications')
      .maybeSingle();

    if (error) {
      console.error('Error fetching notification settings:', error);
      return NextResponse.json({ error: '获取设置失败' }, { status: 500 });
    }

    // 返回默认值或已保存的设置
    const defaultNotifications = {
      // 邮件通知配置
      email: {
        enabled: true,
        smtp: {
          host: '',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: '',
            pass: '',
          },
        },
        from: {
          name: '',
          email: '',
        },
        templates: {
          new_consultation: {
            enabled: true,
            subject: '新的咨询请求',
            body: '您收到了一个新的咨询请求。\n\n客户：{{client_name}}\n咨询类型：{{consultation_type}}\n时间：{{created_at}}',
          },
          consultation_confirmed: {
            enabled: true,
            subject: '咨询已确认',
            body: '您的咨询已确认。\n\n咨询时间：{{consultation_time}}\n律师：{{lawyer_name}}',
          },
          payment_received: {
            enabled: true,
            subject: '付款成功',
            body: '我们已收到您的付款。\n\n订单号：{{order_id}}\n金额：{{amount}}\n时间：{{paid_at}}',
          },
          document_ready: {
            enabled: true,
            subject: '文档已准备好',
            body: '您的文档已准备好，请登录查看。\n\n文档类型：{{document_type}}\n完成时间：{{completed_at}}',
          },
        },
      },
      
      // 短信通知配置
      sms: {
        enabled: false,
        provider: 'twilio', // twilio, aliyun, tencent
        config: {
          account_sid: '',
          auth_token: '',
          from_number: '',
        },
        templates: {
          consultation_reminder: {
            enabled: true,
            content: '提醒：您的咨询将在 {{time}} 开始，律师：{{lawyer_name}}',
          },
          payment_confirmation: {
            enabled: true,
            content: '付款成功！订单号：{{order_id}}，金额：{{amount}}',
          },
        },
      },
      
      // 通知接收人
      recipients: {
        admin_emails: [],
        consultation_emails: [],
        payment_emails: [],
        document_emails: [],
      },
      
      // 通知触发条件
      triggers: {
        new_consultation: {
          enabled: true,
          notify_admin: true,
          notify_lawyer: true,
          notify_client: true,
        },
        consultation_confirmed: {
          enabled: true,
          notify_client: true,
          notify_lawyer: true,
        },
        consultation_cancelled: {
          enabled: true,
          notify_all: true,
        },
        payment_received: {
          enabled: true,
          notify_admin: true,
          notify_client: true,
        },
        payment_failed: {
          enabled: true,
          notify_admin: true,
          notify_client: true,
        },
        document_uploaded: {
          enabled: true,
          notify_admin: true,
          notify_lawyer: true,
        },
        document_ready: {
          enabled: true,
          notify_client: true,
        },
        new_user_registered: {
          enabled: true,
          notify_admin: true,
        },
      },
      
      // 通知频率限制
      rate_limit: {
        enabled: true,
        max_per_hour: 100,
        max_per_day: 1000,
      },
    };

    return NextResponse.json({
      success: true,
      notifications: settings?.setting_value || defaultNotifications,
    });
  } catch (error: any) {
    console.error('Error in GET /api/tenant/notifications:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// PUT - 更新通知配置
export async function PUT(request: NextRequest) {
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

    // 检查权限：必须是 owner 或 admin
    if (profile.user_type !== 'owner' && profile.user_type !== 'admin') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 });
    }

    // 获取请求数据
    const notifications = await request.json();

    // 验证邮件配置
    if (notifications.email?.enabled) {
      if (!notifications.email.from?.email) {
        return NextResponse.json({ error: '发件人邮箱不能为空' }, { status: 400 });
      }
    }

    // 保存或更新通知配置
    const { error } = await supabase
      .from('tenant_settings')
      .upsert({
        tenant_id: profile.tenant_id,
        setting_key: 'notifications',
        setting_value: notifications,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'tenant_id,setting_key',
      });

    if (error) {
      console.error('Error updating notification settings:', error);
      return NextResponse.json({ error: '保存设置失败' }, { status: 500 });
    }

    // 记录审计日志
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'update_notifications',
      resource_type: 'tenant_settings',
      resource_id: profile.tenant_id,
      details: { 
        email_enabled: notifications.email?.enabled,
        sms_enabled: notifications.sms?.enabled,
      },
    });

    return NextResponse.json({
      success: true,
      message: '通知配置已保存',
    });
  } catch (error: any) {
    console.error('Error in PUT /api/tenant/notifications:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
