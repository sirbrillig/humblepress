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
	formArea.appendChild( textArea );
	var submitButton = document.createElement( 'button' );
	submitButton.appendChild( document.createTextNode( 'Post it!' ) );
	formArea.appendChild( submitButton );
	return formArea;
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
			return humblePressLoader.removeForm();
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
	},

	removeForm: function() {
		var existingForm = document.querySelector( '#humblepress-form' );
		if ( existingForm && existingForm.parentNode ) {
			existingForm.parentNode.removeChild( existingForm );
		}
	}
};

// Use Browserify to export the function.
//module.exports = humblePressLoader;
