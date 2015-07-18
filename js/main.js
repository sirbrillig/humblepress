var loader;

// Import the module from the global namespace.
loader = window.humblePressLoader;

// Use Browserify to import the loader as a module.
if ( typeof module !== 'undefined' ) {
	loader = require( './loader' );
}

// Add the activation button to the page once the page is loaded.
window.onload = function() {
	loader.addActivationButton();
};
