import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import DiscordProvider from 'next-auth/providers/discord';
import { env } from '@src/env.mjs';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db';
import { eq } from 'drizzle-orm';
import { type InsertUserMetadata } from './db/models';
import { type UserMetadata } from '@src/models/userMetadata';
import { pgTable } from 'drizzle-orm/pg-core';
import { userMetadata } from './db/schema/users';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user'] &
      UserMetadata;
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export interface PreviewUser {
  id: string;
  name: string;
  email: string;
  image: string;
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db, pgTable),
  callbacks: {
    async session({ session, user }) {
      let metadata = await db.query.userMetadata.findFirst({
        where: (metadata) => eq(metadata.id, user.id),
      });

      if (!metadata) {
        const firstName = user.name?.split(' ')[0] ?? '';
        const lastName = user.name?.split(' ')[1] ?? '';

        const insert: InsertUserMetadata = {
          firstName,
          lastName,
          id: user.id,
          major: 'Computer Science',
        };

        metadata = (
          await db.insert(userMetadata).values(insert).returning()
        ).at(0);
      }

      if (session.user) {
        session.user = { ...session.user, ...metadata };
        // session.user.role = user.role; <-- put other properties on the session here
      }

      return session;
    },
  },
  pages: {
    signIn: '/auth',
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  ],

  /**
   * ...add more providers here.
   *
   * Most other providers require a bit more work than the Discord provider. For example, the
   * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
   * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
   *
   * @see https://next-auth.js.org/providers/github
   */
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
