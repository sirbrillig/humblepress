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


// Start the plugin!
// This line hooks our plugin's initialization onto the `wp_enqueue_scripts` action hook.
// Tutorial Step 2: Uncomment to enqueue the JavaScript
// add_action( 'wp_enqueue_scripts', array( 'HumblePress', 'init' ) );


// Set up AJAX new post action
// Tutorial Step 5: Uncomment to handle AJAX posts
// add_action( 'wp_ajax_new_humblepress_post', array( 'HumblePress', 'ajax_handle_new_post' ) );


class HumblePress {

	// This is the function that gets run when our plugin is loaded, thanks to the action hook above.
	public static function init() {
		if ( current_user_can( 'publish_posts' ) ) {

			// Tutorial Step 3: Comment this to use only the "compiled" file.
			self::enqueue_javascript();

			// Tutorial Step 3: Uncomment to enqueue the single "compiled" JavaScript file
			// wp_enqueue_script( 'humblepress', plugins_url( 'js/humblepress.js', __FILE__ ), array(), true );

			// Bootstrap data for the JavaScript
			// Tutorial Step 4: Uncomment to bootstrap data for the JavaScript
			// self::bootstrap_data();

			// Enqueue some CSS for our plugin
			wp_enqueue_style( 'humblepress', plugins_url( 'css/humblepress.css', __FILE__ ) );
		}
	}

	// Enqueue all the JavaScript files
	public static function enqueue_javascript() {
		wp_enqueue_script( 'humblepress-errors', plugins_url( 'js/errors.js', __FILE__ ), array(), true );
		wp_enqueue_script( 'humblepress-ajax', plugins_url( 'js/wordpress-ajax.js', __FILE__ ), array( 'humblepress-errors' ), true );
		wp_enqueue_script( 'humblepress-loader', plugins_url( 'js/loader.js', __FILE__ ), array( 'humblepress-ajax' ), true );
		wp_enqueue_script( 'humblepress', plugins_url( 'js/main.js', __FILE__ ), array( 'humblepress-loader' ), true );
	}

	// Bootstrap data for the JavaScript. This data will be available in the
	// JavaScript variable `window.humblePressBootstrap`.
	public static function bootstrap_data() {
		$user = wp_get_current_user();
		if ( ! $user instanceof WP_User ) {
			return;
		}
		$api_url = '';
		if ( function_exists( 'get_json_url' ) ) {
			$api_url = esc_url_raw( get_json_url() );
		}

		wp_localize_script( 'humblepress', 'humblePressBootstrap', array(
			'ajaxUrl' => admin_url( 'admin-ajax.php', 'relative' ),
			'apiUrl' => $api_url,
			'nonce' => wp_create_nonce( 'wp_json' ),
			'userName' => $user->display_name
		) );
	}

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

}
