const request = require('request');
const semver = require('semver');

module.exports = function(grunt) {

  grunt.registerTask('default', 'Lint all the plugins', function() {
    var done = this.async();

    var repo = grunt.file.readJSON('repo.json');

    let completedLints = 0;
    let failedLints = 0;

    for (var i = 0; i < repo.plugins.length; i++) {
      let commit;

      if (repo.plugins[i].versions.length === 1) {
        commit = repo.plugins[i].versions[0].commit;
      } else {
        // use the top or bottom commit which has the highest version
        // can't sort with semver as lots of plugins don't follow it
        const topCommit = repo.plugins[i].versions[0];
        const bottomCommit = repo.plugins[i].versions[repo.plugins[i].versions.length-1];
        commit = semver.gte(topCommit.version, bottomCommit.version) ? topCommit.commit: bottomCommit.commit;
      }

      const postData = {
        url: repo.plugins[i].url.trim(),
        commit: commit.trim()
      };

      request.post({url:'http://localhost:4000/api/plugins/lint', form: postData}, function(err, httpResponse, body){ 
        completedLints++;

        const parsedBody = JSON.parse(body);

        if (!parsedBody.valid) {
          grunt.log.writeln(parsedBody.url + ' : ' + parsedBody.commit + '. FAIL: ' + JSON.stringify(parsedBody.lintErrors)).error().writeln();
          failedLints++;
        } else {
          grunt.log.writeln(JSON.stringify(parsedBody.url + ' : ' + parsedBody.commit)).ok().writeln();
        }

        if (completedLints === repo.plugins.length - 1) {
          done(failedLints === 0);
        }
      });
    }
  });
}
