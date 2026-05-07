import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * 獲取單個服務
 * GET /api/admin/services/[id]
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();

    // 獲取當前用戶
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: '未授權' }, { status: 401 });
    }

    // 獲取用戶的租戶ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile?.tenant_id) {
      return NextResponse.json({ error: '未找到租戶信息' }, { status: 404 });
    }

    // 獲取服務
    const { data: service, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', params.id)
      .eq('tenant_id', profile.tenant_id)
      .single();

    if (error) {
      console.error('獲取服務失敗:', error);
      return NextResponse.json({ error: '獲取服務失敗' }, { status: 500 });
    }

    if (!service) {
      return NextResponse.json({ error: '服務不存在' }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error('服務器錯誤:', error);
    return NextResponse.json({ error: '服務器錯誤' }, { status: 500 });
  }
}

/**
 * 更新服務
 * PUT /api/admin/services/[id]
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();

    // 獲取當前用戶
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: '未授權' }, { status: 401 });
    }

    // 獲取用戶的租戶ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile?.tenant_id) {
      return NextResponse.json({ error: '未找到租戶信息' }, { status: 404 });
    }

    // 解析請求體
    const body = await request.json();

    // 更新服務
    const { data: service, error } = await supabase
      .from('services')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .eq('tenant_id', profile.tenant_id)
      .select()
      .single();

    if (error) {
      console.error('更新服務失敗:', error);
      return NextResponse.json({ error: '更新服務失敗' }, { status: 500 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error('服務器錯誤:', error);
    return NextResponse.json({ error: '服務器錯誤' }, { status: 500 });
  }
}

/**
 * 刪除服務
 * DELETE /api/admin/services/[id]
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();

    // 獲取當前用戶
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: '未授權' }, { status: 401 });
    }

    // 獲取用戶的租戶ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile?.tenant_id) {
      return NextResponse.json({ error: '未找到租戶信息' }, { status: 404 });
    }

    // 刪除服務
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', params.id)
      .eq('tenant_id', profile.tenant_id);

    if (error) {
      console.error('刪除服務失敗:', error);
      return NextResponse.json({ error: '刪除服務失敗' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('服務器錯誤:', error);
    return NextResponse.json({ error: '服務器錯誤' }, { status: 500 });
  }
}
