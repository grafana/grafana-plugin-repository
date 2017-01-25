# Grafana Plugins Code Style Draft

## Repo name
It's a good practice to use plugin repo name same as plugin id.  
Plugin id has following structure:
```
(username|company)-(plugin name)-(datasource|app|panel)
```

Examples:
```
raintank-worldping-app
grafana-simple-json-datasource
grafana-piechart-panel
mtanda-histogram-panel
```

## Directories structure

```
johnnyb-awesome-datasource
|-- dist
|-- spec
|   |-- datasource_spec.js
|   |-- query_ctrl_spec.js
|   |-- test-main.js
|-- src
|   |-- img
|   |   |-- logo.svg
|   |-- partials
|   |   |-- annotations.editor.html
|   |   |-- config.html
|   |   |-- query.editor.html
|   |-- datasource.js
|   |-- module.js
|   |-- plugin.json
|   |-- query_ctrl.js
|-- Gruntfile.js
|-- LICENSE
|-- package.json
|-- README.md
```

Directories:
- `src/` contains plugin source files.
- `src/partials` contains html templates.
- `src/img` contains plugin logos and other images.
- `spec/` contains tests (optional).
- `dist/` contains built content.

## Code Style
