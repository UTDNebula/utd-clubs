# Troubleshooting

This guide provides fast, actionable solutions to common issues encountered when running or developing `utd-clubs`.

## Potential issues

### Error: `Invalid environment variables`

![Next.JS error about invalid environment variables](assets/invalid-env-vars.png)

**Cause:** You are missing the listed environment variables in `.env`, or the variable is set to an invalid value.

**Solution:**

- Ensure you have copied `.env.example` to `.env`

  ```bash
  cp .env.example .env
  ```

  Then, fill in all the environment variables that are listed in the error message.

### TypeScript types, CSS, Live reload, and/or the cache are not updating

**Cause:** Your cache is outdated but Next.JS isn't updating it correctly

**Solution:**

- Try running the following command in your terminal:

  ```bash
  npm run clean
  ```

  This will delete the `.next/` folder and `next-env.d.ts` file that are generated whenever Next.JS is running, as well as the `tsconfig.tsbuildinfo` that is generated when TypeScript type checks are run. Don't worry, you won't lose any data doing this.

### There are red squiggles in my TypeScript imports

**Cause:** Some NPM packages are missing or couldn't be found

**Solutions:**

- Install your NPM packages. Try running the following command in your terminal:

  ```bash
  npm install
  ```

  We might have added or updated some packages recently, so you make sure you're all up to date.

- Try running the following command in your terminal:

  ```bash
  npm run clean
  ```

  This will delete `.next/`, `next-env.d.ts`, and `tsconfig.tsbuildinfo`. Occasionally, these contain cached data that refuse to update and it's best to just start fresh.

- Try deleting the entire `node_modules/` folder, then running `npm install` in your terminal again. This will take a while, but sometimes a fresh install is what you need.

---

## Still Stuck?

Reach out to the team on [Discord](https://discord.utdnebula.com)!
