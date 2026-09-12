# Project Architecture

## Prerequisites

This page assumes you have a basic understanding of what HTML, CSS, and JavaScript are. If you haven't worked with these before, we highly recommend you read this page first before continuing: [HTML, CSS, and JavaScript](HTML,-CSS,-and-JavaScript.md)

## Overview

_Use the links in this section to navigate to our documentation for that item!_

UTD Clubs is a web application built using the [**TypeScript**](Languages-and-Core-Technologies.md#typescript) programming language. For frontend development, UTD Clubs uses the [**React**](Languages-and-Core-Technologies.md#react) JavaScript library. The backend of the project runs on [**Node.js**](Languages-and-Core-Technologies.md#nodejs). Libraries/packages are managed using [**NPM**](Languages-and-Core-Technologies.md#npm).

### Full-stack Concepts

The following are concepts that are considered neither front-end nor back-end, as they run on both the client and server.

#### Next.JS and SSR

UTD Clubs utilizes the App Router from [**Next.JS**](Fullstack-Libraries.md#nextjs) library to handle the difficult tasks needed for building the UTD Clubs web application. Next.JS automates the processes of building and serving the website, as well as generating page routes via the folder structure in the `src/app/` directory.

Next.JS utilizes a concept called server-side rendering (SSR). This means anytime a visitor opens a page on UTD Clubs, the backend server (using the Node.js runtime[^1]) will generate most of the content as HTML before sending it to the visitor's device, which then runs any code that must run on the client. SSR is done to improve loading times and the experience of users with older devices. Because of SSR plus the fact that UTD Clubs uses TypeScript for everything, many files might run on either the server or client.[^2]

#### Client and Server Communication

Sometimes, code that runs on the client will need to communicate with the server.[^3] For example, when a visitor submits a form on the client, changes in the database must be run on the server. To allow this, UTD Clubs uses the [**tRPC**](Backend-Libraries.md#trpc) library, which abstracts away the creation of an internal API used only by UTD Clubs to communicate between the client and server.[^4]

To call the API provided by tRPC, developers should use the [**Tanstack Query**](Frontend-Libraries.md#tanstack-query) library. This entails using the `useQuery()` hook in client-side React components. Tanstack Query provides features such as caching, maintaining "out of date" data, and query state metadata that it easier to create loading states and error messages.

### Back-end Concepts

The following are concepts about features that run primarily on the server.

#### Database

UTD Clubs uses a **PostgreSQL** database to store all data related to clubs, users, events, accounts, etc. To avoid requiring developers to write SQL, UTD Clubs uses [**Drizzle**](Backend-Libraries.md#drizzle). This is an ORM (Object-Relational Mapping) library that allows developers to write TypeScript to query the database as well as define type-safe database schemas and relations. The database can only be accessed from code that runs on the server; i.e. React Client Components cannot call APIs that access the database.

UTD Clubs uses a codebase-first workflow rather than a database-first workflow. This means that schemas are defined in the codebase, and databases must be "migrated" to match the codebase's schemas. Drizzle provides tools for automatically generating and applying migrations.[^5]

The database for UTD Clubs is provided by **Neon**, which is a managed serverless PostgreSQL database platform. Drizzle connects to Neon via the `DATABASE_URL` environment variable. Neon provides a feature called database branches, which allows UTD Clubs to provide separate database (and thus separate data) between the different versions of UTD Clubs:

- **Production** - The `main` git branch, deployed on [`clubs.utdnebula.com`](https://clubs.utdnebula.com)
- **Development** - The `develop` git branch, deployed on [`dev.clubs.utdnebula.com`](https://dev.clubs.utdnebula.com)
- **Preview Deployments for PRs** - Each git branch (and by extension, pull requests) in the GitHub repository will automatically create a preview deployment and a database branch specifically for this branch. Example: [`clubs-7s68tk53e-utdnebula.vercel.app`](https://clubs-7s68tk53e-utdnebula.vercel.app) <!-- This example corresponds to the `develop` branch, so this URL shouldn't ever break -->
- **Local development branches** - Developers may request a database branch for testing schema changes from the Clubs Lead or Nebula Platform.

#### Account Authentication

Several features in UTD Clubs require an account to use. The [**Better Auth**](Fullstack-Libraries.md#better-auth) framework handles account authentication by integrating with the following social providers: Google, Discord, and Microsoft. This means that visitors of UTD Clubs can log in using either their Google, Discord, and Microsoft account.[^6] Better Auth integrates with Drizzle to store account data in the database.

To connect to each social platform, Nebula Labs leadership must request oAuth2 client IDs and secrets from the corresponding social platform. These client IDs and secrets must be provided in the environment variables whenever UTD Clubs is deployed; otherwise, account authentication fails and visitors are unable to sign in.

#### Nebula API

Although UTD Clubs has its own backend, some features utilize the [**Nebula API**](Languages-and-Core-Technologies.md#nebula-api), which is another project by Nebula Labs. Currently, UTD Clubs only uses the Nebula API's ability to provide file storage. This is used to allow club managers to upload logos and banner images for their clubs, as well as banner images for events. Whenever a user uploads an image, the Nebula API returns a URL corresponding to that image, which is stored in UTD Club's database.

### Front-end Concepts

The following are concepts related to UI and interacting with users of UTD Clubs.

#### Nebula Library

As a project of Nebula Labs, UTD Clubs has a similar design language to other Nebula Labs projects. To facilite collaboration between projects, the [**Nebula Library**](Languages-and-Core-Technologies.md#nebula-library) provides shared reusable React components. These components have been built in a way that makes them independent of any specific project.

#### Material Design

The UI design style of UTD Clubs loosely follows **Google's Material Design**. UTD Clubs combines concepts from both Material 2 and Material 3. [**MUI**](Frontend-Libraries.md#material-ui-mui) is the library used to provide pre-built React components that follow Material Design. MUI also provides Google's older **Material Icons** as React components.

---

## Next Step

See [Project Structure](Project-Structure.md)

[^1]: Next.JS runs server-side code using the Node.js runtime by default. However, a file can be configured to use the [Edge runtime](https://nextjs.org/docs/app/api-reference/edge) instead by including `export const runtime = 'edge';` in the file.

[^2]: By default, Next.JS runs everything on the server as [React Server Components](https://react.dev/reference/rsc/server-components) (RSC). To create a React component that runs on the client, a file must have the [`'use client'`](https://react.dev/reference/rsc/use-client) directive at the very top. This also makes any code that file imports (e.g. utility functions, other React components) run on the client. It also enables interactivity with React via event handlers and most hooks, so you will see this directive used quite often in the UTD Clubs codebase.

[^3]: React has a feature called [Server Functions](https://react.dev/reference/rsc/server-functions), in which adding the [`'use server'`](https://react.dev/reference/rsc/use-server) directive at the top of a file creates server-side utility code that can be called by client components. However, because UTD Clubs instead uses tRPC and Tanstack Query, **you should not use React Server Functions.**

[^4]: Although UTD Clubs does have features that utilize the [Nebula API](https://www.utdnebula.com/projects/api), backend requests are handled using tRPC. The frontend and backend for UTD Clubs are located in the same codebase.

[^5]: For information about how to generate and apply database migrations, see [Database Migrations](Database-Migrations.md).

[^6]: Logging in with Microsoft is intended for UTD Faculty/Staff. Additionally, visitors currently cannot create an account using an email and password; this is because UTD Clubs currently lacks a system to send emails, which makes email verification and password reset requests rather impossible to implement!
