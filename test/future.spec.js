var expect = require('chai').expect;
var frp = require('../src/frp');

describe('frp#future', function () {
    it('should create a future accessor based on the given function (non accessor)', function (done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var handler = function (a, b) {
            return a + b
        };

        frp.future(handler, state_a, state_b).onResolve(function (value) {
            expect(value).to.eql(3);
            done();
        });
    });

    it('should create a future accessor based on the given function (accessor)', function (done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var handler = function (a, b) {
            return frp.join(a, b, function (c, d) {
                return c + d;
            });
        };

        frp.future(handler, state_a, state_b).onResolve(function (value) {
            expect(value).to.eql(3);
            done();
        });
    });

    it('should propagate unresolved state (accessor)', function (done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var state = frp.state(3);
        var handler = function (a, b) {
            return frp.join(a, b, function (c, d) {
                return state;
            });
        };

        var timeout = setTimeout(function() {
            expect(false).to.be.true;
        }, 1000);

        frp.future(handler, state_a, state_b).onResolve(function (value) {
            state._unresolve();
        }).onUnresolve(function () {
            clearTimeout(timeout);
            done();
        });
    });

    it('should propagate error trigger (accessor)', function (done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var state = frp.state(3);
        var handler = function (a, b) {
            return frp.join(a, b, function (c, d) {
                return state;
            });
        };

        var timeout = setTimeout(function() {
            expect(false).to.be.true;
        }, 1000);

        frp.future(handler, state_a, state_b).onResolve(function (value) {
            state._throw(new Error('An error was encountered'));
        }).onError(function (errs) {
            clearTimeout(timeout);
            expect(errs[0]).be.an.instanceof(Error);
            done();
        });
    });

    it('should propagate unresolved arguments', function (done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var handler = function (a, b) {
            return a + b;
        };

        var timeout = setTimeout(function() {
            expect(false).to.be.true;
        }, 1000);

        frp.future(handler, state_a, state_b).onResolve(function (value) {
            state_b._unresolve();
        }).onUnresolve(function () {
            clearTimeout(timeout);
            done();
        });
    });

    it('should propagate error trigger (arguments)', function (done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var handler = function (a, b) {
            return a + b;
        };

        var timeout = setTimeout(function() {
            expect(false).to.be.true;
        }, 1000);

        frp.future(handler, state_a, state_b).onResolve(function (value) {
            state_b._throw(new Error('An error was encountered'));
        }).onError(function (errs) {
            clearTimeout(timeout);
            expect(errs[0]).be.an.instanceof(Error);
            done();
        });
    });
});