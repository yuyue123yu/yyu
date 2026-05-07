import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminLayoutClient from './AdminLayoutClient';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  console.log('=== Admin-V2 Layout 权限检查 ===');
  console.log('Session:', session ? '存在' : '不存在');
  console.log('Session Error:', sessionError);
  
  // 服务端权限检查 - 无 race condition
  if (!session) {
    console.log('❌ 无Session，重定向到登录页');
    redirect('/admin/login-v2');
  }

  console.log('✅ Session存在，用户ID:', session.user.id);
  console.log('用户邮箱:', session.user.email);

  // 获取用户profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  console.log('Profile查询结果:', profile);
  console.log('Profile Error:', profileError);

  if (!profile) {
    console.log('❌ 未找到Profile，重定向到登录页');
    redirect('/admin/login-v2');
  }

  console.log('✅ Profile存在');
  console.log('user_type:', profile.user_type);
  console.log('super_admin:', profile.super_admin);

  // 检查是否是管理员
  if (profile.user_type !== 'admin' && !profile.super_admin) {
    console.log('❌ 权限不足，重定向到登录页');
    console.log('需要: user_type=admin 或 super_admin=true');
    console.log('实际: user_type=' + profile.user_type + ', super_admin=' + profile.super_admin);
    redirect('/admin/login-v2');
  }

  console.log('✅ 权限验证通过！');

  // 传递用户信息给客户端组件
  return (
    <AdminLayoutClient user={session.user} profile={profile}>
      {children}
    </AdminLayoutClient>
  );
}
