#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// const prettyjson = require('prettyjson');

// const repo = require('../repo.json');
const repoPath = path.join(__dirname, '../repo.json');
let repo = fs.readFileSync(repoPath);
try {
  repo = JSON.parse(repo);
} catch (parseError) {
  console.error(chalk.red('Error parsing repo.json'))
  console.error(parseError);
  process.exit(1);
}

// console.log(prettyjson.render(repo));
// console.log(repo);
const plugins = repo.plugins.map(plugin => plugin.id);
// console.log(plugins);
console.log(repo.plugins[1]);
