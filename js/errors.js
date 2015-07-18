var humblePressErrors = {

	error: function( message ) {
		humblePressErrors.renderErrorNotice( message );
		console.error( message );
	},

	createErrorNotice: function( text ) {
		var noticeArea = document.createElement( 'div' );
		noticeArea.id = 'humblepress-error-notice';
		var noticeText = document.createElement( 'p' );
		noticeText.appendChild( document.createTextNode( text ) );
		noticeArea.appendChild( noticeText );
		var cancelButton = document.createElement( 'button' );
		cancelButton.appendChild( document.createTextNode( 'Close' ) );
		cancelButton.addEventListener( 'click', function() {
			humblePressErrors.removeErrorNotice();
		} );
		noticeArea.appendChild( cancelButton );
		return noticeArea;
	},

	renderErrorNotice: function( text ) {
		humblePressErrors.removeErrorNotice();
		var body = document.querySelector( 'body' );
		if ( ! body ) {
			return;
		}
		var noticeArea = humblePressErrors.createErrorNotice( text );
		body.insertBefore( noticeArea, body.firstChild );
	},

	removeErrorNotice: function() {
		var existingNotice = document.querySelector( '#humblepress-error-notice' );
		if ( existingNotice && existingNotice.parentNode ) {
			existingNotice.parentNode.removeChild( existingNotice );
		}
	}

};

if ( module ) {
	module.exports = humblePressErrors;
}
