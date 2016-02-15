# grafana-plugin-repository

this repository contains a json file linking to all supported grafana plugins

# repo.json

| Property | Description |
| ------------- |:-------------:|
| plugins | An array of plugins hosted by grafana net |
| type | What kind of plugin panel/datasource/app |
| url | Link to the projects website. Perhaps this should be removed? |
| version | Available versions of the plugin. Linking to an github page and exact commit |


# plugin.json

| Property | Description |
| ------------- |:-------------:|
| id | uniqe name of the plugin. Should not contain whitespaces |
| type | panel/datasource/app |
| name | Human readable name of the plugin |
| info.description | Description of plugin. Used for searching grafana net lugins |
| info.author | |
| info.keywords | plugin keywords. Used for search on grafana net|
| info.logos | link to project logos |
| info.version | project version of this commit. Must be semver |
| depedencies.grafanaVersion | Required grafana backend version for this plugin |
| depedencies.plugins | required plugins for this plugin. |
