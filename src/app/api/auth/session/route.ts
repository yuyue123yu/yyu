import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // 检查认证服务是否可用
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json({
        success: false,
        message: '认证服务异常',
        error: error.message,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '认证服务正常',
      authenticated: !!session,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '认证服务检查失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
