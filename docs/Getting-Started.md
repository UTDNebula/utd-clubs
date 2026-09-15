# Getting Started with UTD Clubs

This guide walks you through setting up your local development environment, configuring environment variables, and running a dev server.

## Prerequisites

Ensure you have the following installed:

- [Git](https://git-scm.com/install)
  - If you've never used Git, need a refresher, or need help setting it up—check out [Nebula's Git Workshop](https://github.com/UTDNebula/git-workshop).
- [Node.js](https://nodejs.org/en/download)
  - If you're unsure what to do on this page, scroll down and click the green button that says "Windows Installer (.msi)" or "macOS Installer (.pkg)" then open that file.

## Local Setup

### 1) Clone the repository

Clone the repository to your local machine. Make sure to include the `--recurse-submodules` flag so that nested submodules such as `nebula-library` are also cloned:

**HTTPS:**

```bash
git clone https://github.com/UTDNebula/utd-clubs.git --recurse-submodules
```

**SSH:**

```bash
git clone git@github.com:UTDNebula/utd-clubs.git --recurse-submodules
```

> [!NOTE]
> If you already cloned the repository but your `src/nebula-library/` folder is empty, run the following command:
>
> ```bash
> git submodule update --init --recursive
> ```

### 2) Install dependencies

Next, navigate to the project directory and install the libraries used in `utd-clubs`:

```bash
cd utd-clubs
npm install
```

> [!IMPORTANT]
> From now on, if there's an update in the Nebula Library, you'll need to remember to run `git pull --recurse-submodules` instead of running `git pull`.
>
> If you want to avoid this hassle (and to also fix VS Code's sync button), just run the following once:
>
> ```bash
> git config submodule.recurse true
> ```
>
> Now, running `git pull` will work as expected.

### 3) Configure environment variables

Create a file called `.env` in the root of the project folder, then copy the contents of `.env.example` into it. Some environment variables are required, which you should fill in `.env`. If you're not sure what to put, please ask your project lead.

### 4) Run development server

Start a dev server with

```bash
npm run dev
```

Then, open a browser and visit [http://localhost:3000](http://localhost:3000).

Congratulations! You're running UTD Clubs on your machine, and you're now ready to code!

## While developing

### Check code quality

To maintain good code quality, you should periodically run the following commands while developing.

- Format your code with:

  ```bash
  npm run format
  ```

- Lint your code with:

  ```bash
  npm run lint
  ```

- Type check your code with:

  ```bash
  npm run type:check
  ```

### Run tests

As of right now, `utd-clubs` doesn't use tests. This will be changed in the future, and this section should be updated when that happens

### Ask questions

Confused about anything? Feel free to ask on the [Nebula Labs Discord server](https://discord.utdnebula.com)!

## Next Step

Now that your environment is running, it's time to dive deeper. Check out [Project-Architecture.md](Project-Architecture.md)
