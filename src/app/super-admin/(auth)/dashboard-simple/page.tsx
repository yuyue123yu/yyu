import { createServerClient } from '@/lib/supabase/server';
import DashboardClient from './DashboardClient';

export default async function SimpleDashboard() {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Layout已经验证了权限，这里只需要获取数据
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session!.user.id)
    .maybeSingle();

  return <DashboardClient profile={profile} session={session} />;
}
