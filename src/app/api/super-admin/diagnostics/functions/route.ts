import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // 必需的辅助函数
    const requiredFunctions = ['is_super_admin', 'get_user_tenant_id'];

    const existingFunctions: string[] = [];
    const missingFunctions: string[] = [];

    // 测试 is_super_admin 函数
    try {
      const { data, error } = await supabase.rpc('is_super_admin');
      if (!error) {
        existingFunctions.push('is_super_admin');
      } else {
        missingFunctions.push('is_super_admin');
      }
    } catch {
      missingFunctions.push('is_super_admin');
    }

    // 测试 get_user_tenant_id 函数
    try {
      const { data, error } = await supabase.rpc('get_user_tenant_id');
      if (!error) {
        existingFunctions.push('get_user_tenant_id');
      } else {
        missingFunctions.push('get_user_tenant_id');
      }
    } catch {
      missingFunctions.push('get_user_tenant_id');
    }

    return NextResponse.json({
      success: missingFunctions.length === 0,
      existingFunctions,
      missingFunctions,
      totalRequired: requiredFunctions.length,
      totalExisting: existingFunctions.length,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
