---
layout: post
title:  "Project Euler: 2013 and now"
date:   2016-06-30
categories: javascript java #throwbackthursday
---

In college, I did a bunch of [Project Euler](https://projecteuler.net/) problems (in Java) to practice for tests and interviews. A few weeks ago, I thought it would be fun to attempt some of them in JavaScript.

Past me had saved my solutions to GitHub, and I just now looked at them for the first time in years. And wow. Talk about embarrassing.

Or, to frame it more positively, I’ve actually gotten better at coding after graduating!

For example, here’s the first problem:

> Find the sum of all the multiples of 3 or 5 below 1000.

Pretty simple, right?

``` js
function sumOfAllMultiples() {
  var sum = 0;
  
  for (var i = 0; i < 1000; i++) {
    if (i % 3 === 0 || i % 5 === 0) {
      sum += i;
    }
  }
  
  return sum;
}
```

I checked out my old solution, expecting more or less the same thing but in Java. Cue facepalm.

``` java
public class Problem1 {
  public static void main(String [] args) {
    int sum3 = 0;
    int sum5 = 0;
    int sum15 = 0;
    
    for (int i = 3; i < 1000; i += 3) {
      sum3 += i;
    }
    
    for (int i = 5; i < 1000; i += 5) {
      sum5 += i;
    }
    
    for (int i = 15; i < 1000; i += 15) {
      sum15 += i;
    }
    
    System.out.print(sum3 + sum5 - sum15);
  }
}
```

Yeah, I don’t know.

It gets better (or worse) when I look at my old solution to the second problem:

> By considering the terms in the Fibonacci sequence whose values do not exceed four million, find the sum of the even-valued terms.

``` java
public class Problem2 {
  public static void main(String[] args) {
    int sum = 0;
    
    for (int index = 1; fibonacci(index) < 4000000; index++) {
      if (fibonacci(index) % 2 == 0) {
        sum += fibonacci(index);
      }
    }
    
    System.out.print(sum);
  }
     
  // Find the nth Fibonacci term.
  public static int fibonacci(int n) {
    if (n == 1) return 1;
    if (n == 2) return 2;
    
    return (fibonacci(n - 1) + (fibonacci(n - 2)));
  }
}
```

I used a recursive solution to find the nth Fibonacci number, which isn’t too surprising since I’m pretty sure I had just learned about recursion at that time. But then I called that recursive method three times in that `for` loop?

Here’s my iterative JavaScript solution:

``` js
function evenFib() {
  var MAX = 4000000,
      first = 1,
      second = 2,
      sum = 2,
      temp;
   
  while (first + second < MAX) {
    temp = first;
    first = second;
    second += temp;
     
    if (second % 2 === 0) {
      sum += second;
    }
  }
   
  return sum;
}
```
