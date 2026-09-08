# Database Migration Guide

## Background

UTD Clubs uses a **PostgreSQL** database to store all our data related to clubs, users, events, etc. To avoid having to write SQL code, we use [Drizzle](Project-Architecture.md#drizzle), which is an ORM library that provides useful features such as TypeScript type safety and schema definitions.

UTD Clubs uses a **codebase-first workflow** rather than a database-first workflow. This means that schemas are defined in the codebase, and databases must be "migrated" to match the codebase's schemas. Drizzle also provides tools for automatically generating and applying migrations, which is what this page discusses.

## Overview

When changing the database schemas (that is, any file in the `src/server/db/schema/` directory), it is almost guaranteed that you'll need to update the backend database to match the changes you made to the schema. To do this, you'll generate a migration using Drizzle, which integrates with our CI/CD pipeline to ensure changes are automatically applied when the PR with your schema changes is merged.

The migrationi process consists of two steps:

1. [Generating a new migration](#generating-migrations)
2. [Applying that migration](#applying-the-migration)

## Generating Migrations

For generating migrations, there are two cases:

- [Simple migrations](#a-simple-migrations)
- [Complex migrations](#b-complex-migrations)

### A) Simple migrations

If you are...

- adding columns/tables
- removing columns/tables
- renaming columns/tables

...then you can just generate a new migration with this terminal command:

```bash
npm run drizzle:generate
```

### B) Complex migrations

If your database change involves changing the form of data that already exists (such as reformatting data or changing its data type), you will have to create a custom migration.

To do this, follow these steps:

1. Run the following terminal command (replace `<migration-name>` with a description of the changes in `snake-case`):

   ```bash
   npx drizzle-kit generate --custom --name=<migration-name>
   ```

2. This will generate a new `.sql` file at the bottom of the `src/server/db/migrations/` directory. Locate this file and open it.
3. Write SQL code that will alter the database in a way that matches your schema changes.
   - For more info, check out Drizzle's documentation on [Custom Migrations](https://orm.drizzle.team/docs/kit-custom-migrations)
   - In the future, Drizzle will support creating custom migrations with TypeScript. When they do, this documentation will be updated to reflect that.

## Applying the Migration

> [!WARNING]
> Some changes (such as removing/renaming a column/table) will give you the following unfortunate side effects:
>
> - If you are working on multiple PRs or branches, the database with the applied migrations will become incompatible with those other PRs/branches where the schema changes weren't made.
> - If you are using the shared development branch for the `DATABASE_URL` variable in `.env` and apply the migration, the development branch database will become incompatible with other people's PRs/branches.
>
>   **Please do not apply migrations to the shared database development branch (until your PR is merged)!**
>
> To avoid these issues, please request a database branch from your project lead or Nebula Platform. You'll be provided with a `DATABASE_URL`, which you should add to `.env`. **Only at this point should you apply the migration!**

To apply the migration to the database configured in your `.env`, just run this terminal command:

```bash
npm run drizzle:migrate
```

> [!CAUTION]
> Applying a migration will permanently modify the database you have configured in your `.env`. If you removed columns/tables, data will be permanently lost.

## Troubleshooting

### How do I know if my migration was applied?

To check if the database matches the codebase's schemas, you can run the following terminal command:

```bash
npm run drizzle:check
```

Alternatively, if you'd like to manually verify everything is working, you can view and modify the database using Drizzle Studio GUI. You can access this by running the following terminal command:

```bash
npm run drizzle:studio
```

Then, navigate to this URL: [local.drizzle.studio](https://local.drizzle.studio).

### Migration conflicts

Annoyingly, Drizzle uses an incremental ID to keep track of whether a migration has been applied. This means there there may be Git conflicts as multiple PRs with migrations are merged. If this happens, please let us know on [Discord](https://discord.gg/xMpMtm8C8b) or let your project lead know.

- Drizzle will resolve this issue when Drizzle v1 is released. When they do, this documentation will be updated to reflect that. [...more info](https://discord.gg/xMpMtm8C8b)
