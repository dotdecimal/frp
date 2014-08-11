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
var Promise = require('bluebird').Promise;
var frp = require('../lib/frp');

describe('frp#promise', function() {
    it('should return a promise accessor that is resolved with the promise', function(done) {
        var p = new Promise(function(resolve, reject) {
            resolve('I solemnly swear I am up to no good');
        });

        var state = frp.promise(p);

        state.onResolve(function(value) {
            expect(value).to.eql('I solemnly swear I am up to no good');
            done();
        });
    });

    it('should return a promise accessor that throws an error on rejection', function(done) {
        var p = new Promise(function(resolve, reject) {
            reject(new Error('I solemnly swear I am up to no good'));
        });

        var state = frp.promise(p);

        state.onError(function(errs) {
            expect(errs[0]).be.an.instanceof(Error);
            done();
        });
    });
});

describe('frp#deferred', function() {
    it('should return a promise accessor that is resolved with the promise', function(done) {
        var handler = function(resolve, reject) {
            resolve('I solemnly swear I am up to no good');
        };

        var state = frp.deferred(handler);

        state.onResolve(function(value) {
            expect(value).to.eql('I solemnly swear I am up to no good');
            done();
        });
    });

    it('should return a promise accessor that throws an error on rejection', function(done) {
        var handler = function(resolve, reject) {
            reject(new Error('I solemnly swear I am up to no good'));
        };

        var state = frp.deferred(handler);

        state.onError(function(errs) {
            expect(errs[0]).be.an.instanceof(Error);
            done();
        });
    });
});