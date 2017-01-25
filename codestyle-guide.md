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
### ES6 features
1. Prefer to use `let` instead `var` ([Exploring ES6](http://exploringjs.com/es6/ch_core-features.html#_from-var-to-letconst))
2. Use arrow functions, which don’t shadow `this` ([Exploring ES6](http://exploringjs.com/es6/ch_core-features.html#_from-function-expressions-to-arrow-functions)):
  ```js
  testDatasource() {
    return this.getServerStatus()
    .then(status => {
      return this.doSomething(status);
    })
  }

  better than

  testDatasource() {
    var self = this;
    return this.getServerStatus()
    .then(function(status) {
      return self.doSomething(status);
    })
  }
  ```
3. Use native _Promise_ object:
  ```js
  metricFindQuery(query) {
    if (!query) {
      return Promise.resolve([]);
    }
  }

  better than

  metricFindQuery(query) {
    if (!query) {
      return this.$q.when([]);
    }
  }
  ```
4. Native JS array methods instead lodash.  
  ??? Should we use `array.map()` or `_.map(array)` when it possible?
