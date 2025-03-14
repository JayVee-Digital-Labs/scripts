# JVDL Scripts

This repository contains a collection of useful scripts to automate various tasks.

## Installation

To install the `@jayvee-digital-labs/scripts` package, run the following command:

```bash
npm install -g @jayvee-digital-labs/scripts
```

## Scripts

### `jvdl-local-publish`
(Fast Follow Very Soon)

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


## License

This project is licensed under the MIT License.