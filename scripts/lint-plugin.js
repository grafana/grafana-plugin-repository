#!/usr/bin/env node
const chalk = require('chalk');
const { lintPlugin } = require('./lintPlugin');

const pluginUrl = process.argv[2];
const commit = process.argv[3];
let version, pluginId;
if (process.argv.length > 4) {
  version = process.argv[4];
}
if (process.argv.length > 5) {
  pluginId = process.argv[5];
}

console.log(`${pluginUrl} : ${commit}`);

return lintPlugin(pluginUrl, commit, version, pluginId).then(result => {
  // console.debug(result);
  if (result && result.statusCode > 0) {
    console.error(chalk.yellow(result.status));
    result.warnings.forEach(err => console.error(chalk.yellow(err)));
  } else {
    console.log(chalk.green(result.status));
  }
}).catch(error => {
  if (error && error.status === 'Error') {
    console.error(chalk.red(error.status));
    error.errors.forEach(err => console.error(chalk.red(err)));
    error.warnings.forEach(err => console.error(chalk.yellow(err)));
    process.exit(1);
  } else {
    console.error(error.message || error);
  }
});
