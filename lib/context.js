var prop = require("propertize"),
    Promise = require("es6-promises");

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

/** export Context class */
module.exports = Context;