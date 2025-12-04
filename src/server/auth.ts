import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth/minimal';
import { oAuthProxy } from 'better-auth/plugins';
import { eq } from 'drizzle-orm';
import { env } from '@src/env.mjs';
import { db } from './db';
import { InsertUserMetadata } from './db/models';
import { userMetadata } from './db/schema/users';

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
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const firstName = user.name?.split(' ')[0] ?? '';
          const lastName = user.name?.split(' ')[1] ?? '';

          const insert: InsertUserMetadata = {
            firstName,
            lastName,
            id: user.id,
            major: 'Computer Science',
          };
          await db.insert(userMetadata).values(insert).returning();
        },
      },
      delete: {
        before: async (user) => {
          const res = await db
            .delete(userMetadata)
            .where(eq(userMetadata.id, user.id));
          return res.rowCount == 1;
        },
      },
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  plugins: [
    oAuthProxy({
      productionURL: 'https://clubs.utdnebula.com',
    }),
  ],
  trustedOrigins: [
    'http://localhost:3000',
    'https://clubs.utdnebula.com',
    'https://clubs-*-utdnebula.vercel.app',
  ],
});
