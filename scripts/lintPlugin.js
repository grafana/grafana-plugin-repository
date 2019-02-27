const request = require('request-promise-native');
const { fetchPluginJson } = require('./github/github');

async function lintPlugin(pluginUrl, commit, version) {
  const postData = {
    url: pluginUrl,
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

  // Try to fetch plugin.json and make some additional checks
  try {
    const pluginJsonResponse = await fetchPluginJson(pluginUrl, commit);
    const pluginJson = pluginJsonResponse.json;
    // console.log(pluginJson);
    if (pluginJsonResponse.prefix === 'src') {
      result.warnings.push(`It seems, plugin isn't built properly: plugin.json found in src/ only`);
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

module.exports = {
  lintPlugin
};
