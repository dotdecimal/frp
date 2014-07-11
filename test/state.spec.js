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

describe('frp#state', function() {
    it('should create state with initial values', function() {
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

    it('should create empty, unresolved state', function() {
        var empty_state = frp.state();

        expect(empty_state).to.have.property('_resolved').that.is.false;
        expect(empty_state).to.have.ownProperty('_value');
        expect(empty_state._value).to.be.undefined;
    });

    it('should create state bound to a value accessor', function(done) {
        var state_a = frp.state();
        var state_b = frp.state(state_a);

        expect(state_a).to.have.property('_resolved').that.is.false;
        expect(state_a).to.have.ownProperty('_value');
        expect(state_a._value).to.be.undefined;
        expect(state_b).to.have.property('_resolved').that.is.false;
        expect(state_b).to.have.ownProperty('_value');
        expect(state_b._value).to.be.undefined;

        state_a.set(1);

        state_b.onResolve(function(value) {
            expect(value).to.eql(1);
            done();
        });
    });

    it('should create bound state that propogates unresolved events', function(done) {
        var state_a = frp.state();
        var state_b = frp.state(state_a);

        expect(state_a).to.have.property('_resolved').that.is.false;
        expect(state_a).to.have.ownProperty('_value');
        expect(state_a._value).to.be.undefined;
        expect(state_b).to.have.property('_resolved').that.is.false;
        expect(state_b).to.have.ownProperty('_value');
        expect(state_b._value).to.be.undefined;

        state_a.set(1);

        state_b.onResolve(function(value) {
            state_a._unresolve();
        });

        state_b.onUnresolve(function() {
            done();
        });
    });

    it('should create bound state that propogates error events', function(done) {
        var state_a = frp.state();
        var state_b = frp.state(state_a);

        expect(state_a).to.have.property('_resolved').that.is.false;
        expect(state_a).to.have.ownProperty('_value');
        expect(state_a._value).to.be.undefined;
        expect(state_b).to.have.property('_resolved').that.is.false;
        expect(state_b).to.have.ownProperty('_value');
        expect(state_b._value).to.be.undefined;

        state_a.set(1);

        state_b.onResolve(function(value) {
            state_a._throw(new Error('An error was encountered'));
        });

        state_b.onError(function(errs) {
            expect(errs[0]).be.an.instanceof(Error);
            done();
        });
    });
});