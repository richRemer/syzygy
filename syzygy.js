var Configuration = require("./lib/configuration"),
    Context = require("./lib/context"),
    Promise = require("es6-promises");

/**
 * Add a syzygy plugin.  The name will be added to the syzygy.Configuration
 * prototype.  The plugin will be executed with a Context object set to "this".
 * The plugin must call either the .write or .error method when finished.
 * @param {string} name
 * @param {function} plugin
 */
function plugin(name, plugin) {
    Configuration.prototype[name] = function() {
        var parent = this.contexts.slice(-1)[0],
            context = new Context(parent);

        // add new context and use it to execute plugin
        this.contexts.push(context);
        plugin.apply(context, arguments);

        // chainable
        return this;
    };
}

/**
 * Create a new syzygy Configuration object.
 * @returns {Configuration}
 */
function create() {
    return new Configuration();
}

/** export the create function */
module.exports = create;

/** decorate the function with the rest of the exports */
module.exports.Configuration = Configuration;
module.exports.Context = Context;
module.exports.plugin = plugin;
