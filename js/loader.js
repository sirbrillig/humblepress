var wordPress, errorLib;

// Import the module from the global namespace
wordPress = window.wordPressInterface;
errorLib = window.humblePressErrors;

// Use Browserify to import the admin-ajax interface as a module.
if ( require ) {
	wordPress = require( './wordpress-ajax' );
	errorLib = require( './errors' );
}

// Tutorial Step 6: Uncomment to use REST API to make the post.
//wordPress = require( './wordpress-rest' );

// Private functions
var humblePressPrivate = {

	createAdminBarButton: function() {
		var button = document.createElement( 'li' );
		button.className = 'wp-admin-bar-humblepress';
		var buttonLink = document.createElement( 'a' );
		buttonLink.className = 'ab-item';
		buttonLink.href = '#';
		buttonLink.appendChild( document.createTextNode( 'HumblePress' ) );
		button.appendChild( buttonLink );
		return button;
	},

	getDefaultContent: function() {
		if ( ! wordPress || ! wordPress.getDefaultContent ) {
			errorLib.error( 'HumblePress error: no WordPress interface available to get default content' );
			return;
		}
		return wordPress.getDefaultContent();
	},

	createNotice: function( text, linkText, link ) {
		var noticeArea = document.createElement( 'div' );
		noticeArea.id = 'humblepress-notice';
		var noticeText = document.createElement( 'p' );
		noticeText.appendChild( document.createTextNode( text ) );
		if ( link && linkText ) {
			var linkNode = document.createElement( 'a' );
			linkNode.appendChild( document.createTextNode( linkText ) );
			linkNode.href = link;
			noticeText.appendChild( linkNode );
		}
		noticeArea.appendChild( noticeText );
		var cancelButton = document.createElement( 'button' );
		cancelButton.appendChild( document.createTextNode( 'Close' ) );
		cancelButton.addEventListener( 'click', function() {
			humblePressPrivate.removeFormAndNotice();
		} );
		noticeArea.appendChild( cancelButton );
		return noticeArea;
	},

	createForm: function() {
		var formArea = document.createElement( 'div' );
		formArea.id = 'humblepress-form';
		var textArea = document.createElement( 'textarea' );
		textArea.id = 'humblepress-form-text';
		textArea.value = humblePressPrivate.getDefaultContent();
		formArea.appendChild( textArea );
		var submitButton = document.createElement( 'button' );
		submitButton.appendChild( document.createTextNode( 'Post it!' ) );
		submitButton.addEventListener( 'click', function() {
			humblePressPrivate.submitPost();
		} );
		formArea.appendChild( submitButton );
		var cancelButton = document.createElement( 'button' );
		cancelButton.appendChild( document.createTextNode( 'Cancel Post' ) );
		cancelButton.addEventListener( 'click', function() {
			humblePressPrivate.removeFormAndNotice();
		} );
		formArea.appendChild( cancelButton );
		return formArea;
	},

	removeFormAndNotice: function() {
		var existingForm = document.querySelector( '#humblepress-form' );
		if ( existingForm && existingForm.parentNode ) {
			var textArea = document.querySelector( '#humblepress-form-text' );
			if ( textArea ) {
				textArea.value = '';
			}
			existingForm.parentNode.removeChild( existingForm );
		}
		var existingNotice = document.querySelector( '#humblepress-notice' );
		if ( existingNotice && existingNotice.parentNode ) {
			existingNotice.parentNode.removeChild( existingNotice );
		}
	},

	notifyPostComplete: function( response ) {
		var responseData = JSON.parse( response );
		if ( ! responseData.success && ! responseData.ID ) {
			errorLib.error( 'HumblePress error: something went wrong with making the post' );
			return;
		}
		var notice = 'HumblePress made a new post for you!';
		var linkText = 'View the Post';
		var link = '';
		if ( responseData.link ) {
			link = responseData.link;
		}
		if ( responseData.data && responseData.data.permalink ) {
			link = responseData.data.permalink;
		}
		if ( ! link ) {
			errorLib.error( 'HumblePress error: no link found' );
			return;
		}
		humblePressPrivate.renderNoticeToPage( notice, linkText, link );
	},

	renderNoticeToPage: function( text, linkText, link ) {
		humblePressPrivate.removeFormAndNotice();
		var body = document.querySelector( 'body' );
		if ( ! body ) {
			errorLib.error( 'HumblePress error: could not find page body' );
			return;
		}
		var noticeArea = humblePressPrivate.createNotice( text, linkText, link );
		body.insertBefore( noticeArea, body.firstChild );
	},

	submitPost: function() {
		var textArea = document.querySelector( '#humblepress-form-text' );
		if ( ! textArea ) {
			errorLib.error( 'HumblePress error: could not find text area' );
			return;
		}
		if ( ! wordPress || ! wordPress.makeNewPost ) {
			errorLib.error( 'HumblePress error: no WordPress interface available to make post' );
			return;
		}
		wordPress.makeNewPost( textArea.value, humblePressPrivate.notifyPostComplete );
		humblePressPrivate.removeFormAndNotice();
	}
};

// Public functions
var humblePressLoader = {
	addActivationButton: function() {
		var adminBar = document.querySelector( '#wp-admin-bar-root-default' );
		if ( ! adminBar ) {
			errorLib.error( 'HumblePress error: could not find admin bar' );
			return;
		}
		var button = humblePressPrivate.createAdminBarButton();
		adminBar.appendChild( button );
		button.addEventListener( 'click', function() {
			errorLib.removeErrorNotice();
			humblePressLoader.toggleForm();
		} );

		if ( wordPress.fetchUserNameFromAPI && window.humblePressBootstrap && window.humblePressBootstrap.apiUrl ) {
			wordPress.fetchUserNameFromAPI();
		}
	},

	toggleForm: function() {
		var existingForm = document.querySelector( '#humblepress-form' );
		if ( existingForm ) {
			return humblePressPrivate.removeFormAndNotice();
		}
		humblePressLoader.renderFormToPage();
	},

	renderFormToPage: function() {
		humblePressPrivate.removeFormAndNotice();
		var body = document.querySelector( 'body' );
		if ( ! body ) {
			errorLib.error( 'HumblePress error: could not find page body' );
			return;
		}
		var form = humblePressPrivate.createForm();
		body.insertBefore( form, body.firstChild );
	}

};

// Use Browserify to export these functions
if ( module ) {
	module.exports = humblePressLoader;
}
