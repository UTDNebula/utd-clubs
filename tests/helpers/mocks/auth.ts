import { betterAuth } from 'better-auth/minimal';
import { options } from '@/server/auth';
import { testUtils } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';

/**
 * Options for Better Auth used to configure adapters, providers, callbacks, etc.
 *
 * @see https://www.better-auth.com/docs/introduction
 */
export const auth = betterAuth({
  ...options,
  plugins: [testUtils(), nextCookies()],
});

const ctx = await auth.$context;

/**
 * Factories, helpers, and utilities that help when writing tests against Better Auth
 */
export const authTestHelpers = ctx.test;

const user = authTestHelpers.createUser();
