# List of Core Libraries in UTD Clubs

Libraries that are foundational to how `utd-clubs` works.

## Next.JS

- [Documentation](https://nextjs.org/docs)

A full-stack framework for React that makes building web applications much easier. UTD Clubs uses Next.JS's App Router, which handles page routing, faster page navigation loading, and much more.

- Next.JS heavily uses a concept called **server-side rendering** (SSR). This means anytime a visitor opens a page on UTD Clubs, the backend server (using the Node.js runtime[^1]) will generate most of the content as HTML before sending it to the visitor's device (which then runs any code that must run on the client). SSR improves loading times and the experience of users with older devices. Because of SSR plus the fact that we use TypeScript for everything, most `.tsx` files could run on either the server or client. [_...more info_](https://nextjs.org/docs/app/getting-started/server-and-client-components)

  By default, Next.JS runs everything on the server as [React Server Components](https://react.dev/reference/rsc/server-components) (RSC). To create a React component that runs on the client, you must include the [`'use client'`](https://react.dev/reference/rsc/use-client) directive at the very top of the file. This also makes any code that file imports (e.g. utility functions, other React components) run on the client. It also enables interactivity with React via event handlers and most hooks, so you will see this directive used quite often in the UTD Clubs codebase.

- The `src/app/` directory maps files and folders to the routes in the Clubs website. For example, `src/app/page.tsx` maps to the [homepage](https://clubs.utdnebula.com) and `src/app/club-match/page.tsx` maps to the [club match](https://clubs.utdnebula.com/club-match) page. [_...more info_](https://nextjs.org/docs/app/getting-started/project-structure)
- The `public/` directory contains images and resources that are made available by Next.JS to the website. [_...more info_](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder)

We also use Next.JS for several other things, including: [SEO metadata](https://nextjs.org/docs/app/getting-started/metadata-and-og-images), [Open Graph preview images](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image), [prefetching](https://nextjs.org/docs/app/getting-started/linking-and-navigating#prefetching), [API route handling](https://nextjs.org/docs/app/getting-started/route-handlers), and [deployment](https://nextjs.org/docs/app/getting-started/deploying). These are features you generally don't need to worry about unless you're specifically working on an issue for one of them.

## tRPC

- [Documentation](https://trpc.io/docs)

Sometimes, code that runs on the client will need to communicate with the server.[^3] For example, when a visitor submits a form on the client, changes in the database must be run on the server. To allow this, UTD Clubs uses the [**tRPC**](Backend-Libraries.md#trpc) library, which abstracts away the creation of an internal API used only by UTD Clubs to communicate between the client and server.[^4]

To call the API provided by tRPC, developers should use the [**Tanstack Query**](Frontend-Libraries.md#tanstack-query) library. This entails using the `useQuery()` hook in client-side React components. Tanstack Query provides features such as caching, maintaining "out of date" data, and query state metadata that it easier to create loading states and error messages.

<!-- TODO -->

## Better Auth

- [Documentation](https://better-auth.com/docs)

Several features in UTD Clubs require an account to use. The [**Better Auth**](Fullstack-Libraries.md#better-auth) framework handles account authentication by integrating with the following social providers: Google, Discord, and Microsoft. This means that visitors of UTD Clubs can log in using either their Google, Discord, and Microsoft account.[^6] Better Auth integrates with Drizzle to store account data in the database.

To connect to each social platform, Nebula Labs leadership must request oAuth2 client IDs and secrets from the corresponding social platform. These client IDs and secrets must be provided in the environment variables whenever UTD Clubs is deployed; otherwise, account authentication fails and visitors are unable to sign in.

<!-- TODO -->

## Drizzle

- [Documentation](https://orm.drizzle.team/docs/overview)
  - [Schema](https://orm.drizzle.team/docs/sql-schema-declaration) - See the "What's next?" section at the bottom of the page
    - [Relations](https://orm.drizzle.team/docs/relations-schema-declaration)
  - [Data Querying](https://orm.drizzle.team/docs/data-querying) - See the "What's next?" section at the bottom of the page
  - [Migrations](https://orm.drizzle.team/docs/migrations) & [Drizzle Kit](https://orm.drizzle.team/docs/kit-overview) - See our documentation on [Database Migrations](Database-Migrations.md)

UTD Clubs uses a **PostgreSQL** database to store all data related to clubs, users, events, accounts, etc. To avoid requiring developers to write SQL, UTD Clubs uses [**Drizzle**](Backend-Libraries.md#drizzle). This is an ORM (Object-Relational Mapping) library that allows developers to write TypeScript to query the database as well as define type-safe database schemas and relations. The database can only be accessed from code that runs on the server; i.e. React Client Components cannot call APIs that access the database.

UTD Clubs uses a codebase-first workflow rather than a database-first workflow. This means that schemas are defined in the codebase, and databases must be "migrated" to match the codebase's schemas. Drizzle provides tools for automatically generating and applying migrations.[^5]

The database for UTD Clubs is provided by **Neon**, which is a managed serverless PostgreSQL database platform. Drizzle connects to Neon via the `DATABASE_URL` environment variable. Neon provides a feature called database branches, which allows UTD Clubs to provide separate database (and thus separate data) between the different versions of UTD Clubs:

- **Production** - The `main` git branch, deployed on [`clubs.utdnebula.com`](https://clubs.utdnebula.com)
- **Development** - The `develop` git branch, deployed on [`dev.clubs.utdnebula.com`](https://dev.clubs.utdnebula.com)
- **Preview Deployments for PRs** - Each git branch (and by extension, pull requests) in the GitHub repository will automatically create a preview deployment and a database branch specifically for this branch. Example: [`clubs-7s68tk53e-utdnebula.vercel.app`](https://clubs-7s68tk53e-utdnebula.vercel.app) <!-- This example corresponds to the `develop` branch, so this URL shouldn't ever break -->
- **Local development branches** - Developers may request a database branch for testing schema changes from the Clubs Lead or Nebula Platform.

<!-- TODO -->

[^1]: Next.JS runs server-side code using the Node.js runtime by default. However, a file can be configured to use the [Edge runtime](https://nextjs.org/docs/app/api-reference/edge) instead by including `export const runtime = 'edge';` in the file.

[^3]: React has a feature called [Server Functions](https://react.dev/reference/rsc/server-functions), in which adding the [`'use server'`](https://react.dev/reference/rsc/use-server) directive at the top of a file creates server-side utility code that can be called by client components. However, because UTD Clubs instead uses tRPC and Tanstack Query, **you should not use React Server Functions.**

[^4]: Although UTD Clubs does have features that utilize the [Nebula API](https://www.utdnebula.com/projects/api), backend requests are handled using tRPC. The frontend and backend for UTD Clubs are located in the same codebase.

[^5]: For information about how to generate and apply database migrations, see [Database Migrations](Database-Migrations.md).

[^6]: Logging in with Microsoft is intended for UTD Faculty/Staff. Additionally, visitors currently cannot create an account using an email and password; this is because UTD Clubs currently lacks a system to send emails, which makes email verification and password reset requests rather impossible to implement!
