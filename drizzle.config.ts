import { type Config } from 'drizzle-kit';

export default {
  schema: './src/server/db/schema',
  out: './src/server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
  verbose: true,
} satisfies Config;
