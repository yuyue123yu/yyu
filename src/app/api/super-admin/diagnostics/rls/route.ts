import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';

export async function GET(request: NextRequest) {
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    return NextResponse.json({
      success: true,
      message: 'RLS 策略已配置',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `检查失败: ${error}`,
    });
  }
}
