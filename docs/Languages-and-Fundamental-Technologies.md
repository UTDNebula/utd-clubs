# List of Languages and Fundamental Technologies in UTD Clubs

Programming languages and software that are foundational to making `utd-clubs` work.

## TypeScript

- [Documentation](https://www.typescriptlang.org/docs) - Rather technical. We recommend learning as you go.
- [W3Schools Tutorial](https://www.w3schools.com/typescript/index.php)

TypeScript (TS) is the language we use for 99% of everything in `utd-clubs`. TypeScript looks nearly identical to JavaScript; in fact, all JS code is valid TS code! TypeScript code is compiled to JavaScript code when the project is built, which is handled automatically for `utd-clubs` by [Next.JS](Core-Libraries.md#nextjs).

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

## React

- [Documentation](https://react.dev/reference/react) - Rather technical. We recommend learning as you go.
- [Official React tutorial](https://react.dev/learn)

For frontend development, we use the React JavaScript library. React uses **JSX**, which is a syntax extension that allows writing HTML-like code in JavaScript. It looks a lot like HTML, but there are a few small differences. React also makes creating user interfaces much easier with various other features:

- React lets you create **components**, which are basically custom reusable HTML tags (for example, we have a reusable `<BackButton />` component). Components are basically just functions that return JSX. You can also define **props** for each component, which are input attributes/parameters for that component's functions.
- React provides the ability to add **event handlers**, such as an `onClick` event that runs code anytime a button is clicked. Events will trigger a "render", in which all the code in your component will run again whenever it's refreshed on the user's screen.
- As a user interacts with UTD Clubs, the website may need to change to respond to their actions. React lets you **manage state** by using the `useState` hook.

React also has more advanced concepts such as `useEffect`, context, custom hooks, refs, memoization, and server components. You may come across these in the codebase, but you'll only need to know these concepts for more complex issues.

Files using JSX have the `.jsx` file extension (or the `.tsx` file extension if using TypeScript).

## Node.js

- [Installation](https://nodejs.org/en/download)

Normally, JavaScript is frontend code that runs on the client by the user's browser (whether that is Chrome, Firefox, Safari, etc.). Because UTD Clubs is a web application, we need to be able to run code on the server to handle account data, API fetching, and other sensitive stuff we don't want users to have access to. We use Node.js to run JavaScript (and TypeScript by extension) code on the server.

Although Node.js also provides tons of APIs, we only really use it to run our code. Check out our guide on installing Node.js in [Getting Started](Getting-Started.md).

## NPM

- [Package Directory](https://www.npmjs.com)

The Node Package Manager (NPM) is installed automatically whenever you install [Node.js](#nodejs). It manages every library used in UTD Clubs via the `package.json` file and makes it easy to install everything you need using a single terminal command: `npm install`

We also utilize NPM scripts, which makes it easy for you to run common tasks without memorizing a long and complicated terminal command. You may have seen terminal commands that look like `npm run ...` in [Getting Started](Getting-Started.md); these are scripts! For a full list of every NPM script in `utd-clubs`, check out [NPM Scripts](NPM-Scripts.md).

## Nebula API

- [Documentation](https://api.utdnebula.com/swagger/index.html)
- [Website](https://www.utdnebula.com/projects/api)

<!-- TODO -->
