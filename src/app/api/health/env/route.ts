import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    ];

    const missing = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );

    const configured = missing.length === 0;

    return NextResponse.json({
      success: configured,
      configured: configured,
      missing: missing.length > 0 ? missing : undefined,
      message: missing.length === 0 
        ? '所有必需的环境变量已配置' 
        : `缺少 ${missing.length} 个环境变量`,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      configured: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
