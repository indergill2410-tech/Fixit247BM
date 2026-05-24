import { PrismaClient } from './generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// ─── Soft-delete query extension ──────────────────────────────────────────────
//
// Automatically appends `deletedAt: null` to read operations on models that
// support soft-delete. Admin code that intentionally queries deleted records
// should bypass via db.$extends or raw $queryRaw.

const SOFT_DELETE_MODELS = new Set(['User', 'CustomerProfile', 'TradieProfile', 'Address']);
// findUnique is excluded: Prisma rejects extra fields in unique-index where clauses.
// We rewrite findUnique → findFirst so we can safely append deletedAt: null.
const FILTER_OPS = new Set(['findFirst', 'findMany', 'count', 'aggregate']);
const REWRITE_TO_FIRST_OPS = new Set(['findUnique', 'findUniqueOrThrow']);

function withSoftDeleteExtension(client: PrismaClient) {
  return client.$extends({
    query: {
      $allModels: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async $allOperations({ model, operation, args, query }: { model?: string; operation: string; args: any; query: (args: any) => Promise<any> }) {
          if (model && SOFT_DELETE_MODELS.has(model)) {
            if (FILTER_OPS.has(operation)) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              args.where = { deletedAt: null, ...(args.where ?? {}) };
            } else if (REWRITE_TO_FIRST_OPS.has(operation)) {
              // findUnique requires a pure unique-index where clause — adding
              // deletedAt would cause a Prisma runtime error. Rewrite to
              // findFirst so the soft-delete filter can be applied safely.
              const rewrittenOp = operation === 'findUniqueOrThrow' ? 'findFirstOrThrow' : 'findFirst';
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              args.where = { deletedAt: null, ...(args.where ?? {}) };
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
              return (client as any)[model][rewrittenOp](args);
            }
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return query(args);
        },
      },
    },
  });
}

// ─── Singleton Prisma client ───────────────────────────────────────────────────
//
// In development, Next.js reloads the module graph on every HMR cycle.
// Attaching the instance to `globalThis` prevents exhausting the DB connection
// pool by re-creating a client on each reload.

type ExtendedPrismaClient = ReturnType<typeof withSoftDeleteExtension>;

const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined;
};

function createAdapter() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return new PrismaPg(pool);
}

const baseClient = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
});

export const db: ExtendedPrismaClient =
  globalForPrisma.prisma ?? withSoftDeleteExtension(baseClient);

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
