#!/usr/bin/env node
const { lintRepoUpdate } = require('./lintRepoUpdate');

const repoCurrent = require('../repo.json');

async function main() {
  return lintRepoUpdate(repoCurrent);
}

main().catch(console.error);
