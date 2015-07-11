// Import the module from the global namespace.
var loader = humblePressLoader;

// Use Browserify to import the loader as a module.
//var loader = require( './loader' );

window.onload = function() {
	loader.addActivationButton();
};
