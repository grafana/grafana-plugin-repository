#!/usr/bin/env node
const _ = require('lodash');
const chalk = require('chalk');
const request = require('request-promise-native');
const { diffPluginsRepo } = require('./diffPluginsRepo');
const { lintPlugin } = require('./lintPlugin');

const repoMasterUrl = 'https://raw.githubusercontent.com/grafana/grafana-plugin-repository/master/repo.json';
const repoCurrent = require('../repo.json');

async function main() {
  return request(repoMasterUrl).then(body => {
    const repoMaster = JSON.parse(body);
    const diff = diffPluginsRepo(repoCurrent, repoMaster);
    return diff;
  }).then(result => {
    const diff = result;
    return lintRepoUpdate(diff);
  }).catch(error => {
    console.error(error.message ? chalk.red(error.message) : error);
    process.exit(1);
  });
}

function lintRepoUpdate(diff) {
  let success = true;
  let promises = [];
  _.forEach(diff.diff, (pluginUpdate, pluginId) => {
    _.forEach(pluginUpdate.versions, async versionObj => {
        const url = versionObj.url.trim();
        const commit = versionObj.commit.trim();

        const lintPromise = lintPlugin(url, commit).then(result => {
          console.log(`Linting ${chalk.blue(pluginId)} version ${chalk.blue(versionObj.version)}`);
          console.log(`${url} : ${commit}`);
          if (result && result.statusCode > 0) {
            console.error(chalk.yellow(result.status));
            result.warnings.forEach(err => console.error(chalk.yellow(err)));
          } else {
            console.log(chalk.green(result.status));
          }
          console.log('');
          return;
        }).catch(error => {
          console.log(`Linting ${chalk.blue(pluginId)} version ${chalk.blue(versionObj.version)}`);
          console.log(`${url} : ${commit}`);
          if (error && error.status === 'Error') {
            console.error(chalk.red(error.status));
            error.errors.forEach(err => console.error(chalk.red(err)));
            error.warnings.forEach(err => console.error(chalk.yellow(err)));
          } else {
            console.error(error);
          }
          console.log('');
          success = false;
          return;
        });
        promises.push(lintPromise);
    });
  });

  if (promises.length === 0) {
    console.log('No plugins to lint');
  }

  return Promise.all(promises).then(() => {
    if (success) {
      return success;
    } else {
      return Promise.reject(new Error('Failed linting plugins update'));
    }
  });
}

main().catch(console.error);
