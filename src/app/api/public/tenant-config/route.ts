import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * 公开的租户配置 API
 * 不需要登录即可访问
 * 用于前台页面读取租户的品牌、价格等配置
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // 获取第一个活跃的租户（简化方案）
    // TODO: 未来可以根据域名识别租户
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('id, name, subdomain')
      .eq('status', 'active')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (tenantError || !tenant) {
      console.error('获取租户失败:', tenantError);
      return NextResponse.json(
        { error: '未找到租户配置' },
        { status: 404 }
      );
    }

    // 获取租户的所有配置
    const { data: settings, error: settingsError } = await supabase
      .from('tenant_settings')
      .select('setting_key, setting_value')
      .eq('tenant_id', tenant.id);

    if (settingsError) {
      console.error('获取配置失败:', settingsError);
      return NextResponse.json(
        { error: '获取配置失败' },
        { status: 500 }
      );
    }

    // 将配置转换为对象格式
    const config: Record<string, any> = {
      tenant: {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
      },
    };

    settings?.forEach((setting) => {
      try {
        config[setting.setting_key] = JSON.parse(setting.setting_value);
      } catch (e) {
        config[setting.setting_key] = setting.setting_value;
      }
    });

    // 返回配置（添加缓存头）
    return NextResponse.json(config, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('获取租户配置失败:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
