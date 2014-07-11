var expect = require('chai').expect;
var frp = require('../src/frp');

describe('frp#join', function() {
    it('should properly execute a join', function(done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);

        frp.join(state_a, state_b, function(arg0, arg1) {
            return arg0 + arg1;
        }).onResolve(function(value) {
            expect(value).to.be.a('number').and.eql(3);
            done();
        });
    });

    it('should properly execute a join for an accessor type', function(done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);

        frp.join(state_a, state_b, function(arg0, arg1) {
            return frp.state(arg0 + arg1);
        }).onResolve(function(value) {
            expect(value).to.be.a('number').and.eql(3);
            done();
        });
    });

    it('should join with non-accessor elements', function(done) {
        var state_a = frp.state(1);
        var b = 2;

        frp.join(state_a, b, function(arg0, arg1) {
            return arg0 + arg1;
        }).onResolve(function(value) {
            expect(value).to.be.a('number').and.eql(3);
            done();
        });
    });

    it('should propagate unresolved state', function(done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);

        var timeout = setTimeout(function () {
            expect(false).to.be.true;
        }, 1000);

        frp.join(state_a, state_b, function(arg0, arg1) {
            return arg0 + arg1;
        }).onResolve(function(value) {
            state_b._unresolve();
        }).onUnresolve(function () {
            clearTimeout(timeout);
            done();
        });
    });

    it('should propagate unresolved state (for accessor type)', function(done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var state_final = frp.state('hello');

        var timeout = setTimeout(function () {
            expect(false).to.be.true;
        }, 1000);

        frp.join(state_a, state_b, function(arg0, arg1) {
            return state_final;
        }).onResolve(function(value) {
            state_final._unresolve();
        }).onUnresolve(function () {
            clearTimeout(timeout);
            done();
        });
    });

    it('should propagate error trigger', function(done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);

        var timeout = setTimeout(function () {
            expect(false).to.be.true;
        }, 1000);

        frp.join(state_a, state_b, function(arg0, arg1) {
            return arg0 + arg1;
        }).onResolve(function(value) {
            state_b._throw(new Error('An error was encountered'));
        }).onError(function (errs) {
            clearTimeout(timeout);
            expect(errs[0]).be.an.instanceof(Error);
            done();
        });
    });

    it('should propagate error trigger (for accessor type)', function(done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var state_final = frp.state('hello');

        var timeout = setTimeout(function () {
            expect(false).to.be.true;
        }, 1000);

        frp.join(state_a, state_b, function(arg0, arg1) {
            return state_final;
        }).onResolve(function(value) {
            state_final._throw(new Error('An error was encountered'));
        }).onError(function (errs) {
            clearTimeout(timeout);
            expect(errs[0]).be.an.instanceof(Error);
            done();
        });
    });
});