import { defineConfig } from 'prisma/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrate: {
    async adapter() {
      // Migrations use DIRECT_URL (bypasses PgBouncer) so DDL runs correctly.
      const pool = new Pool({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL });
      return new PrismaPg(pool);
    },
  },
});
