#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const semver = require('semver');
const chalk = require('chalk');
const { lintPlugin } = require('./lintPlugin');

async function main() {
  let pluginsRepo;
  try {
    pluginsRepo = getRepo();
  } catch(err) {
    console.error(chalk.red('Error processing repo.json'))
    console.error(err);
    process.exit(1);
  }
  const plugins = pluginsRepo.plugins;
  if (!(plugins && plugins.length)) {
    console.log(chalk.yellow('Warning: repo.json is empty'));
  }

  let okLints = 0;
  let failedLints = 0;
  let warningLints = 0;

  for (const plugin of plugins) {
    let version;

    if (!(plugin.versions && plugin.versions.length)) {
      console.log(chalk.yellow(`Warning: plugin ${plugin.id} has no versions`));
      continue;
    }

    if (plugin.versions.length === 1) {
      version = plugin.versions[0];
    } else {
      // use the top or bottom commit which has the highest version
      // can't sort with semver as lots of plugins don't follow it
      const topVersion = plugin.versions[0];
      const bottomVersion = plugin.versions[plugin.versions.length - 1];
      version = semver.gte(topVersion.version, bottomVersion.version) ? topVersion : bottomVersion;
    }

    let commit = version.commit;
    let url = version.url;

    // console.log(`Linting plugin ${chalk.blue(plugin.id)}`);
    console.log(`Linting ${chalk.blue(plugin.id)} version ${chalk.blue(version.version)}`);
    try {
      const lintResult = await lintPlugin(url, commit, version.version, plugin.id);
      if (lintResult) {
        if (lintResult && lintResult.statusCode > 0) {
          console.error(chalk.yellow(lintResult.status));
          lintResult.warnings.forEach(err => console.error(chalk.yellow(err)));
          warningLints++;
        } else {
          console.log(chalk.green(lintResult.status));
          okLints++;
        }
      }
      console.log('');
    } catch(error) {
      console.log(`${url} : ${commit}`);
      if (error && error.status === 'Error') {
        console.error(chalk.red(error.status));
        error.errors.forEach(err => console.error(chalk.red(err)));
        error.warnings.forEach(err => console.error(chalk.yellow(err)));
      } else {
        console.error(error);
      }
      failedLints++;
      console.log('');
    }
  }

  console.log(chalk.green('Status:'));
  console.log(`${chalk.green('OK')}:       ${okLints}`);
  console.log(`${chalk.yellow('Warnings')}: ${warningLints}`);
  console.log(`${chalk.red('Failed')}:   ${failedLints}`);

  if (failedLints > 0) {
    process.exit(1);
  }
}

function getRepo() {
  const repoPath = path.join(__dirname, '../repo.json');
  let repo = fs.readFileSync(repoPath);
  repo = JSON.parse(repo);
  return repo;
}

main();
