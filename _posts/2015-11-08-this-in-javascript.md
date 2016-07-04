---
layout: post
title:  "`this` in JavaScript"
date:   2015-11-08
categories: javascript
---

`this` has always been a confusing JavaScript keyword to me. Thanks to the _[You Don’t Know JavaScript](https://github.com/getify/You-Dont-Know-JS)_ series by Kyle Simpson, it’s become slightly less confusing.

This post will mostly be notes I took from the second chapter of the third book in the series, _`this` &amp; Object Prototypes_.

(My only major gripe was that all the code examples used `foo`, `bar`, and `baz`. I feel that meaningless functions make it hard to understand how you would use `this` in real life code. Hence, I tried to come up with my own examples using more meaningful functions, but unsurprisingly, it was rather difficult.)

First, the author makes the point that `this` has nothing to do with scope:

> To be clear, `this` does not, in any way, refer to a function’s lexical scope.

So what _does_ `this` have to do with?

> `this` is not an author-time binding but a runtime binding. It is contextual based on the conditions of the function’s invocation. `this` binding has nothing to do with where a function is declared, but has instead everything to do with the manner in which the function is called.

You have to examine the call-site and the call-stack and consult the following four rules to figure out what `this` refers to.

## Rule One: Default Binding

*   most common case

*   standalone function invocation

*   default catch-all rule

*   applies when a function is called with a plain, undecorated function reference

    var counter = 0;

    function incrementCounter() {
        this.counter++;
    }

    incrementCounter();
    console.log(counter); // 1 - got incremented`</pre>

    Note: if the function is in `strict mode`, the global object is not eligible for the default binding, so `this.counter` in the above code would throw an error.

    ## Rule Two: Implicit Binding

*   consider whether the call-site has a context object (i.e., owning/containing object)<pre>`var counter = 0;

    function incrementCounter() {
        this.counter++;
    }

    var object = {
        counter: 10,
        incrementCounter: incrementCounter,
    };

    object.incrementCounter();
    console.log(counter); // 0 - did not get incremented
    console.log(object.counter); // 11 - got incremented`</pre>

    But wait! There’s more. In some situations, the implicit binding can be lost.

    <pre>`var counter = 0;

    function incrementCounter() {
        this.counter++;
    }

    var object = {
        counter: 10,
        incrementCounter: incrementCounter,
    };

    var copyOfIncrementCounter = object.incrementCounter;

    copyOfIncrementCounter();
    console.log(counter); // 1 - got incremented
    console.log(object.counter); // 10 - did not get incremented
    `</pre>

    Here, `copyOfIncrementCounter` looks like it’s a reference to `object.incrementCounter`, but it’s actually a reference to the global `incrementCounter`. So we fall back to the default binding rule and the global `counter` variable gets incremented.

    Another example of this situation:

    <pre>`var counter = 0;

    function incrementCounter() {
        this.counter++;
    }

    var object = {
        counter: 10,
        incrementCounter: incrementCounter
    };

    function doSomething(callback) {
        callback();
    }

    doSomething(object.incrementCounter);
    console.log(counter); // 1 - got incremented
    console.log(object.counter); // 10 - did not get incremented
    `</pre>

    Why?

    > Parameter passing is just an implicit assignment, and since we’re passing a function, it’s an implicit reference assignment, so the end result is the same as the previous snippet.

    ## Rule Three: Explicit Binding

*   force a function call to use a particular object as `this`
*   use `call` and `apply`, which are available to all functions
*   `call` and `apply` are methods that take an object to use for `this` as their first argument
*   `call` and `apply` are identical with respect to `this`; we won’t worry about their differences for now<pre>`var counter = 0;

    function incrementCounter() {
        this.counter++;
    }

    var object = {
        counter: 10
    };

    incrementCounter.call(object);
    console.log(counter); // 0 - did not get incremented
    console.log(object.counter); // 11 - got incremented`</pre>

    Note that if a primitive is passed instead of an object, it gets wrapped in its object-form (`String`, `Boolean`, or `Number`). This is called _boxing_.

    > Unfortunately, explicit binding alone still doesn’t offer any solution to the issue mentioned previously, of a function “losing” its intended `this` binding…

    …but _hard binding_, a variation pattern around explicit binding, will work.

    <pre>`var counter = 0;

    function incrementCounter() {
        this.counter++;
    }

    var object = {
        counter: 10
    };

    var incrementCounterWrapper = function() {
        incrementCounter.call(object);
    }

    incrementCounterWrapper();
    console.log(counter); // 0 - did not get incremented
    console.log(object.counter); // 11 - got incremented

    incrementCounterWrapper.call(window); // will it use the global counter? nope!
    console.log(counter); // 0 - did not get incremented
    console.log(object.counter); // 12 - got incremented
    `</pre>

    What’s happening here is `incrementCounterWrapper` internally calls `incrementCounter` with `object` as `this`. No matter how `incrementCounterWrapper` is called, it will always manually invoke `incrementCounter` with `object`.

    > Since hard binding is such a common pattern, it’s provided with a built-in utility as of ES5, `Function.prototype.bind`

    > `bind(..)` returns a new function that is hardcoded to call the original function with the `this` context set as you specified.

    <pre>`var counter = 0;

    function incrementCounter() {
        this.counter++;
    }

    var object = {
        counter: 10
    };

    var incrementCounterWrapper = incrementCounter.bind(object);

    incrementCounterWrapper();
    console.log(counter); // 0 - did not get incremented
    console.log(object.counter); // 11 - got incremented
    `</pre>

    ## Rule Four: `new` Binding

    Ah, the `new` keyword. Another confusing one that I often see but am never sure when to use myself.

    > JavaScript has a `new` operator, and the code pattern to use it looks basically identical to what we see in those class-oriented languages; most developers assume that JavaScript’s mechanism is doing something similar. However, there really is no connection to class-oriented functionality implied by `new` usage in JS.

    Okay, what else?

    > First, let’s re-define what a “constructor” in JavaScript is. In JS, constructors are just functions that happen to be called with the `new` operator in front of them. They are not attached to classes, nor are they instantiating a class. They are not even special types of functions. They’re just regular functions that are, in essence, hijacked by the use of new in their invocation.

    How is `new` relevant to `this`, then?

    Well, when a function is invoked with `new`, a brand new object is created. That object is set as the `this` binding for that function call. And that function call will return the new object (unless the function returns its own alternate object).

    <pre>`var counter = 0;

    function incrementCounter(counter) {
        this.counter = counter;
        this.counter++;
    }

    var newIncrementCounter = new incrementCounter(10);

    console.log(counter); // 0 - did not get incremented
    console.log(newIncrementCounter.counter); // 11 - got incremented

## Rule Precedence

1.  `new` binding
2.  explicit binding
3.  implicit binding
4.  default binding

More detailed:

> 1.  Is the function called with `new` (new binding)? If so, `this` is the newly constructed object.
> `var bar = new foo()`
> 2.  Is the function called with `call` or `apply` (explicit binding), even hidden inside a `bind` hard binding? If so, `this` is the explicitly specified object.
> `var bar = foo.call( obj2 )`
> 3.  Is the function called with a context (implicit binding), otherwise known as an owning or containing object? If so, `this` is that context object.
> `var bar = obj1.foo()`
> 4.  Otherwise, default the `this` (default binding). If in `strict mode`, pick `undefined`, otherwise pick the global object.
> `var bar = foo()`

For a discussion on why this is the case, read the original material [here](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%2526%20object%20prototypes/ch2.md#everything-in-order).

(And just read the whole thing while you’re at it.)