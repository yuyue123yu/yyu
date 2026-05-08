// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { createClient } from '@/lib/supabase/server';
import { getTenantId } from '@/lib/tenant';
import { NextResponse } from 'next/server';

/**
 * 公開的服務列�?API
 * 不需要登錄即可訪�?
 * 用於前台頁面顯示服務列表
 * 
 * GET /api/public/services
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // �?Middleware 獲取租戶 ID（基於域名識別）
    const tenantId = await getTenantId();

    if (!tenantId) {
      console.error('未找到租�?);
      return NextResponse.json(
        { error: '未找到租�? },
        { status: 404 }
      );
    }

    // 獲取活躍的服務列�?
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (servicesError) {
      console.error('獲取服務列表失敗:', servicesError);
      return NextResponse.json(
        { error: '獲取服務列表失敗' },
        { status: 500 }
      );
    }

    // 返回服務列表（添加緩存頭�?
    return NextResponse.json(
      { services: services || [] },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('獲取服務列表失敗:', error);
    return NextResponse.json(
      { error: '服務器錯�? },
      { status: 500 }
    );
  }
}
