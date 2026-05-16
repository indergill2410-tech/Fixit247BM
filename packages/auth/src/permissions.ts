import type { Role, Permission } from './types';

// ─── Role Hierarchy ───────────────────────────────────────────────────────────

/**
 * Numeric rank for each role — higher number = more privileged.
 * Used by hasRole() to compare privilege levels.
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  CUSTOMER: 1,
  TRADIE: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};

// ─── All Permissions (named constants) ───────────────────────────────────────

export const PERMISSIONS = {
  // Jobs
  JOBS_CREATE: 'jobs:create' as Permission,
  JOBS_READ: 'jobs:read' as Permission,
  JOBS_READ_OWN: 'jobs:read:own' as Permission,
  JOBS_UPDATE: 'jobs:update' as Permission,
  JOBS_UPDATE_OWN: 'jobs:update:own' as Permission,
  JOBS_DELETE: 'jobs:delete' as Permission,
  JOBS_DELETE_OWN: 'jobs:delete:own' as Permission,
  JOBS_ASSIGN: 'jobs:assign' as Permission,
  JOBS_CANCEL: 'jobs:cancel' as Permission,
  JOBS_CANCEL_OWN: 'jobs:cancel:own' as Permission,
  JOBS_CLOSE: 'jobs:close' as Permission,
  // Quotes / Claims
  QUOTES_CREATE: 'quotes:create' as Permission,
  QUOTES_READ: 'quotes:read' as Permission,
  QUOTES_READ_OWN: 'quotes:read:own' as Permission,
  QUOTES_ACCEPT: 'quotes:accept' as Permission,
  QUOTES_REJECT: 'quotes:reject' as Permission,
  QUOTES_DELETE: 'quotes:delete' as Permission,
  // Payments
  PAYMENTS_INITIATE: 'payments:initiate' as Permission,
  PAYMENTS_RELEASE: 'payments:release' as Permission,
  PAYMENTS_REFUND: 'payments:refund' as Permission,
  PAYMENTS_VIEW: 'payments:view' as Permission,
  PAYMENTS_VIEW_OWN: 'payments:view:own' as Permission,
  // Reviews
  REVIEWS_CREATE: 'reviews:create' as Permission,
  REVIEWS_READ: 'reviews:read' as Permission,
  REVIEWS_UPDATE_OWN: 'reviews:update:own' as Permission,
  REVIEWS_DELETE: 'reviews:delete' as Permission,
  REVIEWS_MODERATE: 'reviews:moderate' as Permission,
  REVIEWS_RESPOND: 'reviews:respond' as Permission,
  // Users
  USERS_READ: 'users:read' as Permission,
  USERS_READ_OWN: 'users:read:own' as Permission,
  USERS_UPDATE_OWN: 'users:update:own' as Permission,
  USERS_MANAGE: 'users:manage' as Permission,
  USERS_DELETE: 'users:delete' as Permission,
  USERS_SUSPEND: 'users:suspend' as Permission,
  USERS_REINSTATE: 'users:reinstate' as Permission,
  // Tradies
  TRADIES_READ: 'tradies:read' as Permission,
  TRADIES_VERIFY: 'tradies:verify' as Permission,
  TRADIES_SUSPEND: 'tradies:suspend' as Permission,
  TRADIES_UPDATE_OWN: 'tradies:update:own' as Permission,
  TRADIES_MANAGE_DOCUMENTS: 'tradies:manage:documents' as Permission,
  TRADIES_MANAGE_AVAILABILITY: 'tradies:manage:availability' as Permission,
  // Admin & Platform
  ADMIN_ACCESS: 'admin:access' as Permission,
  PLATFORM_CONFIGURE: 'platform:configure' as Permission,
  PLATFORM_MANAGE_CATEGORIES: 'platform:manage:categories' as Permission,
  PLATFORM_MANAGE_FEES: 'platform:manage:fees' as Permission,
  // Reports
  REPORTS_VIEW: 'reports:view' as Permission,
  REPORTS_EXPORT: 'reports:export' as Permission,
  REPORTS_FINANCIAL: 'reports:financial' as Permission,
  // Disputes
  DISPUTES_CREATE: 'disputes:create' as Permission,
  DISPUTES_READ: 'disputes:read' as Permission,
  DISPUTES_RESOLVE: 'disputes:resolve' as Permission,
  DISPUTES_ESCALATE: 'disputes:escalate' as Permission,
  // Notifications
  NOTIFICATIONS_READ_OWN: 'notifications:read:own' as Permission,
  NOTIFICATIONS_MANAGE: 'notifications:manage' as Permission,
  // Subscriptions
  SUBSCRIPTIONS_MANAGE_OWN: 'subscriptions:manage:own' as Permission,
  SUBSCRIPTIONS_MANAGE_ALL: 'subscriptions:manage:all' as Permission,
  // Verification
  VERIFICATION_SUBMIT: 'verification:submit' as Permission,
  VERIFICATION_REVIEW: 'verification:review' as Permission,
  VERIFICATION_APPROVE: 'verification:approve' as Permission,
  VERIFICATION_REJECT: 'verification:reject' as Permission,
  // Messages
  MESSAGES_SEND: 'messages:send' as Permission,
  MESSAGES_READ_OWN: 'messages:read:own' as Permission,
  MESSAGES_DELETE: 'messages:delete' as Permission,
  // Wallet / Credits
  WALLET_VIEW_OWN: 'wallet:view:own' as Permission,
  WALLET_MANAGE: 'wallet:manage' as Permission,
  // Audit
  AUDIT_READ: 'audit:read' as Permission,
  AUDIT_EXPORT: 'audit:export' as Permission,
} as const;

// ─── Role Permission Maps ─────────────────────────────────────────────────────

const CUSTOMER_PERMISSIONS: Permission[] = [
  'jobs:create',
  'jobs:read:own',
  'jobs:update:own',
  'jobs:delete:own',
  'jobs:cancel:own',
  'quotes:read:own',
  'quotes:accept',
  'quotes:reject',
  'payments:initiate',
  'payments:view:own',
  'reviews:create',
  'reviews:update:own',
  'users:read:own',
  'users:update:own',
  'tradies:read',
  'disputes:create',
  'disputes:read',
  'notifications:read:own',
  'subscriptions:manage:own',
  'messages:send',
  'messages:read:own',
  'wallet:view:own',
];

const TRADIE_PERMISSIONS: Permission[] = [
  'jobs:read',
  'jobs:update:own',
  'jobs:cancel:own',
  'quotes:create',
  'quotes:read:own',
  'payments:release',
  'payments:view:own',
  'reviews:create',
  'reviews:read',
  'reviews:respond',
  'users:read:own',
  'users:update:own',
  'tradies:read',
  'tradies:update:own',
  'tradies:manage:documents',
  'tradies:manage:availability',
  'disputes:create',
  'disputes:read',
  'notifications:read:own',
  'subscriptions:manage:own',
  'verification:submit',
  'messages:send',
  'messages:read:own',
  'wallet:view:own',
];

const ADMIN_PERMISSIONS: Permission[] = [
  'jobs:read',
  'jobs:update',
  'jobs:delete',
  'jobs:assign',
  'jobs:cancel',
  'jobs:close',
  'quotes:read',
  'quotes:delete',
  'payments:refund',
  'payments:view',
  'reviews:read',
  'reviews:delete',
  'reviews:moderate',
  'users:read',
  'users:manage',
  'users:suspend',
  'users:reinstate',
  'tradies:read',
  'tradies:verify',
  'tradies:suspend',
  'admin:access',
  'reports:view',
  'reports:export',
  'reports:financial',
  'disputes:read',
  'disputes:resolve',
  'disputes:escalate',
  'notifications:manage',
  'subscriptions:manage:all',
  'verification:review',
  'verification:approve',
  'verification:reject',
  'platform:manage:categories',
  'messages:delete',
  'wallet:manage',
  'audit:read',
];

const SUPER_ADMIN_PERMISSIONS: Permission[] = [
  ...ADMIN_PERMISSIONS,
  // Additional SUPER_ADMIN exclusives
  'jobs:create',
  'quotes:create',
  'quotes:accept',
  'payments:initiate',
  'payments:release',
  'reviews:create',
  'reviews:update:own',
  'users:delete',
  'users:update:own',
  'users:read:own',
  'tradies:manage:documents',
  'tradies:manage:availability',
  'tradies:update:own',
  'platform:configure',
  'platform:manage:fees',
  'disputes:create',
  'subscriptions:manage:own',
  'verification:submit',
  'notifications:read:own',
  'messages:send',
  'messages:read:own',
  'wallet:view:own',
  'audit:export',
];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  CUSTOMER: CUSTOMER_PERMISSIONS,
  TRADIE: TRADIE_PERMISSIONS,
  ADMIN: ADMIN_PERMISSIONS,
  SUPER_ADMIN: SUPER_ADMIN_PERMISSIONS,
};

// ─── Permission Helper Functions ──────────────────────────────────────────────

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

/**
 * Check if a role has at least one of the given permissions.
 */
export function hasAnyPermission(
  role: Role,
  permissions: Permission[],
): boolean {
  const rolePerms = ROLE_PERMISSIONS[role];
  return permissions.some((p) => rolePerms.includes(p));
}

/**
 * Check if a role has ALL of the given permissions.
 */
export function hasAllPermissions(
  role: Role,
  permissions: Permission[],
): boolean {
  const rolePerms = ROLE_PERMISSIONS[role];
  return permissions.every((p) => rolePerms.includes(p));
}

/**
 * Check if a user's role is at least as privileged as the required role,
 * based on the ROLE_HIERARCHY.
 */
export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Get the full permission set for a role.
 */
export function getPermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role];
}
