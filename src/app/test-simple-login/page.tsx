'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function TestSimpleLogin() {
  const [email, setEmail] = useState('admin@legalmy.com');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('登录中...');

    try {
      const supabase = createClient();
      
      // 先登出
      await supabase.auth.signOut();
      
      // 登录
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(`错误: ${error.message}`);
        return;
      }

      setMessage('登录成功！');
      
      // 直接跳转
      window.location.href = '/admin';
      
    } catch (err: any) {
      setMessage(`异常: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>简单登录测试</h1>
      
      <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>邮箱:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>密码:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
          />
        </div>
        
        <button 
          type="submit"
          style={{ 
            width: '100%', 
            padding: '10px', 
            background: '#0070f3', 
            color: 'white', 
            border: 'none',
            cursor: 'pointer'
          }}
        >
          登录
        </button>
      </form>
      
      {message && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          background: '#f0f0f0',
          border: '1px solid #ccc'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}
