# Standardize Repo Script

This script helps to standardize a repository by installing required packages, setting up Husky hooks, copying configuration files, merging JSON files, building a Docker image, and more. It is designed to be used on web NEXTJS applications with TypeScript enabled, but it can be used for any other front end application. Be aware you may need to make tweaks later to make it work.

## Requirements

- Node.js
- npm
- Docker

## Usage

1. Ensure you have the required dependencies installed:
  - Node.js
  - npm
  - Docker

2. Navigate to the root of your repository.

3. Run the script:
  ```sh
  npx jvdl-standardize-repo
  ```

4. Follow the prompt to confirm you want to proceed.

## What the Script Does

1. **Install Required Packages**: Installs necessary npm packages such as `rimraf`, `husky`, `cypress`, `commitizen`, `prettier`, and others.

2. **Set Up Husky Hooks**: Creates a `.husky` directory and adds pre-commit and pre-push hooks.

3. **Copy Configuration Files**: Copies various configuration files and directories to the root of the repository, including:
  - `.husky/commit-msg`
  - `.husky/pre-push`
  - `copilot-workspace`
  - `cypress`
  - `.nvmrc`
  - `commitlint.config.js`
  - `cypress.config.ts`
  - `Dockerfile.cypress`
  - `.prettierrc`
  - `.prettierignore`
  - `.vscode`

4. **Merge JSON Files**: Merges `package.json` and `tsconfig.json` with the existing ones in the repository.

5. **Build Docker Image**: Builds a Docker image for Cypress visual regression tests.

## Rollback

If any step fails, the script will automatically rollback the changes:
- Removes copied files.
- Restores original JSON files.
- Resets the git repository.
- Reinstalls npm packages.

## Note

This script should only be used on web applications with TypeScript enabled, not on design systems or utility scripts. Ensure there is at least one commit in the repository for a proper rollback if anything fails.
