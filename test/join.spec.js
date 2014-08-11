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

describe('frp#join', function() {
    it('should properly execute a join', function(done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);

        frp.join(state_a, state_b, function(arg0, arg1) {
            return arg0 + arg1;
        }).onResolve(function(value) {
            expect(value).to.be.a('number').and.eql(3);
            done();
        });
    });

    it('should properly execute a join for an accessor type', function(done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);

        frp.join(state_a, state_b, function(arg0, arg1) {
            return frp.state(arg0 + arg1);
        }).onResolve(function(value) {
            expect(value).to.be.a('number').and.eql(3);
            done();
        });
    });

    it('should join with non-accessor elements', function(done) {
        var state_a = frp.state(1);
        var b = 2;

        frp.join(state_a, b, function(arg0, arg1) {
            return arg0 + arg1;
        }).onResolve(function(value) {
            expect(value).to.be.a('number').and.eql(3);
            done();
        });
    });

    it('should propagate unresolved state', function(done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);

        var timeout = setTimeout(function () {
            expect(false).to.be.true;
        }, 1000);

        frp.join(state_a, state_b, function(arg0, arg1) {
            return arg0 + arg1;
        }).onResolve(function(value) {
            state_b._unresolve();
        }).onUnresolve(function () {
            clearTimeout(timeout);
            done();
        });
    });

    it('should propagate unresolved state (for accessor type)', function(done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var state_final = frp.state('hello');

        var timeout = setTimeout(function () {
            expect(false).to.be.true;
        }, 1000);

        frp.join(state_a, state_b, function(arg0, arg1) {
            return state_final;
        }).onResolve(function(value) {
            state_final._unresolve();
        }).onUnresolve(function () {
            clearTimeout(timeout);
            done();
        });
    });

    it('should propagate error trigger', function(done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);

        var timeout = setTimeout(function () {
            expect(false).to.be.true;
        }, 1000);

        frp.join(state_a, state_b, function(arg0, arg1) {
            return arg0 + arg1;
        }).onResolve(function(value) {
            state_b._throw(new Error('An error was encountered'));
        }).onError(function (errs) {
            clearTimeout(timeout);
            expect(errs[0]).be.an.instanceof(Error);
            done();
        });
    });

    it('should propagate error trigger (for accessor type)', function(done) {
        var state_a = frp.state(1);
        var state_b = frp.state(2);
        var state_final = frp.state('hello');

        var timeout = setTimeout(function () {
            expect(false).to.be.true;
        }, 1000);

        frp.join(state_a, state_b, function(arg0, arg1) {
            return state_final;
        }).onResolve(function(value) {
            state_final._throw(new Error('An error was encountered'));
        }).onError(function (errs) {
            clearTimeout(timeout);
            expect(errs[0]).be.an.instanceof(Error);
            done();
        });
    });
});