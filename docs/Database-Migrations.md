# Database Migration Guide

Guide to how to perform database migrations to integrate with our ci/cd pipeline and for consistency.
It can be simplified to generating a new migration and then applying that new migration.

## generate migrations

For generating migrations there are 2 cases:

### Simple migrations

If you are

- adding columns/tables
- removing columns/tables
- renaming columns/tables

then run `npm run drizzle:generate` to generate a new migration

### Complex migrations

If your database change involves changing the form of data that already exists, the most likely cases would be reformatting data or changing it's data type, to do this you can do `npx drizzle-kit generate --custom --name=migration-name` and then put the migration in the new SQL file. In the future drizzle will support doing this with typescript and this documentation will be updated to reflect that.

For more info read [here](https://orm.drizzle.team/docs/kit-custom-migrations)

## Applying the migration

To apply the migration please just run `npm run drizzle:migrate`.
A branch can be provided to you in order to test your database changes.

# Troubleshooting

This is a new system, if you encounter problems or have questions reach out in the discord.
