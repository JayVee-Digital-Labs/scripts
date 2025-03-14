#!/usr/bin/env node

import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import readline from "readline";

const currentWorkingDirectory = process.cwd();
const packageJsonPath = join(currentWorkingDirectory, "package.json");
const configPath = join(currentWorkingDirectory, "jvdl-local-publish.json");

const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
const config = existsSync(configPath) ? JSON.parse(readFileSync(configPath, "utf-8"))['local-publish'] : {};

console.log("🚀 ~ config:", config)
const isDryMode = process.argv.includes("--dry-mode");

if (isDryMode) {
  console.log("\x1b[42m\x1b[30mRunning in dry mode...\x1b[0m");
}

function getNextVersion(currentVersion, commitType) {
  const [major, minor, patch] = currentVersion.split(".").map(Number);

  switch (commitType) {
    case "major":
      return `${major + 1}.0.0`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error("Invalid commit type");
  }
}

function getCommitType() {
  const commitMessage = execSync("git log -1 --pretty=%B").toString().trim();

  if (/^feat(\(.*\))?!/.test(commitMessage)) {
    return "major";
  } else if (/^feat/.test(commitMessage)) {
    return "minor";
  } else if (/^fix/.test(commitMessage)) {
    return "patch";
  } else {
    throw new Error("Commit message does not follow conventional commit style");
  }
}

function updateVersion(newVersion) {
  console.log(`Updating version to ${newVersion} ...`);
  packageJson.version = newVersion;
  const latestCommit = execSync("git log -1 --pretty=%B").toString().trim();
  console.log(`Latest commit: ${latestCommit}`);
  packageJson.latestCommit = latestCommit;
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

function createGitTag(version) {
  console.log(`Creating git tag v${version}...`);
  if (!isDryMode) {
    execSync(`git tag v${version}`);
  }
}

function pushChanges() {
  console.log("Pushing changes...");
  if (!isDryMode) {
    execSync("git push origin main --no-verify", { stdio: "inherit" }); // Adjust branch name if necessary
    execSync("git push origin --tags --no-verify", { stdio: "inherit" });
  } else {
    console.log("Dry mode enabled, skipping git pushes");
  }
}

function promptUser() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const question =
      "\x1b[41m\x1b[30mThis script will run tests, update version, create a git tag, push to the latest branch, build the storybook static files, deploy it to Firebase hosting, and finally publish to NPM. It should only be used on main with ONE commit using `feat`,`feat!` or `fix`. THIS IS ONLY MEANT TO BE USED LOCAL AS A TEMPORARY CI/CD PROCESS OR IF CI/CD IS BROKEN. Do you want to proceed? (Y/N): \x1b[0m";
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y");
    });
  });
}

function runCommand(command, description) {
  if (command) {
    console.log(`${description}...`);
    execSync(command, { stdio: "inherit" });
  } else {
    console.log(`${description} command not passed in.`);
  }
}

async function main() {
  const proceed = await promptUser();
  if (!proceed) {
    console.log("Operation aborted.");
    return;
  }

  console.log("Getting current version...");
  const currentVersion = packageJson.version;
  console.log("Determining commit type...");
  const commitType = getCommitType();
  console.log("Calculating next version...");
  const newVersion = getNextVersion(currentVersion, commitType);

  updateVersion(newVersion);

  console.log("Installing packages...");
  execSync("npm install", { stdio: "inherit" });

  const buildCommand = `npm run ${config["npm-build"] || "build"}`;
  const testCommand = `npm run ${config["npm-test"] || "test"}`;
  const buildStorybookCommand = config["npm-build-storybook"] ? `npm run ${config["npm-build-storybook"]}` : null;
  const deployCommand = config["deploy"];
  const npmPublish = config["enable-npm-publish"];

  runCommand(buildCommand, "Building App");
  runCommand(testCommand, "Running Tests");

  console.log("Staging updated package.json...");
  execSync("git add package.json package-lock.json", { stdio: "inherit" });

  console.log("Amending latest commit...");
  execSync("git commit --amend --no-edit", { stdio: "inherit" });

  createGitTag(newVersion);
  pushChanges();

  runCommand(buildStorybookCommand, "Building Storybook files");

  if (!isDryMode) {
    if (deployCommand) {
      runCommand(deployCommand, "Deploying");
    } else {
      console.log("Deploy command not passed in.");
    }

    if (npmPublish) {
      console.log("Publishing to NPM...");
      execSync("npm publish", { stdio: "inherit" });
    }
  } else {
    console.log("Dry mode enabled, skipping Firebase deployment and NPM publish.");
  }
}

main();
