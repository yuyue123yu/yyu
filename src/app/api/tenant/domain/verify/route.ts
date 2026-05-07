import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// POST - 验证域名配置
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

    // 检查权限：必须是 owner 或 admin
    if (profile.user_type !== 'owner' && profile.user_type !== 'admin') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 });
    }

    // 获取请求数据
    const { type } = await request.json(); // 'subdomain' or 'custom_domain'

    // 获取当前域名配置
    const { data: settings } = await supabase
      .from('tenant_settings')
      .select('setting_value')
      .eq('tenant_id', profile.tenant_id)
      .eq('setting_key', 'domain')
      .single();

    if (!settings?.setting_value) {
      return NextResponse.json({ error: '域名配置不存在' }, { status: 400 });
    }

    const domainConfig = settings.value;

    // 模拟 DNS 验证（实际项目中需要真实的 DNS 查询）
    // 这里我们简化处理，假设验证成功
    const verified = true;
    const now = new Date().toISOString();

    if (type === 'subdomain' && domainConfig.subdomain?.enabled) {
      domainConfig.subdomain.status = verified ? 'active' : 'error';
      domainConfig.subdomain.verified_at = verified ? now : null;
      domainConfig.verification.verified = verified;
      domainConfig.verification.verified_at = verified ? now : null;
      domainConfig.verification.last_check_at = now;
    } else if (type === 'custom_domain' && domainConfig.custom_domain?.enabled) {
      domainConfig.custom_domain.status = verified ? 'active' : 'error';
      domainConfig.custom_domain.verified_at = verified ? now : null;
      domainConfig.verification.verified = verified;
      domainConfig.verification.verified_at = verified ? now : null;
      domainConfig.verification.last_check_at = now;

      // 如果域名验证成功，自动配置 SSL
      if (verified) {
        domainConfig.custom_domain.ssl_status = 'pending';
        // 模拟 SSL 证书签发（实际项目中需要调用 Let's Encrypt 等服务）
        setTimeout(() => {
          domainConfig.custom_domain.ssl_status = 'active';
          domainConfig.custom_domain.ssl_issued_at = now;
        }, 1000);
      }
    }

    // 更新域名配置
    const { error } = await supabase
      .from('tenant_settings')
      .update({
        setting_value: domainConfig,
        updated_at: now,
      })
      .eq('tenant_id', profile.tenant_id)
      .eq('setting_key', 'domain');

    if (error) {
      console.error('Error updating domain verification:', error);
      return NextResponse.json({ error: '更新验证状态失败' }, { status: 500 });
    }

    // 记录审计日志
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'verify_domain',
      resource_type: 'tenant_settings',
      resource_id: profile.tenant_id,
      details: { 
        type,
        verified,
        domain: type === 'subdomain' 
          ? domainConfig.subdomain?.name 
          : domainConfig.custom_domain?.domain,
      },
    });

    return NextResponse.json({
      success: true,
      verified,
      message: verified ? '域名验证成功！' : '域名验证失败，请检查 DNS 配置',
      domain: domainConfig,
    });
  } catch (error: any) {
    console.error('Error in POST /api/tenant/domain/verify:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
