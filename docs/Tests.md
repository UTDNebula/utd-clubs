# Writing tests with Vitest

UTD Clubs uses the [Vitest](Utility-and-Code-Quality-Libraries.md#vitest) library to allow us to test code. Tests are files that end in `.test.ts` or `.test.tsx`. These test files should typically located in the `tests/` directory, but they technically work anywhere in the repository.

There are several types of tests. For UTD Clubs, we primarily use unit testing and integrationg testing (although other types of testing such as End-to-End and component testing exist):

- **Unit Testing** - Tests individual sections of code. This could be a utility function, an API procedure, a React component or hook, database queries, a script, etc.
  - Located in `tests/unit/`
- **Integration Testing** - Tests how multiple units work together.
  - Located in `tests/integration/`

~~Tests are run any time code is pushed to the GitHub repository (i.e. when a pull request is made). This is part of our CI/CD pipeline to ensure contributions don't break anything important.~~ **CI/CD tests are temporarily disabled while we figure out environment handling**

## Running tests

Before you run tests, make sure you have the necessary environment variables in your `.env` file. Please see: [Configure environment variables](Getting-Started.md#3-configure-environment-variables)

### Using the `npm run test` script

In your terminal, run the following command to immediately run every single test and display the results:

```bash
npm run test
```

This runs Vitest in watch mode, meaning Vitest will continue running and will rerun tests related to any files that have been updated. To run Vitest a single time without using watch mode, use this command instead:

```bash
npm run test:check
```

You can also run specific tests by filtering by file name or test names:

```bash
# Only run tests in test files that contain "event"
# e.g. "event.test.ts", "manage-event.test.ts"
npm run test -- event

# Only run tests whose name/description match the Regex "CRUD"
# e.g. "Club CRUD", "Event CRUD"
npm run test -- -t "CRUD"

# You can combine both
npm run test -- event -t "CRUD"

# Also works without watch mode
npm run test:check -- event -t "CRUD"
```

For more information about filtering tests, see [Vitest's documentation on filtering](https://vitest.dev/guide/filtering).

### IDE Extensions

- If you're using VS Code, we recommend installing the [Vitest extension](https://marketplace.visualstudio.com/items?itemName=vitest.explorer). This lets you run Vitest tests using a GUI (via the Testing pane in the sidebar) and adds inline UI elements to run and debug individual tests while you're writing them.

## Writing tests

Tests are useful for seeing if code you've written does what you expect. For example, if you write a tRPC procedure, you should probably run that procedure to ensure it works correctly. It is a good idea to do this in a test file that you write and commit alongside the procedure code you wrote.

While writing your test, you should periodically run just that test. If something unexpected happens and you're confident that the test you wrote is correct, then this is a good sign that the code you are testing is, in fact, broken!

### Getting started with writing tests

**We highly recommend you read this page first: [Vitest's guide on Writing Tests](https://vitest.dev/guide/learn/writing-tests).** This short page concisely describes basically everything you should know about writing tests.

Here's some more things you should know that are specific to `utd-clubs`:

- Please put your `.test.ts` files in the `test/` directory in the root of the codebase.
- You can access the database (`db`) and the API (`api`) instances in the same way you'd access them on the server. In other words, you just import the server-side singletons:
  - `import { db } from '@/server/db';`
  - `import { api } from '@/trpc/server';`

  **VERY IMPORTANT:** To actually use these singletons, you must call them inside a transactional test context. See [**Database Transactional Test Context**](#database-transactional-test-context)

### Database Transactional Test Context

To use the `db` or `api` singletons, you must call them inside a **transactional test context**. This context reroutes all database calls to a database transaction, which can be rolled back (i.e. undone). Our tests are set up so that all tests roll back their transaction upon finishing, which avoids permanently saving any changes a test might write to the database. This comes with the following benefits:

- Grants more flexibility when writing tests
- Removes the hassle of manually writing code to undo changes that tests wrote
- Avoids polluting your database branch with useless test data

**Transactional test contexts are opt-in**, meaning that any time you want to write a test that uses the database, you need to specify this as well as the scope of the context:

- [**Per-test**](#per-test-transaction-contexts) - Tests CANNOT see any database changes from other tests
- [**Shared**](#shared-transaction-contexts) - Tests CAN see any database changes that previous tests made

#### Per-test transaction contexts

This means that tests cannot see any database changes from other tests. Use one of the following methods to opt into this:

- Use `testWithDb` instead of `test`:

  ```ts
  testWithDb('test 1', async () => {
    await db.insert(); // Uses transaction context A
    await db.select(); // Uses transaction context A
  });
  testWithDb('test 2', async () => {
    await db.select(); // Uses transaction context B
  });
  ```

- Call `wrapWithDb()` alongside your tests:

  ```ts
  wrapWithDb();

  test('test 1', async () => {
    await db.insert(); // Uses transaction context A
    await db.select(); // Uses transaction context A
  });
  test('test 2', async () => {
    await db.select(); // Uses transaction context B
  });
  ```

- Use `describeWithDb` instead of `describe`:

  ```ts
  describeWithDb('suite', () => {
    test('test 1', async () => {
      await db.insert(); // Uses transaction context A
      await db.select(); // Uses transaction context A
    });
    test('test 2', async () => {
      await db.select(); // Uses transaction context B
    });
  });
  ```

- Wrap the code in your test inside `withDb`:

  ```ts
  test('test', async () => {
    await withDb(async () => {
      await db.insert(); // Uses transaction context A
      await db.select(); // Uses transaction context A
    });
    await withDb(async () => {
      const result = await db.select(); // Uses transaction context B
      expect(result);
    });
  });
  ```

#### Shared transaction contexts

This means that tests can see any database changes that previous tests made. Use one of the following methods to opt into this:

- Call `wrapWithSharedDb()`:

  ```ts
  wrapWithSharedDb();

  test('test 1', async () => {
    await db.insert(); // Uses transaction context A
    await db.select(); // Uses transaction context A
  });
  describe('suite' () => {
    test('test 2', async () => {
      await db.select(); // Uses transaction context A
    });
  })
  ```

- Use `describeWithSharedDb` instead of `describe`:

  ```ts
  describeWithSharedDb('suite', () => {
    beforeAll(async () => {
      await db.insert(); // Uses transaction context A
    });
    test('test 1', async () => {
      await db.select(); // Uses transaction context A
    });
    test('test 2', async () => {
      await db.select(); // Uses transaction context A
    });
  });

  testWithDb('external test', async () => {
    await db.select(); // Uses transaction context B
  });
  ```
