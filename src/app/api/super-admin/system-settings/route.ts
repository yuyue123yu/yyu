// System Settings API
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { logAuditEvent } from '@/lib/audit';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/super-admin/system-settings
 * Get all system settings
 */
export async function GET(request: NextRequest) {
  // Verify super admin authentication
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { supabase } = authResult;

  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .order('setting_key', { ascending: true });

    if (error) {
      console.error('Error fetching system settings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch system settings' },
        { status: 500 }
      );
    }

    // Convert array to object for easier access
    const settingsMap: Record<string, any> = {};
    (data || []).forEach((setting: any) => {
      settingsMap[setting.setting_key] = setting.setting_value;
    });

    // Structure settings for frontend
    const settings = {
      maintenance_mode: settingsMap.maintenance_mode || { enabled: false, message: '' },
      feature_flags: settingsMap.feature_flags || {
        multi_tenancy: true,
        user_impersonation: true,
        audit_logging: true,
        analytics: true,
        password_reset: true,
      },
      api_rate_limits: settingsMap.api_rate_limits || {
        requests_per_minute: 60,
        requests_per_hour: 1000,
        requests_per_day: 10000,
      },
      default_oem_config: settingsMap.default_oem_config || {
        branding: {
          siteName: 'LegalMY',
          logo: '',
          favicon: '',
          primaryColor: '#2563eb',
          secondaryColor: '#1e40af',
          accentColor: '#ea580c',
        },
        features: {
          ecommerce: true,
          templates: true,
          articles: true,
          consultations: true,
          reviews: true,
        },
        languages: {
          default: 'en',
          enabled: ['en', 'zh', 'ms'],
        },
        business: {
          currency: 'CNY',
          timezone: 'Asia/Shanghai',
          consultationPricing: {
            min: 100,
            max: 10000,
          },
        },
        email: {
          fromName: 'LegalMY',
          fromEmail: 'noreply@legalmy.com',
          replyTo: 'support@legalmy.com',
        },
      },
    };

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Error fetching system settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system settings' },
      { status: 500 }
    );
  }
}
