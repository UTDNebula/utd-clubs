# Project Architecture

## Prerequisites

This page assumes you have a basic understanding of what HTML, CSS, and JavaScript are. If you haven't worked with these before, we highly recommend you read this page first before continuing: [HTML, CSS, and JavaScript](HTML,-CSS,-and-JavaScript.md)

## Overview

_Use the links in this section to navigate to our documentation for that item!_

UTD Clubs is a web application built using the [TypeScript](#typescript) programming language. For frontend development, UTD Clubs uses the [React](#react) JavaScript library. The backend of the project runs on [Node.js](#nodejs). Libraries/packages are managed using [NPM](#npm).

### Next.JS and SSR

UTD Clubs utilizes the App Router from [Next.JS](#nextjs) library to handle the difficult tasks needed for building the UTD Clubs web application. Next.JS automates the processes of building and serving the website, as well as generating page routes via the folder structure in the `src/app/` directory.

Next.JS utilizes a concept called server-side rendering (SSR). This means anytime a visitor opens a page on UTD Clubs, the backend server (using the Node.js runtime[^1]) will generate most of the content as HTML before sending it to the visitor's device, which then runs any code that must run on the client. SSR is done to improve loading times and the experience of users with older devices. Because of SSR plus the fact that UTD Clubs uses TypeScript for everything, many files might run on either the server or client.[^2]

### Client and Server Communication

Sometimes, code that runs on the client will need to communicate with the server.[^3] For example, when a visitor submits a form on the client, changes in the database must be run on the server. To allow this, UTD Clubs uses the [tRPC](#trpc) library, which abstracts away the creation of an internal API used only by UTD Clubs to communicate between the client and server.[^4]

To call the API provided by tRPC, developers should use the [Tanstack Query](#tanstack-query) library. This entails using the `useQuery()` hook in client-side React components. Tanstack Query provides features such as caching, maintaining "out of date" data, and query state metadata that it easier to create loading states and error messages.

### Backend and Database

UTD Clubs uses a **PostgreSQL** database to store all data related to clubs, users, events, accounts, etc. To avoid requiring developers to write SQL, UTD Clubs uses [Drizzle](#drizzle). This is an ORM (Object-Relational Mapping) library that allows developers to write TypeScript to query the database as well as define type-safe database schemas and relations. The database can only be accessed from code that runs on the server; i.e. React Client Components cannot call APIs that access the database.

UTD Clubs uses a codebase-first workflow rather than a database-first workflow. This means that schemas are defined in the codebase, and databases must be "migrated" to match the codebase's schemas. Drizzle provides tools for automatically generating and applying migrations.[^5]

The database for UTD Clubs is provided by **Neon**, which is a managed serverless PostgreSQL database platform. Drizzle connects to Neon via the `DATABASE_URL` environment variable. Neon provides a feature called database branches, which allows UTD Clubs to provide separate database (and thus separate data) between the different versions of UTD Clubs:

- **Production** - The `main` git branch, deployed on [`clubs.utdnebula.com`](https://clubs.utdnebula.com)
- **Development** - The `develop` git branch, deployed on [`dev.clubs.utdnebula.com`](https://dev.clubs.utdnebula.com)
- **Preview Deployments for PRs** - Each git branch (and by extension, pull requests) in the GitHub repository will automatically create a preview deployment and a database branch specifically for this branch. Example: [`clubs-7s68tk53e-utdnebula.vercel.app`](https://clubs-7s68tk53e-utdnebula.vercel.app) <!-- This example corresponds to the `develop` branch, so this URL shouldn't ever break -->
- **Local development branches** - Developers may request a database branch for testing schema changes from the Clubs Lead or Nebula Platform.

---

> [!NOTE]
> The following sections provide brief explanations for recruits about what each library/technology is and what it's used for. These sections won't provide any critical information about how to use each item, so feel free to skip ahead to the next page: [Project Structure](Project-Structure.md)

## List of Languages and Core Technologies

Programming languages, libraries, and software that are foundational to how `utd-clubs` works.

### TypeScript

- [Documentation](https://www.typescriptlang.org/docs) - Rather technical. We recommend learning as you go.
- [W3Schools Tutorial](https://www.w3schools.com/typescript/index.php)

TypeScript (TS) is the language we use for 99% of everything in `utd-clubs`. TypeScript looks nearly identical to JavaScript; in fact, all JS code is valid TS code! TypeScript code is compiled to JavaScript code when the project is built, which is handled automatically for `utd-clubs` by [Next.JS](#nextjs).

What's different about TypeScript, however, is that it adds static typing and type safety. This helps avoid crashes while the website is running. You can add a **type annotation** to a variable to explicitly declare what values that variable is allowed to have. For instance, the following explicitly states that the variable `name` can only be a string:

```ts
let name: string = 'John Doe';
```

TypeScript also lets you write **custom types**. For instance, the following explicitly states that the variable `color` can only be "red", "green", or "blue":

```ts
type Color = 'red' | 'green' | 'blue';
let color: Color = 'green';
```

Files written in TypeScript have the `.ts` file extension.

### React

- [Documentation](https://react.dev/reference/react) - Rather technical. We recommend learning as you go.
- [Official React tutorial](https://react.dev/learn)

For frontend development, we use the React JavaScript library. React uses **JSX**, which is a syntax extension that allows writing HTML-like code in JavaScript. It looks a lot like HTML, but there are a few small differences. React also makes creating user interfaces much easier with various other features:

- React lets you create **components**, which are basically custom reusable HTML tags (for example, we have a reusable `<BackButton />` component). Components are basically just functions that return JSX. You can also define **props** for each component, which are input attributes/parameters for that component's functions.
- React provides the ability to add **event handlers**, such as an `onClick` event that runs code anytime a button is clicked. Events will trigger a "render", in which all the code in your component will run again whenever it's refreshed on the user's screen.
- As a user interacts with UTD Clubs, the website may need to change to respond to their actions. React lets you **manage state** by using the `useState` hook.

React also has more advanced concepts such as `useEffect`, context, custom hooks, refs, memoization, and server components. You may come across these in the codebase, but you'll only need to know these concepts for more complex issues.

Files using JSX have the `.jsx` file extension (or the `.tsx` file extension if using TypeScript).

### Node.js

- [Installation](https://nodejs.org/en/download)

Normally, JavaScript is frontend code that runs on the client by the user's browser (whether that is Chrome, Firefox, Safari, etc.). Because UTD Clubs is a web application, we need to be able to run code on the server to handle account data, API fetching, and other sensitive stuff we don't want users to have access to. We use Node.js to run JavaScript (and TypeScript by extension) code on the server.

Although Node.js also provides tons of APIs, we only really use it to run our code. Check out our guide on installing Node.js in [Getting Started](Getting-Started.md).

### NPM

- [Package Directory](https://www.npmjs.com)

The Node Package Manager (NPM) is installed automatically whenever you install [Node.js](#nodejs). It manages every library used in UTD Clubs via the `package.json` file and makes it easy to install everything you need using a single terminal command: `npm install`

We also utilize NPM scripts, which makes it easy for you to run common tasks without memorizing a long and complicated terminal command. You may have seen terminal commands that look like `npm run ...` in [Getting Started](Getting-Started.md); these are scripts! For a full list of every NPM script in `utd-clubs`, check out [NPM Scripts](NPM-Scripts.md).

## List of Major Libraries

All the major libraries/packages that make `utd-clubs` work.

### Next.JS

- [Documentation](https://nextjs.org/docs)

A full-stack framework for React that makes building web applications much easier. UTD Clubs uses Next.JS's App Router, which handles page routing, faster page navigation loading, and much more.

- The `src/app/` directory maps files and folders to the routes in the Clubs website. For example, `src/app/page.tsx` maps to the [homepage](https://clubs.utdnebula.com) and `src/app/club-match/page.tsx` maps to the [club match](https://clubs.utdnebula.com/club-match) page. [_...more info_](https://nextjs.org/docs/app/getting-started/project-structure)
- Next.JS handles running files/components either on the client (the device of the user accessing the website) or the server (our backend). This is incredibly useful for caching and server-side rendering, which generally improves how fast the website loads. [_...more info_](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- The `public/` directory contains images and resources that are made available by Next.JS to the website. [_...more info_](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder)

We also use Next.JS for several other things, including: [SEO metadata](https://nextjs.org/docs/app/getting-started/metadata-and-og-images), [Open Graph preview images](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image), [prefetching](https://nextjs.org/docs/app/getting-started/linking-and-navigating#prefetching), [API route handling](https://nextjs.org/docs/app/getting-started/route-handlers), and [deployment](https://nextjs.org/docs/app/getting-started/deploying). These are features you generally don't need to worry about unless you're specifically working on an issue for one of them.

### Tailwind CSS

- [Documentation](https://tailwindcss.com/docs/styling-with-utility-classes)

A frontend library that lets you write CSS using just [HTML classes](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/class). Throughout the codebase, you may see stuff like:

```html
<div className="h-4 w-fit px-6 bg-white dark:bg-black"></div>
```

These are HTML classes automatically generated by Tailwind! In the above example, you are specifying a div with a height of 4 units (equivalent to `16px`), a width of `fit-content`, horizontal padding of 6 units (`24px`), and a default background color of `white` that changes to `black` in dark mode. This would be equivalent to the following CSS:

```css
height: 16px;
width: fit-content;
padding-inline: 24px;
background-color: white;
@media (prefers-color-scheme: dark) {
  background-color: black;
}
```

Obviously, Tailwind is a lot more concise! To learn more about Tailwind, we recommend checking out their [official documentation](https://tailwindcss.com/docs/styling-with-utility-classes).

### Material UI (MUI)

- [Documentation](https://mui.com/material-ui/all-components)

Material UI (MUI, pronounced letter-by-letter) provides pre-built React components for such as buttons, icons, text fields, tooltips, dialogs, and a lot more. The design of MUI is based on [Material Design 2](https://m2.material.io), which is a design system by Google used for Android.

### tRPC

- [Documentation](https://trpc.io/docs)

<!-- TODO -->

### Tanstack Query

- Documentation: [Getting Started](https://tanstack.com/query/latest/docs/framework/react/overview) | [Guides](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults) | [API Reference](https://tanstack.com/query/latest/docs/framework/react/reference/index)

<!-- TODO -->

### Drizzle

- [Documentation](https://orm.drizzle.team/docs/overview)
  - [Schema](https://orm.drizzle.team/docs/sql-schema-declaration) - See the "What's next?" section at the bottom of the page
    - [Relations](https://orm.drizzle.team/docs/relations-schema-declaration)
  - [Data Querying](https://orm.drizzle.team/docs/data-querying) - See the "What's next?" section at the bottom of the page
  - [Migrations](https://orm.drizzle.team/docs/migrations) & [Drizzle Kit](https://orm.drizzle.team/docs/kit-overview) - See our documentation on [Database Migrations](Database-Migrations.md)

<!-- TODO -->

---

## Next Step

See [Project Structure](Project-Structure.md)

[^1]: Next.JS runs server-side code using the Node.js runtime by default. However, a file can be configured to use the [Edge runtime](https://nextjs.org/docs/app/api-reference/edge) instead by including `export const runtime = 'edge';` in the file.

[^2]: By default, Next.JS runs everything on the server as [React Server Components](https://react.dev/reference/rsc/server-components) (RSC). To create a React component that runs on the client, a file must have the [`'use client'`](https://react.dev/reference/rsc/use-client) directive at the very top. This also makes any code that file imports (e.g. utility functions, other React components) run on the client. It also enables interactivity with React via event handlers and most hooks, so you will see this directive used quite often in the UTD Clubs codebase.

[^3]: React has a feature called [Server Functions](https://react.dev/reference/rsc/server-functions), in which adding the [`'use server'`](https://react.dev/reference/rsc/use-server) directive at the top of a file creates server-side utility code that can be called by client components. However, because UTD Clubs instead uses tRPC and Tanstack Query, **you should not use React Server Functions.**

[^4]: Although UTD Clubs does have features that utilize the [Nebula API](https://www.utdnebula.com/projects/api), backend requests are handled using tRPC. The frontend and backend for UTD Clubs are located in the same codebase.

[^5]: For information about how to generate and apply database migrations, see [Database Migrations](Database-Migrations.md).
