const request = require('request-promise-native');

function lintPlugin(pluginUrl, commit) {
  const postData = {
    url: pluginUrl,
    commit: commit
  };

  return request.post({url:'https://grafana.com/api/plugins/lint', form: postData}).then(apiResponse => {
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

    if (result.statusCode < 2) {
      return result;
    } else {
      return Promise.reject(result);
    }
  });
}

module.exports = {
  lintPlugin
};
