const _ = require('lodash');
const chalk = require('chalk');
const request = require('request-promise-native');
const { diffPluginsRepo } = require('./diffPluginsRepo');
const { lintPlugin } = require('./lintPlugin');

async function lintRepoUpdate(repoCurrent, repoMasterUrl) {
  repoMasterUrl = repoMasterUrl || 'https://raw.githubusercontent.com/grafana/grafana-plugin-repository/master/repo.json';
  return request(repoMasterUrl).then(body => {
    const repoMaster = JSON.parse(body);
    try {
      const diff = diffPluginsRepo(repoCurrent, repoMaster);
      return diff;
    } catch(diffError) {
      console.log(diffError);
      process.exit(1);
    }
  }).then(result => {
    const diff = result;
    return lintRepoDiff(diff);
  }).catch(error => {
    console.error(error.message ? chalk.red(error.message) : error);
    process.exit(1);
  });
}

function lintRepoDiff(diff) {
  let success = true;
  let promises = [];
  _.forEach(diff.diff, (pluginUpdate, pluginId) => {
    _.forEach(pluginUpdate.versions, async versionObj => {
        const url = versionObj.url.trim();
        const commit = versionObj.commit.trim();
        const version = versionObj.version;

        const lintPromise = lintPlugin(url, commit, version).then(result => {
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

module.exports = {
  lintRepoUpdate,
  lintRepoDiff,
};
