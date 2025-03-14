# Local Publish Script

This script automates the process of running tests, updating the version, creating a git tag, pushing changes to the repository, building Storybook static files, deploying to Firebase hosting, and publishing to NPM. It is intended to be used locally as a temporary CI/CD process or if CI/CD is broken.

## Prerequisites

- Node.js installed
- NPM installed
- Git installed
- Firebase CLI installed (if deploying to Firebase)

## Setup

Create a configuration file `jvdl-local-publish.json` in the root of your project. You can use the provided example file `jvdl-local-publish.example.json` as a template:

  ```json
  {
    "local-publish": {
      "npm-build": "build-random",
      "npm-test": "prepush:ci",
      "npm-build-storybook": "build-storybook",
      "deploy": "console.log('DEPLOY')",
      "enable-npm-publish": true
    }
  }
  ```

## Usage

1. Ensure you are on the `main` branch and have a single commit with a message following the conventional commit style (`feat`, `feat!`, or `fix`).

2. Run the script:

  ```sh
  jvdl-local-publish
  ```

3. Follow the prompt to confirm you want to proceed.

## Options

- `--dry-mode`: Run the script in dry mode, which skips git pushes, Firebase deployment, and NPM publish.

  ```sh
  jvdl-local-publish --dry-mode
  ```

## Default Values and Behavior

If no configuration is provided, the script will use the following default values:

- `npm-build`: `build`
- `npm-test`: `test`
- `npm-build-storybook`: Not run
- `deploy`: Not run
- `enable-npm-publish`: Not run

## How It Works

1. Prompts the user for confirmation.
2. Determines the current version from `package.json`.
3. Determines the commit type from the latest commit message.
4. Calculates the next version based on the commit type.
5. Updates the version in `package.json`.
6. Installs NPM packages.
7. Runs the build and test commands specified in the configuration file.
8. Stages and amends the latest commit with the updated `package.json`.
9. Creates a git tag with the new version.
10. Pushes changes to the repository.
11. Builds Storybook static files (if specified in the configuration).
12. Deploys to Firebase (if specified in the configuration).
13. Publishes the package to NPM (if enabled in the configuration).

## Example Configuration

Here is an example `jvdl-local-publish.json` configuration file:

```json
{
  "local-publish": {
    "npm-build": "build-random",
    "npm-test": "prepush:ci",
    "npm-build-storybook": "build-storybook",
    "deploy": "console.log('DEPLOY')",
    "enable-npm-publish": true
  }
}
```

## Notes

- This script should only be used on the `main` branch with a single commit using `feat`, `feat!`, or `fix`.
- This script is intended for local use as a temporary CI/CD process or if CI/CD is broken.

