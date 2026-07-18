import { z } from 'zod';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
const server = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_SECRET: isProduction ? z.string().min(1) : z.string().optional(),
  BETTER_AUTH_URL: z.preprocess(
    // This makes Vercel deployments not fail if you don't set BETTER_AUTH_URL
    // Since Better Auth automatically uses the VERCEL_URL if present.
    (str) => process.env.VERCEL_URL ?? str,
    // VERCEL_URL doesn't include `https` so it cant be validated as a URL
    process.env.VERCEL ? z.string().min(1) : z.url(),
  ),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  DISCORD_CLIENT_ID: z.string().optional(),
  DISCORD_CLIENT_SECRET: z.string().optional(),
  MICROSOFT_CLIENT_ID: z.string().optional(),
  MICROSOFT_CLIENT_SECRET: z.string().optional(),
  NEBULA_API_URL: z.string().min(1),
  NEBULA_API_STORAGE_BUCKET: z.string().min(1),
  NEBULA_API_KEY: z.string().min(1),
  NEBULA_API_STORAGE_KEY: z.string().min(1),
  NEBULA_API_EMAIL_KEY: z.string().optional(),
  GEMINI_SERVICE_ACCOUNT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  AUTH_TRUSTED_ORIGINS: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
    },
    z.union([z.string(), z.string().array()]).optional(),
  ),
});

/**
 * Specify your client-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const client = z.object({
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY: isProduction
    ? z.string().min(1)
    : z.string().optional(),
});

const clean = (/** @type {string | undefined} */ input) => {
  const trimmed = input?.trim();
  return trimmed !== '' ? trimmed : undefined;
};

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
 * middlewares) or client-side so we need to destruct manually.
 *
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
  NODE_ENV: clean(process.env.NODE_ENV),
  DATABASE_URL: clean(process.env.DATABASE_URL),
  BETTER_AUTH_SECRET: clean(process.env.BETTER_AUTH_SECRET),
  BETTER_AUTH_URL: clean(process.env.BETTER_AUTH_URL),
  GOOGLE_CLIENT_ID: clean(process.env.GOOGLE_CLIENT_ID),
  GOOGLE_CLIENT_SECRET: clean(process.env.GOOGLE_CLIENT_SECRET),
  DISCORD_CLIENT_ID: clean(process.env.DISCORD_CLIENT_ID),
  DISCORD_CLIENT_SECRET: clean(process.env.DISCORD_CLIENT_SECRET),
  MICROSOFT_CLIENT_ID: clean(process.env.MICROSOFT_CLIENT_ID),
  MICROSOFT_CLIENT_SECRET: clean(process.env.MICROSOFT_CLIENT_SECRET),
  NEBULA_API_URL: clean(process.env.NEBULA_API_URL),
  NEBULA_API_STORAGE_BUCKET: clean(process.env.NEBULA_API_KEY),
  NEBULA_API_KEY: clean(process.env.NEBULA_API_KEY),
  NEBULA_API_STORAGE_KEY: clean(process.env.NEBULA_API_KEY),
  NEBULA_API_EMAIL_KEY: clean(process.env.NEBULA_API_EMAIL_KEY),
  GEMINI_SERVICE_ACCOUNT: clean(process.env.GEMINI_SERVICE_ACCOUNT),
  NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY: clean(
    process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY,
  ),
  SENTRY_AUTH_TOKEN: clean(process.env.SENTRY_AUTH_TOKEN),
  NEXT_PUBLIC_SENTRY_DSN: clean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  AUTH_TRUSTED_ORIGINS: clean(process.env.AUTH_TRUSTED_ORIGINS),
};

// Don't touch the part below
// --------------------------

const merged = server.extend(client.shape);

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.ZodSafeParseResult<MergedOutput>} MergedSafeParseReturn */

let env = /** @type {MergedOutput} */ (process.env);

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const isServer = typeof window === 'undefined';

  const parsed = /** @type {MergedSafeParseReturn} */ (
    isServer
      ? merged.safeParse(processEnv) // on server we can validate all env vars
      : client.safeParse(processEnv) // on client we can only validate the ones that are exposed
  );

  if (parsed.success === false) {
    const errors = z.treeifyError(parsed.error).properties ?? [];

    let errorString = '';
    for (const [key, value] of Object.entries(errors)) {
      errorString += `\n • ${key} - ${value.errors.join('; ')}`;
    }

    console.error('❌ Invalid environment variables:', errors);
    throw new Error(`Invalid environment variables:${errorString}`);
  }

  env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== 'string') return undefined;
      // Throw a descriptive error if a server-side env var is accessed on the client
      // Otherwise it would just be returning `undefined` and be annoying to debug
      if (!isServer && !prop.startsWith('NEXT_PUBLIC_'))
        throw new Error(
          process.env.NODE_ENV === 'production'
            ? '❌ Attempted to access a server-side environment variable on the client'
            : `❌ Attempted to access server-side environment variable '${prop}' on the client`,
        );
      return target[/** @type {keyof typeof target} */ (prop)];
    },
  });
}

export { env };
