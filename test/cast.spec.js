/* Functional Reactive Programming (frp) Tests
 *
 * Copyright (c) 2014 .decimal, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var expect = require('chai').expect;
var frp = require('../lib/frp');

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