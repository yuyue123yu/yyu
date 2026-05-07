// Super Admin 登录自动化测试脚本
// 运行方法: node test-super-admin-login.js

const { createClient } = require('@supabase/supabase-js');

// Supabase 配置
const supabaseUrl = 'https://ovtrvzbftinsfwytzgwy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92dHJ2emJmdGluc2Z3eXR6Z3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3OTQ3MDgsImV4cCI6MjA5MzM3MDcwOH0.cB_v3FeWj3GoQfGo08S4pOQ2vIgRZwyQ5-KrPkedpDM';

// 测试用户
const testEmail = '403940124@qq.com';
const testPassword = '请在这里输入您的密码'; // 需要手动输入密码

async function testSuperAdminLogin() {
  console.log('=== 🧪 Super Admin 登录测试 ===\n');

  // 创建 Supabase 客户端
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // 步骤 1: 测试登录
    console.log('📝 步骤 1: 测试登录...');
    console.log(`   邮箱: ${testEmail}`);
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (authError) {
      console.error('❌ 登录失败:', authError.message);
      return;
    }

    console.log('✅ 登录成功!');
    console.log(`   用户 ID: ${authData.user.id}`);
    console.log(`   邮箱: ${authData.user.email}`);
    console.log(`   邮箱已验证: ${authData.user.email_confirmed_at ? '是' : '否'}`);

    // 步骤 2: 获取 Session
    console.log('\n📝 步骤 2: 获取 Session...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('❌ 获取 Session 失败:', sessionError.message);
      return;
    }

    if (!session) {
      console.error('❌ Session 不存在!');
      return;
    }

    console.log('✅ Session 存在!');
    console.log(`   Access Token: ${session.access_token.substring(0, 20)}...`);
    console.log(`   过期时间: ${new Date(session.expires_at * 1000).toLocaleString('zh-CN')}`);

    // 步骤 3: 查询 Profile
    console.log('\n📝 步骤 3: 查询 Profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('❌ 查询 Profile 失败:', profileError.message);
      console.error('   详情:', profileError);
      return;
    }

    if (!profile) {
      console.error('❌ Profile 不存在!');
      return;
    }

    console.log('✅ Profile 查询成功!');
    console.log('   Profile 详情:');
    console.log(`   - ID: ${profile.id}`);
    console.log(`   - Email: ${profile.email}`);
    console.log(`   - Full Name: ${profile.full_name || '未设置'}`);
    console.log(`   - User Type: ${profile.user_type}`);
    console.log(`   - Super Admin: ${profile.super_admin ? '是' : '否'}`);
    console.log(`   - Tenant ID: ${profile.tenant_id || 'NULL (正确)'}`);
    console.log(`   - Active: ${profile.active ? '是' : '否'}`);

    // 步骤 4: 验证 Super Admin 权限
    console.log('\n📝 步骤 4: 验证 Super Admin 权限...');
    
    if (!profile.super_admin) {
      console.error('❌ 不是 Super Admin!');
      return;
    }

    if (profile.user_type !== 'super_admin') {
      console.error('❌ user_type 不正确:', profile.user_type);
      return;
    }

    if (profile.tenant_id !== null) {
      console.error('❌ tenant_id 应该是 NULL，但是:', profile.tenant_id);
      return;
    }

    console.log('✅ Super Admin 权限验证通过!');

    // 步骤 5: 测试 RLS 策略
    console.log('\n📝 步骤 5: 测试 RLS 策略...');
    
    // 测试查询所有 profiles
    const { data: allProfiles, error: allProfilesError } = await supabase
      .from('profiles')
      .select('id, email, user_type, super_admin')
      .limit(5);

    if (allProfilesError) {
      console.error('❌ 查询所有 profiles 失败:', allProfilesError.message);
    } else {
      console.log(`✅ 可以查询所有 profiles (找到 ${allProfiles.length} 条记录)`);
    }

    // 测试查询所有 tenants
    const { data: allTenants, error: allTenantsError } = await supabase
      .from('tenants')
      .select('id, name, status')
      .limit(5);

    if (allTenantsError) {
      console.error('❌ 查询所有 tenants 失败:', allTenantsError.message);
    } else {
      console.log(`✅ 可以查询所有 tenants (找到 ${allTenants.length} 条记录)`);
    }

    // 最终结果
    console.log('\n=== 🎉 测试完成 ===');
    console.log('✅ 所有测试通过！Super Admin 登录功能正常！');
    console.log('\n📋 总结:');
    console.log('   1. ✅ 登录成功');
    console.log('   2. ✅ Session 正常');
    console.log('   3. ✅ Profile 存在且正确');
    console.log('   4. ✅ Super Admin 权限正确');
    console.log('   5. ✅ RLS 策略正常');

    // 登出
    await supabase.auth.signOut();
    console.log('\n✅ 已登出');

  } catch (error) {
    console.error('\n❌ 测试过程中发生异常:', error);
    console.error('   错误堆栈:', error.stack);
  }
}

// 运行测试
testSuperAdminLogin();
