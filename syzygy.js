var Settings = require("./settings");

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

/**
 * Create a new syzygy Settings object.
 * @param {Settings} [previous]
 * @returns {Settings}
 */
module.exports = function(previous) {
    return new Settings(previous);
};

/** add additional module exports to function */
module.exports.Settings = Settings;
module.exports.plugin = plugin;
