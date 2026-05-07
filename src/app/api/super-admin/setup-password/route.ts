import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 使用 Service Role Key 来管理用户
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码至少需要 6 个字符' },
        { status: 400 }
      );
    }

    // 只允许为 403940124@qq.com 设置密码（安全限制）
    if (email !== '403940124@qq.com') {
      return NextResponse.json(
        { error: '只能为指定的 Super Admin 邮箱设置密码' },
        { status: 403 }
      );
    }

    console.log('🔐 开始设置密码...');

    // 1. 查找用户
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      console.error('❌ 查询用户失败:', listError);
      return NextResponse.json(
        { error: `查询用户失败: ${listError.message}` },
        { status: 500 }
      );
    }

    const user = users.users.find(u => u.email === email);

    if (!user) {
      console.error('❌ 用户不存在:', email);
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    console.log('✅ 找到用户:', user.id);

    // 2. 更新用户密码
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password }
    );

    if (updateError) {
      console.error('❌ 更新密码失败:', updateError);
      return NextResponse.json(
        { error: `更新密码失败: ${updateError.message}` },
        { status: 500 }
      );
    }

    console.log('✅ 密码更新成功!');

    // 3. 确保 Profile 配置正确
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: user.id,
        email: email,
        full_name: 'Super Admin',
        user_type: 'super_admin',
        super_admin: true,
        tenant_id: null,
      }, {
        onConflict: 'id'
      });

    if (profileError) {
      console.error('⚠️ Profile 更新失败:', profileError);
      // 不返回错误，因为密码已经设置成功
    } else {
      console.log('✅ Profile 配置成功!');
    }

    return NextResponse.json({
      success: true,
      message: '密码设置成功',
      userId: user.id,
    });

  } catch (error: any) {
    console.error('❌ 设置密码异常:', error);
    return NextResponse.json(
      { error: `设置密码异常: ${error.message}` },
      { status: 500 }
    );
  }
}
