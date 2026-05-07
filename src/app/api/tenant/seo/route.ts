import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// GET - 获取 SEO 配置
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

    // 获取 SEO 配置
    const { data: settings, error } = await supabase
      .from('tenant_settings')
      .select('setting_value')
      .eq('tenant_id', profile.tenant_id)
      .eq('setting_key', 'seo')
      .maybeSingle();

    if (error) {
      console.error('Error fetching SEO settings:', error);
      return NextResponse.json({ error: '获取设置失败' }, { status: 500 });
    }

    // 返回默认值或已保存的设置
    const defaultSEO = {
      // 基础 SEO
      basic: {
        site_title: '专业法律咨询服务',
        site_description: '为您提供全方位的法律支持与解决方案，拥有经验丰富的律师团队',
        keywords: ['法律咨询', '律师服务', '法律顾问', '合同审查', '诉讼代理'],
        author: '',
        language: 'zh-CN',
      },
      
      // Favicon
      favicon: {
        favicon_url: '', // 16x16 或 32x32
        apple_touch_icon_url: '', // 180x180
        favicon_32_url: '',
        favicon_16_url: '',
      },
      
      // Open Graph (Facebook, LinkedIn 等)
      open_graph: {
        enabled: true,
        og_title: '',
        og_description: '',
        og_image: '', // 推荐 1200x630
        og_type: 'website',
        og_locale: 'zh_CN',
        og_site_name: '',
      },
      
      // Twitter Card
      twitter: {
        enabled: true,
        card_type: 'summary_large_image', // summary, summary_large_image
        twitter_site: '', // @username
        twitter_creator: '', // @username
        twitter_title: '',
        twitter_description: '',
        twitter_image: '', // 推荐 1200x600
      },
      
      // 结构化数据 (Schema.org)
      structured_data: {
        enabled: true,
        organization: {
          name: '',
          logo: '',
          url: '',
          description: '',
          telephone: '',
          email: '',
          address: {
            street: '',
            city: '',
            region: '',
            postal_code: '',
            country: 'MY',
          },
          social_links: [],
        },
        local_business: {
          enabled: false,
          business_type: 'LegalService',
          price_range: '$$',
          opening_hours: 'Mo-Fr 09:00-18:00',
        },
      },
      
      // 高级设置
      advanced: {
        robots: 'index, follow',
        canonical_url: '',
        alternate_languages: [],
        google_site_verification: '',
        bing_site_verification: '',
        google_analytics_id: '',
        google_tag_manager_id: '',
      },
    };

    return NextResponse.json({
      success: true,
      seo: settings?.setting_value || defaultSEO,
    });
  } catch (error: any) {
    console.error('Error in GET /api/tenant/seo:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// PUT - 更新 SEO 配置
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
    const seo = await request.json();

    // 验证必填字段
    if (!seo.basic?.site_title) {
      return NextResponse.json({ error: '网站标题不能为空' }, { status: 400 });
    }

    if (!seo.basic?.site_description) {
      return NextResponse.json({ error: '网站描述不能为空' }, { status: 400 });
    }

    // 保存或更新 SEO 配置
    const { error } = await supabase
      .from('tenant_settings')
      .upsert({
        tenant_id: profile.tenant_id,
        setting_key: 'seo',
        setting_value: seo,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'tenant_id,setting_key',
      });

    if (error) {
      console.error('Error updating SEO settings:', error);
      return NextResponse.json({ error: '保存设置失败' }, { status: 500 });
    }

    // 记录审计日志
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'update_seo',
      resource_type: 'tenant_settings',
      resource_id: profile.tenant_id,
      details: { 
        site_title: seo.basic?.site_title,
        og_enabled: seo.open_graph?.enabled,
        twitter_enabled: seo.twitter?.enabled,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'SEO 配置已保存',
    });
  } catch (error: any) {
    console.error('Error in PUT /api/tenant/seo:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
