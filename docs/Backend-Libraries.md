# List of Backend Libraries

## Drizzle

- [Documentation](https://orm.drizzle.team/docs/overview)
  - [Schema](https://orm.drizzle.team/docs/sql-schema-declaration) - See the "What's next?" section at the bottom of the page
    - [Relations](https://orm.drizzle.team/docs/relations-schema-declaration)
  - [Data Querying](https://orm.drizzle.team/docs/data-querying) - See the "What's next?" section at the bottom of the page
  - [Migrations](https://orm.drizzle.team/docs/migrations) & [Drizzle Kit](https://orm.drizzle.team/docs/kit-overview) - See our documentation on [Database Migrations](Database-Migrations.md)

UTD Clubs uses a **PostgreSQL** database to store all data related to clubs, users, events, accounts, etc. To avoid requiring developers to write SQL, UTD Clubs uses [**Drizzle**](Backend-Libraries.md#drizzle). This is an ORM (Object-Relational Mapping) library that allows developers to write TypeScript to query the database as well as define type-safe database schemas and relations. The database can only be accessed from code that runs on the server; i.e. React Client Components cannot call APIs that access the database.

UTD Clubs uses a codebase-first workflow rather than a database-first workflow. This means that schemas are defined in the codebase, and databases must be "migrated" to match the codebase's schemas. Drizzle provides tools for automatically generating and applying migrations.[^5]

The database for UTD Clubs is provided by **Neon**, which is a managed serverless PostgreSQL database platform. Drizzle connects to Neon via the `DATABASE_URL` environment variable. Neon provides a feature called database branches, which allows UTD Clubs to provide separate database (and thus separate data) between the different versions of UTD Clubs:

- **Production** - The `main` git branch, deployed on [`clubs.utdnebula.com`](https://clubs.utdnebula.com)
- **Development** - The `develop` git branch, deployed on [`dev.clubs.utdnebula.com`](https://dev.clubs.utdnebula.com)
- **Preview Deployments for PRs** - Each git branch (and by extension, pull requests) in the GitHub repository will automatically create a preview deployment and a database branch specifically for this branch. Example: [`clubs-7s68tk53e-utdnebula.vercel.app`](https://clubs-7s68tk53e-utdnebula.vercel.app) <!-- This example corresponds to the `develop` branch, so this URL shouldn't ever break -->
- **Local development branches** - Developers may request a database branch for testing schema changes from the Clubs Lead or Nebula Platform.

<!-- TODO -->

[^5]: For information about how to generate and apply database migrations, see [Database Migrations](Database-Migrations.md).
