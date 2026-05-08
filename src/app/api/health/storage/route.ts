// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 检查存储服务配�?
    const storageConfigured = !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    return NextResponse.json({
      success: storageConfigured,
      available: storageConfigured,
      message: storageConfigured 
        ? '存储服务配置正常' 
        : '存储服务未配�?,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      available: false,
      message: '存储服务检查失�?,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
