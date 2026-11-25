import { AsyncLocalStorage } from 'node:async_hooks';
import { schema } from '@/server/db';
import { NeonDatabase } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import {
  test as baseTest,
  describe as baseDescribe,
  SuiteAPI,
  SuiteFactory,
} from 'vitest';

type DatabaseSchema = typeof schema;
type DrizzleDatabaseInstance = NeonDatabase<DatabaseSchema> & {
  $client: Pool;
};
type DatabaseTransaction = Parameters<
  Parameters<DrizzleDatabaseInstance['transaction']>[0]
>[0];
const ROLLBACK_SIGNAL = Symbol('triggerTransactionRollback');

/** Actual database instance */
let rawDbWithSessions: DrizzleDatabaseInstance | undefined;
/**
 * Fetches the actual database instance. If not cached in {@linkcode rawDbWithSessions}, will asynchronously import the database instance.
 */
async function fetchRawDbWithSessions(): Promise<DrizzleDatabaseInstance> {
  if (!rawDbWithSessions) {
    const actualModule =
      await vi.importActual<typeof import('@/server/db')>('@/server/db');
    rawDbWithSessions = actualModule.dbWithSessions;
  }
  return rawDbWithSessions;
}

/** Context that stores the active test's transaction */
const transactionStorage = new AsyncLocalStorage<DatabaseTransaction>();

/**
 * Creates a proxy for a database driver that reroutes everything to a transaction through the `dbWithSessions` driver instead. If there is no transactional test context, will exit safely to avoid permanent writes to the database branch.
 *
 * @param target The database driver to reroute
 * @returns The database driver, except it is a transaction instead. **Note that this driver will not support the `batch()` method found in the `neon-http` driver.**
 */
function createDbProxy<T extends object>(target: T): T {
  return new Proxy(target, {
    get(targetObject, prop, receiver) {
      const activeTransaction = transactionStorage.getStore();

      if (!activeTransaction) {
        // Allows Node.JS and Vitest checks to pass
        if (typeof prop === 'symbol' || prop === 'then' || prop === 'toJSON') {
          return Reflect.get(targetObject, prop, receiver);
        }

        // Allow BetterAuth schema validation checks to pass
        const isBetterAuthInit = new Error().stack?.includes('better-auth');
        if (isBetterAuthInit) {
          const value = Reflect.get(targetObject, prop, receiver);
          return typeof value === 'function' ? value.bind(targetObject) : value;
        }

        throw new Error(
          `Refusing to access database (via \`db.${String(prop)}\`) outside of a transactional test context.\nThis is done to avoid permanent writes to your database branch.\nIn your tests, please wrap code that requires the database in \`withDb\``,
        );
      }

      const value = Reflect.get(activeTransaction, prop, receiver);
      return typeof value === 'function'
        ? value.bind(activeTransaction)
        : value;
    },
  });
}

// Mocks both production database drivers to always use the neon-serverless driver, which supports transactions (and therefore rollbacks)
// Also proxies the database drivers to require them to always run in a transactional test context
vi.mock(import('@/server/db'), async (importOriginal) => {
  const { db, dbWithSessions, ...rest } = await importOriginal();
  rawDbWithSessions = dbWithSessions;

  return {
    db: createDbProxy(db),
    dbWithSessions: createDbProxy(dbWithSessions),
    ...rest,
  };
});

/**
 * Creates a transactional test context for database operations.
 * @param fn Code to run inside this transactional test context
 *
 * @example
 * test('test', async () => {
 *   await withDb(async () => {
 *     await db.select(); // Uses transactions
 *   });
 * });
 */
export async function withDb<T>(fn: () => Promise<T>): Promise<T> {
  // If already in context
  if (transactionStorage.getStore()) {
    return fn();
  }

  const dbWithSessions = await fetchRawDbWithSessions();
  let result!: T;

  await dbWithSessions
    .transaction(async (tx) => {
      result = await transactionStorage.run(tx, fn);

      // throw an error that is discarded instead of tx.rollback() to avoid silently catching rollbacks triggered by nested transactions
      throw ROLLBACK_SIGNAL;
    })
    .catch((e) => {
      if (e !== ROLLBACK_SIGNAL) throw e;
    });

  return result;
}

/**
 * Wraps each test in a scope with its own database transactional test context. Can be used in either the global scope or a `suite`/`describe` scope (but not a `test`/`it` scope; use {@linkcode testWithDb} instead)
 *
 * @example
 * <caption>Global scope</caption>
 *
 * wrapWithDb();
 *
 * test('global test', async () => {
 *   await db.select(); // Uses transaction context A
 * });
 * describe('suite', () => {
 *   test('child test', async () => {
 *     await db.select(); // Uses transaction context B
 *   });
 * });
 *
 * @example
 * <caption>`suite` scope</caption>
 *
 * describe('suite', () => {
 *   wrapWithDb();
 *   test('test 1', async () => {
 *     await db.select(); // Uses transaction context A
 *   });
 *   test('test 2', async () => {
 *     await db.select(); // Uses transaction context B
 *   });
 * });
 */
export function wrapWithDb() {
  aroundEach(async (runTest) => {
    await withDb(runTest);
  });
}

/**
 * Wraps a suite of tests with a shared database transactional test context. Can be used in either the global scope or a `suite`/`describe` scope
 *
 * @example
 * <caption>Global scope</caption>
 *
 * wrapWithSharedDb();
 *
 * test('global test', async () => {
 *   await db.select(); // Uses transaction context A
 * });
 * describe('suite', () => {
 *   test('child test 1', async () => {
 *     await db.select(); // Uses transaction context B
 *   });
 *   test('child test 2', async () => {
 *     await db.select(); // Uses transaction context B
 *   });
 * });
 *
 * @example
 * <caption>`suite` scope</caption>
 *
 * describe('suite', () => {
 *   wrapWithSharedDb();
 *   beforeAll(async () => {
 *     await db.insert(); // Uses transaction context A
 *   });
 *   test('test 1', async () => {
 *     await db.select(); // Uses transaction context A
 *   });
 *   test('test 2', async () => {
 *     await db.select(); // Uses transaction context A
 *   });
 * });
 */
export function wrapWithSharedDb() {
  aroundAll(async (runSuite) => {
    await withDb(runSuite);
  });
}

/**
 * Use in place of a regular {@linkcode test} for tests that need to interact with the database
 */
export const testWithDb = baseTest.extend<{ setup: void }>({
  setup: [
    async ({}, use) => {
      await withDb(use);
    },
    { auto: true },
  ],
});

/**
 * Use in place of a regular {@linkcode it} for tests that need to interact with the database
 */
export const itWithDb = testWithDb;

function isSuiteFactory(val: unknown): val is SuiteFactory {
  return typeof val === 'function';
}

function createDescribeWithDb(
  baseDescribe: SuiteAPI,
  dbWrapper: () => void,
): SuiteAPI {
  const wrapped = (...args: Parameters<SuiteAPI>) => {
    const [name, optionsOrFn, fnOrOptions] = args;

    if (isSuiteFactory(optionsOrFn)) {
      return baseDescribe(name, (...factoryArgs) => {
        dbWrapper();
        return optionsOrFn(...factoryArgs);
      });
    }

    if (isSuiteFactory(fnOrOptions)) {
      return baseDescribe(name, optionsOrFn, (...factoryArgs) => {
        dbWrapper();
        return fnOrOptions(...factoryArgs);
      });
    }

    return baseDescribe(...args);
  };

  return Object.assign(wrapped, baseDescribe);
}

/**
 * Wraps each test in a suite with its own database transactional test context.
 *
 * @example
 * describeWithDb('suite', () => {
 *   test('test 1', async () => {
 *     await db.select(); // Uses transaction context A
 *   });
 *   test('test 2', async () => {
 *     await db.select(); // Uses transaction context B
 *   });
 * });
 */
export const describeWithDb = createDescribeWithDb(baseDescribe, wrapWithDb);

/**
 * Wraps a suite of tests with a shared database transactional test context.
 *
 * @example
 * describeWithSharedDb('suite', () => {
 *   beforeAll(async () => {
 *     await db.insert(); // Uses transaction context A
 *   });
 *   test('test 1', async () => {
 *     await db.select(); // Uses transaction context A
 *   });
 *   test('test 2', async () => {
 *     await db.select(); // Uses transaction context A
 *   });
 * });
 */
export const describeWithSharedDb = createDescribeWithDb(
  baseDescribe,
  wrapWithSharedDb,
);

/**
 * Wraps each test in a suite with its own database transactional test context.
 *
 * @example
 * suiteWithDb('suite', () => {
 *   test('test 1', async () => {
 *     await db.select(); // Uses transaction context A
 *   });
 *   test('test 2', async () => {
 *     await db.select(); // Uses transaction context B
 *   });
 * });
 */
export const suiteWithDb = describeWithDb;

/**
 * Wraps a suite of tests with a shared database transactional test context.
 *
 * @example
 * suiteWithSharedDb('suite', () => {
 *   beforeAll(async () => {
 *     await db.insert(); // Uses transaction context A
 *   });
 *   test('test 1', async () => {
 *     await db.select(); // Uses transaction context A
 *   });
 *   test('test 2', async () => {
 *     await db.select(); // Uses transaction context A
 *   });
 * });
 */
export const suiteWithSharedDb = describeWithSharedDb;

Object.assign(globalThis, {
  withDb,
  wrapWithDb,
  wrapWithSharedDb,
  testWithDb,
  itWithDb,
  describeWithDb,
  describeWithSharedDb,
  suiteWithDb,
  suiteWithSharedDb,
});

afterAll(async () => {
  if (rawDbWithSessions) {
    await rawDbWithSessions.$client.end();
  }
});
