import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

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

    // 获取上传的文件
    const formData = await request.formData();
    const file = formData.get('logo') as File;

    if (!file) {
      return NextResponse.json({ error: '未选择文件' }, { status: 400 });
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: '不支持的文件类型，请上传 JPG、PNG、SVG、WebP 或 GIF 格式' 
      }, { status: 400 });
    }

    // 验证文件大小（5MB）
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: '文件太大，最大支持 5MB' 
      }, { status: 400 });
    }

    // 生成文件名
    const fileExt = file.name.split('.').pop();
    const fileName = `${profile.tenant_id}/logo-${Date.now()}.${fileExt}`;

    // 上传到 Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('tenant-assets')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Error uploading logo:', uploadError);
      return NextResponse.json({ error: '上传失败' }, { status: 500 });
    }

    // 获取公开 URL
    const { data: { publicUrl } } = supabase.storage
      .from('tenant-assets')
      .getPublicUrl(fileName);

    // 更新品牌设置中的 logo_url
    const { data: currentSettings } = await supabase
      .from('tenant_settings')
      .select('setting_value')
      .eq('tenant_id', profile.tenant_id)
      .eq('setting_key', 'branding')
      .maybeSingle();

    const branding = currentSettings?.setting_value || {};
    branding.logo_url = publicUrl;

    await supabase
      .from('tenant_settings')
      .upsert({
        tenant_id: profile.tenant_id,
        setting_key: 'branding',
        setting_value: branding,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'tenant_id,setting_key',
      });

    // 记录审计日志
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'upload_logo',
      resource_type: 'tenant_settings',
      resource_id: profile.tenant_id,
      details: { file_name: fileName, file_size: file.size },
    });

    return NextResponse.json({
      success: true,
      logo_url: publicUrl,
      message: 'Logo 上传成功',
    });
  } catch (error: any) {
    console.error('Error in POST /api/tenant/branding/upload-logo:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
