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

describe('frp#future', function () {
    it('should create a future accessor based on the given function (non accessor)', function (done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var handler = function (a, b) {
            return a + b
        };

        frp.future(handler, state_a, state_b).onResolve(function (value) {
            expect(value).to.eql(3);
            done();
        });
    });

    it('should create a future accessor based on the given function (accessor)', function (done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var handler = function (a, b) {
            return frp.join(a, b, function (c, d) {
                return c + d;
            });
        };

        frp.future(handler, state_a, state_b).onResolve(function (value) {
            expect(value).to.eql(3);
            done();
        });
    });

    it('should propagate unresolved state (accessor)', function (done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var state = frp.state(3);
        var handler = function (a, b) {
            return frp.join(a, b, function (c, d) {
                return state;
            });
        };

        var timeout = setTimeout(function() {
            expect(false).to.be.true;
        }, 1000);

        frp.future(handler, state_a, state_b).onResolve(function (value) {
            state._unresolve();
        }).onUnresolve(function () {
            clearTimeout(timeout);
            done();
        });
    });

    it('should propagate error trigger (accessor)', function (done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var state = frp.state(3);
        var handler = function (a, b) {
            return frp.join(a, b, function (c, d) {
                return state;
            });
        };

        var timeout = setTimeout(function() {
            expect(false).to.be.true;
        }, 1000);

        frp.future(handler, state_a, state_b).onResolve(function (value) {
            state._throw(new Error('An error was encountered'));
        }).onError(function (errs) {
            clearTimeout(timeout);
            expect(errs[0]).be.an.instanceof(Error);
            done();
        });
    });

    it('should propagate unresolved arguments', function (done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var handler = function (a, b) {
            return a + b;
        };

        var timeout = setTimeout(function() {
            expect(false).to.be.true;
        }, 1000);

        frp.future(handler, state_a, state_b).onResolve(function (value) {
            state_b._unresolve();
        }).onUnresolve(function () {
            clearTimeout(timeout);
            done();
        });
    });

    it('should propagate error trigger (arguments)', function (done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var handler = function (a, b) {
            return a + b;
        };

        var timeout = setTimeout(function() {
            expect(false).to.be.true;
        }, 1000);

        frp.future(handler, state_a, state_b).onResolve(function (value) {
            state_b._throw(new Error('An error was encountered'));
        }).onError(function (errs) {
            clearTimeout(timeout);
            expect(errs[0]).be.an.instanceof(Error);
            done();
        });
    });
});