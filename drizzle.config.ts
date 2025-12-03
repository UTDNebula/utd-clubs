import { type Config } from 'drizzle-kit';

export default {
  schema: './src/server/db/schema',
  out: './src/server/db/migrations',
  migrations: {
    prefix: 'timestamp',
  },
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
  verbose: true,
} satisfies Config;
