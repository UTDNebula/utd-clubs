# Jupiter

_A tool to find ways to get involved on campus._

## Contributing

We are always open to contributions to the project. If you would like to contribute and want some guidance on where to start,
please join our [Discord](http://discord.utdnebula.com/) and ask for drop a message in the `#jupiter-chat` channel or
DM Ruben for more details.

Currently, we're tracking all issues via GitHub Issues. If you would like to work on an issue, please comment on the issue and we will assign it to you.
If you see anything that you think could be improved, please create an issue and we will look into it.

### Getting Started

Please make sure you have at least [NodeJS v18.0.0](https://nodejs.org/en) or greater installed before continuing.

Start by cloning the repository to your local machine.

```bash
git clone https://github.com/UTDNebula/jupiter.git
```

Next, navigate to the project directory and install the dependencies.

```bash
cd jupiter
npm install
```

Make sure you have a `.env` file in the root of the project. If you do not, copy the `.env.example` file and rename it to `.env`

#### Environment Variables

This project uses [NextAuth](https://next-auth.js.org/) for authentication. NextAuth, with their built-in [providers](https://next-auth.js.org/providers/), makes it easy for users to use preexisting logins. Currently, we are using Discord and Google as OAuth Providers, so you will need to create a Client ID and Client Secret for [Google](https://next-auth.js.org/providers/google) and [Discord](https://next-auth.js.org/providers/discord) respectively (or remove the providers if you'd like).

Once you have your Client ID and Client Secrets, add them to your `.env` file.

The `NEXTAUTH_URL` variable should be set to `http://localhost:3000` for local development.
The `NEXTAUTH_SECRET` variable should be set to a random string of characters. You can generate one [here](https://randomkeygen.com/).
or by running the following command in your terminal.

```bash
openssl rand -hex 32
```

Jupiter uses an ORM called [Drizzle](https://orm.drizzle.team/) to interact with the database. In order to connect to the database, you will need to add the `DATABASE_URL` variable to your `.env` file.

We're using Supabase as our database provider. You can create a supabase account [here](https://supabase.io/). Once you have created an account, you can create a new project and add the `DATABASE_URL` to your `.env` file. From a Supabase project, you can find the `DATABASE_URL` by navigating to the `Settings` tab and clicking on the `Database` tab.

The Nebula API is used for image storage. The `NEBULA_API_URL` variable should be set to `https://api.utdnebula.com/` and an API key should be requested from the project lead for the `NEBULA_API_KEY` variable.

#### Database Migrations

In your SQL editor, you will have to run a couple commands in order to properly set up the database

<details>
<summary>Nanoid</summary><br />

Run the following command to install the nanoid extension.

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION nanoid(size int DEFAULT 21, alphabet text DEFAULT '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    RETURNS text
    LANGUAGE plpgsql
    volatile
AS
$$
DECLARE
    idBuilder text := '';
    i int := 0;
    bytes bytea;
    alphabetIndex int;
    mask int;
    step int;
BEGIN
    mask := (2 << cast(floor(log(length(alphabet) - 1) / log(2)) as int)) - 1;
    step := cast(ceil(1.6 * mask * size / length(alphabet)) AS int);

    while true
        loop
            bytes := gen_random_bytes(size);
            while i < size
                loop
                    alphabetIndex := (get_byte(bytes, i) & mask) + 1;
                    if alphabetIndex <= length(alphabet) then
                        idBuilder := idBuilder || substr(alphabet, alphabetIndex, 1);
                        if length(idBuilder) = size then
                            return idBuilder;
                        end if;
                    end if;
                    i = i + 1;
                end loop;

            i := 0;
        end loop;
END
$$;
```

</details>
<details>
<summary>Enums</summary><br />

Currently, drizzle does not automatically create enums for you. You will have to create them manually. This [link](https://orm.drizzle.team/docs/column-types/pg#enum) should give you a good idea of how to create enums in postgres.

</details> 
<details>
<summary>Tag View</summary>
  there is a sql query in `src/server/db/tagView.sql` that you need to run in order for tags to work properly.
  This query sets up a view that queries the different tags from clubs and orders them by how many clubs have those tags in descending order.
</details></br>

Once you have added the `DATABASE_URL` to your `.env` file, and have all the necessary extensions as well as enums, you will need to run the following commands to create the tables in your database.

```bash
npm run drizzle:generate
npm run drizzle:push
```

These commands will create the tables in your database based on the models defined in the `src/server/db/schema.ts` directory. You would also run these commands anytime there are changes to `schema.ts` in order to update the database.

Finally, start the development server.

```bash
npm run dev
```

### Branching

When working on a new feature, please create a new branch with the following naming convention:

```bash
git checkout -b feature/<feature-name>
```

When you are ready to merge your branch into the `develop` branch, please create a pull request and request a review from the Jupiter Dev Team.
Please include details about what issue you are addressing with the pull request, what changes you made, and any other relevant information.
