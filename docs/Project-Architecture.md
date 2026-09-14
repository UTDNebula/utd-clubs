# Project Architecture

## Prerequisites

This page assumes you have a basic understanding of what HTML, CSS, and JavaScript are. If you haven't worked with these before, we highly recommend you read this page first before continuing: [HTML, CSS, and JavaScript](HTML,-CSS,-and-JavaScript.md)

## Overview

_Use the links in this section to navigate to our documentation for that item!_

UTD Clubs is a web application built using the [**TypeScript**](Languages-and-Fundamental-Technologies.md#typescript) programming language. For frontend development, UTD Clubs uses the [**React**](Languages-and-Fundamental-Technologies.md#react) JavaScript library. The backend of the project runs on [**Node.js**](Languages-and-Fundamental-Technologies.md#nodejs). Libraries/packages are managed using [**NPM**](Languages-and-Fundamental-Technologies.md#npm).

- **Web Framework** - UTD Clubs utilizes the App Router from the [**Next.JS**](Core-Libraries.md#nextjs) library to handle the difficult tasks for creating a web application. Next.JS automates the process of building and serving the website by generating page routes via the folder structure in the `src/app/` directory.

- **Client/server communication** - The [**tRPC**](Core-Libraries.md#trpc) library is used to allow the client to communicate with the server by creating an internal API of server-side procedures. Developers call this API using the client-side [**Tanstack Query**](Core-Libraries.md#tanstack-query) library.

- **Database and Nebula API** - Server-side procedures often access the **PostgreSQL** database that UTD Clubs uses. To avoid requiring developers to write SQL, developers use the [**Drizzle**](Core-Libraries.md#drizzle) ORM library to interact with the database. Server-side procedures may occasionally utilize the [**Nebula API**](Languages-and-Fundamental-Technologies.md#nebula-api) for file storage and email sending.

- **Account authentication** - Several features in UTD Clubs require an account to use. The [**Better Auth**](Core-Libraries.md#better-auth) framework handles account authentication, allowing users to sign in using Google, Discord, or Microsoft.[^6]

- **UI Components** - UTD Clubs loosely follows the **Google's Material Design** guidelines for UI/UX. The [**MUI**](UI-Libraries.md#material-ui-mui) library provides reusable React components, utilities, and icons that follow these guidelines. For more specialized components shared across Nebula Labs' other projects, the [**Nebula Library**](UI-Libraries.md#nebula-library) also provides reusable React components.

  Additionally, for special UI components where the foundational components of MUI are lacking, UTD Clubs also uses the following UI libraries:
  - [**MUI X**](UI-Libraries.md#mui-x) for its date/time pickers and data grid table components
  - [**Syncfusion**](UI-Libraries.md#syncfusion) for its calendar component
  - [**Tanstack Form**](UI-Libraries.md#tanstack-form) for handling forms
  - [**Tanstack Table**](UI-Libraries.md#tanstack-table) for additional table components
  - [**Motion**](UI-Libraries.md#motion) for building animated user interfaces
  - [**dnd kit**](UI-Libraries.md#dnd-kit) for utilities related to drag-and-drop interfaces

- **Utilities** - UTD Clubs uses the [**Zod**](Utility-and-Code-Quality-Libraries.md#zod) library to define schemas, parse, and validate inputted data into the tRPC API, form responses, and URL query parameters. The [**date-fns**](Utility-and-Code-Quality-Libraries.md#date-fns) library provides useful function for working with date/time in JavaScript. The [**Zustand**](Utility-and-Code-Quality-Libraries.md#zustand) library provides state management tools that make passing state in React much easier.

- **Code Quality** - To ensure the UTD Clubs codebase follows good practices and remains readable to future developers, the following libraries are used:
  - [**Prettier**](Utility-and-Code-Quality-Libraries.md#prettier) formats code to maintain a consistent style
  - [**ESLint**](Utility-and-Code-Quality-Libraries.md#eslint) catches problems with poorly written code
  - [**Jest**](Utility-and-Code-Quality-Libraries.md#jest) runs unit tests to ensure code works as expected
  - [**Sentry**](Utility-and-Code-Quality-Libraries.md#sentry) detects errors in production and allows website visitors to report bugs

---

## Next Step

See [Project Structure](Project-Structure.md)
