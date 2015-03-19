var syzygy = require(".."),
    expect = require("expect.js"),
    sinon = require("sinon"),
    Promise = require("es6-promises");

describe("syzygy", function() {
    it("should be a function", function() {
        expect(syzygy).to.be.a("function");
    });

    it("should return a Configuration object", function() {
        expect(syzygy()).to.be.a(syzygy.Configuration);
    });

    describe("Context", function() {
        describe("(Context)", function() {
            it("should set the 'parent' Context", function() {
                var parent = new syzygy.Context();
                expect(new syzygy.Context(parent).parent).to.be(parent);
            });
        });

        describe(".then(function, [function])", function() {
            it("should return a Promise", function () {
                expect(new syzygy.Context().then(sinon.spy())).to.be.a(Promise);
            });
        });

        describe(".write(object)", function() {
            it("should resolve context", function(done) {
                var context = new syzygy.Context();

                context.then(function(settings) {
                    expect(settings).to.be.an("object");
                    expect(settings.foo).to.be(42);
                    done();
                }).catch(done);

                context.write({foo: 42, bar: 23, baz: true});
            });
        });
    });

    describe("Configuration", function() {
        describe(".then", function() {
            it("should return a Promise", function() {
                expect(syzygy().then(sinon.spy())).to.be.a(Promise);
            });

            it("should resolve to merged settings object", function(done) {
                var config = new syzygy.Configuration(),
                    parent = new syzygy.Context(),
                    child = new syzygy.Context(parent);

                config.contexts.push(parent);
                config.contexts.push(child);

                config.then(function(settings) {
                    expect(settings).to.be.an("object");
                    expect(settings.foo).to.be(42);
                    expect(settings.bar).to.be(23);
                    done();
                }).catch(done);

                parent.write({foo: 42, bar: 13});
                child.write({bar: 23});
            });
        });
    });

    describe("#plugin(string, function)", function() {
        it("should add method to Configuration prototype", function() {
            var config = syzygy(),
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
});
