import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    // Migrations use DIRECT_URL to bypass PgBouncer so DDL runs correctly.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
