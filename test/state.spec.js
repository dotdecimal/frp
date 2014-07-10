var expect = require('chai').expect;
var frp = require('../src/frp');

describe('frp', function() {
    it('should create state', function() {
        var number_state = frp.state(1);
        var bool_state = frp.state(true);
        var string_state = frp.state('frp rocks!');
        var array_state = frp.state([1, 2, 3]);
        var obj_state = frp.state({
            one: 1,
            two: 2,
            three: 3
        });

        expect(number_state).to.have.property('_resolved').that.is.true;
        expect(number_state).to.have.property('_value').that.equals(1);

        expect(bool_state).to.have.property('_resolved').that.is.true;
        expect(bool_state).to.have.property('_value').that.equals(true);

        expect(string_state).to.have.property('_resolved').that.is.true;
        expect(string_state).to.have.property('_value').that.equals('frp rocks!');

        expect(array_state).to.have.property('_resolved').that.is.true;
        expect(array_state).to.have.property('_value').that.deep.equals([1, 2, 3]);

        expect(obj_state).to.have.property('_resolved').that.is.true;
        expect(obj_state).to.have.property('_value').that.deep.equals({
            one: 1,
            two: 2,
            three: 3
        });
    });
});