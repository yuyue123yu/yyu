import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';

export async function GET(request: NextRequest) {
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
    ];

    const missingVars: string[] = [];

    for (const varName of requiredEnvVars) {
      if (!process.env[varName]) {
        missingVars.push(varName);
      }
    }

    if (missingVars.length > 0) {
      return NextResponse.json({
        success: false,
        message: `缺少环境变量: ${missingVars.join(', ')}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: '所有必需的环境变量都已配置',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `检查失败: ${error}`,
    });
  }
}
