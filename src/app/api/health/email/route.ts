import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 检查邮件服务配置
    const emailConfigured = !!(
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER
    );

    return NextResponse.json({
      success: true, // 邮件服务是可选的，所以总是返回成功
      configured: emailConfigured,
      message: emailConfigured 
        ? '邮件服务已配置' 
        : '邮件服务未配置（可选）',
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      configured: false,
      message: '邮件服务检查失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
