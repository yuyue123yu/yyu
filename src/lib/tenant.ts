import { headers } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';

/**
 * 从 Middleware 设置的请求头中获取租户 ID
 * 如果没有（开发环境），则查询第一个活跃租户
 */
export async function getTenantId(): Promise<string | null> {
  try {
    // 尝试从 Middleware 设置的请求头获取
    const headersList = await headers();
    const tenantId = headersList.get('x-tenant-id');
    
    if (tenantId) {
      return tenantId;
    }

    // 开发环境 fallback：查询第一个活跃租户
    const supabase = await createServerClient();
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('status', 'active')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    return tenant?.id || null;
  } catch (error) {
    console.error('获取租户 ID 失败:', error);
    return null;
  }
}

/**
 * 获取租户模式（custom-domain, subdomain, default, development）
 */
export async function getTenantMode(): Promise<string> {
  try {
    const headersList = await headers();
    return headersList.get('x-tenant-mode') || 'unknown';
  } catch (error) {
    return 'unknown';
  }
}

/**
 * 获取当前主机名
 */
export async function getHostname(): Promise<string> {
  try {
    const headersList = await headers();
    return headersList.get('x-hostname') || headersList.get('host') || '';
  } catch (error) {
    return '';
  }
}

/**
 * 获取完整的租户信息
 */
export async function getTenantInfo() {
  const tenantId = await getTenantId();
  
  if (!tenantId) {
    return null;
  }

  const supabase = await createServerClient();
  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', tenantId)
    .maybeSingle();

  return tenant;
}
