var syzygy = require(".."),
    fs = require("fs");

/**
 * Syzygy json plugin.  Read JSON from filesystem path.
 * @param {string} path
 */
function json(path) {
    var settings = this;

    fs.readFile(path, function(err, data) {
        // parse JSON data
        if (!err) {
            try {
                data = JSON.parse(data.toString("utf8"));
                settings.write(data);
            } catch (err) {
                settings.error(err);
            }
        }

        // just write empty data if file does not exist
        else if (err.code === "ENOENT") settings.write({});

        // fail on other errors
        else settings.error(err);
    });
}

module.exports = json;
