# JVDL Scripts

This repository contains a collection of useful scripts to automate various tasks.

## Installation

To install the `@jayvee-digital-labs/scripts` package, run the following command:

```bash
npm install -g @jayvee-digital-labs/scripts
```

## Scripts

### `jvdl-local-publish`

The `jvdl-local-publish` script is designed to streamline the process of publishing your project locally. It performs the following tasks:

1. Runs tests.
2. Updates the version based on the commit message.
3. Creates a git tag.
4. Pushes changes to the main branch.
5. Builds the Storybook static files.
6. Deploys to Firebase hosting.
7. Publishes to NPM.

This script is intended to be used locally as a temporary CI/CD process or if your CI/CD pipeline is broken.

For more detailed information on how to use the `local-publish` script, please refer to the [local-publish README](./bin/local-publish/README.md).

### `jvdl-standardize-repo`

The `jvdl-standardize-repo` script helps to standardize a repository by installing required packages, setting up Husky hooks, copying configuration files, merging JSON files, building a Docker image, and more. It performs the following tasks:

1. Installs necessary npm packages such as `rimraf`, `husky`, `cypress`, `commitizen`, `prettier`, and others.
2. Creates a `.husky` directory and adds pre-commit and pre-push hooks.
3. Copies various configuration files and directories to the root of the repository.
4. Merges `package.json` and `tsconfig.json` with the existing ones in the repository.
5. Builds a Docker image for Cypress visual regression tests.

This script should only be used on web applications with TypeScript enabled. If any step fails, the script will automatically rollback the changes.

For more detailed information on how to use the `standardize-repo` script, please refer to the [standardize-repo README](./bin/standardize-repo/README.md).

## License

This project is licensed under the MIT License.