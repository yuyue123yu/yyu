// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * 獲取服務列表
 * GET /api/admin/services
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // 獲取當前用戶
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: '未授�? }, { status: 401 });
    }

    // 獲取用戶的租戶ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile?.tenant_id) {
      return NextResponse.json({ error: '未找到租戶信�? }, { status: 404 });
    }

    // 獲取服務列表
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .eq('tenant_id', profile.tenant_id)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('獲取服務列表失敗:', error);
      return NextResponse.json({ error: '獲取服務列表失敗' }, { status: 500 });
    }

    return NextResponse.json({ services });
  } catch (error) {
    console.error('服務器錯�?', error);
    return NextResponse.json({ error: '服務器錯�? }, { status: 500 });
  }
}

/**
 * 創建新服�?
 * POST /api/admin/services
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 獲取當前用戶
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: '未授�? }, { status: 401 });
    }

    // 獲取用戶的租戶ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile?.tenant_id) {
      return NextResponse.json({ error: '未找到租戶信�? }, { status: 404 });
    }

    // 解析請求�?
    const body = await request.json();

    // 創建服務
    const { data: service, error } = await supabase
      .from('services')
      .insert({
        tenant_id: profile.tenant_id,
        ...body,
      })
      .select()
      .single();

    if (error) {
      console.error('創建服務失敗:', error);
      return NextResponse.json({ error: '創建服務失敗' }, { status: 500 });
    }

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error('服務器錯�?', error);
    return NextResponse.json({ error: '服務器錯�? }, { status: 500 });
  }
}
