#!/usr/bin/env node
const request = require('request-promise-native');
const github = require('./github/github');
const { lintRepoUpdate } = require('./lintRepoUpdate');

async function main() {
  if (process.argv.length < 3) {
    printUsage();
    return;
  }
  let prNumber = process.argv[2];
  prNumber = prNumber[0] === '#' ? prNumber.slice(1) : prNumber;
  const repoJson = await getPluginsRepoPR(prNumber);
  return await lintRepoUpdate(repoJson);
}

async function getPluginsRepoPR(prNumber) {
  const repoJsonFile = await github.fetchPRFile('grafana', 'grafana-plugin-repository', prNumber, 'repo.json');
  const repoJson = JSON.parse(repoJsonFile);
  return repoJson;
}

function printUsage() {
  console.log(`Lint plugins from particular pull request
Usage:
  ./lint-pr.js <PR_number>
  ./lint-pr.js 42`);
}

main();
