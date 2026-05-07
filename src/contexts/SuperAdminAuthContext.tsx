'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface SuperAdminAuthContextType {
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const SuperAdminAuthContext = createContext<SuperAdminAuthContextType | undefined>(
  undefined
);

export function SuperAdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkUser();

    // Set up auth state listener
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        checkSuperAdminStatus(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setIsSuperAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        await checkSuperAdminStatus(user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSuperAdminStatus = async (userId: string) => {
    try {
      const supabase = createClient();
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setProfile(profile);
      setIsSuperAdmin(profile?.super_admin || false);
    } catch (error) {
      console.error('Error checking super admin status:', error);
      setIsSuperAdmin(false);
    }
  };

  const login = async (email: string, password: string) => {
    const supabase = createClient();

    // Sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (!data.user) {
      throw new Error('Login failed');
    }

    // Check super admin status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('super_admin')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw profileError;

    if (!profile?.super_admin) {
      // Not a super admin, sign out
      await supabase.auth.signOut();
      throw new Error('Unauthorized: Super admin access required');
    }

    setUser(data.user);
    setProfile(profile);
    setIsSuperAdmin(true);

    // 暂时注释掉 audit log，避免阻塞登录
    // TODO: 修复 audit log API 后再启用
    /*
    try {
      await fetch('/api/super-admin/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'auth.login',
          target_entity: 'profiles',
          target_id: data.user.id,
        }),
      });
    } catch (auditError) {
      console.error('Failed to log audit event:', auditError);
    }
    */
  };

  const logout = async () => {
    const supabase = createClient();

    // 暂时注释掉 audit log，避免阻塞登出
    /*
    if (user) {
      try {
        await fetch('/api/super-admin/audit-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action_type: 'auth.logout',
            target_entity: 'profiles',
            target_id: user.id,
          }),
        });
      } catch (auditError) {
        console.error('Failed to log audit event:', auditError);
      }
    }
    */

    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsSuperAdmin(false);
    router.push('/super-admin/login');
  };

  const refreshSession = async () => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.refreshSession();
    if (session?.user) {
      setUser(session.user);
      await checkSuperAdminStatus(session.user.id);
    }
  };

  return (
    <SuperAdminAuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isSuperAdmin,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </SuperAdminAuthContext.Provider>
  );
}

export function useSuperAdminAuth() {
  const context = useContext(SuperAdminAuthContext);
  if (context === undefined) {
    throw new Error('useSuperAdminAuth must be used within SuperAdminAuthProvider');
  }
  return context;
}
