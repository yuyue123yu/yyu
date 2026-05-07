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
    const requiredTables = [
      'tenants',
      'tenant_settings',
      'profiles',
      'audit_logs',
      'services',
    ];

    const missingTables: string[] = [];

    for (const table of requiredTables) {
      const { error } = await supabase.from(table).select('count').limit(1);
      if (error) {
        missingTables.push(table);
      }
    }

    if (missingTables.length > 0) {
      return NextResponse.json({
        success: false,
        message: `缺少表: ${missingTables.join(', ')}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: '所有核心表都存在',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `检查失败: ${error}`,
    });
  }
}
