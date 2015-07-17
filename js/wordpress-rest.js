var wordPressInterface = {
	makeNewPost: function( postContents, callback ) {
		if ( ! window.humblePressBootstrap || ! window.humblePressBootstrap.apiUrl ) {
			console.error( 'HumblePress error: could not get API url' );
			return;
		}
		if ( ! window.humblePressBootstrap.nonce ) {
			console.error( 'HumblePress error: could not get required API data' );
			return;
		}

		var apiData = {
			title: '',
			content_raw: postContents,
			status: 'publish'
		};

		var request = new XMLHttpRequest();
		request.onload = function() {
			if ( request.status >= 200 && request.status < 400 ) {
				callback( request.responseText );
			} else {
				console.error( 'HumblePress error: API request failed', request );
			}
		};
		request.onerror = function() {
			console.error( 'HumblePress error: API request encountered an error', request );
		};
		request.open( 'POST', window.humblePressBootstrap.apiUrl + '/posts', true );
		request.setRequestHeader( 'X-WP-Nonce', window.humblePressBootstrap.nonce );
		request.send( JSON.stringify( apiData ) );
	},

	getDefaultContent: function() {
		if ( window.humblePressBootstrap && window.humblePressBootstrap.userName ) {
			return window.humblePressBootstrap.userName + ' says: ';
		}
		return '';
	}
};

// Tutorial Step 3: Uncomment to use Browserify to export these functions
//module.exports = wordPressInterface;

