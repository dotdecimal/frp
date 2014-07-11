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