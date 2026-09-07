# Project Architecture

## Prerequisites

This page assumes you have a basic understanding of what HTML, CSS, and JavaScript are. If you haven't worked with these before, we highly recommend you read this page first before continuing: [HTML, CSS, and JavaScript](HTML,-CSS,-and-JavaScript.md)

## Overview

_Use the links below to navigate to our documentation for that item!_

UTD Clubs is a web application built using the [TypeScript](#typescript) (TS) programming language. For frontend development, we use the [React](#react) JavaScript library. The backend of the project runs on [Node.js](#nodejs). Libraries/packages are managed using [NPM](#npm).

One notable library used in `utd-clubs` is Next.JS, which

---

## Languages and Core Technologies

Programming languages, libraries, and software that are foundational to how `utd-clubs` works.

### TypeScript

- [Documentation](https://www.typescriptlang.org/docs) - Rather technical. We recommend learning as you go.
- [W3Schools Tutorial](https://www.w3schools.com/typescript/index.php)

TypeScript is the language we use for 99% of everything in `utd-clubs`. TypeScript looks nearly identical to JavaScript; in fact, all JS code is valid TS code! TypeScript code is compiled to JavaScript code when the project is built, which is handled automatically for `utd-clubs` by [Next.JS](#nextjs).

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

The Node Package Manager (NPM) is installed automatically whenever you install [Node.js](#nodejs). It manages every library used in UTD Clubs via the `package.json` file and makes it easy to install everything you need using a single terminal command.

We also utilize NPM scripts, which makes it easy for you to run common tasks without memorizing a long and complicated terminal command. You may have seen terminal commands that look like `npm run ...` in [Getting Started](Getting-Started.md); these are scripts! For a full list of every NPM script in `utd-clubs`, check out [NPM Scripts](NPM-Scripts.md).

## Libraries

List of the major libraries/packages that make `utd-clubs` work.

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

---

## Next Step

See [Project-Structure.md](Project-Structure.md)
