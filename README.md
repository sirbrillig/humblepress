# HumblePress

A WordPress plugin for making really simple posts.

This plugin adds a button to the logged-in admin bar which activates a small new post form right on whatever page you're currently viewing. The form has no formatting options, allows no HTML or JavaScript, and has no title. It's just a very quick way to make a new post.

# This is a tutorial

The plugin is written almost entirely in JavaScript as a demonstration of using JavaScript in a WordPress plugin. There are several crucial lines of the plugin's code commented-out so that you can see how the different pieces of the plugin fit together.

As you follow the steps below, look through the code for comments matching each of the steps. Commenting or uncommenting those lines will add some functionality to the plugin and bring you to the next step. For example, on Step 2, look for lines marked `Tutorial Step 2`.

# Step 1: Installation

To install this plugin, just [download it](https://github.com/sirbrillig/humblepress/archive/master.zip) and put the uncompressed `humblepress-master` folder into the `wp-content/plugins` directory of a WordPress install. WordPress can be running locally on your computer, in a virtual machine, or on a remote server; it doesn't matter.

Next, log into your WordPress server as an admin user, go into the **Plugins** page of the admin section and click 'Activate' next to the **HumblePress** plugin.

Once it's activated, you'll be able to use the plugin from the front-end of your site (rather than the admin section), so visit the front-end now.

# Step 2: Enqueuing

If you open the source code of the plugin using your favorite editor, you'll find that there's one PHP file, `humblepress.php`. That's the extent of the PHP part of the plugin. WordPress will automatically load that file when the plugin is active.

Initially, the plugin does nothing when activated. In order to get some JavaScript running on our site, we'll need to enqueue a file using the `wp_enqueue_script()` function of WordPress. Our plugin is going to operate almost all the time, so we'll enqueue the JavaScript on the `wp_include_scripts` action hook, but if your plugin only affects specific parts of a site, it's better to pick a hook that will more accurately identify those parts. For a list of action hooks, see [the Action Hooks documentation](https://codex.wordpress.org/Plugin_API/Action_Reference).

**humblepress.php:**

```php
...
// Start the plugin!
// This line hooks our plugin's initialization onto the `wp_enqueue_scripts` action hook.
// Tutorial Step 2: Uncomment to enqueue the JavaScript
add_action( 'wp_enqueue_scripts', array( 'HumblePress', 'init' ) );
...
```

To use `wp_enqueue_script()`, you need to specify four things: a name, the path to the JavaScript file, any dependencies you'll need, and a true/false value for whether to print the script on the top or the bottom of the page. Unless you have a very compelling reason to enqueue at the top of the page, good practice is to always use `true` here.

If you look further down in the PHP file, you'll see the code that enqueues our JavaScript.

**humblepress.php:**

```php
...
class HumblePress {

	// This is the function that gets run when our plugin is loaded, thanks to the action hook above.
	public static function init() {
		if ( current_user_can( 'publish_posts' ) ) {

			// Tutorial Step 3: Comment this to use only the "compiled" file.
			self::enqueue_javascript();
			...
		}
	}

	// Enqueue all the JavaScript files
	public static function enqueue_javascript() {
		wp_enqueue_script( 'humblepress-ajax', plugins_url( 'js/wordpress-ajax.js', __FILE__ ), array(), true );
		wp_enqueue_script( 'humblepress-loader', plugins_url( 'js/loader.js', __FILE__ ), array( 'humblepress-ajax' ), true );
		wp_enqueue_script( 'humblepress', plugins_url( 'js/main.js', __FILE__ ), array( 'humblepress-loader' ), true );
	}
	...
}
```

Our plugin is going to render a form onto the page when you click the activation button. In the `js` folder of the project I have put a simple JavaScript file called `js/main.js` that does this. We will have to enqueue that.

Loading a form is a pretty big task, though, so I've stuck all that logic into a separate file called `js/loader.js`. In order to get that loaded too, we'll need to also enqueue it before `main.js`, and then specify it as a dependency.

Our loader is going to need to do some communication with WordPress too, so we'll also enqueue a library called `js/wordpress-ajax.js` and make it a dependency too.

# Step 3: JavaScript Build Tools

Now our button appears and displays the new post form (which was created entirely in JavaScript). The button cannot make any posts yet, unfortuantely, but let's talk about how we're enqueueing our files.

Enqueueing each JavaScript file we need can be pretty time-consuming, especially in large projects where the logic is split into hundreds of smaller files and the dependencies are convoluted.

Instead, we can have a program automatically mash up all of our files into one file and then just enqueue that. That program is called a "build tool" and we're going to use one called [Browserify](http://browserify.org/).

Browserify also implements the [CommonJS Module Pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#detailcommonjs) for each of your JavaScript files, so we're going to use the `require` function to join our files together, keeping everything out of the global namespace.

**main.js:**

```javascript
...
loader = require( './loader' );
...
```

So how do we get Browserify installed? Luckily, pretty much everyone with a Mac or Linux computer has a program called "make" installed on their computer, so I've also included a [Makefile](https://github.com/sirbrillig/humblepress/blob/master/Makefile) which will install everything when you type `make run`. Everything you need should be installed automatically (you will be notified otherwise), and then Browserify will "compile" all your JavaScript files into one. It will then watch those files and re-compile them if it notices any changes.

```zsh
➜  humblepress ✗ make run
Checking for npm...
Checking dependencies...
Running Browserify on your files and watching for changes... (Press CTRL-C to stop)
10931 bytes written to js/humblepress.js (0.09 seconds)
```

I know, that's a lot of tools, but this will all be worth it as we go. For your own projects, feel free to use as many or as few of these tools as you like. There's a lot of things to choose from.

Browserify is going to create a single file, `humblepress.js`, which includes all the JavaScript files in our `js` folder. Now we can just enqueue that one file in our PHP code and...

**humblepress.php:**

```php
			...
			// Tutorial Step 3: Comment this to use only the "compiled" file.
			// self::enqueue_javascript();

			// Tutorial Step 3: Uncomment to enqueue the single "compiled" JavaScript file
			wp_enqueue_script( 'humblepress', plugins_url( 'js/humblepress.js', __FILE__ ), array(), true );
			...
```

Our plugin loads a teeny-tiny bit faster! For a project with hundreds of JavaScript files, this difference could be significant.

# Step 4: Bootstrapping Data

Now we're going to have the plugin automatically populate the form field with the user's display name, so we'll need to send that data down to the JavaScript when it loads.

When we enqueue our JavaScript, we can bootstrap whatever data we like from the PHP using the confusingly-named `wp_localize_script` (the function was originally intended to be used for translations).

**humblepress.php:**

```php
...
class HumblePress {

	// This is the function that gets run when our plugin is loaded, thanks to the action hook above.
	public static function init() {
		if ( current_user_can( 'publish_posts' ) ) {
			...

			// Bootstrap data for the JavaScript
			// Tutorial Step 4: Uncomment to bootstrap data for the JavaScript
			self::bootstrap_data();

			...
		}
	}

	// Bootstrap data for the JavaScript. This data will be available in the
	// JavaScript variable `window.humblePressBootstrap`.
	public static function bootstrap_data() {
		$user = wp_get_current_user();
		if ( ! $user instanceof WP_User ) {
			return;
		}

		wp_localize_script( 'humblepress', 'humblePressBootstrap', array(
			'ajaxUrl' => admin_url( 'admin-ajax.php', 'relative' ),
			'nonce' => wp_create_nonce( 'wp_json' ),
			'userName' => $user->display_name
		) );
	}
	...
}
...
```

We grab the user name, use`wp_localize_script` to add that data to the variable `humblePressBootstrap.userName`, and...

We can access that data directly from our JavaScript. The code is already set up to look for that variable, so it should display the text inside our form when it gets loaded.

# Step 5: AJAX

Of course, our form doesn't actually do anything yet. When you press the "post" button, we need to submit the form data back to WordPress. We'll do this using the function `XMLHttpRequest` (aka: "AJAX") to a special file included in WordPress called `admin-ajax.php`.

When you send a request to `admin-ajax.php`, you specify an `action` to run. Back in our PHP we can create a function to handle that action, in this case making a new post. The actual post creation is done with the internal WordPress function `wp_insert_post` as you can see from the code.

**humblepress.php:**

```php
...
// Set up AJAX new post action
// Tutorial Step 5: Uncomment to handle AJAX posts
add_action( 'wp_ajax_new_humblepress_post', array( 'HumblePress', 'ajax_handle_new_post' ) );
...

	// Use data sent to the admin-ajax.php file for our plugin to make a new post.
	public static function ajax_handle_new_post() {
		if ( ! isset( $_POST['postContents'] ) || empty( $_POST['postContents'] ) ) {
			http_response_code( 400 );
			wp_die( 'HumblePress error: post contents not found', 400 );
		}
		if ( ! current_user_can( 'publish_posts' ) ) {
			http_response_code( 400 );
			wp_die( 'HumblePress error: insufficient permissions', 400 );
		}
		$new_post_data = array(
			'post_content' => wp_strip_all_tags( $_POST['postContents'] ),
			'post_status' => 'publish'
		);
		$new_post_id = wp_insert_post( $new_post_data );
		if ( ! $new_post_id ) {
			http_response_code( 500 );
			wp_die( 'HumblePress error: could not create post', 500 );
		}
		$permalink = get_permalink( $new_post_id );
		if ( ! $permalink ) {
			http_response_code( 500 );
			wp_die( 'HumblePress error: error while creating post', 500 );
		}
		wp_send_json_success( array( 'post_id' => $new_post_id, 'permalink' => $permalink ) );
	}
	...
```

Once that's hooked up, we can now press the "Post" button in the form, and pretty much instantly we get a link to our new post!

# Step 6: REST API

That's a fully-functional plugin right there, but we can do something even cooler if your WordPress install has a REST API installed. The [REST API is a plugin](https://wordpress.org/plugins/json-rest-api/) right now, but soon it will be part of WordPress core.

If it's installed, we can switch out the methods of our plugin to remove the complicated call to `admin-ajax.php` and the PHP action handler and just make a request to the API instead.

**loader.js:**

```javascript
...
// Tutorial Step 6: Uncomment to use REST API to make the post.
wordPress = require( './wordpress-rest' );
...
```

# Step 7: Full REST API

In fact, if we did some more work we could even replace the bootstrap code with another REST API request to get the user name.

Once that's done, the only bootstrapped data we still have is the nonce that is used to authenticate our API requests. We can replace that too using OAuth, but that part of the REST API project is still in-progress so you'll have to imagine it for now.

With both the form input and output being loaded via the REST API, there's no longer any connection between our JavaScript app and WordPress except for loading the JavaScript file in the first place. This means that our app could operate outside of WordPress, as a desktop app for example, or many other places.
