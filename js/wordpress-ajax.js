var wordPressInterface = {
	makeNewPost: function( postContents ) {},

	getDefaultContent: function() {
		if ( window.humblePressBootstrap && window.humblePressBootstrap.defaultContent ) {
			return window.humblePressBootstrap.defaultContent;
		}
	}
};

// Use Browserify to export these functions
//module.exports = wordPressInterface;
