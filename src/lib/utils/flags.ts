import { Flag, flag } from 'flags/next';
import SuperJSON from 'superjson';
import { isDevelopment, isProduction, truthy } from '@/env.mjs';

////////////////////////////////////////////////////////////////////////////////
// Flags - Modify this section
////////////////////////////////////////////////////////////////////////////////

export const emailAuth = createFlag({
  key: 'email-auth',
  type: 'boolean',
  defaultValue: isDevelopment, // Only enabled on development
});

export const passwordRequirements = createFlag({
  key: 'password-requirements',
  type: 'boolean',
  defaultValue: isProduction, // Only enabled on producution
});

export const flags = { emailAuth, passwordRequirements };

////////////////////////////////////////////////////////////////////////////////
// Flag Utilities
////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs the type for the flagPromises props when picking specific {@linkcode FlagKeys}
 */
export type FlagPromises<FlagKeys extends keyof typeof flags> = {
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
  ValueType = boolean | string | number,
  EntitiesType = unknown,
>(
  options: Omit<
    Parameters<typeof flag<ValueType, EntitiesType>>[0],
    'decide'
  > & {
    envKey?: string;
    type: 'boolean' | 'number' | 'string' | 'object';
    deciderOptions?: DeciderFactoryOptions;
  },
): Flag<ValueType, EntitiesType> {
  const { key, envKey, type, deciderOptions } = options;

  const decider = createDecider(
    key,
    envKey ?? `FLAG_${toScreamingSnakeCase(key)}`,
    type,
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
 * @param type Data type of the flag. Can be `"boolean"`, `"number"`, `"string"`, or `"object"`
 * @returns Value of the flag if loading from environment variable (typed as {@linkcode type}). Otherwise, returns `undefined` to defer to adapter or the hardcoded default.
 */
function createDecider(
  flagKey: string,
  envKey: string,
  type: 'boolean',
  options?: DeciderFactoryOptions,
): () => Promise<boolean | undefined>;
function createDecider(
  flagKey: string,
  envKey: string,
  type: 'number',
  options?: DeciderFactoryOptions,
): () => Promise<number | undefined>;
function createDecider(
  flagKey: string,
  envKey: string,
  type: 'string',
  options?: DeciderFactoryOptions,
): () => Promise<string | undefined>;
function createDecider<TObject extends object>(
  flagKey: string,
  envKey: string,
  type: 'object',
  options?: DeciderFactoryOptions,
): () => Promise<TObject | undefined>;
function createDecider(
  flagKey: string,
  envKey: string,
  type: 'boolean' | 'number' | 'string' | 'object',
  options?: DeciderFactoryOptions,
): () => Promise<boolean | number | string | object | undefined>;
function createDecider(
  flagKey: string,
  envKey: string,
  type: 'boolean' | 'number' | 'string' | 'object',
  options?: DeciderFactoryOptions,
) {
  return async () => {
    const hasVercelCredentials =
      process.env.VERCEL_OIDC_TOKEN?.trim() || process.env.FLAGS_SECRET?.trim();

    const envValue = process.env[envKey];

    const prioritizeEnvVars = options?.prioritizeAdapter
      ? !hasVercelCredentials
      : true;

    if (prioritizeEnvVars && envValue !== undefined && envValue.trim() !== '') {
      let resolvedValue;

      try {
        switch (type) {
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
              `Unknown type ${type} for environment flag ${envKey}`,
            );
        }
        if (logFlagOrigins)
          console.log(
            `Getting flag \`${flagKey}\` from environment variable \`${envKey}\``,
          );
        return resolvedValue;
      } catch (e) {
        console.error(
          `Couldn't parse environment flag ${envKey} as ${type}. Error:`,
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
