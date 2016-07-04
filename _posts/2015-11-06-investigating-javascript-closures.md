---
layout: post
title:  "Investigating JavaScript closures"
date:   2015-11-06
categories: javascript
---

I was looking up JavaScript closures this morning and came across this [terrific Stack Overflow answer](http://stackoverflow.com/questions/111102/how-do-javascript-closures-work) (the first one with all the examples).

But, one of the examples (#5) confused me so I decided to take a closer look at it. Here’s the code, taken directly from SO with a little bit of formatting:

``` js
function buildList(list) {
    var result = [];
    for (var i = 0; i < list.length; i++) {
        var item = 'item' + i;
        result.push(function() {
            alert(item + ' ' + list[i])
        });
    }
    return result;
}

function testList() {
    var fnlist = buildList([1,2,3]);
    // Using j only to help prevent confusion -- could use i.
    for (var j = 0; j < fnlist.length; j++) {
        fnlist[j]();
    }
}
```

When I ran the code in the console, calling `testList()`, I got `'item2 undefined'` in an alert three times. But according to the explanation, I should have seen `'item3 undefined'`.

> Note that when you run the example, `'item3 undefined'` is alerted three times! This is because just like previous examples, there is only one closure for the local variables for `buildList`. When the anonymous functions are called on the line `fnlist[j]();` they all use the same single closure, and they use the current value for `i` and `item` within that one closure (where `i` has a value of 3 because the loop had completed, and `item` has a value of `'item3'`).

Unless there’s something wrong with my browser, I don’t think that’s completely correct. Let’s look at the `buildList` function in depth.

``` js
function buildList(list) {
```

Passing in a variable called `list` to the function.

``` js
var result = [];
```
Just initiating an empty array.

``` js
for (var i = 0; i < list.length; i++) {
```

Here we have a standard `for` loop. But in JavaScript, you have to remember that the variable `i` gets hoisted to the top of the current scope (which in this case is the scope of the `buildList` function). So once this loop is done, we’ll still have access to `i`.

``` js
var item = 'item' + i;
```

Creating a string using the word ‘item’ and the current value of `i`. I think this is where my confusion is coming from. More on that later.

``` js
result.push(function() {
    alert(item + ' ' + list[i])
});
```

Here’s where the fun closure stuff happens. We’re creating new functions and pushing them onto the `result` array. These functions are special because they have access to the enclosing function’s variables, like `list` and `i`. And they will still have access after `buildList` is done running—the variables are saved in a closure.

``` js
return result;
``` 

The array of functions is returned.

Calling `buildList([1, 2, 3])` and then each of the functions in `result` always yields `'item2 undefined'`. The `undefined` part makes sense, because at the end of the `for` loop, `i` increments one last time to `3`. So `i = 3` at the point in time when we call the functions in `result`. Since the input array `[1, 2, 3]` only has three elements, trying to access the fourth element at index `3` results in `undefined`.

As for why I’m seeing `'item2'` and not `'item3'`, I think that’s because the `item` string is set in this line:

``` js
var item = 'item' + i;
```

Since the last time the code inside the loop is run is when `i = 2`, the `item` string is set to `'item2'`, not `'item' + i`. In other words, the `i` is evaluated at that point in time, and not later, when `i = 3`.

I hope this is correct! I would comment on the SO answer, but I don’t have that privilege yet.
