# NPM Scripts

Make sure you've read the [Getting Started](Getting-Started.md) page first!

These scripts make it easy to run common tasks without memorizing a long and complicated terminal command. You can run scripts by typing the following in a terminal (replacing `<script-name>` with a valid script):

```bash
npm run <script-name>
```

> [!TIP]
> If you are using VS Code, you can actually access NPM scripts using the built-in GUI! Go to the left sidebar → the Explorer tab → the NPM Scripts section at the bottom → click the play icon on the right side of the script you wish to run.

Before you run any script, you should run `npm install` to ensure you have all the necessary libraries.

## List of UTD Club's scripts

These scripts are ordered by how often you're likely to use them.

### `npm run dev`

Runs the development version of the UTD Clubs server using Next.JS. You can access this by running `npm run dev`, then navigating to this URL: [localhost:3000](http://localhost:3000). The first time you navigate to any page route, Next.JS will need to compile that page (may take ~20 seconds).

This development version of UTD Clubs will have the following:

- **Live reloading** - Any time you make a change in the code, it will update on the website after a few seconds.
- **Debugging** - Libraries will provide more detailed error messages.
- **Strict mode** - React runs in "strict mode", meaning it will double render every component to promote good practices.

To stop the server, use the hotkey `ctrl + c` in your terminal.

### `npm run build`, then `npm run start`

These two scripts are used in tandem. `npm run build` will compile the project using Next.JS and inform you if there were any issues. If successful, you can run `npm run start` to run the production version of the UTD Clubs server.

To stop the server, use the hotkey `ctrl + c` in your terminal.

### `npm run clean`

If you are experiencing weird issues such as live reloading not working, CSS not updating, or the cache not updating, run this script to safely delete old files. You shouldn't have to run this script often.

### `npm run format`

Formats every file in the codebase using Prettier to ensure code uses a consistent style and remains readable. **This is required for CI/CD testing.**

- If you only wish to check for files that don't follow our code style, use `npm run format:check`
- If you're using VS Code, you can add the Prettier extension for native formatter support. Please see: [VS Code](VS-Code.md). **Note that due to an issue with Prettier, imports aren't sorted when using this extension.**

### `npm run lint`

Scans every file in the codebase using ESLint for code issues, and fixes if possible. **This is required for CI/CD testing.**

- If you don't wish to fix issues as ESLint finds them, use `npm run lint:check`
- If you're using VS Code, you can add the ESLint extension for inline linter warnings. Please see: [VS Code](VS-Code.md).

### `npm run type:check`

Utility script to scan every TypeScript file in the codebase for type errors. **This is required for CI/CD testing.**

- If you're using VS Code, it will also automatically show inline type errors.

### `npm run test`

Runs tests using Jest. Not currently functional. Will be required for CI/CD testing at some point.

### `npm run drizzle:studio`

Opens the database configured in `.env` in Drizzle Studio, which is a GUI that lets you view and modify your database branch. You can access this by running `npm run drizzle:studio`, then navigating to this URL: [local.drizzle.studio](https://local.drizzle.studio).

### `npm run drizzle:generate`, `npm run drizzle:migrate`, and `npm run drizzle:check`

See [Database Migrations](Database-Migrations.md)

### `npm run auth-schema:generate`

**You won't need to run this.**

This is a utility script that updates the auth schemas required for the database (located in `src/server/db/schema/auth.ts`). This may be required if we update the Better Auth library.

- If you do use this script, you'll need to immediately generate and apply a database migration with drizzle. See [Database Migrations](Database-Migrations.md)

### `npm run migratePageViews`

**You won't need to run this.**

This is an internal script that runs this script: `scripts/migratePageViews.ts`. This will fetch page views from Google Analytics and push them to the database, which is required for displaying page views to club managers and for sorting by popularity.

This script automatically runs at midnight every day by this GitHub workflow: `.github/workflows/migrate-page-views.yml`
