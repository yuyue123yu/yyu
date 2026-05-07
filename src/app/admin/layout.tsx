import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminLayoutClient from './AdminLayoutClient';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  // 服务端权限检查 - 无 race condition
  if (!session) {
    redirect('/admin/login');
  }

  // 获取用户profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  if (!profile) {
    redirect('/admin/login');
  }

  // 检查是否是管理员
  if (profile.user_type !== 'admin' && !profile.super_admin) {
    redirect('/admin/login');
  }

  // 传递用户信息给客户端组件
  return (
    <AdminLayoutClient user={session.user} profile={profile}>
      {children}
    </AdminLayoutClient>
  );
}
