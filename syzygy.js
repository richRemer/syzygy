var Promise = require("es6-promises"),
    prop = require("propertize"),
    copy = require("objektify").copy;

/**
 * Merged configuration settings.
 * @constructor
 */
function Configuration() {
    var configuration = this,
        contextPromise;

    prop.internal(this, "contexts", []);
    prop.internal(this, "promise", new Promise(function(resolve, reject) {
        configuration.then = function(fulfilled, rejected) {
            if (!contextPromise) {
                contextPromise = Promise.all(this.contexts);
                contextPromise.then(function(contextData) {
                    var mergedData = {};
                    contextData.forEach(copy.bind(null, mergedData));
                    resolve(mergedData);
                }).catch(reject);
            }

            return this.promise.then.apply(this.promise, arguments);
        };
    }));
}

/**
 * Configuration context in which a plugin will execute.
 * @param {Context} [parent]
 * @constructor
 */
function Context(parent) {
    var context = this;

    prop.readonly(this, "parent", parent);
    prop.internal(this, "promise", new Promise(function(resolve, reject) {
        context.write = resolve;
        context.error = reject;
    }));
}

/**
 * Call fulfilled with resolved context data or rejected with an error once the
 * data has been loaded or failed.
 * @param {function} fulfilled
 * @param {function} [rejected]
 * @returns {Promise}
 */
Context.prototype.then = function(fulfilled, rejected) {
    return this.promise.then.apply(this.promise, arguments);
};

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

/** decorate the exported function */
module.exports.Configuration = Configuration;
module.exports.Context = Context;
module.exports.plugin = plugin;
