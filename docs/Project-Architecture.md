# Project Architecture

## Prerequisites

This page assumes you have a basic understanding of what HTML, CSS, and JavaScript are. If you haven't worked with these before, we highly recommend you read this page first before continuing: [HTML, CSS, and JavaScript](HTML,-CSS,-and-JavaScript.md)

## Overview

_Use the links in this section to navigate to our documentation for that item!_

UTD Clubs is a web application built using the [**TypeScript**](Languages-and-Core-Technologies.md#typescript) programming language. For frontend development, UTD Clubs uses the [**React**](Languages-and-Core-Technologies.md#react) JavaScript library. The backend of the project runs on [**Node.js**](Languages-and-Core-Technologies.md#nodejs). Libraries/packages are managed using [**NPM**](Languages-and-Core-Technologies.md#npm).

- **Next.JS** - UTD Clubs utilizes the App Router from the [**Next.JS**](Fullstack-Libraries.md#nextjs) library to handle the difficult tasks for creating a web application. Next.JS automates the process of building and serving the website by generating page routes via the folder structure in the `src/app/` directory.

- **Client/server communication** - The [**tRPC**](Fullstack-Libraries.md#trpc) library is used to allow the client to communicate with the server by creating an internal API of server-side procedures. Developers call this API using the client-side [**Tanstack Query**](Frontend-Libraries.md#tanstack-query) library.

- **Database and Nebula API** - Server-side procedures often access the **PostgreSQL** database that UTD Clubs uses. To avoid requiring developers to write SQL, developers use the [**Drizzle**](Backend-Libraries.md#drizzle) ORM library to interact with the database. Server-side procedures may occasionally utilize the [**Nebula API**](Languages-and-Core-Technologies.md#nebula-api) for file storage and email sending.

- **Account authentication** - Several features in UTD Clubs require an account to use. The [**Better Auth**](Fullstack-Libraries.md#better-auth) framework handles account authentication, allowing users to sign in using Google, Discord, or Microsoft.[^6]

- **UI Components** - UTD Clubs loosely follows the **Google's Material Design** guidelines for UI/UX. The [**MUI**](Frontend-Libraries.md#material-ui-mui) library provides reusable React components, utilities, and icons that follow these guidelines. For more specialized components shared across Nebula Labs' other projects, the [**Nebula Library**](Languages-and-Core-Technologies.md#nebula-library) also provides reusable React components.

  Additionally, for special UI components where the foundational components of MUI are lacking, UTD Clubs also uses the following UI libraries:
  - [**MUI X**](Frontend-Libraries.md#mui-x) for its date/time pickers and data grid table components
  - [**Syncfusion**](Frontend-Libraries.md#syncfusion) for its calendar component
  - [**Tanstack Form**](Frontend-Libraries.md#tanstack-form) for handling forms
  - [**Tanstack Table**](Frontend-Libraries.md#tanstack-table) for additional table components
  - [**Motion**](Frontend-Libraries.md#motion) for building animated user interfaces
  - [**dnd kit**](Frontend-Libraries.md#dnd-kit) for utilities related to drag-and-drop interfaces

- **Utilities** - UTD Clubs uses the **Zod** library to define schemas, parse, and validate inputted data into the tRPC API, form responses, and URL query parameters. The **date-fns** library provides useful function for working with date/time in JavaScript. The **Zustand** library provides state management tools that make passing state in React much easier.

- **Code Quality** - To ensure the UTD Clubs codebase follows good practices and remains readable to future developers, the following libraries are used:
  - **Prettier** formats code to maintain a consistent style
  - **ESLint** catches problems with poorly written code
  - **Jest** runs unit tests to ensure code works as expected
  - **Sentry** detects errors in production and allows visitors to report bugs

---

## Next Step

See [Project Structure](Project-Structure.md)
