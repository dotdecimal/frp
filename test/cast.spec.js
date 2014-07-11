var expect = require('chai').expect;
var frp = require('../src/frp');

describe('frp#cast', function() {
    it('should cast a given value to an accessor', function () {
        var b = true;
        var n = 2;
        var s = 'three';

        var obj = {
            one: true,
            two: 2,
            three: 'three'
        };

        var arr = [true, 2, 'three'];

        var state_bool = frp.cast(b);
        var state_number = frp.cast(n);
        var state_string = frp.cast(s);
        var state_obj = frp.cast(obj);
        var state_array = frp.cast(arr);

        expect(frp.isAccessor(state_bool)).to.be.true;
        expect(frp.isAccessor(state_number)).to.be.true;
        expect(frp.isAccessor(state_string)).to.be.true;
        expect(frp.isAccessor(state_obj)).to.be.true;
        expect(frp.isAccessor(state_array)).to.be.true;
    });

    it('should return an accessor as is', function () {
        var state = frp.state({
            one: true,
            two: 2,
            three: 'three',
            four: {
                five: ':)'
            }
        });

        var casted = frp.cast(state);

        expect(casted).to.eql(state);
    });
});