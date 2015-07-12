# HumblePress

A WordPress plugin for making really simple posts.

This plugin adds a button to the logged-in admin bar which activates a small new post form right on whatever page you're currently viewing. The form has no formatting options, allows no HTML or JavaScript, and has no title. It's just a very quick way to make a new post.

# This is a tutorial

The plugin is written almost entirely in JavaScript as a demonstration of using JavaScript in a WordPress plugin. There are several crucial lines of the plugin's code commented-out so that you can see how the different pieces of the plugin fit together.

As you follow the steps below, look through the code for comments matching each of the steps. Commenting or uncommenting those lines will add some functionality to the plugin and bring you to the next step. For example, on Step 2, look for lines marked `Tutorial Step 2`.

# Step 1: Installation

To install this plugin, just drop it into the `wp-content/plugins` directory of a WordPress install. Then go into the Plugins page of wp-admin and click 'Activate' next to The HumblePress plugin.

# Step 2: Enqueuing

Initially, the plugin does nothing when activated. In order to get some JavaScript running on our site, we'll need to enqueue a file using the `wp_enqueue_script()` function of WordPress. Our plugin is going to operate almost all the time, so we'll enqueue the JavaScript on the `wp_include_scripts` action hook, but if your plugin only affects specific parts of a site, it's better to pick a hook that will more accurately identify those parts. For a list of action hooks, see [the Action Hooks documentation](https://codex.wordpress.org/Plugin_API/Action_Reference).

To use `wp_enqueue_script()`, you need to specify four things: a name, the path to the JavaScript file, any dependencies you'll need, and a true/false value for whether to print the script on the top or the bottom of the page. Unless you have a very compelling reason to enqueue at the top of the page, good practice is to always use `true` here.

Our plugin is going to render a post form when you click the activation button. In the `js` folder of the project I have put a simple JavaScript file called `js/main.js` that does this. We will have to enqueue that.

Loading a form is a pretty big task, though, so I've stuck all that logic into a separate file called `js/loader.js`. In order to get that loaded too, we'll need to also enqueue it before `main.js`, and then specify it as a dependency.

Our loader is going to need to do some communication with WordPress too, so we'll also enqueue a library for that called `js/wordpress-ajax.js` and make it a dependency too.

# Step 3: JavaScript Build Tools

Now our button appears and displays the new post form (which was created entirely in JavaScript).

But enqueueing each JavaScript file we need can be pretty time-consuming, especially in large projects where the logic is split into hundreds of smaller files. This is where JavaScript pipelines come in.

Instead, we can have a program automatically mash up all of our files into one file and then just enqueue that. That program is called a "build tool" and we're going to use one called [Browserify](http://browserify.org/).

Browserify also implements the [CommonJS Module Pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#detailcommonjs) for each of your JavaScript files, so we're going to use the `require` function to join our files together, keeping everything out of the global namespace.

Actually we should use another program, a "task runner", to run our build tool for us, because that way we can have Browserify always running while we code, and have it do other things for us too, like minify the source.

We're going to use a task runner called [Grunt](http://gruntjs.com/). I have a [Gruntfile already set up in the repository](https://github.com/sirbrillig/humblepress/blob/master/Gruntfile.js) that contains all the instructions for telling Grunt how to run Browserify.

Oh, but that would be too easy. How do we get Browserify and Grunt installed? Luckily, pretty much everyone has a program called "make" installed on their computer, so I've also included a [Makefile](https://github.com/sirbrillig/humblepress/blob/master/Makefile) which will install everything and kick off Grunt when you type `make run`. Everything you need should be installed automatically, and then Grunt will sit there watching for any changes to your files, running Browserify on them if anything changes.

Technically, "make" is also a task runner, so we could just use that instead of Grunt, but in this case Grunt is easier to configure and use, so we use these tools together.

I know, that's a lot of tools, but this will all be worth it as we go. For your own projects, feel free to use as many or as few of these tools as you like. There's a lot of things to choose from.

Browserify is going to create a single file, `humblepress.js`, which includes all the JavaScript files in our `js` folder. Now we can just enqueue that one file in our PHP code and...

Our plugin loads a teeny-tiny bit faster! For a project with hundreds of JavaScript files, this difference could be significant.

We can also ask Grunt to do other things for us, like run a CSS pre-processor (e.g.: [Sass](http://sass-lang.com/)), [translate ES6 code to ES5](https://babeljs.io/), run [unit tests](http://mochajs.org/), and a whole lot more.

# Step 4: Bootstrapping Data

Now we're going to have the plugin automatically populate the form field with the user's display name, so we'll need to send that data down to the JavaScript when it loads.

When we enqueue our JavaScript, we can bootstrap whatever data we like from the PHP using the confusingly-named `wp_localize_script` (the function was originally intended to be used for translations).

We grab the user name, use`wp_localize_script` to add that data to the variable `humblePressBootstrap.defaultContent`, and...

We can access that data directly from our JavaScript. The code is already set up to look for that variable, so it should display the text inside our form when it gets loaded.

# Step 5: AJAX

Of course, our form doesn't actually do anything yet. When you press the "post" button, we need to submit the form data back to WordPress. We'll do this using AJAX to a special file included in WordPress called `admin-ajax.php`.

When you send a request to `admin-ajax.php`, you specify an `action` to run. Back in our PHP we can create a function to handle that action, in this case making a new post.

Once that's hooked up, we can now press the "post" button, and pretty much instantly we get a new post!

