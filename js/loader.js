// Import the module from the global namespace
var wordPress = window.wordPressInterface;

// Use Browserify to import the admin-ajax interface as a module.
//var wordPress = require( 'wordpress-ajax' );

// Use Browserify to import the REST API interface as a module.
//var wordPress = require( 'wordpress-rest-api' );

// Private functions
function createHumblePressAdminBarButton() {
	var button = document.createElement( 'li' );
	button.className = 'wp-admin-bar-humblepress';
	var buttonLink = document.createElement( 'a' );
	buttonLink.className = 'ab-item';
	buttonLink.href = '#';
	buttonLink.appendChild( document.createTextNode( 'HumblePress' ) );
	button.appendChild( buttonLink );
	return button;
}

function createHumblePressForm() {
	var formArea = document.createElement( 'div' );
	formArea.id = 'humblepress-form';
	var textArea = document.createElement( 'textarea' );
	textArea.id = 'humblepress-form-text';
	formArea.appendChild( textArea );
	var submitButton = document.createElement( 'button' );
	submitButton.appendChild( document.createTextNode( 'Post it!' ) );
	submitButton.addEventListener( 'click', function() {
		submitHumblePressPost();
	} );
	formArea.appendChild( submitButton );
	return formArea;
}

function removeHumblePressForm() {
	var existingForm = document.querySelector( '#humblepress-form' );
	if ( existingForm && existingForm.parentNode ) {
		existingForm.parentNode.removeChild( existingForm );
	}
}

function submitHumblePressPost() {
	var textArea = document.querySelector( '#humblepress-form-text' );
	if ( ! textArea ) {
		console.error( 'HumblePress error: could not find text area' );
		return;
	}
	if ( ! wordPress || ! wordPress.makeNewPost ) {
		console.error( 'HumblePress error: no WordPress interface available to make post' );
		return;
	}
	wordPress.makeNewPost( textArea.value );
	removeHumblePressForm();
}

var humblePressLoader = {
	addActivationButton: function() {
		var adminBar = document.querySelector( '#wp-admin-bar-root-default' );
		if ( ! adminBar ) {
			console.error( 'HumblePress error: could not find admin bar' );
			return;
		}
		var button = createHumblePressAdminBarButton();
		adminBar.appendChild( button );
		button.addEventListener( 'click', function() {
			humblePressLoader.toggleForm();
		} );
	},

	toggleForm: function() {
		var existingForm = document.querySelector( '#humblepress-form' );
		if ( existingForm ) {
			return removeHumblePressForm();
		}
		humblePressLoader.renderFormToPage();
	},

	renderFormToPage: function() {
		var body = document.querySelector( 'body' );
		if ( ! body ) {
			console.error( 'HumblePress error: could not find page body' );
			return;
		}
		var form = createHumblePressForm();
		body.insertBefore( form, body.firstChild );
	}

};

// Use Browserify to export the functions.
//module.exports = humblePressLoader;
