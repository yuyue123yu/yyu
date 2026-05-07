import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// GET - 获取价格配置
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

    // 获取价格配置
    const { data: settings, error } = await supabase
      .from('tenant_settings')
      .select('setting_value')
      .eq('tenant_id', profile.tenant_id)
      .eq('setting_key', 'pricing')
      .maybeSingle();

    if (error) {
      console.error('Error fetching pricing settings:', error);
      return NextResponse.json({ error: '获取设置失败' }, { status: 500 });
    }

    // 返回默认值或已保存的设置
    const defaultPricing = {
      currency: 'MYR',
      consultation: {
        basic: {
          price: 200,
          duration: 30,
          description: '基础咨询服务',
          enabled: true,
        },
        standard: {
          price: 500,
          duration: 60,
          description: '标准咨询服务',
          enabled: true,
        },
        premium: {
          price: 1000,
          duration: 120,
          description: '高级咨询服务',
          enabled: true,
        },
      },
      documents: {
        contract_review: {
          price: 300,
          description: '合同审查',
          enabled: true,
        },
        legal_letter: {
          price: 150,
          description: '法律函件',
          enabled: true,
        },
        agreement_draft: {
          price: 500,
          description: '协议起草',
          enabled: true,
        },
        notarization: {
          price: 100,
          description: '文件公证',
          enabled: true,
        },
      },
      membership: {
        enabled: false,
        monthly: {
          price: 99,
          description: '月度会员',
          benefits: ['优先咨询', '文档折扣', '专属客服'],
        },
        yearly: {
          price: 999,
          description: '年度会员',
          benefits: ['优先咨询', '文档折扣', '专属客服', '免费法律讲座'],
        },
      },
      discounts: {
        first_time: {
          enabled: true,
          percentage: 10,
          description: '首次咨询优惠',
        },
        referral: {
          enabled: true,
          percentage: 15,
          description: '推荐好友优惠',
        },
        bulk: {
          enabled: false,
          percentage: 20,
          description: '批量服务优惠',
        },
      },
    };

    return NextResponse.json({
      success: true,
      pricing: settings?.setting_value || defaultPricing,
    });
  } catch (error: any) {
    console.error('Error in GET /api/tenant/pricing:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// PUT - 更新价格配置
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
    const pricing = await request.json();

    // 验证价格数据
    if (pricing.currency && !['MYR', 'USD', 'SGD', 'CNY'].includes(pricing.currency)) {
      return NextResponse.json({ error: '不支持的货币类型' }, { status: 400 });
    }

    // 验证价格为正数
    const validatePrices = (obj: any): boolean => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (obj[key].price !== undefined && (obj[key].price < 0 || isNaN(obj[key].price))) {
            return false;
          }
          if (!validatePrices(obj[key])) {
            return false;
          }
        }
      }
      return true;
    };

    if (!validatePrices(pricing)) {
      return NextResponse.json({ error: '价格必须为正数' }, { status: 400 });
    }

    // 保存或更新价格配置
    const { error } = await supabase
      .from('tenant_settings')
      .upsert({
        tenant_id: profile.tenant_id,
        setting_key: 'pricing',
        setting_value: pricing,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'tenant_id,setting_key',
      });

    if (error) {
      console.error('Error updating pricing settings:', error);
      return NextResponse.json({ error: '保存设置失败' }, { status: 500 });
    }

    // 记录审计日志
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'update_pricing',
      resource_type: 'tenant_settings',
      resource_id: profile.tenant_id,
      details: { currency: pricing.currency },
    });

    return NextResponse.json({
      success: true,
      message: '价格配置已保存',
    });
  } catch (error: any) {
    console.error('Error in PUT /api/tenant/pricing:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
