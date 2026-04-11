import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    seed: 'npx tsx ./prisma/init-data.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});