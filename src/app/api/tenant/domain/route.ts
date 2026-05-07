import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// GET - 获取域名配置
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

    // 获取域名配置
    const { data: settings, error } = await supabase
      .from('tenant_settings')
      .select('setting_value')
      .eq('tenant_id', profile.tenant_id)
      .eq('setting_key', 'domain')
      .maybeSingle();

    if (error) {
      console.error('Error fetching domain settings:', error);
      return NextResponse.json({ error: '获取设置失败' }, { status: 500 });
    }

    // 返回默认值或已保存的设置
    const defaultDomain = {
      // 子域名配置
      subdomain: {
        enabled: false,
        name: '', // 例如: abc (完整域名: abc.platform.com)
        status: 'not_configured', // not_configured, pending, active, error
        verified_at: null,
      },
      
      // 自定义域名配置
      custom_domain: {
        enabled: false,
        domain: '', // 例如: www.example.com
        status: 'not_configured', // not_configured, pending, active, error
        verified_at: null,
        ssl_status: 'not_configured', // not_configured, pending, active, error
        ssl_issued_at: null,
      },
      
      // DNS 配置
      dns_records: {
        a_record: {
          type: 'A',
          name: '@',
          value: '123.456.789.0', // 平台服务器 IP
          ttl: 3600,
        },
        cname_record: {
          type: 'CNAME',
          name: 'www',
          value: 'platform.com',
          ttl: 3600,
        },
        txt_record: {
          type: 'TXT',
          name: '@',
          value: '', // 验证码，动态生成
          ttl: 3600,
        },
      },
      
      // 域名验证
      verification: {
        method: 'dns', // dns, file
        token: '', // 验证令牌
        verified: false,
        verified_at: null,
        last_check_at: null,
      },
      
      // 重定向设置
      redirect: {
        force_https: true,
        force_www: false,
        redirect_from_old_domain: true,
      },
    };

    return NextResponse.json({
      success: true,
      domain: settings?.setting_value || defaultDomain,
    });
  } catch (error: any) {
    console.error('Error in GET /api/tenant/domain:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// PUT - 更新域名配置
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
    const domain = await request.json();

    // 验证域名格式
    if (domain.subdomain?.enabled && domain.subdomain?.name) {
      const subdomainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;
      if (!subdomainRegex.test(domain.subdomain.name)) {
        return NextResponse.json({ 
          error: '子域名格式不正确，只能包含小写字母、数字和连字符' 
        }, { status: 400 });
      }
    }

    if (domain.custom_domain?.enabled && domain.custom_domain?.domain) {
      const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
      if (!domainRegex.test(domain.custom_domain.domain)) {
        return NextResponse.json({ 
          error: '自定义域名格式不正确' 
        }, { status: 400 });
      }
    }

    // 保存或更新域名配置
    const { error } = await supabase
      .from('tenant_settings')
      .upsert({
        tenant_id: profile.tenant_id,
        setting_key: 'domain',
        setting_value: domain,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'tenant_id,setting_key',
      });

    if (error) {
      console.error('Error updating domain settings:', error);
      return NextResponse.json({ error: '保存设置失败' }, { status: 500 });
    }

    // 记录审计日志
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'update_domain',
      resource_type: 'tenant_settings',
      resource_id: profile.tenant_id,
      details: { 
        subdomain: domain.subdomain?.name,
        custom_domain: domain.custom_domain?.domain,
      },
    });

    return NextResponse.json({
      success: true,
      message: '域名配置已保存',
    });
  } catch (error: any) {
    console.error('Error in PUT /api/tenant/domain:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
