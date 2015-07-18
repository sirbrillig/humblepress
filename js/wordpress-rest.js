var humblePressUserName = '';

var errorLib = require( './errors' );

var wordPressInterface = {
	getConnectionData: function() {
		// Tutorial Step 7: Uncomment to use the API to replace the bootstrapped data.
		//return wordPressInterface.getApiData();

		return window.humblePressBootstrap;
	},

	makeNewPost: function( postContents, callback ) {
		var connectionData = wordPressInterface.getConnectionData();
		if ( ! connectionData || ! connectionData.apiUrl ) {
			errorLib.error( 'HumblePress error: could not get API url. Are you sure the WP-API plugin is installed?' );
			return;
		}
		if ( ! connectionData.nonce ) {
			errorLib.error( 'HumblePress error: could not get required API data' );
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
				errorLib.error( 'HumblePress error: API request failed', request );
			}
		};
		request.onerror = function() {
			errorLib.error( 'HumblePress error: API request encountered an error', request );
		};
		request.open( 'POST', connectionData.apiUrl + '/posts', true );
		request.setRequestHeader( 'X-WP-Nonce', connectionData.nonce );
		request.send( JSON.stringify( apiData ) );
	},

	getDefaultContent: function() {
		var connectionData = wordPressInterface.getConnectionData();
		if ( connectionData && connectionData.userName ) {
			return connectionData.userName + ' says: ';
		}
		return '';
	},

	fetchUserNameFromAPI: function() {
		var connectionData = wordPressInterface.getConnectionData();
		var request = new XMLHttpRequest();
		request.onload = function() {
			if ( request.status >= 200 && request.status < 400 ) {
				var responseData = JSON.parse( request.responseText );
				humblePressUserName = responseData.username;
			} else {
				errorLib.error( 'HumblePress error: API request to get userName failed', request );
			}
		};
		request.onerror = function() {
			errorLib.error( 'HumblePress error: API request to get userName encountered an error', request );
		};
		request.open( 'GET', connectionData.apiUrl + '/users/me', true );
		request.setRequestHeader( 'X-WP-Nonce', connectionData.nonce );
		request.send();
	},

	getApiData: function() {
		// If we used OAuth here, we could avoid needing the bootstrapped data entirely.
		if ( ! window.humblePressBootstrap.apiUrl || ! window.humblePressBootstrap.nonce ) {
			errorLib.error( 'HumblePress error: could not get required API data. Is the WP-API plugin installed?' );
			return {};
		}
		return {
			apiUrl: window.humblePressBootstrap.apiUrl,
			userName: humblePressUserName,
			nonce: window.humblePressBootstrap.nonce
		};
	}
};

module.exports = wordPressInterface;

