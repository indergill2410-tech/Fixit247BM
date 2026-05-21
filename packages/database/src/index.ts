import { PrismaClient } from './generated/client';

// ─── Singleton Prisma client ───────────────────────────────────────────────────
//
// In development, Next.js reloads the module graph on every HMR cycle.
// Attaching the instance to `globalThis` prevents exhausting the DB connection
// pool by re-creating a client on each reload.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

// ─── Prisma type re-exports ────────────────────────────────────────────────────

export * from './generated/client';
export type { Prisma } from './generated/client';

// ─── Soft-delete utilities ────────────────────────────────────────────────────

/**
 * Standard where-clause extension that filters out soft-deleted records.
 * Use this whenever querying user-facing entities that carry a `deletedAt` field.
 *
 * @example
 * const users = await db.user.findMany({ where: { ...notDeleted } });
 */
export const notDeleted = { deletedAt: null } as const;

/**
 * Soft-delete a record by setting its `deletedAt` timestamp.
 *
 * @example
 * await softDelete(db.user, userId);
 */
export async function softDelete<
  T extends { update: (args: { where: { id: string }; data: { deletedAt: Date } }) => Promise<unknown> },
>(
  model: T,
  id: string,
): Promise<void> {
  await model.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

/**
 * Restore a soft-deleted record by clearing its `deletedAt` timestamp.
 *
 * @example
 * await restoreSoftDeleted(db.user, userId);
 */
export async function restoreSoftDeleted<
  T extends { update: (args: { where: { id: string }; data: { deletedAt: null } }) => Promise<unknown> },
>(
  model: T,
  id: string,
): Promise<void> {
  await model.update({
    where: { id },
    data: { deletedAt: null },
  });
}

/**
 * Return a Prisma `where` clause that optionally includes deleted records.
 *
 * @param includeDeleted  When true, no filter is applied (admin use-cases).
 *                        When false (default), only non-deleted records match.
 */
export function deletedFilter(
  includeDeleted = false,
): { deletedAt: null } | Record<string, never> {
  return includeDeleted ? {} : { deletedAt: null };
}
