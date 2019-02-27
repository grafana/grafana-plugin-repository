const request = require('request-promise-native');
const semver = require('semver');
const { fetchPluginJson } = require('./github/github');

async function lintPlugin(url, commit, version, pluginId) {
  const postData = {
    url: url,
    commit: commit
  };

  const apiResponse = await request.post({url:'https://grafana.com/api/plugins/lint', form: postData});
  // console.debug(apiResponse);
  const linterResult = JSON.parse(apiResponse);

  const result = {
    status: 'OK',
    statusCode: 0,
    errors: [],
    warnings: [],
  };

  if (!linterResult.valid) {
    if (linterResult.lintErrors && linterResult.lintErrors.length) {
      const htmlTagsErrorPattern = /The .* file contains HTML tags/;
      linterResult.lintErrors.forEach(err => {
        // Do not fail on "The README.md file contains HTML tags" error
        if (htmlTagsErrorPattern.test(err)) {
          result.status = 'Warning'
          result.statusCode = 1;
          result.warnings.push(err);
        } else {
          result.status = 'Error'
          result.statusCode = 2;
          result.errors.push(err);
        }
      });
    } else {
      result.status = 'Error'
      result.statusCode = 2;
    }
  }

  if(pluginId) {
    try {
      const publishedVersion = await getPublishedVersion(pluginId);
      if (semver.gt(publishedVersion, version)) {
        result.warnings.push(`Published version (${publishedVersion}) newer than repo.json (${version})`);
        if (result.statusCode === 0) {
          result.status = 'Warning'
          result.statusCode = 1;
        }
      }
    } catch(err) {}
  }

  // Try to fetch plugin.json and make some additional checks
  try {
    const pluginJsonResponse = await fetchPluginJson(url, commit);
    const pluginJson = pluginJsonResponse.json;
    // console.log(pluginJson);
    if (pluginJsonResponse.prefix === 'src') {
      result.warnings.push(`It seems, plugin isn't built properly: plugin.json found in src/ only`);
      if (result.statusCode === 0) {
        result.status = 'Warning'
        result.statusCode = 1;
      }
    }

    if (pluginId !== pluginJson.id) {
      result.warnings.push(`Plugin id in repo.json (${pluginId}) doesn't match plugin.json (${pluginJson.id})`);
      if (result.statusCode === 0) {
        result.status = 'Warning'
        result.statusCode = 1;
      }
    }

    const pluginJsonVersion = pluginJson.info.version;
    if (version && (!pluginJsonVersion || pluginJsonVersion !== version)) {
      result.warnings.push(`Version in repo.json (${version}) doesn't match plugin.json (${pluginJsonVersion})`);
      if (result.statusCode === 0) {
        result.status = 'Warning'
        result.statusCode = 1;
      }
    }
  } catch(err) {
    console.log(`Warning: failed fetching plugin.json. This may be caused by private repo without proper access rights.`);
  }

  if (result.statusCode < 2) {
    return result;
  } else {
    return Promise.reject(result);
  }
}

async function getPublishedVersion(pluginId) {
  try {
    let plugin = await request.get(`https://grafana.com/api/plugins/${pluginId}`);
    plugin = JSON.parse(plugin);
    return plugin.version;
  } catch(err) {
    // console.log(err.error || err.message || err);
    throw new Error(`Warning: unable to fetch published plugin ${pluginId}`);
  }
}

module.exports = {
  lintPlugin
};
