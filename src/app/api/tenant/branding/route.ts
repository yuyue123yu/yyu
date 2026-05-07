import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// GET - 获取品牌设置
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

    // 获取品牌设置
    const { data: settings, error } = await supabase
      .from('tenant_settings')
      .select('setting_value')
      .eq('tenant_id', profile.tenant_id)
      .eq('setting_key', 'branding')
      .maybeSingle();

    if (error) {
      console.error('Error fetching branding settings:', error);
      return NextResponse.json({ error: '获取设置失败' }, { status: 500 });
    }

    // 返回默认值或已保存的设置
    const defaultBranding = {
      logo_url: '',
      primary_color: '#1E40AF',
      secondary_color: '#F59E0B',
      company_name: '',
      company_description: '',
      contact_phone: '',
      contact_email: '',
      contact_address: '',
      social_links: {
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: '',
      },
    };

    return NextResponse.json({
      success: true,
      branding: settings?.setting_value || defaultBranding,
    });
  } catch (error: any) {
    console.error('Error in GET /api/tenant/branding:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// PUT - 更新品牌设置
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
    const branding = await request.json();

    // 验证必填字段
    if (!branding.company_name) {
      return NextResponse.json({ error: '公司名称不能为空' }, { status: 400 });
    }

    // 验证颜色格式
    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!colorRegex.test(branding.primary_color)) {
      return NextResponse.json({ error: '主色调格式不正确' }, { status: 400 });
    }
    if (!colorRegex.test(branding.secondary_color)) {
      return NextResponse.json({ error: '辅色调格式不正确' }, { status: 400 });
    }

    // 保存或更新品牌设置
    const { error } = await supabase
      .from('tenant_settings')
      .upsert({
        tenant_id: profile.tenant_id,
        setting_key: 'branding',
        setting_value: branding,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'tenant_id,setting_key',
      });

    if (error) {
      console.error('Error updating branding settings:', error);
      return NextResponse.json({ error: '保存设置失败' }, { status: 500 });
    }

    // 记录审计日志
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'update_branding',
      resource_type: 'tenant_settings',
      resource_id: profile.tenant_id,
      details: { updated_fields: Object.keys(branding) },
    });

    return NextResponse.json({
      success: true,
      message: '品牌设置已保存',
    });
  } catch (error: any) {
    console.error('Error in PUT /api/tenant/branding:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
