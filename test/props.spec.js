var expect = require('chai').expect;
var frp = require('../src/frp');

describe('frp#props', function() {
    it('should return an object accessor', function(done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var state_obj = {
            'one': state_a,
            'two': state_b
        };

        frp.props(state_obj).onResolve(function(value) {
            expect(value).to.be.an.instanceof(Object);
            expect(value).to.have.keys(['one', 'two']);
            expect(value.one).to.eql(1);
            expect(value.two).to.eql(2);
            done();
        });
    });

    it('should accept an empty object as a parameter', function(done) {
        frp.props().onResolve(function (value) {
            expect(value).to.be.an('object').and.to.be.empty;
            done();
        });
    });

    it('should resolve non-accessor elements', function(done) {
        var state_a = frp.state(1);
        var b = 2
        var state_obj = {
            'one': state_a,
            'two': b
        };

        frp.props(state_obj).onResolve(function(value) {
            expect(value).to.be.an.instanceof(Object);
            expect(value).to.have.keys(['one', 'two']);
            expect(value.one).to.eql(1);
            expect(value.two).to.eql(2);
            done();
        });
    });

    it('should not resolve if at least one of its property values is not resolved', function(done) {
        var state_a = frp.state(1);
        var state_b = frp.state();
        var state_obj = {
            'one': state_a,
            'two': state_b
        };

        var objAccessor = frp.props(state_obj);

        expect(objAccessor).to.have.property('_resolved').that.is.false;
        expect(objAccessor).to.have.ownProperty('_value');
        expect(objAccessor._value).to.be.undefined;

        objAccessor.onResolve(function(value) {
            expect(false).to.be.true;
            done();
        });

        setTimeout(function() {
            done();
        }, 15);
    });

    it('should propagate unresolved state', function(done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var state_obj = {
            'one': state_a,
            'two': state_b
        };

        var timeout = setTimeout(function () {
            expect(false).to.be.true;
        }, 1000);

        frp.props(state_obj).onResolve(function(value) {
            state_b._unresolve();
        });

        frp.props(state_obj).onUnresolve(function() {
            clearTimeout(timeout);
            done();
        });
    });

    it('should propagate error triggers', function(done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var state_obj = {
            'one': state_a,
            'two': state_b
        };

        var timeout = setTimeout(function () {
            expect(false).to.be.true;
        }, 1000);

        frp.props(state_obj).onResolve(function(value) {
            state_a._throw(new Error('An error was encountered'));
        });

        frp.props(state_obj).onError(function(errs) {
            clearTimeout(timeout);
            expect(errs[0]).be.an.instanceof(Error);
            done();
        });
    });
});