var expect = require('chai').expect;
var frp = require('../src/frp');

describe('frp#all', function() {
    it('should return an array accessor', function(done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var state_arr = frp.state([state_a, state_b]);

        frp.all(state_arr).onResolve(function(values) {
            expect(values).to.be.an.instanceof(Array);
            expect(values).to.have.length(2).and.to.eql([1, 2]);
            done();
        });
    });

    it('should accept an array instead of accessor to an array', function(done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);

        frp.all([state_a, state_b]).onResolve(function(values) {
            expect(values).to.be.an.instanceof(Array);
            expect(values).to.have.length(2).and.to.eql([1, 2]);
            done();
        });
    });

    it('should immediate resolve if an empty array is provides', function(done) {
        frp.all([]).onResolve(function(values) {
            expect(values).to.be.an.instanceof(Array);
            expect(values).to.be.empty;
            done();
        });
    });

    it('should resolve non-accessor elements', function(done) {
        var state_a = frp.state(1);
        var b = 2;

        frp.all([state_a, b]).onResolve(function(values) {
            expect(values).to.be.an.instanceof(Array);
            expect(values).to.have.length(2).and.to.eql([1, 2]);
            done();
        });
    });

    it('should not resolve if at least one of its values is not resolved', function() {
        var state_a = frp.state(1);
        var state_b = frp.state();
        var state_arr = frp.state([state_a, state_b]);

        var arrAccessor = frp.all(state_arr);

        expect(arrAccessor).to.have.property('_resolved').that.is.false;
        expect(arrAccessor).to.have.ownProperty('_value');
        expect(arrAccessor._value).to.be.undefined;

        arrAccessor.onResolve(function(values) {
            expect(false).to.be.true;
        });
    });

    it('should unresolve state', function(done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var state_arr = frp.state([state_a, state_b]);

        var timeout = setTimeout(function () {
            expect(false).to.be.true;
        }, 25);

        frp.all(state_arr).onResolve(function(values) {
            state_arr._unresolve();
        });

        frp.all(state_arr).onUnresolve(function() {
            clearTimeout(timeout);
            done();
        });
    });

    it('should propagate unresolved state', function(done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var state_arr = frp.state([state_a, state_b]);

        var timeout = setTimeout(function () {
            expect(false).to.be.true;
        }, 1000);

        frp.all(state_arr).onResolve(function(values) {
            state_b._unresolve();
        });

        frp.all(state_arr).onUnresolve(function() {
            clearTimeout(timeout);
            done();
        });
    });

    it('should error trigger', function(done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var state_arr = frp.state([state_a, state_b]);

        var timeout = setTimeout(function () {
            expect(false).to.be.true;
        }, 1000);

        frp.all(state_arr).onResolve(function(values) {
            state_arr._throw(new Error('An error was encountered'));
        });

        frp.all(state_arr).onError(function(errs) {
            clearTimeout(timeout);
            expect(errs[0]).be.an.instanceof(Error);
            done();
        });
    });

    it('should propagate error trigger', function(done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var state_arr = frp.state([state_a, state_b]);

        var timeout = setTimeout(function () {
            expect(false).to.be.true;
        }, 1000);

        frp.all(state_arr).onResolve(function(values) {
            state_a._throw(new Error('An error was encountered'));
        });

        frp.all(state_arr).onError(function(errs) {
            clearTimeout(timeout);
            expect(errs[0]).be.an.instanceof(Error);
            done();
        });
    });
});