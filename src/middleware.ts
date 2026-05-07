import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * 多租户域名识别 Middleware
 * 
 * 优先级：
 * 1. custom_domain (primary_domain) - 例如：lawfirmabc.com
 * 2. subdomain - 例如：abc.legalmy.com
 * 3. default tenant - 第一个活跃租户（开发环境）
 */
export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl;
  
  // 跳过静态资源和 API 路由（部分）
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api/auth') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 创建 Supabase 客户端
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Middleware 中不能直接设置 cookie
        },
        remove(name: string, options: any) {
          // Middleware 中不能直接删除 cookie
        },
      },
    }
  );

  try {
    // 解析域名
    const hostname = host.split(':')[0]; // 移除端口号
    
    // 开发环境：localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // 开发环境使用第一个活跃租户
      const response = NextResponse.next();
      response.headers.set('x-tenant-mode', 'development');
      return response;
    }

    // 生产环境：识别租户
    let tenantId: string | null = null;
    let tenantMode: string = 'unknown';

    // 优先级 1: 检查是否是自定义域名 (primary_domain)
    const { data: customDomainTenant } = await supabase
      .from('tenants')
      .select('id, name, subdomain, primary_domain')
      .eq('primary_domain', hostname)
      .eq('status', 'active')
      .maybeSingle();

    if (customDomainTenant) {
      tenantId = customDomainTenant.id;
      tenantMode = 'custom-domain';
    }

    // 优先级 2: 检查是否是子域名 (subdomain.legalmy.com)
    if (!tenantId) {
      const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'legalmy.com';
      
      if (hostname.endsWith(`.${mainDomain}`)) {
        const subdomain = hostname.replace(`.${mainDomain}`, '');
        
        const { data: subdomainTenant } = await supabase
          .from('tenants')
          .select('id, name, subdomain, primary_domain')
          .eq('subdomain', subdomain)
          .eq('status', 'active')
          .maybeSingle();

        if (subdomainTenant) {
          tenantId = subdomainTenant.id;
          tenantMode = 'subdomain';
        }
      }
    }

    // 优先级 3: 使用默认租户（主域名访问）
    if (!tenantId && hostname === (process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'legalmy.com')) {
      const { data: defaultTenant } = await supabase
        .from('tenants')
        .select('id, name, subdomain')
        .eq('status', 'active')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (defaultTenant) {
        tenantId = defaultTenant.id;
        tenantMode = 'default';
      }
    }

    // 如果找不到租户，返回 404
    if (!tenantId) {
      return new NextResponse('Tenant not found', { status: 404 });
    }

    // 将租户信息添加到请求头
    const response = NextResponse.next();
    response.headers.set('x-tenant-id', tenantId);
    response.headers.set('x-tenant-mode', tenantMode);
    response.headers.set('x-hostname', hostname);

    return response;

  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

// 配置 Middleware 匹配路径
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了：
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (网站图标)
     * - public 文件夹中的文件
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
