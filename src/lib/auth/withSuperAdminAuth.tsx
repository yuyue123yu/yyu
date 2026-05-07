'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function withSuperAdminAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ProtectedComponent(props: P) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      checkAuth();
    }, []);

    const checkAuth = async () => {
      try {
        console.log('[withSuperAdminAuth] 🔍 开始权限检查...');
        const supabase = createClient();

        // Check if user is authenticated
        console.log('[withSuperAdminAuth] 📝 检查用户认证状态...');
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        console.log('[withSuperAdminAuth] 👤 用户认证结果:', { 
          email: user?.email, 
          id: user?.id,
          error: authError?.message 
        });

        if (authError || !user) {
          console.log('[withSuperAdminAuth] ❌ 用户未认证，跳转到登录页');
          setIsLoading(false);
          setIsAuthorized(false);
          router.push('/super-admin/login');
          return;
        }

        // Check if user is super admin
        console.log('[withSuperAdminAuth] 🔐 检查 Super Admin 权限...');
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('super_admin, user_type, tenant_id')
          .eq('id', user.id)
          .single();

        console.log('[withSuperAdminAuth] 📊 Profile 查询结果:', { 
          profile, 
          error: profileError?.message,
          details: profileError?.details,
          hint: profileError?.hint
        });

        if (profileError) {
          console.error('[withSuperAdminAuth] ❌ Profile 查询失败:', profileError);
          setIsLoading(false);
          setIsAuthorized(false);
          router.push('/super-admin/login?error=profile_error');
          return;
        }

        if (!profile) {
          console.error('[withSuperAdminAuth] ❌ Profile 不存在');
          setIsLoading(false);
          setIsAuthorized(false);
          router.push('/super-admin/login?error=no_profile');
          return;
        }

        if (!profile.super_admin) {
          console.error('[withSuperAdminAuth] ❌ 不是 Super Admin:', profile);
          setIsLoading(false);
          setIsAuthorized(false);
          router.push('/super-admin/login?error=unauthorized');
          return;
        }

        console.log('[withSuperAdminAuth] ✅ 权限验证通过！');
        console.log('[withSuperAdminAuth] 📋 Profile 详情:', profile);
        setIsAuthorized(true);
        setIsLoading(false);
      } catch (error: any) {
        console.error('[withSuperAdminAuth] ❌ 权限检查异常:', error);
        console.error('[withSuperAdminAuth] 错误堆栈:', error.stack);
        setIsLoading(false);
        setIsAuthorized(false);
        router.push('/super-admin/login?error=exception');
      }
    };

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Verifying access...</p>
          </div>
        </div>
      );
    }

    if (!isAuthorized) {
      return null;
    }

    return <Component {...props} />;
  };
}
