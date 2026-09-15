# List of Utility and Code Quality Libraries in UTD Club

Small libraries that provide useful tools to make things easier in `utd-clubs`.

## Zod

- [Documentation](https://zod.dev)

Zod is a schema validation library. Unlike TypeScript's types, in which types are only known as compile-time, Zod's schemas are known as runtime. This allows you to define a schema, parse data using that schema, and handle any errors that it may throw.

_TODO: add more documentation here!_

## date-fns

- [Documentation](https://date-fns.org/docs/Getting-Started)

_TODO: add more documentation here!_

## Zustand

- [Documentation](https://zustand.docs.pmnd.rs/reference)
- [Official Tutorial](https://zustand.docs.pmnd.rs/learn)

_TODO: add more documentation here!_

## Prettier

Prettier is a library that scans every file in the codebase and formats it to ensure it follows a consistent style (for example, using two spaces for indents and enforcing 80-character max line lengths). Prettier is triggered when using the [`npm run format`](NPM-Scripts.md#npm-run-format) script, which is automatically called during CI/CD testing.

## ESLint

ESLint scans every file in the codebase and finds potential code issues that either breaks good practices or will outright cause problems (for example, using a state setter in a `useEffect` hook). ESLint is triggered when using the [`npm run lint`](NPM-Scripts.md#npm-run-lint) script, which is automatically called during CI/CD testing.

## Jest

- [Documentation](https://jestjs.io/docs/getting-started)

Jest is the library used to run unit tests that developers write for React components, utility functions, and modules to ensure they continue to work as expected as the codebase grows. Jest is triggered when using the [`npm run test`](NPM-Scripts.md#npm-run-test) script, which is automatically called during CI/CD testing.

## Sentry

Occasionally, our code breaks while someone is visiting the website. That's unfortunate, but it happens. What would be even worse is if our code broke and we didn't even know about it; imagine if a feature was broken and annoyed website visitors for months, and we didn't know about it!

Fortunately, UTD Clubs uses Sentry. Anytime a visitor experiences a detectable error on the website, Sentry automatically logs it and informs us. Additionally, visitors may also report bugs using the "Report a Bug" button at the bottom right of every page on the website.

You can view error logs and bug reports as they come in via the [`#github-feed`](https://discord.com/channels/860405177865338890/1030273725658042420) on the [Nebula Labs Discord server](https://discord.utdnebula.com).
