# Jupiter

_A tool to find ways to get involved on campus._

## Contributing

We are always open to contributions to the project. If you would like to contribute and want some guidance on where to start,
please join our [Discord](http://discord.utdnebula.com/) and ask for drop a message in the `#jupiter-general` channel or
DM Braedon for more details.

Currently, we're tracking all issues via GitHub Issues. If you would like to work on an issue, please comment on the issue and we will assign it to you.
If you see anything that you think could be improved, please create an issue and we will look into it.

### Getting Started

Please make sure you have at least [NodeJS v21.1.0](https://nodejs.org/en) or greater installed before continuing.

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

Jupiter uses an ORM called [Drizzle](https://orm.drizzle.team/) to interact with the database. In order to connect to the database, you will need to add the `DATABASE_URL` variable to your `.env` file. Your project lead will give this to you upon request.

The Nebula API is used for image storage. The `NEBULA_API_URL` variable should be set to `https://api.utdnebula.com/` and the `NEBULA_API_STORAGE_BUCKET` variable to `jupiter`. An API key and storage key should be requested from the project lead for the `NEBULA_API_KEY` and `NEBULA_API_STORAGE_KEY` variables.

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
