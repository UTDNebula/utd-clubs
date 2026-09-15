# Project structure

This is the project structure for UTD Clubs. It follows a similar structure to other Nebula Labs projects and other codebases that use Next.JS.

## Directory Overview

Here's a visualization of the most important files/directories in `utd-clubs`. We've omitted some niche stuff that you can find on Google instead. For more detailed info, continue reading this page.

```text
utd-clubs/
├── src/                       # Source code for the website
│   ├── app/                    # File-system based routing for Next.JS's App Router
│   │   ├── layout.tsx           # Global wrapper for every route
│   │   ├── page.tsx             # Homepage
│   │   ├── **/layout.tsx        # Wrapper for this route
│   │   ├── **/page.tsx          # Page for this route
│   │   └── **/route.ts          # Route handler for this route
│   ├── lib/                    # Library of generic code for UTD Clubs
│   │   ├── components/          # Collection of reusable UI components
│   │   ├── utils/               # Collection of useful functions
│   │   ├── icons/               # Collection of special icon components
│   │   ├── modules/             # Mini-systems for UTD Clubs
│   │   └── styles/              # CSS
│   ├── nebula-library/         # Nebula Library. Like lib/ but shared with other projects
│   ├── server/                 # Code that runs on backend server
│   │   ├── api/                 # API routers for tRPC
│   │   ├── db/                  # Database schemas and migrations for Drizzle
│   │   └── auth.ts              # Better Auth configuration for account authentication
│   └── systems/                # List of systems
│   │   ├── dashboard/           # Dashboard and homepage features
│   │   ├── clubs/               # Features related to clubs
│   │   ├── events/              # Features related to events
│   │   ├── manage/              # Club and event management features
│   │   ├── settings/            # Account settings and onboarding features
│   │   └── admin/               # Website administrative features
├── docs/                      # Pages for Club's developer documentation
│   └── assets/                 # Images used in documentation
├── tests/                     # Jest unit tests
├── public/                    # Static assets served by Next.JS
├── scripts/                   # Automated scripts
├── .env.example               # Template for environment variables (copy to .env)
└── package.json               # Manifest for the utd-clubs Node.js project
```

## Detailed Directory Overview

Here's more detailed information about UTD Club's project structure. Feel free to skip ahead to [How to Contribute](How-to-Contribute.md) if you feel you've got the gist of this already.

### Top-level folders and files

The stuff you see at the root of the `utd-clubs` project folder.

| Folder/File                                                                           | Description                                                                                                                                                                             |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.github/`                                                                            | Configuration folder for the GitHub repository.                                                                                                                                         |
| `.next/`                                                                              | Generated build files when running Next.JS (through `npm run dev` or `npm run build`).                                                                                                  |
| [`.vscode/`](VS-Code.md)                                                              | Workspace settings and recommended extensions for VS Code.\_                                                                                                                            |
| [`docs/`](https://github.com/UTDNebula/utd-clubs/wiki)                                | Documentation files for the codebase. Deployed using GitHub Actions to the repository's GitHub wiki.\_                                                                                  |
| [`public/`](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder) | Static assets to be served, such as images. Import files from here using `@public/...`.                                                                                                 |
| [`scripts/`](NPM-Scripts.md)                                                          | NPM scripts that are added to `package.json` and run using `npm run ...`                                                                                                                |
| [`src/`](#src-folder)                                                                 | The actual code for the repository.                                                                                                                                                     |
| [`tests/`](Tests.md)                                                                  | Files for integration testing and end-to-end testing.                                                                                                                                   |
| `.env.example`                                                                        | Template for UTD Club's environment variables. Copy this file to `.env` and fill in the required variables. See [Getting Started](Getting-Started.md#3-configure-environment-variables) |

### `src/` folder

Contains all the source code of the website.

| Folder                                                                  | Description                                                                                                                                   |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [`app/`](https://nextjs.org/docs/app/getting-started/project-structure) | Defines the website's page structure and routes for the Next.JS App Router                                                                    |
| [`lib/`](#srclib-folder)                                                | Common library files for UTD Clubs                                                                                                            |
| [`nebula-library/`](./nebula-library.md)                                | Common library files for all of Nebula Labs' projects. This is a git submodule, so it must be initialized using `git submodule update --init` |
| [`server/`](#srcserver-folder)                                          | Backend code that runs on the server. Contains database and backend implementations for API procedures                                        |
| [`systems/`](#srcsystems-folder)                                        | All the major systems of UTD Clubs, grouped into folders                                                                                      |
| `trpc/`                                                                 | Folder for TRPC stuff that we plan on moving elsewhere in another refactor                                                                    |

---

### `src/lib/` folder

Common library files for UTD Clubs. Import statements start with `@/lib/`

| Folder        | Description                                                                                                                                                                                                                                                                       |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/` | One-off reusable component files. Every file should have the `.tsx` extension (`.ts` files belong in `src/lib/utils/`)                                                                                                                                                            |
| `icons/`      | Icon component files                                                                                                                                                                                                                                                              |
| `modules/`    | Small reusable systems, grouped into folders. Files can have a mixture of the `.ts` and `.tsx` extensions. Each module should have an `index.ts` barrel file that re-exports everything in the module so that imports look like `import { ... } from '@/lib/modules/module-name'` |
| `styles/`     | Global CSS files. `global.css` should import every other file in this folder because `global.css` itself is imported into `src/app/layout.tsx`                                                                                                                                    |
| `utils/`      | Collection of one-off reusable utility files. Every file should have the `.ts` extension (`.tsx` files belong in `src/lib/components/`)                                                                                                                                           |

### `src/server/` folder

Backend code that runs on the server. Contains database and backend implementations for API procedures. Import statements start with `@/server/`

| Folder/File      | Description                                                                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api/`           | API procedures so client can communicate with server using tRPC. Contains initialization and routers for tRPC                                                      |
| `api/routers/`   | Folder of routers for tRPC                                                                                                                                         |
| `db/`            | Backend database instance for Drizzle                                                                                                                              |
| `db/schemas/`    | PostgresSQL database schema definitions. These files are editable (except `src/server/db/schema/auth.ts`, which is generated using `npm run auth-schema:generate`) |
| `db/migrations/` | Database migration snapshots for Drizzle. Automatically generated when using `drizzle:generate`                                                                    |
| `auth.ts`        | Better Auth instance for account authentication                                                                                                                    |

### `src/systems/` folder

All the major systems of UTD Clubs, grouped into folders. Each folder:

- May contain components, utilities, and schemas related to that system
- Could be organized independently from one another

Import statements start with `@/systems/`

| Folder       | Description                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| `admin/`     | Website administrative features. Used exclusively by the `/admin` route                                 |
| `clubs/`     | Features related to clubs. Used primarily by the `/directory`, `/club-match`, and `/manage` routes      |
| `dashboard/` | Dashboard and homepage features. Used primarily by the `/` and `/community` routes                      |
| `events/`    | Features related to events. Used primarily by the `/events` and `/manage` routes                        |
| `manage/`    | Club and event management features. Used exclusively by the `/manage` route                             |
| `settings/`  | Account settings and onboarding features. Used exclusively by the `/settings` and `/get-started` routes |

## Next Step

See [How-to-Contribute.md](How-to-Contribute.md)
