// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Try a simple query to test database connection
    // Use tenants table as it's core to the super admin system
    const { data, error } = await supabase
      .from('tenants')
      .select('id')
      .limit(1);

    if (error) {
      // If tenants table doesn't exist, try system_settings table
      const { data: settingsData, error: settingsError } = await supabase
        .from('system_settings')
        .select('id')
        .limit(1);

      if (settingsError) {
        return NextResponse.json({
          success: false,
          message: 'Database query failed',
          error: settingsError.message,
          details: 'Please ensure database tables are created',
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
      details: 'Successfully connected to Supabase database',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Please check Supabase configuration and network connection',
    }, { status: 500 });
  }
}
