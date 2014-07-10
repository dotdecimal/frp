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

        frp.props(state_obj).onResolve(function(values) {
            expect(values).to.be.an.instanceof(Object);
            expect(values).to.have.keys(['one', 'two']);
            expect(values.one).to.eql(1);
            expect(values.two).to.eql(2);
            done();
        });
    });
});