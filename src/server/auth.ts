import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth/minimal';
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
    microsoft: {
      clientId: env.MICROSOFT_CLIENT_ID,
      clientSecret: env.MICROSOFT_CLIENT_SECRET,
    },
  },
  databaseHooks: {
    account: {
      delete: {
        before: async (accountInfo) => {
          // revoke google permissions for the account if they exist
          if (accountInfo.accessToken || accountInfo.refreshToken) {
            try {
              await fetch('https://oauth2.googleapis.com/revoke', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `token=${accountInfo.refreshToken || accountInfo.accessToken}`, // refresh_token is more reliable if present
              });
              console.log(
                `Revoked Google perms for user: ${accountInfo.userId}`,
              );
            } catch (error) {
              console.error(
                `Failed to revoke Google perms for user: ${accountInfo.userId}`,
                error,
              );
            }
          }
        },
      },
    },
    user: {
      create: {
        after: async (user) => {
          let firstName = '';
          let lastName = '';
          if (user.name?.includes(', ')) {
            firstName = user.name?.split(', ')[1] ?? '';
            lastName = user.name?.split(', ')[0] ?? '';
          } else {
            firstName = user.name?.split(' ')[0] ?? '';
            lastName = user.name?.split(' ')[1] ?? '';
          }

          const insert: InsertUserMetadata = {
            firstName,
            lastName,
            id: user.id,
            major: '',
          };
          await db.insert(userMetadata).values(insert).returning();
        },
      },
      delete: {
        before: async (user) => {
          // delete user metadata
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
  trustedOrigins: [
    'http://localhost:3000',
    'https://clubs.utdnebula.com',
    'https://clubs-*-utdnebula.vercel.app',
    'http://192.168.137.1:3000',
  ],
});
