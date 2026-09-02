# Getting Started with API Tools

This guide walks you through setting up your local development environment, configuring environment variables, and running a dev server.

## Prerequisites

Ensure you have the following installed:

- Git
  - If you've never used git, need a refresher, or need help setting it up, check out [Nebula's Git Workshop](https://github.com/UTDNebula/git-workshop).
- Go
  - You can install from the [Go website](https://go.dev/dl/), or from [Homebrew](https://brew.sh/) or another package manager for automatic updates
- **Make** *(Linux/macOS)* — Pre-installed on macOS (via `xcode-select --install`) and most Linux distributions (`build-essential`)
- **Google Chrome** or **Chromium** — Required for headless browser scraping
- **Docker** *(Optional)* — For running containerized runners locally

**Make** is a build automation tool. Feel free to check out [Makefile](../Makefile) to see exactly what's being run.

If you're using Windows, instead of using `make`, you can also use our `.\build.bat` file. When you see any command starting with `make`, you can instead use `.\build.bat`. For example instead of `make setup`, you can run `.\build.bat setup`.

## Local Setup

### Step 1: Clone the Repository

Clone the repository with `git clone` and `cd` into the project directory or open it in your code editor

### Step 2: Install Development Tooling

Install the Go static analysis and formatting tools (`staticcheck` and `goimports`):

```bash
make setup
```

If you installed **Go** with [**Homebrew**](https://brew.sh/), you need to add Go tools to your path for tools like `staticcheck` and others to work.

- **For zsh** (the default shell on MacOS)

  ```bash
  echo 'export PATH=${PATH}:`go env GOPATH`/bin' >> ~/.zshrc && source ~/.zshrc
  ```

- **For bash** (the default shell on most Linux distributions)

  ```bash
  echo 'export PATH=${PATH}:`go env GOPATH`/bin' >> ~/.bashrc && source ~/.bashrc
  ```

- **For fish**

  ```bash
  echo 'fish_add_path (go env GOPATH)/bin' >> ~/.config/fish/config.fish
  ```

### Step 3: Configure Environment Variables

Make a file called `.env` at the root of the project, and copy the contents of `.env.template` into it. Some tools in `api-tools` require certain environment variables, which you can fill in `.env`. If you're not sure what to put, ask for help.

### Step 4: Run Code Verification & Formatting

Check your code with:

```bash
make check
```

You'll want to run this frequently while developing

### Step 5: Build the CLI Executable

Compile the Go source code into a runnable binary (`./api-tools` on Linux/macOS, `api-tools.exe` on Windows):

```bash
make build
```

### Step 6: Verify with Automated Tests

Run the test suite to confirm your environment is ready:

```bash
make test
```

If all tests pass, congratulations! Your local development environment is ready.

## Next Step

Now that your environment is running, it's time to dive deeper. Check out [Project-Architecture.md](Project-Architecture.md)
