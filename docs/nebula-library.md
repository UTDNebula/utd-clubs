# Nebula Library

When working in the `src/nebula-library` folder, you are working in a shared component library that is part of a nested Git repository.

## Contributing to the Nebula Library

Follow these steps to create a secondary **pull request** (PR) for your library changes:

### 1. Checkout a branch

Create a branch in the Nebula Library nested Git repository.:

```bash
cd src/nebula-library
# Replace <branch-name> with a branch name that follows our branch naming conventions
git checkout -b <branch-name>
```

### 2. Make your changes in the `src/nebula-library` folder

### 3. Push your changes

After pushing your changes, return to UTD Clubs's main Git repository

```bash
git push
cd ../..
```

### 4. Make a pull request in the `nebula-library` repository

Make a PR from your branch into `main` at [github.com/UTDNebula/nebula-library](https://github.com/UTDNebula/nebula-library) and request your project lead as a reviewer.

Wait for your PR to be approved.

> [!TIP]
> In the meantime, you can make a regular PR on the [UTD Clubs repository](https://github.com/UTDNebula/utd-clubs). Its checks and build may not pass without your changes in `src/nebula-library`, so you can switch the branch and push with the following commands:
>
> ```bash
> # Replace <feature-name> with the feature name you used in step 1
> git submodule set-branch --branch feature/<feature-name> src/nebula-library
> git push
> ```
>
> If you do this, just make sure to run the following command before the next step:
>
> ```bash
> git submodule set-branch --default src/nebula-library
> ```

### 5. After your `nebula-library` pull request is merged…

Pull your changes from the library and push them to Clubs. Then make a regular PR on Clubs.

```bash
git submodule update --recursive --remote
git push
```
