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
		return current_user_can( 'publish_posts' );
	}

	public static function enqueue_javascript() {
		// Enqueue the JavaScript file(s)
		wp_enqueue_script( 'humblepress-ajax', plugins_url( 'js/wordpress-ajax.js', __FILE__ ), array(), true );
		wp_enqueue_script( 'humblepress-loader', plugins_url( 'js/loader.js', __FILE__ ), array( 'humblepress-ajax' ), true );
		wp_enqueue_script( 'humblepress', plugins_url( 'js/main.js', __FILE__ ), array( 'humblepress-loader' ), true );
		// wp_enqueue_script( 'humblepress', plugins_url( 'js/humblepress.js', __FILE__ ), array(), true );

		// Bootstrap data for the JavaScript
		$user = wp_get_current_user();
		if ( ! $user instanceof WP_User ) {
			return;
		}
		wp_localize_script( 'humblepress', 'humblePressBootstrap', array(
			'defaultContent' => $user->display_name. " says: "
		) );
	}
}
