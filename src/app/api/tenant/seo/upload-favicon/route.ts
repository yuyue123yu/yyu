// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    // 验证用户登录
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: '未登�? }, { status: 401 });
    }

    // 获取用户的租户信息和权限
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id, user_type')
      .eq('id', session.user.id)
      .single();

    if (!profile?.tenant_id) {
      return NextResponse.json({ error: '用户未关联租�? }, { status: 400 });
    }

    // 检查权�?
    if (profile.user_type !== 'owner' && profile.user_type !== 'admin') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 });
    }

    // 获取上传的文�?
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'favicon', 'apple-touch-icon'

    if (!file) {
      return NextResponse.json({ error: '未选择文件' }, { status: 400 });
    }

    // 验证文件类型
    const allowedTypes = ['image/x-icon', 'image/png', 'image/jpeg', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: '不支持的文件类型，请上传 ICO, PNG, JPG �?SVG 格式' 
      }, { status: 400 });
    }

    // 验证文件大小（最�?1MB�?
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: '文件大小超过限制（最�?1MB�? 
      }, { status: 400 });
    }

    // 生成文件�?
    const fileExt = file.name.split('.').pop();
    const fileName = `${profile.tenant_id}/${type || 'favicon'}-${Date.now()}.${fileExt}`;

    // 上传�?Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('tenant-assets')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Error uploading favicon:', uploadError);
      return NextResponse.json({ error: '上传失败' }, { status: 500 });
    }

    // 获取公开 URL
    const { data: { publicUrl } } = supabase.storage
      .from('tenant-assets')
      .getPublicUrl(fileName);

    // 记录审计日志
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'upload_favicon',
      resource_type: 'tenant_settings',
      resource_id: profile.tenant_id,
      details: { type, file_name: fileName },
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      message: 'Favicon 上传成功',
    });
  } catch (error: any) {
    console.error('Error in POST /api/tenant/seo/upload-favicon:', error);
    return NextResponse.json({ error: '服务器错�? }, { status: 500 });
  }
}
