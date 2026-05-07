'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function TestLoginSimple() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@legalmy.com');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('开始登录...');

    try {
      const supabase = createClient();
      
      // 步骤1: 登出
      setMessage('步骤1: 登出旧账号...');
      await supabase.auth.signOut();
      
      // 步骤2: 登录
      setMessage('步骤2: 登录新账号...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(`❌ 登录失败: ${error.message}`);
        return;
      }

      if (!data.session) {
        setMessage('❌ 登录成功但未获取到Session');
        return;
      }

      // 步骤3: 写入Cookie
      setMessage('步骤3: 写入Cookie...');
      const cookieResponse = await fetch('/api/auth/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        }),
      });

      if (!cookieResponse.ok) {
        setMessage(`❌ Cookie写入失败: ${cookieResponse.status}`);
        return;
      }

      setMessage('✅ 登录成功！准备跳转...');
      
      // 步骤4: 跳转
      setTimeout(() => {
        router.replace('/admin-v2');
      }, 1000);
      
    } catch (err: any) {
      setMessage(`❌ 异常: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '50px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>简单登录测试</h1>
      
      <form onSubmit={handleLogin} style={{ marginTop: '30px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            邮箱:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '2px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            密码:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '2px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <button 
          type="submit"
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: '#0070f3', 
            color: 'white', 
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          登录
        </button>
      </form>
      
      {message && (
        <div style={{ 
          marginTop: '30px', 
          padding: '15px', 
          background: message.includes('❌') ? '#fee' : '#efe',
          border: `2px solid ${message.includes('❌') ? '#fcc' : '#cfc'}`,
          borderRadius: '5px',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}
