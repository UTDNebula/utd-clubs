# Writing tests with Jest

UTD Clubs uses [Jest](Utility-and-Code-Quality-Libraries.md#jest) for tests.

## Club tag refresh regression tests

Run the isolated router tests with this command (works on Windows, macOS, and Linux):

```bash
node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand --runTestsByPath tests/clubTagRefresh.test.ts
```

These tests use mocked database and storage calls, so they do not need a `.env` file or change remote data. They cover deletion, marking a club deleted, restoration, admin status changes, permissions, and database/storage failures. They also verify that the database write finishes before the tag refresh, and that the mutation waits for the refresh.

## Existing database tests

The older `tests/test.ts` writes to the database configured in `.env`. It is separate from the isolated suite above; only run it against a disposable personal test database. The broader test setup is still unfinished.
