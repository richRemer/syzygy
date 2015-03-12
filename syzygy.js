var Promise = require("es6-promises"),
    prop = require("propertize"),
    copy = require("objektify").copy;

/**
 * Asynchronous settings object.  Acts as a Promise which resolves to an object
 * containing settings names and values.  If a previous Settings object is
 * passed, those settings will be imported into this one.
 * @constructor
 * @param {Settings} [previous]
 */
function Settings(previous) {
    var local = null,
        previousData = null,
        resolver = null,
        that = this;

    if (!previous) previous = Promise.resolve({});
    this.previous = previous;

    /**
     * Resolve Promised settings if ready.
     */
    function attemptResolve() {
        if (local && previousData && resolver) {
            resolver(copy(copy({}, previousData), local));
            resolver = null;
        }
    }

    // if there's no previous, set empty previous settings
    if (!this.previous) previousData = {};

    // setup base Promise
    Promise.call(this, function(resolve, reject) {
        resolver = resolve;

        previous.then(function(data) {
            previousData = data;
            attemptResolve();
        });
        
        attemptResolve();
    });

    /**
     * Write settings data and resolve (pending previous resolution).
     * @param {object} data
     */
    this.write = function(data) {
        if (!local) local = data;
        attemptResolve();
    };
}

Settings.prototype = Object.create(Promise.prototype);

/**
 * Create a new Settings object.
 * @param {Settings} [previous]
 * @returns {Settings}
 */
function create(previous) {
    return new Settings(previous);
}

/**
 * Register a plugin.
 * @param {string} name
 * @param {function} plugin
 */
function plugin(name, plugin) {
    Settings.prototype[name] = function() {
        var settings;

        // new settings override existing previous
        this.previous = new Settings(this.previous);

        // execute plugin, using new settings object as context object
        plugin.call(this.previous);        

        // chainable
        return this;
    };
}

/** export create with additional decorated exports */
module.exports = create;
module.exports.Settings = Settings;
module.exports.plugin = plugin;
