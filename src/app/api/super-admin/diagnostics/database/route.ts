import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { supabase } = authResult;

  try {
    // Test database connection
    const { data, error } = await supabase
      .from('tenants')
      .select('count')
      .limit(1);

    if (error) {
      return NextResponse.json({
        success: false,
        message: `数据库连接失败: ${error.message}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: '数据库连接正常',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `检查失败: ${error}`,
    });
  }
}
