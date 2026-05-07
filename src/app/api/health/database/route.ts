import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // 尝试执行一个简单的查询来测试数据库连接
    // 使用 tenants 表，因为这是超级管理员系统的核心表
    const { data, error } = await supabase
      .from('tenants')
      .select('id')
      .limit(1);

    if (error) {
      // 如果 tenants 表不存在，尝试查询 system_settings 表
      const { data: settingsData, error: settingsError } = await supabase
        .from('system_settings')
        .select('id')
        .limit(1);

      if (settingsError) {
        return NextResponse.json({
          success: false,
          message: '数据库查询失败',
          error: settingsError.message,
          details: '请确保数据库表已创建',
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: '数据库连接正常',
      timestamp: new Date().toISOString(),
      details: '成功连接到 Supabase 数据库',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '数据库连接失败',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: '请检查 Supabase 配置和网络连接',
    }, { status: 500 });
  }
}
