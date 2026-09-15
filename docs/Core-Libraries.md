# List of Core Libraries in UTD Clubs

Libraries that are foundational to how `utd-clubs` works.

## Next.JS

- [Documentation](https://nextjs.org/docs)

This is arguably the most important framework for UTD Clubs. Next.JS is a full-stack framework for React that makes building web applications much easier because it handles page routing, faster page navigation loading, and much more.

- **App Router** - This version of Next.JS means the `src/app/` directory maps its files and folders to the routes of the Clubs website. For example, `src/app/page.tsx` maps to the [homepage](https://clubs.utdnebula.com) and `src/app/club-match/page.tsx` maps to the [club match](https://clubs.utdnebula.com/club-match) page.[^7]

- **Server-side rendering** (SSR) - Next.JS is built around this concept, which improves loading times and the experience of visitors with older devices! What this feature means is that anytime a visitor opens a page on UTD Clubs, the backend server[^1] will first render the React code responsible for the page content (i.e. "server-side rendering!) Then, Next.JS will send this pre-rendered content to the visitor's device, which then runs any code that absolutely must run on the client.

  Because Next.JS runs everything on the server as [React Server Components](https://react.dev/reference/rsc/server-components) (RSC) by default, you have to explicitly specify that you want code to run on the client. Therefore, to create a React component that runs on the client, you must include the [`'use client'`](https://react.dev/reference/rsc/use-client) directive at the very top of the file. Example:

  ```tsx
  'use client';

  import AlertButton from './AlertButton';

  export default function ButtonGroup() {
    // useState MUST run on the client, hence the 'use client' directive!
    const [count, setCount] = useState(0);

    return (
      <div>
        <button
          onClick={() => {
            setCount((prev) => prev + 1);
          }}
        >
          Clicked {count} times
        </button>
        <AlertButton />
      </div>
    );
  }
  ```

  In the above example, the `'use client'` directive enables client-side reactivity via event handlers and hooks such as `useState`. Without this directive, the above component would NOT work if used in a Next.JS page.

  Additionally, the directive makes any code that file imports (e.g. utility functions, other React components) run on the client. That means in the above example, `<AlertButton />` will also run on the client because it is a child of the `<ButtonGroup />` component.

  For more information on this topic, see Next.JS's documentation on [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components).

We also use Next.JS for several other things, including: [SEO metadata](https://nextjs.org/docs/app/getting-started/metadata-and-og-images), [`public/` folder](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder), [Open Graph preview images](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image), [prefetching](https://nextjs.org/docs/app/getting-started/linking-and-navigating#prefetching), [API route handling](https://nextjs.org/docs/app/getting-started/route-handlers), and [deployment](https://nextjs.org/docs/app/getting-started/deploying). These are features you generally don't need to worry about unless you're specifically working on an issue for one of them.

## tRPC

- [Documentation](https://trpc.io/docs)

Sometimes, code that runs on the client will need to communicate with the server.[^2] For example, when a visitor submits a form on the client, changes to the database must be run on the server. This means we need to create an API between the client and the server! To make this task easier, UTD Clubs uses the tRPC library, which abstracts away the creation of Club's internal API.[^3]

How does this API work? Well, think of it as though the client is literally just running a function that runs code on the server. This function does a single thing; it could fetch a list of a user's clubs, a club's events, or even mutate (AKA modify) the description of a club! tRPC calls these functions "**procedures**". A procedure can accept an input, perform a task on the server, then return something.

Of course, it'd be nice to group similar procedures together, kind of like folders. tRPC calls these groups/folders "**routers**". UTD Clubs has the following routers, which are located in `src/server/api/routers/`:

- `clubRouter` - clubs system
  - `clubPublicRouter` - query procedures, doesn't require login
  - `clubManageRouter` - mutation procedures
- `eventRouter` - events system
  - `eventPublicRouter` - query procedures, doesn't require login
  - `eventManageRouter` - mutation procedures
- `userRouter` - procedures related to the currently logged in user
  - `userPublicRouter` - query procedures, doesn't require login
  - `userClubsRouter` - procedures that relate a user to clubs
  - `userEventsRouter` - procedures that relate a user to events
  - `userMetadataRouter` - procedures for data associated with a user
- `adminRouter` - website admin features
- `aiRouter` - AI features
- `storageRouter` - file storage features

Each of these routers have procedures that perform a specific task. For instance, the `eventPublicRouter` has a procedure called `findByFilters`, which accepts search filters for events then returns a list of events that match those filters.

To call this API from the client, you should use the [**Tanstack Query**](#tanstack-query) library. This would entail using a `useQuery()` hook in a React Client Component. Please see our documentation on that library below for examples on how to do that!

While you'd normally call this API from the client, you can actually call API procedures from the server. In fact, it's even easier, as it just looks like an asyncronous JavaScript function! Here's an example that fetches the club listing info of Nebula Labs:

```ts
import { api } from '@/trpc/server';

const club = await api.club.getDirectoryInfo({ slug: 'nebula-labs' });
```

## Tanstack Query

- Documentation: [Getting Started](https://tanstack.com/query/latest/docs/framework/react/overview) | [Guides](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults) | [API Reference](https://tanstack.com/query/latest/docs/framework/react/reference/index)

This library makes it much easier for developers to fetch data from asyncronous code (which in a nutshell means it takes some time to fetch that data). In UTD Clubs, this is almost always used to call upon API procedures provided by tRPC.

Tanstack Query provides a `useQuery()` hook for use in client-side React components. Tanstack Query provides features such as caching, maintaining "out of date" data, and query state metadata that it easier to create loading states and error messages.

<!-- TODO -->

## Drizzle

- [Documentation](https://orm.drizzle.team/docs/overview)
  - [Schema](https://orm.drizzle.team/docs/sql-schema-declaration) - See the "What's next?" section at the bottom of the page
    - [Relations](https://orm.drizzle.team/docs/relations-schema-declaration)
  - [Data Querying](https://orm.drizzle.team/docs/data-querying) - See the "What's next?" section at the bottom of the page
  - [Migrations](https://orm.drizzle.team/docs/migrations) & [Drizzle Kit](https://orm.drizzle.team/docs/kit-overview) - See our documentation on [Database Migrations](Database-Migrations.md)

UTD Clubs uses a **PostgreSQL** (Postgres) database to store all data related to clubs, users, events, accounts, etc. To avoid requiring you to learn and write SQL, we use Drizzle! This is an ORM (Object-Relational Mapping) library, which just allows you to access the database using TypeScript code instead of SQL. Because it's TypeScript, we also get access to tools that let us define type-safe database schemas and relations!

Okay, but how even is a database structured?

_TODO: insert brief explanation of tables, columns, records, primary keys_

Some other notes:

- The database can only be accessed from code that runs on the server (i.e. React Client Components cannot call APIs that access the database). Allowing clients to directly access the database is the absolute antithesis to data security.

- UTD Clubs uses a codebase-first workflow rather than a database-first workflow. This means that we define schemas in the codebase, and databases must be "migrated" to match the codebase's schemas. Drizzle provides tools for automatically generating and applying migrations. For information about how to generate and apply database migrations, see [Database Migrations](Database-Migrations.md).

- The database for UTD Clubs is hosted by **Neon**, which is a "managed serverless PostgreSQL database platform." Drizzle connects to Neon via the `DATABASE_URL` environment variable, which could actually correspond to any arbitrary database. Neon takes advantage of this by providing a feature called **database branches**, which allows UTD Clubs to provide separate database (and thus separate data) between the different versions of UTD Clubs:
  - **Production** - The `main` git branch, deployed on [`clubs.utdnebula.com`](https://clubs.utdnebula.com)
  - **Development** - The `develop` git branch, deployed on [`dev.clubs.utdnebula.com`](https://dev.clubs.utdnebula.com)
  - **Preview Deployments for PRs** - Each git branch (and by extension, pull requests) in the GitHub repository will automatically create a preview deployment and a database branch specifically for this branch. Example: [`clubs-7s68tk53e-utdnebula.vercel.app`](https://clubs-7s68tk53e-utdnebula.vercel.app) <!-- This example corresponds to the `develop` branch, so this URL shouldn't ever break -->
  - **Local development branches** - Developers may request a database branch for testing schema changes from the Clubs Lead or Nebula Platform.

## Better Auth

- [Documentation](https://better-auth.com/docs)

Several features in UTD Clubs require an account to use. The Better Auth framework handles account authentication for UTD Clubs. It allows visitors of UTD Clubs to log in using either their Google, Discord, and Microsoft account.[^4] Better Auth then integrates with [Drizzle](#drizzle) to store account data in the database.

To connect to Google and Discord and Microsoft, we have to request oAuth2 client IDs and secrets from each social platform. These client IDs and secrets must be provided in the environment variables whenever UTD Clubs is deployed. Otherwise, account authentication fails, and visitors are unable to sign in! Nebula Labs' leadership handles this and will provide you with the necessary environment variables.

---

## Next Step

See [UI Libraries](UI-Libraries.md)

[^7]: Check out the documentation on [Next.JS's project structure](https://nextjs.org/docs/app/getting-started/project-structure).

[^1]: Next.JS runs server-side code using the Node.js runtime by default, which has all the regular APIs and bundler features you're used to. However, a file can be configured to use the [Edge runtime](https://nextjs.org/docs/app/api-reference/edge) instead by including `export const runtime = 'edge';` in the file.

[^2]: React has a feature called [Server Functions](https://react.dev/reference/rsc/server-functions), in which adding the [`'use server'`](https://react.dev/reference/rsc/use-server) directive at the top of a file creates server-side utility code that can be called by client components. However, because UTD Clubs instead uses tRPC and Tanstack Query, **you should not use React Server Functions.**

[^3]: Although UTD Clubs does have features that utilize the [Nebula API](https://www.utdnebula.com/projects/api), backend requests are handled using tRPC. UTD Clubs has its own backend, which is located in the same codebase.

[^4]: Logging in with Microsoft is intended for UTD Faculty/Staff. Additionally, visitors currently cannot create an account using an email and password; this is because UTD Clubs currently lacks a system to send emails, which makes email verification and password reset requests rather impossible to implement!
