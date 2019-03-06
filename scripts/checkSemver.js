const _ = require('lodash');
const semver = require('semver');

/**
 * Checks whether plugin updates follow semver or not.
 * @param {*} diff
 * @param {*} base
 */
function checkSemver(diff, base) {
  _.forEach(diff.diff, (pluginUpdate, pluginId) => {
    _.forEach(pluginUpdate.versions, versionObj => {
      const updateVersion = versionObj.version;
      if (!semver.valid(updateVersion)) {
        throw new Error(`Invalid version: ${updateVersion} (plugin: ${pluginId})`);
      }
      const basePlugin = _.find(base.plugins, { 'id': pluginId });
      if (basePlugin) {

        const baseVersions = basePlugin.versions;
        _.forEach(baseVersions, baseVersionObj => {
          const baseVersion = baseVersionObj.version;
          if (semver.lt(updateVersion, baseVersion)) {
            throw new Error(`Updated version should be greater than previous: ${updateVersion} < ${baseVersion} (plugin: ${pluginId})`);
          }
        });
      }
    });
  });
  return true;
}

module.exports = {
  checkSemver
};
