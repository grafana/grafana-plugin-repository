# Grafana Plugin Repository

This repository lists all officially supported Grafana plugins. Plugins in this repository are listed on [Grafana.com](https://grafana.com/grafana/plugins), and can be [installed](https://grafana.com/docs/grafana/latest/plugins/installation/) locally using [Grafana CLI](https://grafana.com/docs/grafana/latest/administration/cli/#plugins-commands) or by [Grafana Cloud](https://grafana.com/products/cloud/) users.

We review all plugins before they are published. This means that it may take some time before we can review your plugin.

Here's a few things you can do to help us review your plugin faster.

- Validate your plugin release with [this plugin validator](https://grafana-plugins-web-vgmmyppaka-lz.a.run.app/)
- If needed, provide instructions on how to best test your plugin

To submit a plugin for review:

1. Fork this repository
1. Add your plugin to `repo.json`
1. Create a pull request

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

- [Plugin Development](https://grafana.com/docs/grafana/latest/developers/plugins/)
- [Create a plugin release](https://grafana.com/tutorials/build-a-panel-plugin/#8)
- [plugin.json Schema](https://grafana.com/docs/grafana/latest/developers/plugins/metadata/)
