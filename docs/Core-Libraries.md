# List of Core Libraries in UTD Clubs

Libraries that are foundational to how `utd-clubs` works.

## Next.JS

- [Documentation](https://nextjs.org/docs)

This is arguably the most important framework for UTD Clubs. Next.JS is a full-stack framework for React that makes building web applications much easier because it handles page routing, faster page navigation loading, and much more.

- **App Router** - This version of Next.JS means the `src/app/` directory maps its files and folders to the routes of the Clubs website. For example, `src/app/page.tsx` maps to the [homepage](https://clubs.utdnebula.com) and `src/app/club-match/page.tsx` maps to the [club match](https://clubs.utdnebula.com/club-match) page.[^1]

- **Server-side rendering** (SSR) - Next.JS is built around this concept, which improves loading times and the experience of visitors with older devices! What this feature means is that anytime a visitor opens a page on UTD Clubs, the backend server[^2] will first render the React code responsible for the page content (i.e. "server-side rendering!) Then, Next.JS will send this pre-rendered content to the visitor's device, which then runs any code that absolutely must run on the client.

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

Sometimes, code that runs on the client will need to communicate with the server.[^3] For example, when a visitor submits a form on the client, changes to the database must be run on the server. This means we need to create an API between the client and the server! To make this task easier, UTD Clubs uses the tRPC library, which abstracts away the creation of Club's internal API.[^4]

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

Tanstack Query adds features that make it much easier for you to fetch data from asyncronous functions (which in a nutshell are functions that might take some time to fetch that data). In UTD Clubs, the most prominent example of asyncronous functions are the API procedures provided by tRPC! Tanstack Query is how you should use this API in client-side code.

Tanstack Query includes features such as caching, maintaining "out of date" data (i.e. refetching data when it's outdated), and provides metadata about the query such as whether a query is currently fetching. This latter feature makes it very easy to create loading states and even add user-facing error messages!

Tanstack Query is always used in React Client Components, as it provides two useful functions/hooks that must run on the client: `useQuery()` and `useMutation()`. Both serve two useful, yet slightly different purposes:

- `useQuery()` - For getting (or "querying") data from the server. If you're familiar with the concept of [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete), this hook represents "reading" data.
- `useMutation()` - For modifying (or "mutating") in the server. In CRUD, this hook represents "creating", "updating", and "deleting" data.

As an example, let's actually look at `<JoinButton />`, which is a real React component we have that's located in `src/systems/clubs/JoinButton.tsx`. What does the join button need to do? Well:

- The button should show whether or not the user has joined this club. In this case, we are "reading" data; this means we also need the `useQuery()` hook.
- Perhaps more obviously, clicking the button needs to inform the server that the user needs to join this club. In this case, we are "updating" data; this means we need the `useMutation()` hook.

The `<JoinButton />` component is a unique example where we use both `useQuery()` and `useMutation()`! For clarity's sake, let's look at how we'd use the `useQuery()` hook first. Assume we have an API procedure called `memberState` that returns whether the user has joined the club or not.

```tsx
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/react';

export default function JoinButton({ clubId }: { clubId: string }) {
  const api = useTRPC(); // Access the tRPC API

  const memberState = useQuery(
    // We are passing clubId as input for this particular API procedure
    api.user.clubs.memberState.queryOptions({ clubId }),
  );

  // The button's label changes depending on if the user has joined the club
  // memberState.data is true if the user has joined the club
  return <button>{memberState.data ? 'Joined!' : 'Join'}</button>;
}
```

Now let's look at the `useMutation()` hook in isolation, which will make the button actually functional. Assume we have an API procedure called `joinLeave` that toggles whether the user has joined the club.

```tsx
import { useMutation } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/react';

export default function JoinButton({ clubId }: { clubId: string }) {
  const api = useTRPC(); // Access the tRPC API

  // Initial setup. Note that we don't pass input data here
  const joinLeave = useMutation(api.user.clubs.joinLeave.mutationOptions());

  const handleClick = () => {
    // This is where we actually run the mutation and pass clubId as input
    joinLeave.mutate({ clubId });
  };

  return <button onClick={handleClick}>Join</button>;
}
```

Nice! Now let's combine the two. In fact, I'll also demonstrate how you can use Tanstack Query (and the `<Button />` component from [MUI](UI-Libraries.md#material-ui-mui)) to easily add a loading state to the button!

```tsx
import Button from '@mui/material/Button';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/react';

export default function JoinButton({ clubId }: { clubId: string }) {
  const api = useTRPC();

  const memberState = useQuery(
    api.user.clubs.memberState.queryOptions({ clubId }),
  );
  const joinLeave = useMutation(api.user.clubs.joinLeave.mutationOptions());

  return (
    // Button will show a loading spinner if it is either
    // reading or updating whether the user has joined the club
    <Button
      loading={memberState.isPending || joinLeave.isPending}
      onClick={() => {
        joinLeave.mutate({ clubId });
      }}
    >
      {memberState.data ? 'Joined!' : 'Join'}
    </Button>
  );
}
```

Now we have a functional `<JoinButton />`! Of course, the actual implementation is much more elaborate, but the above are the fundamentals that you can find in the actual implementation. Additionally, Tanstack Query will cache the results of the `memberState` query, meaning multiple requests with the same `clubId` input that happen at the same time will only result in one network call.

Tanstack Query includes other concepts such as the query client, query invalidation, and prefetching; however, these are topics that will only come up in more advanced issues.

## Drizzle

- [Documentation](https://orm.drizzle.team/docs/overview)
  - [Schema](https://orm.drizzle.team/docs/sql-schema-declaration) - See the "What's next?" section at the bottom of the page
    - [Relations](https://orm.drizzle.team/docs/relations-schema-declaration)
  - [Data Querying](https://orm.drizzle.team/docs/data-querying) - See the "What's next?" section at the bottom of the page
  - [Migrations](https://orm.drizzle.team/docs/migrations) & [Drizzle Kit](https://orm.drizzle.team/docs/kit-overview) - See our documentation on [Database Migrations](Database-Migrations.md)

UTD Clubs uses a **PostgreSQL** (Postgres) database to store all data related to clubs, users, events, accounts, etc. To avoid requiring you to learn and write SQL, we use Drizzle! This is an ORM (Object-Relational Mapping) library, which just allows you to access the database using TypeScript code instead of SQL. Because it's TypeScript, we also get access to tools that let us define type-safe database schemas and relations!

Okay, but how is the UTD Clubs database even structured? In a nutshell, a relational database is a collection of tables. These are almost exactly like a spreadsheet table: rows correspond to an item/record, and columns correspond to fields for that item. One of these columns is known as the "primary key", which means that the value for that column must be unique for every item/record; in most cases, this is an ID.

For example, we have a `club` table which lists every club that is on UTD Clubs. Each row corresponds to a single club, and the columns corresponds to that club's fields such as the club's name, its logo, its tags, etc. The primary key is the `club_id` column, which is unique for every club. Some other tables we have include: `events`, `contacts`, `account`, `user`, and `user_metadata`.

Drizzle makes it easy to define "relations" between tables. It could be a **one-to-one relationship**; for example, for each item in the `user` table, there is a corresponding entry in the `user_metadata` table. It could be a **one-to-many relationship**; for example, for each club in the `club` table, there are multiple events that correspond to that club in the `events` table. In Drizzle, you simply attach a relation to a table's schema.

Some important notes about how the database works in UTD Clubs:

- The database can only be accessed from code that runs on the server (i.e. React Client Components cannot call APIs that access the database). Allowing clients to directly access the database is the absolute antithesis to data security.

- UTD Clubs uses a codebase-first workflow rather than a database-first workflow. This means that we define schemas in the codebase, and databases must be "migrated" to match the codebase's schemas. Drizzle provides tools for automatically generating and applying migrations. For information about how to generate and apply database migrations, see [Database Migrations](Database-Migrations.md).

- The database for UTD Clubs is hosted by **Neon**, which is a "managed serverless PostgreSQL database platform." Drizzle connects to Neon via the `DATABASE_URL` environment variable, which could actually correspond to any arbitrary database. Neon takes advantage of this by providing a feature called **database branches**, which allows UTD Clubs to provide separate database (and thus separate data) between the different versions of UTD Clubs:
  - **Production** - The `main` git branch, deployed on [`clubs.utdnebula.com`](https://clubs.utdnebula.com)
  - **Development** - The `develop` git branch, deployed on [`dev.clubs.utdnebula.com`](https://dev.clubs.utdnebula.com)
  - **Preview Deployments for PRs** - Each git branch (and by extension, pull requests) in the GitHub repository will automatically create a preview deployment and a database branch specifically for this branch. Example: [`clubs-7s68tk53e-utdnebula.vercel.app`](https://clubs-7s68tk53e-utdnebula.vercel.app) <!-- This example corresponds to the `develop` branch, so this URL shouldn't ever break -->
  - **Local development branches** - Developers may request a database branch for testing schema changes from the Clubs Lead or Head of Engineering.

## Better Auth

- [Documentation](https://better-auth.com/docs)

Several features in UTD Clubs require an account to use. The Better Auth framework handles account authentication for UTD Clubs. It allows visitors of UTD Clubs to log in using either their Google, Discord, and Microsoft account.[^5] Better Auth then integrates with [Drizzle](#drizzle) to store account data in the database.

To connect to Google and Discord and Microsoft, we have to request oAuth2 client IDs and secrets from each social platform. These client IDs and secrets must be provided in the environment variables whenever UTD Clubs is deployed. Otherwise, account authentication fails, and visitors are unable to sign in! Nebula Labs' leadership handles this and will provide you with the necessary environment variables.

Better Auth requires the `BETTER_AUTH_URL` and `BETTER_AUTH_SECRET` environment variables. The former should simply be the base URL of the deployed server (so `http://localhost:3000` for local development). The latter should be an arbitrary string with at least 32 characters. This secret is used for encryption and hashing. You can generate one by running `openssl rand -base64 32` in your terminal, or clicking the "Generate Secret" button on Better Auth's [Installation](https://better-auth.com/docs/installation#set-environment-variables) documentation.

## Google Gen AI

- [Documentation](https://googleapis.github.io/js-genai/release_docs/index.html)

Some features in UTD Clubs utilize the Google Gemini AI. The Google Gen AI SDK allows the codebase to easily connect to the Gemini Developer API. Currently, UTD Clubs uses the `gemini-3.1-flash-lite` model due to its relatively low cost and simplicity.

UTD Clubs uses Google Gemini on our club match page to intelligently match visitors to clubs based on their hobbies and interests. We prompt the AI by providing it with a JSON list of every club on UTD Clubs, as well as the user's form response on the club match quiz. We prompt the AI with important security and integrity rules twice: once in the beginning to structure its response, and again at the end to reduce prompt injection.

The `GEMINI_SERVICE_ACCOUNT` environment variable is required to use Gemini AI features in UTD Clubs.

---

## Next Step

See [UI Libraries](UI-Libraries.md)

[^1]: Check out the documentation on [Next.JS's project structure](https://nextjs.org/docs/app/getting-started/project-structure).

[^2]: Next.JS runs server-side code using the Node.js runtime by default, which has all the regular APIs and bundler features you're used to. However, a file can be configured to use the [Edge runtime](https://nextjs.org/docs/app/api-reference/edge) instead by including `export const runtime = 'edge';` in the file.

[^3]: React has a feature called [Server Functions](https://react.dev/reference/rsc/server-functions), in which adding the [`'use server'`](https://react.dev/reference/rsc/use-server) directive at the top of a file creates server-side utility code that can be called by client components. However, because UTD Clubs instead uses tRPC and Tanstack Query, **you should not use React Server Functions.**

[^4]: Although UTD Clubs does have features that utilize the [Nebula API](https://www.utdnebula.com/projects/api), backend requests are handled using tRPC. UTD Clubs has its own backend, which is located in the same codebase.

[^5]: Logging in with Microsoft is intended for UTD Faculty/Staff. Additionally, visitors currently cannot create an account using an email and password; this is because UTD Clubs currently lacks a system to send emails, which makes email verification and password reset requests rather impossible to implement!
