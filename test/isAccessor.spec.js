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

describe('frp#isAccessor', function () {
    it('should return true if the value is an accessor', function () {
        var number_state = frp.state(1);
        var bool_state = frp.state(true);
        var string_state = frp.state('frp rocks!');
        var array_state = frp.state([1, 2, 3]);
        var obj_state = frp.state({
            one: 1,
            two: 2,
            three: 3
        });

        expect(frp.isAccessor(number_state)).to.be.true;
        expect(frp.isAccessor(bool_state)).to.be.true;
        expect(frp.isAccessor(string_state)).to.be.true;
        expect(frp.isAccessor(array_state)).to.be.true;
        expect(frp.isAccessor(obj_state)).to.be.true;
    });

    it('should return false if the value is not an accessor', function () {
        var number = 1;
        var bool = true;
        var string = 'frp rocks!';
        var arr = [1, 2, 3];
        var obj = {
            one: 1,
            two: 2,
            three: 3
        };

        expect(frp.isAccessor(number)).to.be.false;
        expect(frp.isAccessor(bool)).to.be.false;
        expect(frp.isAccessor(string)).to.be.false;
        expect(frp.isAccessor(arr)).to.be.false;
        expect(frp.isAccessor(obj)).to.be.false;
    });
});