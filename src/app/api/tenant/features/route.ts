import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// GET - 获取功能开关配置
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

    // 获取功能开关配置
    const { data: settings, error } = await supabase
      .from('tenant_settings')
      .select('setting_value')
      .eq('tenant_id', profile.tenant_id)
      .eq('setting_key', 'features')
      .maybeSingle();

    if (error) {
      console.error('Error fetching features settings:', error);
      return NextResponse.json({ error: '获取设置失败' }, { status: 500 });
    }

    // 返回默认值或已保存的设置
    const defaultFeatures = {
      // 核心功能
      consultations: {
        enabled: true,
        online_booking: true,
        video_consultation: false,
        description: '在线法律咨询服务',
      },
      lawyers: {
        enabled: true,
        show_profiles: true,
        show_ratings: true,
        description: '律师团队展示',
      },
      articles: {
        enabled: true,
        allow_comments: false,
        show_author: true,
        description: '法律知识文章',
      },
      
      // 商业功能
      online_payment: {
        enabled: true,
        payment_methods: ['credit_card', 'online_banking', 'ewallet'],
        description: '在线支付功能',
      },
      membership: {
        enabled: false,
        auto_renewal: false,
        description: '会员订阅系统',
      },
      
      // 交互功能
      live_chat: {
        enabled: true,
        business_hours_only: false,
        description: '在线客服聊天',
      },
      appointment_booking: {
        enabled: true,
        require_deposit: false,
        description: '预约预订系统',
      },
      document_upload: {
        enabled: true,
        max_file_size_mb: 10,
        description: '文档上传功能',
      },
      
      // 营销功能
      newsletter: {
        enabled: false,
        description: '邮件订阅功能',
      },
      referral_program: {
        enabled: false,
        description: '推荐奖励计划',
      },
      reviews: {
        enabled: true,
        require_verification: true,
        description: '用户评价系统',
      },
      
      // 其他功能
      multi_language: {
        enabled: false,
        languages: ['zh', 'en', 'ms'],
        description: '多语言支持',
      },
      seo: {
        enabled: true,
        description: 'SEO 优化功能',
      },
      analytics: {
        enabled: true,
        description: '数据分析统计',
      },
    };

    return NextResponse.json({
      success: true,
      features: settings?.setting_value || defaultFeatures,
    });
  } catch (error: any) {
    console.error('Error in GET /api/tenant/features:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// PUT - 更新功能开关配置
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
    const features = await request.json();

    // 保存或更新功能开关配置
    const { error } = await supabase
      .from('tenant_settings')
      .upsert({
        tenant_id: profile.tenant_id,
        setting_key: 'features',
        setting_value: features,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'tenant_id,setting_key',
      });

    if (error) {
      console.error('Error updating features settings:', error);
      return NextResponse.json({ error: '保存设置失败' }, { status: 500 });
    }

    // 记录审计日志
    const enabledFeatures = Object.entries(features)
      .filter(([_, config]: [string, any]) => config.enabled)
      .map(([key]) => key);

    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'update_features',
      resource_type: 'tenant_settings',
      resource_id: profile.tenant_id,
      details: { enabled_features: enabledFeatures },
    });

    return NextResponse.json({
      success: true,
      message: '功能开关已保存',
    });
  } catch (error: any) {
    console.error('Error in PUT /api/tenant/features:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
