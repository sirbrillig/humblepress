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

// Set up AJAX new post action
// Tutorial Step 5: Uncomment to handle AJAX posts
// add_action( 'wp_ajax_new_humblepress_post', array( 'HumblePress', 'ajax_handle_new_post' ) );

class HumblePress {
	public static function init() {
		if ( self::should_enqueue() ) {
			// Tutorial Step 2: Uncomment to enqueue the JavaScript
			// self::enqueue_javascript();
		}
	}

	public static function should_enqueue() {
		return current_user_can( 'publish_posts' );
	}

	public static function enqueue_javascript() {
		// Enqueue the CSS
		wp_enqueue_style( 'humblepress', plugins_url( 'css/humblepress.css', __FILE__ ) );

		// Enqueue all the JavaScript files
		// Tutorial Step 3: Comment these to use only the "compiled" file.
		wp_enqueue_script( 'humblepress-ajax', plugins_url( 'js/wordpress-ajax.js', __FILE__ ), array(), true );
		wp_enqueue_script( 'humblepress-loader', plugins_url( 'js/loader.js', __FILE__ ), array( 'humblepress-ajax' ), true );
		wp_enqueue_script( 'humblepress', plugins_url( 'js/main.js', __FILE__ ), array( 'humblepress-loader' ), true );

		// Tutorial Step 3: Uncomment to enqueue the single "compiled" JavaScript file
		// wp_enqueue_script( 'humblepress', plugins_url( 'js/humblepress.js', __FILE__ ), array(), true );

		// Bootstrap data for the JavaScript
		// Tutorial Step 4: Uncomment to bootstrap data for the JavaScript
		// self::bootstrap_data();
	}

	public static function bootstrap_data() {
		$user = wp_get_current_user();
		if ( ! $user instanceof WP_User ) {
			return;
		}
		wp_localize_script( 'humblepress', 'humblePressBootstrap', array(
			'ajaxUrl' => admin_url( 'admin-ajax.php', 'relative' ),
			'apiUrl' => ( function_exists( 'get_json_url' ) ? esc_url_raw( get_json_url() ) : '' ),
			'nonce' => wp_create_nonce( 'wp_json' ),
			'defaultContent' => $user->display_name. " says: "
		) );
	}

	public static function ajax_handle_new_post() {
		if ( ! isset( $_POST['postContents'] ) || empty( $_POST['postContents'] ) ) {
			http_response_code( 400 );
			wp_die( 'HumblePress error: post contents not found', 400 );
		}
		if ( ! current_user_can( 'publish_posts' ) ) {
			http_response_code( 400 );
			wp_die( 'HumblePress error: insufficient permissions', 400 );
		}
		$post_content = $_POST['postContents'];
		$new_post_id = wp_insert_post( self::create_new_post_with_content( $post_content ) );
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

	public static function create_new_post_with_content( $post_content ) {
		$post_content = wp_strip_all_tags( $post_content );
		return array(
			'post_content' => $post_content,
			'post_status' => 'publish'
		);
	}
}
