/*jshint esversion: 8 */
const request = require('request-promise-native');
const semver = require('semver');
const { fetchPluginJson } = require('./github/github');
const chalk = require('chalk');

const PLUGIN_TYPES = ['datasource', 'panel', 'app', 'renderer'];
const PLUGIN_ID_PATTERN = new RegExp(`^[a-z0-9]+(-[a-z0-9]+)*-(${PLUGIN_TYPES.join('|')})$`);

async function lintPlugin(url, commit, version, download, pluginId) {
  const postData = {
    url: url,
    commit: commit
  };
  if (download) {
    postData.download = download;
  }

  const apiResponse = await request.post({ url: 'https://grafana.com/api/plugins/lint', form: postData });
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
          result.status = 'Warning';
          result.statusCode = 1;
          result.warnings.push(err);
        } else {
          result.status = 'Error';
          result.statusCode = 2;
          result.errors.push(err);
        }
      });
    } else {
      result.status = 'Error';
      result.statusCode = 2;
    }
  }

  if (pluginId) {
    try {
      const publishedVersion = await getPublishedVersion(pluginId);
      if (semver.gt(publishedVersion, version)) {
        addWarning(`Published version (${publishedVersion}) newer than repo.json (${version})`, result);
      }

      // Check if Org exist for new plugins
      if (!publishedVersion) {
        const slug = getOrgSlug(pluginId);
        try {
          const org = await getOrg(slug);
        } catch (error) {
          addWarning(error, result);
        }
      }
    } catch (err) { }
  }

  // if the linter from api is valid, and there is no commit returned, this is a zip-style plugin
  if (linterResult.commit === '') {
    console.log(`Plugin ${chalk.blue(pluginId)} version ${chalk.blue(version)} published with download url to zip, skipping dist check.`);
  } else {
    // Try to fetch plugin.json and make some additional checks
    try {
      const pluginJsonResponse = await fetchPluginJson(url, commit);
      const pluginJson = pluginJsonResponse.json;
      // console.log(pluginJson);
      if (pluginJsonResponse.prefix === 'src') {
        addWarning(`It seems, plugin isn't built properly: plugin.json found in src/ only`, result);
      }

      if (pluginId !== pluginJson.id) {
        addWarning(`Plugin id in repo.json (${pluginId}) doesn't match plugin.json (${pluginJson.id})`, result);
      }

      if (!pluginJson.id) {
        addError('No plugin id found in plugin.json', result);
      }

      // Plugin id rules
      const validSlug = PLUGIN_ID_PATTERN.test(pluginJson.id);
      if (!validSlug) {
        addError(`Invalid plugin id "${pluginJson.id}" found in plugin.json`, result);
      }

      // TODO this check is duplicated in https://grafana.com/api/plugins/lint
      // Plugin type rules
      if (!PLUGIN_TYPES.includes(pluginJson.type)) {
        addError(`Invalid plugin type - must be one of: datasource, panel or app, got "${pluginJson.type}"`, result);
      }

      const pluginJsonVersion = pluginJson.info.version;
      if (version && (!pluginJsonVersion || pluginJsonVersion !== version)) {
        addWarning(`Version in repo.json (${version}) doesn't match plugin.json (${pluginJsonVersion})`, result);
      }

      if (!(pluginJson.info.author && pluginJson.info.author.name)) {
        addWarning(`No author specified in plugin.json`, result);
      }

      if (!pluginJson.info.description) {
        addWarning(`No plugin description provided in plugin.json`, result);
      }
    } catch (err) {
      console.log(`Warning: failed fetching plugin.json. This may be caused by private repo without proper access rights.`);
    }
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
  } catch (err) {
    // console.log(err.error || err.message || err);
    throw new Error(`Warning: unable to fetch published plugin ${pluginId}`);
  }
}

async function getOrg(orgSlug) {
  try {
    let result = await request.get(`https://grafana.com/api/orgs/${orgSlug}`);
    result = JSON.parse(result);
    return result;
  } catch (err) {
    // console.log(err.error || err.message || err);
    let error = {};
    try {
      error = JSON.parse(err.error);
    } catch (jsonErr) { }

    throw new Error(`Unable to get organization ${orgSlug}, ${error.message || ''}`);
  }
}

function getOrgSlug(pluginId) {
  const result = /^([a-z0-9]+)(-[a-z0-9]+)*-(datasource|app|panel)$/.exec(pluginId);
  if (result && result.length > 1) {
    return result[1];
  }
  return null;
}

function addWarning(warning, result) {
  result.warnings.push(warning);
  if (result.statusCode < 1) {
    result.status = 'Warning';
    result.statusCode = 1;
  }
}

function addError(error, result) {
  result.errors.push(error);
  if (result.statusCode < 2) {
    result.status = 'Error';
    result.statusCode = 2;
  }
}

module.exports = {
  lintPlugin
};
