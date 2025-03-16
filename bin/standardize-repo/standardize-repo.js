#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import readline from 'readline';
import lodash from 'lodash';

// Destructure the merge function from lodash
const { merge } = lodash;

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const changes = [];

// Helper function to copy files
const copyFile = (src, dest) => {
  fs.copyFileSync(src, dest);
  changes.push({ type: 'copy', src, dest });
  console.log(`Copied ${src} to ${dest}`);
};

// Helper function to copy directories recursively
const copyDirectory = (src, dest) => {
  fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src).forEach((item) => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  });
};

// Helper function to merge JSON files deeply
const mergeJsonFiles = (src, dest) => {
  const srcJson = JSON.parse(fs.readFileSync(src, 'utf8'));
  const destJson = JSON.parse(fs.readFileSync(dest, 'utf8'));
  const mergedJson = merge({}, destJson, srcJson);
  fs.writeFileSync(dest, JSON.stringify(mergedJson, null, 2));
  changes.push({ type: 'merge', src, dest, original: destJson });
  console.log(`Merged ${src} into ${dest}`);
};

// Rollback function to undo changes
const rollback = () => {
  console.log('Rolling back changes...');
  changes.reverse().forEach(change => {
    if (change.type === 'copy') {
      fs.unlinkSync(change.dest);
      console.log(`Removed ${change.dest}`);
    } else if (change.type === 'merge') {
      fs.writeFileSync(change.dest, JSON.stringify(change.original, null, 2));
      console.log(`Restored ${change.dest}`);
    }
  });
  console.log('Resetting git repository...');
  execSync('git reset --hard', { stdio: 'inherit' });
  console.log('Reinstalling npm packages...');
  execSync('npm install', { stdio: 'inherit' });
};

// Function to prompt the user for confirmation
const promptUser = () => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const question =
      "\x1b[41m\x1b[30mThis script will install required packages, set up Husky hooks, copy configuration files, merge JSON files, build a Docker image, and standardize the repository. It should only be used on Web Apps with TypeScript enabled, not design systems or utility scripts, and with at least ONE commit in the repo for a proper rollback if anything fails. Do you want to proceed? (Y/N): \x1b[0m";
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y");
    });
  });
};

// Main function to standardize the repo
const standardizeRepo = async () => {
  const proceed = await promptUser();
  if (!proceed) {
    console.log("Operation aborted.");
    return;
  }

  try {
    // Check if package.json exists
    if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) {
      throw new Error('Error: package.json not found in the current directory.');
    }

    // Check if Docker is installed
    try {
      execSync('docker --version', { stdio: 'ignore' });
    } catch (error) {
      throw new Error('Error: Docker is not installed or not available in the PATH.');
    }

    // 1. Install the required packages
    const packages = [
      '@commitlint/config-conventional',
      '@jayvee-digital-labs/scripts',
      '@simonsmith/cypress-image-snapshot',
      '@testing-library/cypress',
      'commitizen',
      'commitlint',
      'cypress',
      'husky',
      'prettier',
      'rimraf'
    ];
    execSync(`npm install ${packages.join(' ')} --save-dev`, { stdio: 'inherit' });

    // 2. Create a .husky directory and add pre-commit and pre-push hooks
    execSync('npx husky install', { stdio: 'inherit' });
    copyFile(path.join(__dirname, '.husky/.commit-msg'), path.join(process.cwd(), '.husky/commit-msg'));
    copyFile(path.join(__dirname, '.husky/.pre-push'), path.join(process.cwd(), '.husky/pre-push'));

    // 3. Copy copilot-workspace directory to the root of the repo
    copyDirectory(path.join(__dirname, 'copilot-workspace'), path.join(process.cwd(), 'copilot-workspace'));

    // 4. Copy the contents of the cypress directory to the cypress directory in the repo
    copyDirectory(path.join(__dirname, 'cypress'), path.join(process.cwd(), 'cypress'));

    // 5. Copy over .nvmrc
    copyFile(path.join(__dirname, '.nvmrc'), path.join(process.cwd(), '.nvmrc'));

    // 6. Copy over .commitlint.config.js
    copyFile(path.join(__dirname, 'commitlint.config.js'), path.join(process.cwd(), 'commitlint.config.js'));

    // 7. Copy over or replace cypress.config.js in root of the repo
    copyFile(path.join(__dirname, 'cypress.config.ts'), path.join(process.cwd(), 'cypress.config.ts'));

    // 8. Merge package.json with the one in the repo
    mergeJsonFiles(path.join(__dirname, 'package.json'), path.join(process.cwd(), 'package.json'));

    // 9. Merge tsconfig.json with the one in the repo
    mergeJsonFiles(path.join(__dirname, 'tsconfig.json'), path.join(process.cwd(), 'tsconfig.json'));

    // 10. Copy Docker File and run docker build
    copyFile(path.join(__dirname, 'Dockerfile.cypress'), path.join(process.cwd(), 'Dockerfile.cypress'));
    execSync('docker build -t cypress-vr-tests -f Dockerfile.cypress .', { stdio: 'inherit' });

    // 11. Copy .prettierrc and .prettierignore to the root of the repo
    copyFile(path.join(__dirname, '.prettierrc'), path.join(process.cwd(), '.prettierrc'));
    copyFile(path.join(__dirname, '.prettierignore'), path.join(process.cwd(), '.prettierignore'));

    // 12. Copy the .vscode folder to the root of the repo
    copyDirectory(path.join(__dirname, '.vscode'), path.join(process.cwd(), '.vscode'));

    console.log('Repository has been standardized.');
  } catch (error) {
    console.error(error.message);
    rollback();
    process.exit(1);
  }
};

standardizeRepo();