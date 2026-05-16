import { createServiceRoleClient } from './supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Mirror of the AuditAction enum from the Prisma schema.
 * Redefined here so the auth package has no hard dependency on @fixit247/database
 * (which requires a generated Prisma client at runtime).
 */
export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'REGISTER'
  | 'PASSWORD_RESET'
  | 'EMAIL_VERIFIED'
  | 'ROLE_CHANGED'
  | 'PROFILE_UPDATED'
  | 'DOCUMENT_UPLOADED'
  | 'VERIFICATION_APPROVED'
  | 'VERIFICATION_REJECTED'
  | 'PAYMENT_INITIATED'
  | 'PAYMENT_RELEASED'
  | 'JOB_CREATED'
  | 'JOB_CLAIMED'
  | 'JOB_COMPLETED'
  | 'DISPUTE_OPENED'
  | 'DISPUTE_RESOLVED'
  | 'ACCOUNT_SUSPENDED'
  | 'ACCOUNT_REINSTATED';

export interface AuditLogEntry {
  id: string;
  userId: string | null;
  action: AuditAction;
  resource: string | null;
  resourceId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface LogAuthEventOptions {
  userId?: string;
  action: AuditAction;
  resource?: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

// ─── Functions ────────────────────────────────────────────────────────────────

/**
 * Write a single audit log entry via the Supabase service-role client.
 * Failures are caught and logged to stderr — audit logging must never break
 * the calling request.
 */
export async function logAuthEvent(
  options: LogAuthEventOptions,
): Promise<void> {
  try {
    const admin = createServiceRoleClient();

    const { error } = await admin.from('audit_logs').insert({
      user_id: options.userId ?? null,
      action: options.action,
      resource: options.resource ?? null,
      resource_id: options.resourceId ?? null,
      ip_address: options.ipAddress ?? null,
      user_agent: options.userAgent ?? null,
      metadata: options.metadata ?? null,
    });

    if (error) {
      console.error('[audit] Failed to write audit log:', error.message);
    }
  } catch (err) {
    console.error('[audit] Unexpected error writing audit log:', err);
  }
}

/**
 * Retrieve recent audit log entries for a user, ordered by most recent first.
 */
export async function getAuditLogs(
  userId: string,
  limit = 50,
): Promise<AuditLogEntry[]> {
  const admin = createServiceRoleClient();

  const { data, error } = await admin
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch audit logs: ${error.message}`);
  }

  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: String(row['id']),
    userId: row['user_id'] ? String(row['user_id']) : null,
    action: row['action'] as AuditAction,
    resource: row['resource'] ? String(row['resource']) : null,
    resourceId: row['resource_id'] ? String(row['resource_id']) : null,
    ipAddress: row['ip_address'] ? String(row['ip_address']) : null,
    userAgent: row['user_agent'] ? String(row['user_agent']) : null,
    metadata: row['metadata']
      ? (row['metadata'] as Record<string, unknown>)
      : null,
    createdAt: String(row['created_at']),
  }));
}
