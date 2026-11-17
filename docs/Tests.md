# Writing tests with Vitest

UTD Clubs uses the [Vitest](Utility-and-Code-Quality-Libraries.md#vitest) library to allow us to test code. Tests are files that end in `.test.ts` or `.test.tsx`. These test files should typically located in the `tests/` directory, but they technically work anywhere in the repository.

There are several types of tests. For UTD Clubs, we primarily use unit testing and integrationg testing (although other types of testing such as End-to-End and component testing exist):

- **Unit Testing** - Tests individual sections of code. This could be a utility function, an API procedure, a React component or hook, database queries, a script, etc.
- **Integration Testing** - Tests how multiple units work together.

Tests are run any time code is pushed to the GitHub repository (i.e. when a pull request is made). This is part of our CI/CD pipeline to ensure contributions don't break anything important.

## Running tests

Before you run tests, make sure you have the necessary environment variables in your `.env` file. Please see: [Configure environment variables](Getting-Started.md#3-configure-environment-variables)

### Using the `npm run test` script

In your terminal, run the following command to immediately run every single test and display the results:

```bash
npm run test
```

You can run specific tests by filtering by file name or test names:

```bash
# Only run tests in test files that contain "event"
# e.g. "event.test.ts", "manage-event.test.ts"
npm run test -- event

# Only run tests whose name/description match the Regex "CRUD"
# e.g. "Club CRUD", "Event CRUD"
npm run test -- -t "CRUD"

# You can combine both
npm run test -- event -t "CRUD"
```

For more information about filtering tests, see [Vitest's documentation on filtering](https://vitest.dev/guide/filtering).

### IDE Extensions

- If you're using VS Code, we recommend installing the [Vitest extension](https://marketplace.visualstudio.com/items?itemName=vitest.explorer). This lets you run Vitest tests using a GUI (via the Testing pane in the sidebar) and adds inline UI elements to run and debug individual tests while you're writing them.

## Writing tests

Tests are useful for letting you see if the code you're writing does what you expect. For example, if you write a tRPC procedure, you may want to run that procedure and see if it works. It is a good idea to run the procedure in a test file that you write and commit alongside the functional code you wrote.

We highly recommend reading [Vitest's guide on Writing Tests](https://vitest.dev/guide/learn/writing-tests)! This page concisely describes everything you should know about creating a test. Please note that you should put your `.test.ts` file in the `test/` directory in the root of the codebase.

While you're writing your test, you should periodically run just that test to make sure it behaves as expected. If something unexpected happens and you're confident that the test you wrote is correct, this is a good sign that the code you are testing is in fact broken!
