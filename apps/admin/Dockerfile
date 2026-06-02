FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
RUN npm install -g pnpm@9 turbo@2

# ── Prune workspace to only what the admin app needs ────────────────────────
FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune @fixit247/admin --docker

# ── Install dependencies ─────────────────────────────────────────────────────
FROM base AS installer
WORKDIR /app
# Step 1: install without lifecycle scripts using the json-only layer so this
# stage is cache-hit on any pure source change (only lock/manifest changes
# bust the cache here).
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile --ignore-scripts
# Step 2: overlay the full source so lifecycle scripts (prisma generate, sharp)
# can find the schema and native deps, then re-run install to trigger them.
COPY --from=pruner /app/out/full/ .
RUN pnpm install --frozen-lockfile

# ── Build ────────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=installer /app/node_modules ./node_modules
COPY --from=pruner /app/out/full/ .
COPY --from=installer /app/apps/admin/node_modules ./apps/admin/node_modules

# Generate Prisma client
RUN pnpm --filter @fixit247/database exec prisma generate

# Public NEXT_PUBLIC_* values are inlined into the client bundle at build time.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_DEMO_MODE

# DATABASE_URL only needs to be *present* at build so the db client module does
# not throw during page-data collection — the build never connects. The real
# value is injected by Render at runtime.
ENV NEXT_TELEMETRY_DISABLED=1 \
    DATABASE_URL="postgresql://build:build@localhost:5432/build" \
    DIRECT_URL="postgresql://build:build@localhost:5432/build" \
    NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_DEMO_MODE=$NEXT_PUBLIC_DEMO_MODE

RUN pnpm --filter @fixit247/admin build

# ── Production runner ────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Standalone output is rooted at the monorepo root (outputFileTracingRoot),
# so the server entrypoint lives at apps/admin/server.js after the copy.
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/static ./apps/admin/.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "apps/admin/server.js"]
