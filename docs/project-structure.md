# Project structure

This is the project structure for UTD Clubs. It follows a similar structure to other Nebula Labs projects and other codebases that use Next.JS.

## Top-level folders and files

| Folder                       | Description                                                                                                                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.github/`                   | Configuration folder for the GitHub repository.                                                                                                                                           |
| `.next/`                     | Generated build files when running Next.JS (through `npm run dev` or `npm run build`).                                                                                                    |
| `.vscode/`                   | Workspace settings and recommended extensions for VS Code.                                                                                                                                |
| `docs/`                      | Documentation files for the codebase. Deployed using GitHub Actions to the repository's GitHub wiki. [View the repository's wiki](https://github.com/UTDNebula/utd-clubs/wiki)            |
| `public/`                    | Static assets to be served, such as images. Import files from here using `@public/...`. [Next.JS documentation](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder) |
| `scripts/`                   | NPM scripts that are added to `package.json` and run using `npm run ...`                                                                                                                  |
| [`src/`](#the-src-directory) | The actual code for the repository.                                                                                                                                                       |
| `tests/`                     | Files for integration testing and end-to-end testing.                                                                                                                                     |

| File   | Description                                                                                                                                |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `.env` | Environment variables for project. To create this file, duplicate `.env.example`, rename it to `.env`, and fill in the required variables. |

## The `src` directory

Contains all the source code of the website.

| Folder                                                                  | Description                                                                                                                                   |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [`app/`](https://nextjs.org/docs/app/getting-started/project-structure) | Defines the website's page structure and routes for the Next.JS App Router                                                                    |
| [`lib/`](#lib-folder)                                                   | Common library files for UTD Clubs                                                                                                            |
| `nebula-library/`                                                       | Common library files for all of Nebula Labs' projects. This is a git submodule, so it must be initialized using `git submodule update --init` |
| [`server/`](#server-folder)                                             | Backend code that runs on the server. Contains database and backend implementations for API procedures                                        |
| [`systems/`](#systems-folder)                                           | All the major systems of UTD Clubs, grouped into folders                                                                                      |
| `trpc/`                                                                 | Folder for TRPC stuff that we plan on moving elsewhere in another refactor                                                                    |

---

### `@/lib` folder

Common library files for UTD Clubs

| Folder        | Description                                                                                                                                                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/` | One-off reusable component files. Ideally, everything should be a `.tsx` file (`.ts` files belong in `src/lib/utils/`)                                                                                                        |
| `icons/`      | Icon component files                                                                                                                                                                                                          |
| `modules/`    | Small reusable systems, grouped into folders. Ideally, each module should have an `index.ts` barrel file that re-exports everything in the module so that imports look like `import { ... } from '@/lib/modules/module-name'` |
| `styles/`     | Global CSS files. `global.css` should import every other file in this folder because `global.css` itself is imported into `src/app/layout.tsx`                                                                                |
| `utils/`      | Collection of one-off reusable utility files. Ideally, everything should be a `.ts` file (`.tsx` files belong in `src/lib/components/`)                                                                                       |

### `@/server` folder

Backend code that runs on the server. Contains database and backend implementations for API procedures

| Folder/File      | Description                                                                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api/`           | API procedures so client can communicate with server using tRPC. Contains initialization and routers for tRPC                                                      |
| `api/routers/`   | Folder of routers for tRPC                                                                                                                                         |
| `db/`            | Backend database instance for Drizzle                                                                                                                              |
| `db/schemas/`    | PostgresSQL database schema definitions. These files are editable (except `src/server/db/schema/auth.ts`, which is generated using `npm run auth-schema:generate`) |
| `db/migrations/` | Database migration snapshots for Drizzle. Automatically generated when using `drizzle:generate`                                                                    |
| `auth.ts`        | Better Auth instance for account authentication                                                                                                                    |

### `@/systems` folder

All the major systems of UTD Clubs, grouped into folders. Each folder:

- May contain components, utilities, and schemas related to that system
- Could be organized independently from one another

| Folder       | Description                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| `admin/`     | Website administrative features. Used exclusively by the `/admin` route                                 |
| `clubs/`     | Features related to clubs. Used primarily by the `/directory`, `/club-match`, and `/manage` routes      |
| `dashboard/` | Dashboard and homepage features. Used primarily by the `/` and `/community` routes                      |
| `events/`    | Features related to events. Used primarily by the `/events` and `/manage` routes                        |
| `manage/`    | Club and event management features. Used exclusively by the `/manage` route                             |
| `settings/`  | Account settings and onboarding features. Used exclusively by the `/settings` and `/get-started` routes |
