import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  // 验证Session
  if (!session) {
    redirect('/super-admin/login');
  }

  // 获取Profile并验证Super Admin权限
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  if (!profile?.super_admin) {
    redirect('/super-admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
