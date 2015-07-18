var errorLib = window.humblePressErrors;

// Use Browserify to import the error lib as a module.
if ( require ) {
	errorLib = require( './errors' );
}

var wordPressInterface = {
	makeNewPost: function( postContents, callback ) {
		if ( ! window.humblePressBootstrap || ! window.humblePressBootstrap.ajaxUrl ) {
			errorLib.error( 'HumblePress error: could not get ajax url' );
			return;
		}

		var ajaxData = {
			action: 'new_humblepress_post',
			postContents: postContents
		};
		var encodedAjaxData = new FormData();
		Object.getOwnPropertyNames( ajaxData ).forEach( function( key ) {
			encodedAjaxData.append( key, ajaxData[ key ] );
		} );

		var request = new XMLHttpRequest();
		request.onload = function() {
			if ( request.status >= 200 && request.status < 400 ) {
				callback( request.responseText );
			} else {
				errorLib.error( 'HumblePress error: ajax request failed', request );
			}
		};
		request.onerror = function() {
			errorLib.error( 'HumblePress error: ajax request encountered an error', request );
		};
		request.open( 'POST', window.humblePressBootstrap.ajaxUrl, true );
		request.send( encodedAjaxData );
	},

	getDefaultContent: function() {
		if ( window.humblePressBootstrap && window.humblePressBootstrap.userName ) {
			return window.humblePressBootstrap.userName + ' says: ';
		}
		return '';
	}
};

// Use Browserify to export these functions
if ( module ) {
	module.exports = wordPressInterface;
}
