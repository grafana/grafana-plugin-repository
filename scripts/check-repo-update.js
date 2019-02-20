#!/usr/bin/env node
const request = require('request-promise-native');
const { diffPluginsRepo } = require('./diffPluginsRepo');
const { checkSemver } = require('./checkSemver');

const repoMasterUrl = 'https://raw.githubusercontent.com/grafana/grafana-plugin-repository/master/repo.json';
const repoCurrent = require('../repo.json');

function main() {
  return request(repoMasterUrl).then(body => {
    const repoMaster = JSON.parse(body);
    const diff = diffPluginsRepo(repoCurrent, repoMaster);
    return { diff, repoMaster };
  }).then(result => {
    const { diff, repoMaster } = result;
    console.log(JSON.stringify(diff, null, 2));
    return checkSemver(diff, repoMaster);
  }).catch(error => {
    console.error(error);
    process.exit(1);
  });
}

main();
