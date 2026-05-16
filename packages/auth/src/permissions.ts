import type { Role } from './types';

export const ROLE_HIERARCHY: Record<Role, number> = {
  CUSTOMER: 1,
  TRADIE: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};

export type Permission =
  | 'jobs:create'
  | 'jobs:read'
  | 'jobs:update'
  | 'jobs:delete'
  | 'jobs:assign'
  | 'quotes:create'
  | 'quotes:read'
  | 'quotes:accept'
  | 'payments:initiate'
  | 'payments:release'
  | 'payments:refund'
  | 'reviews:create'
  | 'reviews:moderate'
  | 'users:read'
  | 'users:manage'
  | 'tradies:verify'
  | 'tradies:suspend'
  | 'platform:configure'
  | 'reports:view'
  | 'reports:export';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  CUSTOMER: [
    'jobs:create',
    'jobs:read',
    'jobs:update',
    'quotes:read',
    'quotes:accept',
    'payments:initiate',
    'reviews:create',
  ],
  TRADIE: [
    'jobs:read',
    'quotes:create',
    'quotes:read',
    'payments:release',
    'reviews:create',
    'reviews:read',
  ] as Permission[],
  ADMIN: [
    'jobs:read',
    'jobs:update',
    'jobs:delete',
    'jobs:assign',
    'quotes:read',
    'payments:refund',
    'reviews:moderate',
    'users:read',
    'users:manage',
    'tradies:verify',
    'tradies:suspend',
    'reports:view',
    'reports:export',
  ],
  SUPER_ADMIN: [
    'jobs:create',
    'jobs:read',
    'jobs:update',
    'jobs:delete',
    'jobs:assign',
    'quotes:create',
    'quotes:read',
    'quotes:accept',
    'payments:initiate',
    'payments:release',
    'payments:refund',
    'reviews:create',
    'reviews:moderate',
    'users:read',
    'users:manage',
    'tradies:verify',
    'tradies:suspend',
    'platform:configure',
    'reports:view',
    'reports:export',
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function getPermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role];
}
