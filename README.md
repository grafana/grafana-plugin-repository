# Grafana Plugin Repository

This repository lists all officially supported Grafana plugins. Plugins in this repository are listed on [Grafana.com](https://grafana.com/grafana/plugins), and can be [installed](https://grafana.com/docs/grafana/latest/plugins/installation/) locally using [Grafana CLI](https://grafana.com/docs/grafana/latest/administration/cli/#plugins-commands) or by [Grafana Cloud](https://grafana.com/products/cloud/) users.

We review all plugins before they are published. This means that it may take some time before we can review your plugin.

Here's a few things you can do to help us review your plugin faster.

- Validate your plugin release with [this plugin validator](https://grafana-plugins-web-vgmmyppaka-lz.a.run.app/)
- Read the [Review Guidelines](http://docs.grafana.org/plugins/developing/plugin-review-guidelines/) before submitting your plugin. These guidelines determine if the plugin is ready to be published or not.
- If possible, for datasource plugins please provide a description on how to set up a simple test environment. A docker container or simple install script helps speed up the review process a lot.

To submit a plugin for review:

1. Fork this repository
1. Add your plugin to `repo.json`
1. Create a pull request

> **Note:** Commercial plugins require a plugin subscription to be published. Commercial plugin subscriptions help us fund continued development of our open source platform and software. See the [terms](https://grafana.com/terms) for more details.

## Add a plugin to `repo.json`

Here's an example of a plugin release:

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
    }
  ]
}
```

### Plugin Release Schema

| Property   | Description                                              |
|------------|----------------------------------------------------------|
| `id`       | Plugin ID. Needs to match the plugin ID in `plugin.json` |
| `type`     | Plugin type, e.g. `panel`, `datasource`, or `app`        |
| `url`      | URL to the plugin's GitHub project page                  |
| `versions` | URL to the plugin's GitHub project page                  |

### Plugin Version Schema

| Property  | Description                                                 |
|-----------|-------------------------------------------------------------|
| `version` | Plugin version. Needs to match the version in `plugin.json` |
| `commit`  | Commit SHA of the version to submit                         |
| `url`     | URL to the plugin's GitHub project page                     |

## Resources

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
