Syzygy Asynchronous Configuration
=================================

Example
-------
```js
var syzygy = require("syzygy")(),
    path = require("path"),
    HOME = process.env.HOME || process.env.USERPROFILE,
    APP = "app_name";

syzygy()
    .json(path.join(HOME, "." + APP))
    .json(path.join("/etc", APP))
    .redis("localhost:6379", "app_config")
```

Plugin Example
--------------
```js
var syzygy = require("syzygy"),
    foo = require("foo");

// define a "foo" plugin method
syzygy.plugin("foo", function(config) {
    // this.read can be used to asynchronously load from earlier configs
    this.read("host", function(host) {
        foo.doThings().then(function(val) {
            // this.write ends this plugin and sets config values
            this.write({foo_val: val});
        });
    });
});
```
