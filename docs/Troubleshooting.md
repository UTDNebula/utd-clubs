# Troubleshooting & FAQ

This guide provides fast, actionable solutions to common issues encountered when running or developing `api-tools`.

---

## 1. Chromium & ChromeDP Issues

### Issue: "exec: 'chromium': executable file not found in $PATH" or Chrome fails to launch

- **Cause**: ChromeDP cannot find a Chromium or Google Chrome binary on your operating system.
- **Solutions**:
  - **Linux**: Install Chromium via your package manager:
    ```bash
    # Ubuntu / Debian
    sudo apt update && sudo apt install -y chromium-browser
    # Fedora / RHEL
    sudo dnf install chromium
    # Arch Linux
    sudo pacman -S chromium
    ```
  - **macOS / Windows**: Ensure [Google Chrome](https://www.google.com/chrome/) is installed in the standard applications directory.
  - **Environment Variables**: If Chrome is installed in a non-standard location, specify its path explicitly before running `api-tools`:
    ```bash
    export CHROMIUM_BIN="/path/to/custom/chrome"
    export GOOGLE_CHROME_BIN="/path/to/custom/chrome"
    ```

### Issue: Chrome window opens during scraping and interferes with work

- **Solution**: Pass the `-headless` flag to run ChromeDP invisibly in background headless mode:
  ```bash
  ./api-tools -scrape -coursebook -term 24F -headless
  ```

---

## 2. Environment Variables & MongoDB Connection Issues

### Issue: Panic: `<KEY> is missing from .env!`

- **Cause**: An authenticated scraper or uploader attempted to read a required environment variable from `.env` via `utils.GetEnv`, but the key was either missing or empty.
- **Solutions**:
  1. Ensure you have copied `.env.template` to `.env`:
     ```bash
     cp .env.template .env
     ```
  2. For Coursebook, Astra, or Mazevo scrapers, populate the required credentials:
     - `LOGIN_NETID` / `LOGIN_PASSWORD` (UTD NetID login)
     - `LOGIN_ASTRA_USERNAME` / `LOGIN_ASTRA_PASSWORD`
     - `MAZEVO_API_KEY`
  3. If you only want to parse existing local data or run tests, you do **not** need these credentials; avoid calling authenticated scraping flags.

### Issue: MongoDB connection timed out / "server selection error"

- **Cause**: The uploader could not establish a connection to the MongoDB instance specified in `MONGODB_URI`.
- **Solutions**:
  - **Verify Connection String**: Check that `MONGODB_URI` in `.env` is formatted correctly:
    ```env
    MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority"
    ```
  - **Check Network & IP Whitelist**: If using MongoDB Atlas, ensure your current IP address is whitelisted under Atlas Network Access.
  - **Local Development**: If testing locally with a local MongoDB container or service, verify MongoDB is running:
    ```bash
    # Test local MongoDB connection
    mongosh "mongodb://localhost:27017"
    ```

---

## 3. Locating & Inspecting Log Files

### How Logging Works

When `api-tools` executes, `utils.NewSplitWriter` writes all log output to two destinations simultaneously:

1. **Console (`stdout`)**: Live output in your terminal window.
2. **Log File (`logs/*.log`)**: A persistent log file saved to the `logs/` directory named with the execution timestamp:
   ```
   logs/8-31-2026T12-30-15.log
   ```

### Enabling Verbose Debug Logging

If a scraper or parser is behaving unexpectedly, re-run the command with the `-verbose` flag:

```bash
./api-tools -verbose -scrape -coursebook -term 24F
```

Verbose mode enables:

- Microsecond timestamp precision (`log.Lmicroseconds`).
- Source code filename and line number for every log statement (`log.Lshortfile`).
- Additional internal debug logs (`utils.Lverbose`).

---

## Still Stuck?

Reach out to the team on [Discord](https://discord.utdnebula.com) with:

1. The exact command you ran.
2. The relevant lines from your latest log file in `logs/`.
3. Your operating system and Go version (`go version`).
