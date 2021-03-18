# Grafana Plugin Repository

This repository lists all officially supported Grafana plugins. Plugins in this repository are listed on [Grafana.com](https://grafana.com/grafana/plugins), and can be [installed](https://grafana.com/docs/grafana/latest/plugins/installation/) locally using [Grafana CLI](https://grafana.com/docs/grafana/latest/administration/cli/#plugins-commands) or by [Grafana Cloud](https://grafana.com/products/cloud/) users.

We review all plugins before they are published. This means that it may take some time before we can review your plugin.

Here's a few things you can do to help us review your plugin faster.

- Validate your plugin release with [this plugin validator](http://plugin-validator.grafana.net)
- Use the [GitHub workflows](https://github.com/grafana/plugin-workflows) to automate your plugin release
- Read the [Review Guidelines](http://docs.grafana.org/plugins/developing/plugin-review-guidelines/) before submitting your plugin. These guidelines determine if the plugin is ready to be published or not.
- If possible, for datasource plugins please provide a description on how to set up a simple test environment. A docker container or simple install script helps speed up the review process a lot.

To submit a plugin for review:

1. Fork this repository
1. Add your plugin to `repo.json`
1. Create a pull request

> **Note:** Commercial plugins require a plugin subscription to be published. Commercial plugin subscriptions help us fund continued development of our open source platform and software. See the [terms](https://grafana.com/terms) for more details.

## Add a plugin to `repo.json`

To publish a plugin, add a new entry to the `plugins` array in [repo.json](repo.json).

Here's an example of a plugin release:

```json
{
  "id": "briangann-gauge-panel",
  "type": "panel",
  "url": "https://github.com/briangann/grafana-gauge-panel",
  "versions": [
    {
      "version": "0.0.8",
      "url": "https://github.com/briangann/grafana-gauge-panel",
      "download": {
        "any": {
          "url": "https://github.com/briangann/grafana-gauge-panel/releases/download/v0.0.8/briangann-gauge-panel-0.0.8.zip",
          "md5": "782c973460f330287b7efca5486aa015"
        }
      }
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
| `versions` | List of all published versions of the plugin             |

### Plugin Version Schema

| Property   | Description                                                 |
|------------|-------------------------------------------------------------|
| `version`  | Plugin version. Needs to match the version in `plugin.json` |
| `url`      | URL to the plugin's GitHub project page                     |
| `download` | Download information.                                       |

### Plugin Download Schema

| Property   | Description                                                      |
|------------|------------------------------------------------------------------|
| `url`      | URL to a ZIP archive containing a production build of the plugin |
| `md5`      | MD5 check sum of the ZIP archive                                 |

## Resources

- [Plugin Development](https://grafana.com/docs/grafana/latest/developers/plugins/)
- [Sign a plugin](https://grafana.com/docs/grafana/latest/developers/plugins/sign-a-plugin)
- [Package a plugin](https://grafana.com/docs/grafana/latest/developers/plugins/package-a-plugin)
- [plugin.json Schema](https://grafana.com/docs/grafana/latest/developers/plugins/metadata/)
- [6 tips for improving your Grafana plugin before you publish](https://grafana.com/blog/2021/01/21/6-tips-for-improving-your-grafana-plugin-before-you-publish/)
