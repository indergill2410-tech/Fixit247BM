const ROLE_LABELS: Record<string, string> = {
  CUSTOMER:    'Homeowner',
  TRADIE:      'Tradie',
  ADMIN:       'Admin',
  SUPER_ADMIN: 'Super Admin',
};

export function getRoleLabel(role: string | undefined | null): string {
  if (!role) return 'User';
  const normalizedRole = role.toUpperCase();
  return ROLE_LABELS[normalizedRole] ?? role;
}
