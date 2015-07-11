<?php
/*
Plugin Name: HumblePress
Plugin URI:  https://github.com/sirbrillig/humblepress
Description: Creates a simple form that allows writing new short posts on a blog with no formatting or metadata. 99% JavaScript.
Version:     0.1
Author:      Payton Swick
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
*/

// Start the plugin
add_action( 'wp_enqueue_scripts', array( 'HumblePress', 'init' ) );

class HumblePress {
	public static function init() {
		if ( self::should_enqueue() ) {
			self::enqueue_javascript();
		}
	}

	public static function should_enqueue() {
		return true;
	}

	public static function enqueue_javascript() {
		// Enqueue the JavaScript file(s)
		wp_enqueue_script( 'humblepress', plugins_url( 'js/main.js', __FILE__ ), array(), true );
	}
}
