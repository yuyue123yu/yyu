// 创建测试用户脚本
// 运行: node scripts/create-test-user.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ovtrvzbftinsfwytzgwy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92dHJ2emJmdGluc2Z3eXR6Z3d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc5NDcwOCwiZXhwIjoyMDkzMzcwNzA4fQ.VmaReeo6bcuIAtdnTbQFG4JshTg7roVrVGCJq8BqbXg';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    // 使用 service role 创建用户（绕过邮件验证）
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'Test123456',
      email_confirm: true, // 自动确认邮箱
      user_metadata: {
        full_name: '测试用户',
        phone: '+60123456789'
      }
    });

    if (error) {
      console.error('Error creating user:', error);
      return;
    }

    console.log('User created successfully:', data.user.id);

    // 创建 profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: data.user.id,
          email: 'test@example.com',
          full_name: '测试用户',
          phone: '+60123456789',
          user_type: 'client'
        }
      ]);

    if (profileError) {
      console.error('Error creating profile:', profileError);
    } else {
      console.log('Profile created successfully!');
      console.log('\n✅ Test user created!');
      console.log('Email: test@example.com');
      console.log('Password: Test123456');
      console.log('\nYou can now login at: http://localhost:3000/login');
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createTestUser();
