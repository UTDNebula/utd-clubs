import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { env } from '@src/env.mjs';
import { db } from './db';

/**
 * Options for Better Auth used to configure adapters, providers, callbacks, etc.
 *
 * @see https://www.better-auth.com/docs/introduction
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // or "pg" or "mysql"
  }),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      accessType: 'offline',
    },
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    },
  },
});
