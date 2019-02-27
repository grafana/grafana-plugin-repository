const _ = require('lodash');

/**
 * Returns plugins repo diff with additional metadata.
 * @param {Object} update updated repo
 * @param {Object} base   base repo
 * @return {Object}       Diff object
 */
function diffPluginsRepo(update, base) {
  let diff = {};
  let diffMeta = {};

  const pluginsBase = _.keyBy(base.plugins, 'id');
  const pluginsUpdate = _.keyBy(update.plugins, 'id');

  _.forEach(pluginsUpdate, (pluginUpdate, id) => {
    const pluginBase = pluginsBase[id];

    // New plugin added
    if (!pluginBase) {
      diff[id] = pluginUpdate;
      diffMeta[id] = { newPlugin: true };
      return;
    }

    // Plugin version added
    if (!_.isEqual(pluginUpdate, pluginBase)) {
      diff[id] = {};
      diffMeta[id] = { updatedPlugin: true };

      // Check if metadata was changed
      _.forOwn(pluginUpdate, (value, key) => {
        if (value !== pluginBase[key] && key !== 'versions') {
          diffMeta[id].metadataUpdated = true;
          diff[key] = value;
        }
      });

      let versionsDiff = _.xorWith(pluginUpdate.versions, pluginBase.versions, _.isEqual);
      if (versionsDiff && versionsDiff.length) {
        diff[id].versions = [];
        // Check if version was changed
        versionsDiff.forEach(versionObj => {
          const changedVersion = _.find(pluginBase.versions, { 'version': versionObj.version });
          if (changedVersion) {
            diffMeta[id].versionChanged = true;
            const versionChange = _.find(pluginUpdate.versions, { 'version': versionObj.version });
            if (versionChange && !_.find(diff[id].versions, { 'version': versionChange.version })) {
              diff[id].versions.push(versionChange);
              _.forOwn(changedVersion, (value, key) => {
                if (value !== versionObj[key]) {
                  if (diffMeta[id].versionChanges && diffMeta[id].versionChanges[versionObj.version]) {
                    diffMeta[id].versionChanges[versionObj.version].push(key);
                  } else {
                    diffMeta[id].versionChanges = {
                      [versionObj.version]: [key]
                    };
                  }
                }
              });
            }
          } else {
            diff[id].versions.push(versionObj);
            diffMeta[id].versionAdded = true;
          }
        });
      }
    }
  });
  return {
    diff: diff,
    meta: diffMeta
  };
}

module.exports = {
  diffPluginsRepo
};
