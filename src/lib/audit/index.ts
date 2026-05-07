// Audit Logging System
import { createClient } from '@/lib/supabase/server';
import type { AuditLogEntry } from '../../../types/super-admin';

/**
 * Log an audit event for super admin actions
 * All super admin operations should be logged for compliance
 */
export async function logAuditEvent(
  entry: AuditLogEntry,
  request?: Request
): Promise<void> {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('Cannot log audit event: No authenticated user');
      return; // Don't throw - audit logging should not break operations
    }

    // Extract IP address and user agent from request
    const ip_address = extractIPAddress(request);
    const user_agent = request?.headers.get('user-agent') || null;

    // Log the event
    const { error } = await supabase.from('audit_logs').insert({
      super_admin_id: user.id,
      action_type: entry.action_type,
      target_entity: entry.target_entity,
      target_id: entry.target_id || null,
      changes: entry.changes || null,
      ip_address,
      user_agent,
      session_id: null, // Can be added later if needed
    });

    if (error) {
      console.error('Failed to log audit event:', error);
      // Don't throw - audit logging should not break operations
    }
  } catch (error) {
    console.error('Error logging audit event:', error);
    // Don't throw - audit logging should not break operations
  }
}

/**
 * Extract IP address from request headers
 * Handles various proxy headers
 */
function extractIPAddress(request?: Request): string | null {
  if (!request) {
    return null;
  }

  // Try various headers in order of preference
  const headers = [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip', // Cloudflare
    'x-client-ip',
    'x-cluster-client-ip',
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first one
      return value.split(',')[0].trim();
    }
  }

  return null;
}

/**
 * Decorator for automatic audit logging
 * Usage: @withAuditLog('tenant.create', 'tenants')
 */
export function withAuditLog(actionType: string, targetEntity: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);

      // Log after successful operation
      await logAuditEvent({
        action_type: actionType,
        target_entity: targetEntity,
        target_id: result?.id,
        changes: result,
      });

      return result;
    };

    return descriptor;
  };
}

/**
 * Batch log multiple audit events
 * Useful for operations that affect multiple entities
 */
export async function logAuditEventBatch(
  entries: AuditLogEntry[],
  request?: Request
): Promise<void> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('Cannot log audit events: No authenticated user');
      return;
    }

    const ip_address = extractIPAddress(request);
    const user_agent = request?.headers.get('user-agent') || null;

    // Prepare batch insert
    const logs = entries.map((entry) => ({
      super_admin_id: user.id,
      action_type: entry.action_type,
      target_entity: entry.target_entity,
      target_id: entry.target_id || null,
      changes: entry.changes || null,
      ip_address,
      user_agent,
      session_id: null,
    }));

    const { error } = await supabase.from('audit_logs').insert(logs);

    if (error) {
      console.error('Failed to log audit events:', error);
    }
  } catch (error) {
    console.error('Error logging audit events:', error);
  }
}

/**
 * Query audit logs with filters
 */
export async function queryAuditLogs(filters: {
  action_type?: string;
  target_entity?: string;
  super_admin_id?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}) {
  const supabase = await createClient();

  let query = supabase
    .from('audit_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  // Apply filters
  if (filters.action_type) {
    query = query.eq('action_type', filters.action_type);
  }

  if (filters.target_entity) {
    query = query.eq('target_entity', filters.target_entity);
  }

  if (filters.super_admin_id) {
    query = query.eq('super_admin_id', filters.super_admin_id);
  }

  if (filters.start_date) {
    query = query.gte('created_at', filters.start_date);
  }

  if (filters.end_date) {
    query = query.lte('created_at', filters.end_date);
  }

  // Pagination
  const page = filters.page || 1;
  const limit = filters.limit || 50;
  const offset = (page - 1) * limit;

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    throw error;
  }

  return {
    logs: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

/**
 * Export audit logs to CSV format
 */
export async function exportAuditLogsToCSV(filters: {
  start_date?: string;
  end_date?: string;
  action_type?: string;
  target_entity?: string;
}): Promise<string> {
  const { logs } = await queryAuditLogs({
    ...filters,
    limit: 10000, // Max export limit
  });

  // CSV header
  const header = [
    'ID',
    'Super Admin ID',
    'Action Type',
    'Target Entity',
    'Target ID',
    'Changes',
    'IP Address',
    'User Agent',
    'Created At',
  ].join(',');

  // CSV rows
  const rows = logs.map((log) => {
    return [
      log.id,
      log.super_admin_id,
      log.action_type,
      log.target_entity,
      log.target_id || '',
      JSON.stringify(log.changes || {}),
      log.ip_address || '',
      log.user_agent || '',
      log.created_at,
    ]
      .map((field) => `"${String(field).replace(/"/g, '""')}"`)
      .join(',');
  });

  return [header, ...rows].join('\n');
}

/**
 * Export audit logs to JSON format
 */
export async function exportAuditLogsToJSON(filters: {
  start_date?: string;
  end_date?: string;
  action_type?: string;
  target_entity?: string;
}): Promise<string> {
  const { logs } = await queryAuditLogs({
    ...filters,
    limit: 10000, // Max export limit
  });

  return JSON.stringify(logs, null, 2);
}
