Syzygy Asynchronous Configuration
=================================

Example
-------
```js
var syzygy = require("syzygy"),
    path = require("path"),
    HOME = process.env.HOME || process.env.USERPROFILE;

syzygy()
    .json("/etc/my-app")
    .json(path.join(HOME, ".my-app"))
    .then(function(config) {
        // config contains merged settings from JSON files
    });
```

Plugin Example
--------------
```js
var syzygy = require("syzygy"),
    foo = require("foo");

// define a "foo" plugin method
syzygy.plugin("foo", function(config) {
    // this.parent.then can be used to asynchronously load from earlier configs
    this.parent.then(function(settings) {
        var host = settings.host;
        foo(host).doThings().then(function(val) {
            // this.write ends this plugin and sets config values for the plugin
            this.write({foo_val: val});
        });
    });
});
```
