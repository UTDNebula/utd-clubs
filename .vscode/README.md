# Recommended extensions and settings for VS Code

Although not required to work in this codebase, these settings and recommended extensions make coding a lot easier by adding IntelliSense code completion, inline linter warnings, and native formatter support.

## Getting started

To get started, install the recommend extensions by heading over to the **Extensions** panel on the left (or press `F1` and enter `view extensions`). Under the Recommended section, install the first three:

- [Tailwind CSS IntelliSense](vscode:extension/bradlc.vscode-tailwindcss) - Adds code completion for Tailwind's classes when adding `className` to React components.
- [ESLint](vscode:extension/dbaeumer.vscode-eslint) - Adds inline warnings and errors for immediate feedback on linting issues, rather than having to use `npm run lint`
- [Prettier - Code formatter](vscode:extension/esbenp.prettier-vscode) - Lets you [format when you save a file](vscode://settings/editor.formatOnSave), or when you use a hotkey (`shift + alt + f` by default)

Although VS Code may recommend other extensions, they are completely optional and up to you to figure out.

Workspace settings are automatically applied, so you don't have to do anything for these.

## What does each setting do?

```json
"files.associations": {
  "*.css": "tailwindcss",
  "*.module.css": "css"
},
```

The above setting ensures that you won't receive "Unknown at rule" warnings when working in CSS files, since Tailwind adds at rules. It also adds IntelliSense code completion for Tailwind.

NOTE: Tailwind is not active in [Next.JS CSS Modules](https://nextjs.org/docs/app/getting-started/css#css-modules), hence the `"*.module.css": "css"`

```json
"tailwindCSS.experimental.classRegex": [
  ["className\\s*:\\s*['\"]([^'\"]*)['\"]"]
],
```

The above setting ensures you receive IntelliSense code completion for Tailwind when customizing the interior slots of Material UI components. [This is recommended by MUI.](https://mui.com/material-ui/integrations/tailwindcss/tailwindcss-v4/#tailwind-css-intellisense-for-vs-code)

## What if I want to override this workspace with my own settings?

Instead of using JSON files in `.vscode/`, create a VS Code workspace by pressing `f1`, entering `save workspace as`, then choosing a location for your workspace file. Then, add your personal settings overrides to this configuration file (or customize your settings in the **Workspace** tab in VS Code's settings).

Now, anytime you want to work in this codebase, just open this workspace file and your personal settings will apply.

[More info on VS Code workspaces](https://code.visualstudio.com/docs/editing/workspaces/workspaces)
