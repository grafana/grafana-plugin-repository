#!/usr/bin/env node
const request = require('request-promise-native');
const chalk = require('chalk');
const github = require('./github/github');
const { lintRepoUpdate } = require('./lintRepoUpdate');

async function main() {
  if (process.argv.length < 3) {
    printUsage();
    return;
  }
  let prNumber = process.argv[2];
  prNumber = prNumber[0] === '#' ? prNumber.slice(1) : prNumber;
  try {
    const repoJson = await getPluginsRepoPR(prNumber);
    return await lintRepoUpdate(repoJson);
  } catch(err) {
    console.log(chalk.red('Error: '), err.error || err.message || err);
    process.exit(1);
  }
}

async function getPluginsRepoPR(prNumber) {
  const repoJsonFile = await github.fetchPRFile('grafana', 'grafana-plugin-repository', prNumber, 'repo.json');
  try {
    const repoJson = JSON.parse(repoJsonFile);
    return repoJson;
  } catch(parseError) {
    throw new Error(`Error parsing repo.json from PR: ${parseError}`);
  }
}

function printUsage() {
  console.log(`Lint plugins from particular pull request
Usage:
  ./lint-pr.js <PR_number>
  ./lint-pr.js 42`);
}

main();
