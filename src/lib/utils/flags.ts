import { Flag, flag } from 'flags/next';
import SuperJSON from 'superjson';
import { isDevelopment, isProduction, truthy } from '@/env.mjs';

////////////////////////////////////////////////////////////////////////////////
// Flags - Modify this section
////////////////////////////////////////////////////////////////////////////////

/**
 * Controls whether visitors can sign in or sign up to accounts that use an email and password.
 */
export const emailAuth = createFlag({
  key: 'email-auth',
  defaultValue: isDevelopment, // Only enabled on development
});

/**
 * Controls whether account passwords should have at least 3 of the following:
 * lowercase, uppercase, number, symbol. Passwords must always have at least 8
 * characters regardless of this flag
 */
export const strictPasswordRequirements = createFlag({
  key: 'strict-password-requirements',
  defaultValue: isProduction, // Only enabled on producution
});

/**
 * Defines text to show in a banner on the login modal. Hides the banner if an empty string
 */
export const loginBannerText = createFlag({
  key: 'login-banner-text',
  defaultValue: 'For now, email login is only available for local development',
});

/**
 * Object containing every feature flags for this project
 */
export const flags = {
  emailAuth,
  strictPasswordRequirements,
  loginBannerText,
};

////////////////////////////////////////////////////////////////////////////////
// Flag Utilities
////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs an object of flags returning their promised value. Intended for a {@code flagPromises} props. When used as a generic, can pick specific {@linkcode FlagKeys}
 */
export type FlagPromises<
  FlagKeys extends keyof typeof flags = keyof typeof flags,
> = {
  [K in FlagKeys]: Promise<FlagValueType<(typeof flags)[K]>>;
};

/**
 * Gets the data type of a flag
 */
export type FlagValueType<T> = T extends Flag<infer V, unknown> ? V : never;

////////////////////////////////////////////////////////////////////////////////
// Factory Functions - Don't touch stuff below
////////////////////////////////////////////////////////////////////////////////

/**
 * Formats a string as SCREAMING_SNAKE_CASE. Supports normal strings, kebab-case, camelCase, and other variants.
 */
function toScreamingSnakeCase(string: string) {
  return string
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .toUpperCase()
    .replace(/^_+|_+$/g, '');
}

/**
 * Creates a feature flag using a decider that also may obtain the flag's value from an environment variable.
 *
 * For example, if the flag is named `enable-feature`, will search for environment variable `FLAG_ENABLE_FEATURE`. You can customize the environment variable's key using {@linkcode envKey}
 */
function createFlag<
  ValueType extends string | number | boolean | object =
    | boolean
    | string
    | number
    | object,
  EntitiesType = unknown,
>(
  options: Omit<
    Parameters<typeof flag<ValueType, EntitiesType>>[0],
    'decide'
  > & {
    envKey?: string;
    envType?: 'boolean' | 'number' | 'string' | 'object';
    deciderOptions?: DeciderFactoryOptions;
  },
): Flag<ValueType, EntitiesType> {
  const { key, envKey, envType, deciderOptions, defaultValue } = options;

  const parsableTypes = ['boolean', 'number', 'string', 'object'] as const;
  const typeOfDefaultValue = typeof defaultValue;
  const parsableEnvType = (parsableTypes as readonly string[]).includes(
    typeOfDefaultValue,
  )
    ? (typeOfDefaultValue as (typeof parsableTypes)[number])
    : undefined;

  const decider = createDecider<ValueType>(
    key,
    envKey ?? `FLAG_${toScreamingSnakeCase(key)}`,
    envType ?? parsableEnvType,
    deciderOptions,
  );

  const definition: Parameters<typeof flag<ValueType, EntitiesType>>[0] = {
    ...options,
    decide: decider as () => Promise<ValueType>,
  };

  return flag(definition);
}

const logFlagOrigins = truthy(process.env.LOG_FLAG_ORIGINS ?? false);

type DeciderFactoryOptions = {
  /**
   * Rather than obtaining the flag's value from environment variables first, prioritize obtaining the flag's value from the adapter
   * @default false
   */
  prioritizeAdapter?: boolean;
};

/**
 * Create a decider that will obtain the flag's value from the following sources, in order:
 * 1. Local environment variables
 *    - Requires environment variable with key of {@linkcode envKey}
 * 2. Feature flag provider (via adapter)
 *    - Requires adapter in parent. e.g. `vercelAdapter()`, which requires `VERCEL_OIDC_TOKEN` or `FLAGS_SECRET` environment varisbles
 * 3. Hardcoded defaultValue
 *
 * @param flagKey The key/slug of the flag
 * @param envKey The key of the environment value that will trigger the flag
 * @param envType Parse the flag as this data type when reading from environment variables. Can be `"boolean"`, `"number"`, `"string"`, or `"object"`. Defaults to `"string"`
 * @returns Value of the flag if loading from environment variable (typed as {@linkcode envType}). Otherwise, returns `undefined` to defer to adapter or the hardcoded default.
 */
function createDecider<
  ValueType extends boolean | string | number | object = boolean,
>(
  flagKey: string,
  envKey: string,
  envType?: 'boolean',
  options?: DeciderFactoryOptions,
): () => Promise<ValueType | undefined>;
function createDecider<
  ValueType extends boolean | string | number | object = number,
>(
  flagKey: string,
  envKey: string,
  envType?: 'number',
  options?: DeciderFactoryOptions,
): () => Promise<ValueType | undefined>;
function createDecider<
  ValueType extends boolean | string | number | object = string,
>(
  flagKey: string,
  envKey: string,
  envType?: 'string',
  options?: DeciderFactoryOptions,
): () => Promise<ValueType | undefined>;
function createDecider<
  ValueType extends boolean | string | number | object = object,
>(
  flagKey: string,
  envKey: string,
  envType?: 'object',
  options?: DeciderFactoryOptions,
): () => Promise<ValueType | undefined>;
function createDecider<
  ValueType extends boolean | string | number | object =
    | boolean
    | string
    | number
    | object,
>(
  flagKey: string,
  envKey: string,
  envType?: 'boolean' | 'number' | 'string' | 'object',
  options?: DeciderFactoryOptions,
): () => Promise<ValueType | undefined>;
function createDecider(
  flagKey: string,
  envKey: string,
  envType: 'boolean' | 'number' | 'string' | 'object' = 'string',
  options?: DeciderFactoryOptions,
) {
  return async () => {
    const hasVercelCredentials =
      process.env.VERCEL_OIDC_TOKEN?.trim() || process.env.FLAGS_SECRET?.trim();

    const envValue = process.env[envKey];

    const prioritizeEnvVars = options?.prioritizeAdapter
      ? !hasVercelCredentials
      : true;

    if (
      prioritizeEnvVars &&
      envValue !== undefined &&
      (envType === 'string' || envValue.trim() !== '')
    ) {
      let resolvedValue;

      try {
        switch (envType) {
          case 'boolean':
            resolvedValue = truthy(envValue);
            break;
          case 'number':
            resolvedValue = Number(envValue);
            break;
          case 'object':
            resolvedValue = SuperJSON.parse(envValue);
            break;
          case 'string':
            resolvedValue = envValue;
            break;
          default:
            console.error(
              `Unknown type ${envType} for environment flag ${envKey}`,
            );
        }
        if (logFlagOrigins)
          console.log(
            `Getting flag \`${flagKey}\` as ${envType} from environment variable \`${envKey}\``,
          );
        return resolvedValue;
      } catch (e) {
        console.error(
          `Couldn't parse environment flag ${envKey} as ${envType}. Error:`,
          e,
        );
      }
    }

    if (logFlagOrigins) {
      if (hasVercelCredentials)
        console.log(
          `Getting flag \`${flagKey}\` from Vercel (assuming OIDC token is valid and not expired)`,
        );
      else console.log(`Getting flag \`${flagKey}\` from default value`);
    }
    return undefined;
  };
}
