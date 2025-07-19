import { type Config } from 'drizzle-kit';

export default {
  schema: './src/server/db/schema',
  out: './src/server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
  tablesFilter: ['test_*'],
  verbose: true,
} satisfies Config;
