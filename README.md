# grafana-plugin-repository

This repository contains a json file linking to all supported grafana plugins. To submit a plugin to be published on Grafana.net, add your plugin to the repo.json file below.

When submitting a plugin we need the following:

- plugin id
- type (panel|datasource|app)
- version
- git commit hash
- url to github repo

Here is an example snippet:
```json
 {
    "id": "alexanderzobnin-zabbix-app",
    "type": "app",
    "url": "https://github.com/alexanderzobnin/grafana-zabbix",
    "versions": [
      {
        "version": "3.2.1",
        "commit": "ad6614eacd2b94eedbd0671b1d1a0f2002ade056",
        "url": "https://github.com/alexanderzobnin/grafana-zabbix"
      },
      ...
```
## pull request 시 참고사항
1. CircleCI pipline 을 통해서 코딩 규칙 테스트 완료후 진행
1. pull request 는 github.com 온라인 페이지에서 진행

## Developing a Plugin

The Developing Plugins section in Grafana docs contains several articles about plugins. Start with these:

- [Development Guide](http://docs.grafana.org/plugins/developing/development/)
- [Code Styleguide](http://docs.grafana.org/plugins/developing/code-styleguide/)


# repo.json

| Property | Description |
| ------------- |-------------|
| plugins | An array of plugins hosted by grafana net |
| type | What kind of plugin panel/datasource/app |
| url | Link to the projects website. |
| version | Available versions of the plugin. Linking to an github page and exact commit |


# plugin.json

| Property | Description |
| ------------- |-------------|
| id | uniqe name of the plugin. Should not contain whitespaces |
| type | panel/datasource/app |
| name | Human readable name of the plugin |
| info.description | Description of plugin. Used for searching grafana net plugins |
| info.author | |
| info.keywords | plugin keywords. Used for search on grafana net|
| info.logos | link to project logos |
| info.version | project version of this commit. Must be semver |
| dependencies.grafanaVersion | Required grafana backend version for this plugin |
| dependencies.plugins | required plugins for this plugin. |
