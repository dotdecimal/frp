var expect = require('chai').expect;
var frp = require('../src/frp');

describe('frp#constant', function () {
    it('should return a constant accessor', function () {
        var number_state = frp.constant(1);
        var bool_state = frp.constant(true);
        var string_state = frp.constant('frp rocks!');
        var array_state = frp.constant([1, 2, 3]);
        var obj_state = frp.constant({
            one: 1,
            two: 2,
            three: 3
        });

        expect(number_state.isSettable()).to.be.false;
        expect(bool_state.isSettable()).to.be.false;
        expect(string_state.isSettable()).to.be.false;
        expect(array_state.isSettable()).to.be.false;
        expect(obj_state.isSettable()).to.be.false;

        expect(number_state.get()).to.eql(1);
        expect(bool_state.get()).to.eql(true);
        expect(string_state.get()).to.eql('frp rocks!');
        expect(array_state.get()).to.eql([1, 2, 3]);
        expect(obj_state.get()).to.eql({
            one: 1,
            two: 2,
            three: 3
        });
    });

    it('should accept no arguments', function () {
        var undefinedAccessor = frp.constant();

        expect(undefinedAccessor.isSettable()).to.be.false;

        expect(undefinedAccessor.get()).to.be.undefined;
    });
});