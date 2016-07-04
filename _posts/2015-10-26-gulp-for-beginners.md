---
layout: post
title:  "Gulp for beginners"
date:   2015-10-26
categories: javascript
---

[Gulp](http://gulpjs.com) is a JavaScript-based build tool/task runner. What does that mean?

Say you’re working on a website and you’re writing CSS using [Sass](http://sass-lang.com) and JavaScript using [CoffeeScript](http://coffeescript.org). You’ll need to convert it to plain CSS and JavaScript so that browsers can understand it. And perhaps for performance reasons, you want to [minify](https://developers.google.com/speed/docs/insights/MinifyResources?hl=en) your code before sending it off. You’ll also need to set up a local server so you can see what your website looks like as you build it.

Build tools and task runners like Gulp automate these processes so that all you have to do is enter a command in your terminal.

Side note: I started my front-end web development career by using [CodeKit](https://incident57.com/codekit/), a Mac app that compiles and minifies your code, sets up a server, watches for changes, and auto-refreshes the browser (among other useful things). All you have to do is change a few settings and press a button. It’s a really great app (particularly for designers who prototype with code, in my opinion), but after using it for a month or so, I realized that it’s important to know how to do what CodeKit is doing under the surface. (The aha moment came when I cloned one of my own GitHub projects onto a new computer and realized I couldn’t do anything without CodeKit installed.)

Another side note: [Grunt](http://gruntjs.com) is frequently mentioned as an alternative to Gulp. I have used both in the past year and I don’t have a super strong preference for one or the other (but I am leaning towards Gulp). [Here](https://medium.com/@preslavrachev/gulp-vs-grunt-why-one-why-the-other-f5d3b398edc4#.4haswc244) is a good article on the differences between the two.

I learned Grunt first and then switched to Gulp because my latest project at work uses it, and I wanted to understand it better. I started using a small, simple `gulpfile.js` in my side projects that I will break down in detail here.

What’s a `gulpfile.js`? That’s the file all your tasks go in. It should be at the root of your project.

First, some more background and setup. My project structure looks something like this:

    .
    ├── src
    |   ├── js
    |   |   ├── app.js
    |   |   └── [other *.js files]
    |   ├── scss
    |       ├── style.scss
    |       └── [other *.scss files]
    ├── public
    |   ├── index.html
    |   ├── bundle.js
    |   └── style.css
    ├── node_modules 
    |   └── [all dependencies]
    ├── server.js
    ├── gulpfile.js
    └── package.json

I use [npm](https://www.npmjs.com) as my package manager. Check out this incomplete project of mine [here](https://github.com/chinaowl/next-caltrain) for a live example. Now let’s look at `gulpfile.js` in detail.

``` js
var gulp = require('gulp');
var del = require('del');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var shell = require('gulp-shell');
```

At the top of my file, I put all my dependencies. (I include all of these things in the `package.json` file.) I found these through Google, mostly. A good rule of thumb when choosing a dependency is to see how recently it was updated, how many open issues there are, and how many people have downloaded it.

``` js
gulp.task('clean', function() {
    del(['./public/*', '!./public/index.html']);
});
```

A simple, standard task that deletes all generated files using [`del`](https://www.npmjs.com/package/del).  This is so that you start with a clean workspace each time. To run this task on its own, you would type `gulp clean` into the terminal.

``` js
gulp.task('js', function() {
    browserify('./src/js/app.js')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./public'));
});
```

A JavaScript task that takes everything in `app.js`, including its dependencies, and puts it all into one file using [Browserify](http://browserify.org). Browserify is something that requires its own lengthy post, but to really gloss over things for now, I’ll say that it’s a tool that lets you `require` modules (something that comes with [Node.js](https://nodejs.org/en/) but not plain JavaScript) and bundle them up into one JavaScript file.

Along with Browserify, this task uses [`vinyl-source-stream`](https://www.npmjs.com/package/vinyl-source-stream) and Gulp’s built-in `pipe` functionality. You can think of `pipe` as…pipes! You take the results of one thing and pipe it into the next thing. Output becomes input repeatedly until you get what you want.

`gulp.dest()` tells the task what directory to place the final result.

``` js
gulp.task('css', function() {
    gulp.src('./src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public'));
});
```
    
Takes Sass and converts it to CSS using [`gulp-sass`](https://www.npmjs.com/package/gulp-sass). Uses pipes, similar to the JavaScript task above.

``` js
gulp.task('build', ['clean', 'js', 'css']);
```

This task combines the three tasks I’ve already written into one that can be called with a simple `gulp build`.

``` js
gulp.task('server', shell.task('node server.js'));
```
    
This task is possible thanks to [`gulp-shell`](https://www.npmjs.com/package/gulp-shell). It lets Gulp run any command you would normally enter in your terminal. In this case, I use it to start my Express server.

``` js
gulp.task('watch', function() {
    gulp.watch('./src/scss/*.scss', ['css']);
    gulp.watch('./src/js/*.js', ['js']);
});
```
 
A task that watches for changes to certain files and then performs the task specified in the brackets when something changes. `watch` comes with Gulp.

``` js
gulp.task('default', ['build', 'server', 'watch']);
```
If you simply type `gulp` in the terminal without specifying a task, it will run the default task. In this case, it will build the project, start the server, and watch for changes.

And that’s all! There’s a lot more you can do with Gulp. Checking out the recipes [here](https://github.com/gulpjs/gulp/tree/master/docs/recipes) is a good place to start.

P.S. I’m looking for feedback on this post! If you’ve never heard of Gulp before, was it understandable? Please feel free to leave a comment.
