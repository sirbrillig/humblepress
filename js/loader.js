var humblePressLoader = {
	addActivationButton: function() {
		var adminBar = document.querySelector( '#wp-admin-bar-root-default' );
		if ( ! adminBar ) {
			console.error( 'HumblePress error: could not find admin bar' );
			return;
		}
		var button = document.createElement( 'li' );
		button.className = 'wp-admin-bar-humblepress';
		var buttonLink = document.createElement( 'a' );
		buttonLink.className = 'ab-item';
		buttonLink.href = '#';
		buttonLink.appendChild( document.createTextNode( 'HumblePress' ) );
		button.appendChild( buttonLink );
		adminBar.appendChild( button );
		button.addEventListener( 'click', function() {
			humblePressLoader.renderFormToPage();
		} );
	},

	renderFormToPage: function() {
		console.log( 'here' );
	}
};

// Use Browserify to export the function.
//module.exports = humblePressLoader;
