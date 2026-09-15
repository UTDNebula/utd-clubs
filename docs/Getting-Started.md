# Getting Started with UTD Clubs

This guide walks you through setting up your local development environment, configuring environment variables, and running a dev server.

## Prerequisites

Ensure you have the following installed:

- Git
  - If you've never used git, need a refresher, or need help setting it up, check out [Nebula's Git Workshop](https://github.com/UTDNebula/git-workshop).
- Node.js
  - Install following instructions from the [Node.js website](https://nodejs.org/en/)

## Local Setup

### Clone the Repository

Clone the repository to your local machine. Make sure to pass `--recurse-submodules` so that nested submodules such as `nebula-library` are also cloned:

**HTTPS:**

```bash
git clone https://github.com/UTDNebula/utd-clubs.git --recurse-submodules
```

**SSH:**

```bash
git clone git@github.com:UTDNebula/utd-clubs.git --recurse-submodules
```

> [!NOTE]
> If you already cloned the repository but don't have the `src/nebula-library` folder, run the following command:
>
> ```bash
> git submodule update --init --recursive
> ```

Next, navigate to the project directory and install the dependencies:

```bash
cd utd-clubs
npm install
```

### Configure Environment Variables

Make a file called `.env` at the root of the project, and copy the contents of `.env.example` into it. Some parts of `utd-clubs` require certain environment variables, which you can fill in `.env`. If you're not sure what to put, ask for help.

### Start Developing

Start a dev server with

```bash
npm run dev
```

Then, open a browser, and visit [http://localhost:3000](http://localhost:3000).

Congratulations! You're developing UTD Clubs!

### Run Code Verification & Formatting

Format your code with:

```bash
npm run format
```

Lint your code with:

```bash
npm run lint
```

Type check your code with:

```bash
npm run type:check
```

You'll want to run these frequently while developing.

### Run tests

As of right now, `utd-clubs` doesn't use tests. This will be changed in the future, and this section should be updated when that happens

## Next Step

Now that your environment is running, it's time to dive deeper. Check out [Project-Architecture.md](Project-Architecture.md)
