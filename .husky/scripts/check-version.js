#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path to package.json
const packageJsonPath = path.resolve(__dirname, '../../package.json');

// Function to get the current version from package.json
function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
}

// Get the current version
const currentVersion = getCurrentVersion();

try {
  // Try to get the version from the remote origin/main first
  let remoteVersion;
  try {
    remoteVersion = execSync(
      'git show origin/main:package.json | grep "version" | head -1 | awk -F: \'{ print $2 }\' | sed \'s/[",]//g\' | tr -d " "',
      { encoding: 'utf8' }
    ).trim();
    console.log(`Remote version (origin/main): ${remoteVersion}`);
  } catch (remoteError) {
    // If remote doesn't exist or can't be accessed, fall back to previous commit
    console.log('Could not access remote version, checking against previous commit...');
    remoteVersion = execSync(
      'git show HEAD~1:package.json | grep "version" | head -1 | awk -F: \'{ print $2 }\' | sed \'s/[",]//g\' | tr -d " "',
      { encoding: 'utf8' }
    ).trim();
    console.log(`Previous commit version: ${remoteVersion}`);
  }

  console.log(`Current version: ${currentVersion}`);

  // Compare versions
  if (currentVersion === remoteVersion) {
    console.error('\x1b[31mERROR: Version in package.json has not been increased!\x1b[0m');
    console.error('Please update the version in package.json before pushing.');
    console.error('Use `make patch` to increment the patch version.');
    console.error('Use `make minor` to increment the minor version.');
    console.error('Use `make major` to increment the major version.');
    // use make help to see all available commands
    console.error('--');
    console.error('If you are not sure what to do, please ask for help.');
    console.error('You can also use `make help` to see all available commands.');
    process.exit(1);
  } else {
    console.log('\x1b[32mVersion check passed: Version has been increased.\x1b[0m');
  }
} catch (error) {
  // If we can't get any previous version, skip check
  console.log('Could not determine previous version, skipping version check.');
  console.log(error.message);
}
