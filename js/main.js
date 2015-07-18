var loader;

// Import the module from the global namespace.
loader = window.humblePressLoader;

// Use Browserify to import the loader as a module.
if ( require ) {
	loader = require( './loader' );
}

window.onload = function() {
	loader.addActivationButton();
};
