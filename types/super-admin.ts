// Super Admin System Type Definitions

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  primary_domain: string | null;
  status: 'active' | 'inactive' | 'suspended';
  subscription_plan: 'free' | 'basic' | 'premium' | 'enterprise';
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  user_count: number;
  metadata: Record<string, any>;
}

export interface TenantSetting {
  id: string;
  tenant_id: string;
  setting_key: string;
  setting_value: any;
  created_at: string;
  updated_at: string;
}

export interface OEMConfiguration {
  branding: {
    siteName: string;
    logo: string;
    favicon: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  features: {
    ecommerce: boolean;
    templates: boolean;
    articles: boolean;
    consultations: boolean;
    reviews: boolean;
  };
  languages: {
    default: 'en' | 'zh' | 'ms';
    enabled: Array<'en' | 'zh' | 'ms'>;
  };
  business: {
    currency: string;
    timezone: string;
    consultationPricing: {
      min: number;
      max: number;
    };
  };
  email: {
    fromName: string;
    fromEmail: string;
    replyTo: string;
  };
}

export interface AuditLog {
  id: string;
  super_admin_id: string;
  action_type: string;
  target_entity: string;
  target_id: string | null;
  changes: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  session_id: string | null;
  created_at: string;
}

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface SuperAdminUser {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  user_type: 'admin';
  super_admin: boolean;
  tenant_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PasswordResetToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  used_at: string | null;
  created_by: string | null;
  created_at: string;
}

export interface TenantAnalytics {
  tenant_id: string;
  period: {
    start: string;
    end: string;
  };
  metrics: {
    user_count: number;
    new_users: number;
    active_users: number;
    consultation_count: number;
    completed_consultations: number;
    order_count: number;
    revenue: number;
    active_lawyers: number;
    average_rating: number;
  };
  trends: Array<{
    date: string;
    users: number;
    consultations: number;
    revenue: number;
  }>;
}

export interface AuditLogEntry {
  action_type: string;
  target_entity: string;
  target_id?: string;
  changes?: Record<string, any>;
}
