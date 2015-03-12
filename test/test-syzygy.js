var syzygy = require(".."),
    expect = require("expect.js"),
    sinon = require("sinon"),
    Promise = require("es6-promises");

describe("syzygy", function() {
    describe("Settings", function() {
        var baseConfig, config;
 
        it("should extend Promise", function() {
            expect(new syzygy.Settings()).to.be.a(Promise);
        });

        describe("(Settings)", function() {
            it("should set previous Settings object", function() {
                var config = new syzygy.Settings();
                expect(new syzygy.Settings(config).previous).to.be(config);
            });
        });

        describe(".write(object)", function() {
            it("should resolve settings", function(done) {
                var config = new syzygy.Settings();

                config.then(function(settings) {
                    expect(settings).to.be.an("object");
                    expect(settings.foo).to.be(42);
                    done();
                }).catch(done);

                config.write({foo: 42, bar: 23, baz: true});
            });
        });

        describe(".then(function)", function() {
            it("should resolve to merged settings object", function(done) {
                var previous = new syzygy.Settings(),
                    config = new syzygy.Settings(previous);

                config.then(function(result) {
                    expect(result).to.be.an("object");
                    expect(result.foo).to.be(42);
                    expect(result.bar).to.be(23);
                    done();
                }).catch(done);

                previous.write({foo: 42, bar: 13});
                config.write({bar: 23});
            });            
        });
    });

    describe("#plugin(string, function)", function() {
        it("should add method to Settings prototype", function() {
            var config = new syzygy.Settings(),
                plugin = sinon.spy(),
                result;

            // verify the initial state
            expect(config.foo).to.be(undefined);

            // add plugin and verify there's a new method
            syzygy.plugin("foo", plugin);
            expect(config.foo).to.be.a("function");

            // verify the plugin is executed and is chainable
            result = config.foo();
            expect(plugin.calledOnce).to.be(true);
            expect(result).to.be(config);
        });
    });

    describe("when called as function", function() {
        it("should return a new Settings object", function() {
            var config = syzygy();
            expect(config).to.be.a(syzygy.Settings);
        });
    });
});
