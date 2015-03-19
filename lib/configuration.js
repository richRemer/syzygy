var prop = require("propertize"),
    Promise = require("es6-promises"),
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

/** export Configuration class */
module.exports = Configuration;