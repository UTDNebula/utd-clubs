// React Server Function that checks what social providers are available on the server
'use server';

import { BetterAuthOptions } from 'better-auth/minimal';
import { env } from '@/env.mjs';

const socialProviders = {
  google: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
  discord: Boolean(env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET),
  microsoft: Boolean(env.MICROSOFT_CLIENT_ID && env.MICROSOFT_CLIENT_SECRET),
} satisfies Record<keyof BetterAuthOptions['socialProviders'], boolean>;

/**
 * Fetch an array of currently available social providers. Items may be missing if its client ID and secret is missing from environment variables
 */
export const getAvailableSocialProviders = async (): Promise<
  (keyof typeof socialProviders)[]
> =>
  (Object.keys(socialProviders) as (keyof typeof socialProviders)[]).filter(
    (key) => socialProviders[key],
  );
