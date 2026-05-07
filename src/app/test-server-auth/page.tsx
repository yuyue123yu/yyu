import { createServerClient } from '@/lib/supabase/server';

export default async function TestServerAuth() {
  console.log('=== 测试服务端认证 ===');
  
  try {
    const supabase = await createServerClient();
    console.log('✅ Supabase客户端创建成功');
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Session:', session);
    console.log('Session Error:', sessionError);
    
    if (!session) {
      return (
        <div style={{ padding: '50px', fontFamily: 'monospace' }}>
          <h1>❌ 无Session</h1>
          <p>请先登录</p>
          <a href="/admin/login-v2">去登录</a>
        </div>
      );
    }
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();
    
    console.log('Profile:', profile);
    console.log('Profile Error:', profileError);
    
    return (
      <div style={{ padding: '50px', fontFamily: 'monospace', lineHeight: '1.8' }}>
        <h1>✅ 服务端认证测试成功</h1>
        
        <h2>Session信息：</h2>
        <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
          {JSON.stringify({
            user_id: session.user.id,
            email: session.user.email,
            created_at: session.user.created_at,
          }, null, 2)}
        </pre>
        
        <h2>Profile信息：</h2>
        <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
          {JSON.stringify(profile, null, 2)}
        </pre>
        
        <h2>Profile Error:</h2>
        <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
          {JSON.stringify(profileError, null, 2)}
        </pre>
        
        <div style={{ marginTop: '30px' }}>
          <a href="/admin-v2" style={{ 
            padding: '10px 20px', 
            background: '#0070f3', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '5px'
          }}>
            去 Admin-V2 Dashboard
          </a>
        </div>
      </div>
    );
    
  } catch (error: any) {
    console.error('❌ 错误:', error);
    return (
      <div style={{ padding: '50px', fontFamily: 'monospace' }}>
        <h1>❌ 错误</h1>
        <pre style={{ background: '#fee', padding: '15px', borderRadius: '5px', color: 'red' }}>
          {error.message}
        </pre>
      </div>
    );
  }
}
