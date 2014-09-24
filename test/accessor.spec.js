/* istanbul ignore next: hard to test; *//* Functional Reactive Programming (frp) Tests
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

describe('frp:Accessor', function() {
    describe('Accessor#get', function() {
        it('should return the current value of the accessor', function() {
            var number_state = frp.state(1);
            var bool_state = frp.state(true);
            var string_state = frp.state('frp rocks!');
            var array_state = frp.state([1, 2, 3]);
            var obj_state = frp.state({
                one: 1,
                two: 2,
                three: 3
            });

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

        it('should return undefined if the state is unresolved', function() {
            var state = frp.state();

            expect(state.get()).to.be.undefined;
        });
    });

    describe('Accessor#isGettable', function() {
        it('shoud return true if the accessor has a get method', function() {
            var state = frp.state();

            expect(state.isGettable()).to.be.true;
        });
    });

    describe('Accessor#isSettable', function() {
        it('should return true if the accessor has a set method', function() {
            var state = frp.state();

            expect(state.isSettable()).to.be.true;
        });

        it('should return true if the accessor has a set method', function() {
            var state = frp.constant(1);

            expect(state.isSettable()).to.be.false;
        });
    });

    describe('Accessor#isObject', function() {
        it('should have state true if the value is an object', function(done) {
            var state = frp.state({
                one: 1,
                two: 2,
                three: 3
            });

            state.isObject().onResolve(function(value) {
                expect(value).to.be.true;
                done();
            });
        });

        it('should have state false if the value is not an object', function(done) {
            var state = frp.state(1);

            state.isObject().onResolve(function(value) {
                expect(value).to.be.false;
                done();
            });
        });

        it('should have state false if the value is unresolved', function(done) {
            var state = frp.state({
                one: 1,
                two: 2,
                three: 3
            });

            var timeout = setTimeout(function() {
                expect(false).to.be.true;
            }, 1000);

            var triggered = false;
            state.isObject().onResolve(function(value) {
                if (value) {
                    triggered = true;
                    state._unresolve();
                } else {
                    clearTimeout(timeout);
                    expect(triggered).to.be.true;
                    done();
                }
            });
        });

        it('should propagate error trigger', function(done) {
            var state = frp.state({
                one: 1,
                two: 2,
                three: 3
            });

            var timeout = setTimeout(function() {
                expect(false).to.be.true;
            }, 1000);

            state.isObject().onResolve(function(value) {
                state._throw(new Error('An error was encountered'));
            }).onError(function(errs) {
                clearTimeout(timeout);
                expect(errs[0]).be.an.instanceof(Error);
                done();
            });
        });
    });

    describe('Accessor#isResolved', function() {
        it('should have state true if the value is resolved', function(done) {
            var state = frp.state(1);

            state.isResolved().onResolve(function(value) {
                expect(value).to.be.true;
                done();
            });
        });

        it('should have state false if the value is unresolved', function(done) {
            var state = frp.state();

            state.isResolved().onResolve(function(value) {
                expect(value).to.be.false;
                done();
            });
        });

        it('should have state false if the value becomes unresolved', function(done) {
            var state = frp.state(1);

            var timeout = setTimeout(function() {
                expect(false).to.be.true;
            }, 1000);

            var triggered = false;
            state.isResolved().onResolve(function(value) {
                if (value) {
                    triggered = true;
                    state._unresolve();
                } else {
                    clearTimeout(timeout);
                    expect(triggered).to.be.true;
                    done();
                }
            });
        });

        it('should propagate error trigger', function(done) {
            var state = frp.state(1);

            var timeout = setTimeout(function() {
                expect(false).to.be.true;
            }, 1000);

            state.isResolved().onResolve(function(value) {
                state._throw(new Error('An error was encountered'));
            }).onError(function(errs) {
                clearTimeout(timeout);
                expect(errs[0]).be.an.instanceof(Error);
                done();
            });
        });
    });

    describe('Accessor#isUndefined', function() {
        it('should have an initial state of true before the value is resolved', function(done) {
            var state = frp.state();

            var timeout = setTimeout(function() {
                expect(false).to.be.true;
            }, 1000);

            state.isUndefined().onResolve(function(value) {
                expect(value).to.be.true;
                clearTimeout(timeout);
                done();
            });
        });

        it('should return true if the resolved value is undefined', function(done) {
            var state = frp.state(void 0);

            var timeout = setTimeout(function() {
                expect(false).to.be.true;
            }, 1000);

            state.isUndefined().onResolve(function(value) {
                expect(value).to.be.true;
                clearTimeout(timeout);
                done();
            });
        });

        it('should return false if the resolved value is defined', function(done) {
            var state = frp.state(1);

            var timeout = setTimeout(function() {
                expect(false).to.be.true;
            }, 1000);

            var triggered = false;
            state.isUndefined().onResolve(function(value) {
                if (value) {
                    triggered = true;
                } else {
                    expect(triggered).to.be.true;
                    clearTimeout(timeout);
                    done();
                }
            });
        });

        it('should return true if the value becomes unresolved', function(done) {
            var state = frp.state(1);

            var timeout = setTimeout(function() {
                expect(false).to.be.true;
            }, 1000);

            var flag = 0;
            var triggered = false;
            state.isUndefined().onResolve(function(value) {
                if (flag === 2) {
                    clearTimeout(timeout);
                    expect(triggered).to.be.true;
                    done();
                } else {
                    if (flag === 1) {
                        triggered = true;
                        state._unresolve();
                    }
                    flag++;
                }
            });
        });

        it('should propagate error trigger', function(done) {
            var state = frp.state(1);

            var timeout = setTimeout(function() {
                expect(false).to.be.true;
            }, 1000);

            state.isUndefined().onResolve(function(value) {
                state._throw(new Error('An error was encountered'));
            }).onError(function(errs) {
                clearTimeout(timeout);
                expect(errs[0]).be.an.instanceof(Error);
                done();
            });
        });
    });

    describe('Accessor#at', function() {
        it('should access an array at a particular index', function(done) {
            var state_arr = frp.state([0, 1, 2]);

            state_arr.at(1).onResolve(function(value) {
                expect(value).to.eql(1);
                done();
            });
        });

        it('should access an array-like object at a particular index', function(done) {
            var state_obj = frp.state({
                '0': 0,
                '1': 1,
                '2': 2
            });

            state_obj.at(1).onResolve(function(value) {
                expect(value).to.eql(1);
                done();
            });
        });
    });

    describe('Accessor#not', function() {
        it('should return true if the value is the number 0', function(done) {
            var number_state = frp.state(0);

            number_state.not().onResolve(function(value) {
                expect(value).to.be.true;
                done();
            });
        });

        it('should return false if the value is a non-zero number', function(done) {
            var number_state = frp.state(1);

            number_state.not().onResolve(function(value) {
                expect(value).to.be.false;
                done();
            });
        });

        it('should return true if the value is a boolean false', function(done) {
            var bool_state = frp.state(false);

            bool_state.not().onResolve(function(value) {
                expect(value).to.be.true;
                done();
            });
        });

        it('should return false if the value is a boolean true', function(done) {
            var bool_state = frp.state(true);

            bool_state.not().onResolve(function(value) {
                expect(value).to.be.false;
                done();
            });
        });

        it('should return true if the value is an empty string', function(done) {
            var string_state = frp.state('');

            string_state.not().onResolve(function(value) {
                expect(value).to.be.true;
                done();
            });
        });

        it('should return false if the value is a non-empty string', function(done) {
            var string_state = frp.state('frp rocks!');

            string_state.not().onResolve(function(value) {
                expect(value).to.be.false;
                done();
            });
        });

        it('should return true if the value is null', function(done) {
            var null_state = frp.state(null);

            null_state.not().onResolve(function(value) {
                expect(value).to.be.true;
                done();
            });
        });

        it('should return true if the value is undefined', function(done) {
            var undefined_state = frp.state(undefined);

            undefined_state.not().onResolve(function(value) {
                expect(value).to.be.true;
                done();
            });
        });

        it('should return false if the value is an array', function(done) {
            var array_state = frp.state([1, 2, 3]);

            array_state.not().onResolve(function(value) {
                expect(value).to.be.false;
                done();
            });
        });

        it('should return false if the value is an array', function(done) {
            var obj_state = frp.state({
                one: 1,
                two: 2,
                three: 3
            });

            obj_state.not().onResolve(function(value) {
                expect(value).to.be.false;
                done();
            });
        });

        it('should propagate unresolved state', function(done) {
            var state = frp.state(0);

            var timeout = setTimeout(function() {
                expect(false).to.be.true;
            }, 1000);

            state.not().onResolve(function(value) {
                state._unresolve();
            }).onUnresolve(function() {
                clearTimeout(timeout);
                done();
            });
        });

        it('should propagate error trigger', function(done) {
            var state = frp.state(0);

            var timeout = setTimeout(function() {
                expect(false).to.be.true;
            }, 1000);

            state.not().onResolve(function(value) {
                state._throw(new Error('An error was encountered'));
            }).onError(function(errs) {
                clearTimeout(timeout);
                expect(errs[0]).be.an.instanceof(Error);
                done();
            });
        });
    });

    describe('Accessor#delay', function() {
        it('should delay resolution for the specified number of ms', function(done) {
            var start = +new Date();
            var state = frp.state(1).delay(1000);

            state.onResolve(function(value) {
                var timeDif = (+new Date()) - start;
                expect(timeDif).to.be.at.least(1000);
                done();
            });
        });

        it('should restart the timer if the value was reset before the first resolve', function(done) {
            var start = +new Date();
            var state_a = frp.state(1)
            var state = state_a.delay(1000);

            setTimeout(function() {
                state_a.set(2);
            }, 500);

            state.onResolve(function(value) {
                var timeDif = (+new Date()) - start;
                expect(timeDif).to.be.at.least(1500);
                expect(value).to.eql(2);
                done();
            });
        });

        it('should propagate unresolved state', function(done) {
            var start = +new Date();
            var state_a = frp.state(1)
            var state = state_a.delay(500);

            var timeout = setTimeout(function() {
                expect(false).to.be.true;
            }, 1000);

            state.onResolve(function(value) {
                state_a._unresolve();
            }).onUnresolve(function() {
                clearTimeout(timeout);
                done();
            });
        });

        it('should propagate error trigger', function(done) {
            var start = +new Date();
            var state_a = frp.state(1)
            var state = state_a.delay(500);

            var timeout = setTimeout(function() {
                expect(false).to.be.true;
            }, 1000);

            state.onResolve(function(value) {
                state_a._throw(new Error('An error was encountered'));
            }).onError(function(errs) {
                clearTimeout(timeout);
                expect(errs[0]).be.an.instanceof(Error);
                done();
            });
        });
    });

    describe('Accessor#property', function() {
        it('should return a property accessor for accessing object properties', function(done) {
            var obj_state = frp.state({
                one: 1,
                two: 2,
                three: 3
            });

            obj_state.property('.one').onResolve(function(value) {
                expect(value).to.eql(1);
                done();
            });
        });

        it('should become unresolved if the property does not exist in the object', function(done) {
            var obj_state = frp.state({
                one: 1,
                two: 2,
                three: 3
            });

            obj_state.property('.four').startWith(4).onResolve(function(value) {
                expect(false).to.be.true;
            }).onUnresolve(function() {
                done();
            });
        });

        it('should propagate unresolved state', function(done) {
            var obj_state = frp.state({
                one: 1,
                two: 2,
                three: 3
            });

            var timeout = setTimeout(function() {
                expect(false).to.be.true;
            }, 1000);

            obj_state.property('.one').onResolve(function(value) {
                obj_state._unresolve()
            }).onUnresolve(function() {
                clearTimeout(timeout);
                done();
            });
        });

        it('should propagate error trigger', function(done) {
            var obj_state = frp.state({
                one: 1,
                two: 2,
                three: 3
            });

            var timeout = setTimeout(function() {
                expect(false).to.be.true;
            }, 1000);

            obj_state.property('.one').onResolve(function(value) {
                obj_state._throw(new Error('An error was encountered'))
            }).onError(function(errs) {
                clearTimeout(timeout);
                expect(errs[0]).be.an.instanceof(Error);
                done();
            });
        });
    });

    describe('Accessor#startWith', function() {
        it('should start with a certain value', function(done) {
            var state = frp.state().startWith(1);

            state.onResolve(function(value) {
                expect(value).to.be.a('number').and.to.eql(1);
                done();
            });
        });

        it('should ignore the start value it has already been resolved', function(done) {
            var state = frp.state(2).startWith(1);

            state.onResolve(function(value) {
                expect(value).to.be.a('number').and.to.eql(2);
                done();
            });
        });
    });

    describe('Accessor#then', function() {
        it('should map state to another value', function(done) {
            var state = frp.state(1);

            state.then(function(value) {
                return value + 1;
            }).onResolve(function(value) {
                expect(value).to.eql(2);
                done();
            });
        });
    });
});

describe('frp:PropertyAccessor', function() {
    describe('PropertyAccessor#set', function() {
        it('should set a property accessor (shallow)', function(done) {
            var obj_state = frp.state({
                one: 1,
                two: 2,
                three: 3
            });

            var prop = obj_state.property('.one');

            var trigger = false;
            prop.onResolve(function(value) {
                if (value === 1) {
                    trigger = true;
                    prop.set('one');
                } else {
                    expect(value).to.eql('one');
                    expect(trigger).to.be.true;
                    done();
                }
            });
        });

        it('should set a property accessor (deep)', function(done) {
            var obj_state = frp.state({
                person: {
                    first: 'John',
                    last: 'Doe'
                }
            });

            var prop = obj_state.property('.person.first');

            var trigger = false;
            prop.onResolve(function(value) {
                if (value === 'John') {
                    trigger = true;
                    prop.set('Jane');
                } else {
                    expect(value).to.eql('Jane');
                    expect(trigger).to.be.true;
                    done();
                }
            });
        });

        it('should deeply construct the property with a value (deep)', function(done) {
            var obj_state = frp.state();

            var prop = obj_state.property('.person.first');

            prop.set('John');

            obj_state.onResolve(function(value) {
                expect(value).to.eql({ person: { first: 'John' } });
                done();
            });
        });
    });
});