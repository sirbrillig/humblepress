var loader;

// Import the module from the global namespace.
loader = window.humblePressLoader;

// Tutorial Step 3: Uncomment to use use Browserify to import the loader as a module.
//loader = require( './loader' );

window.onload = function() {
	loader.addActivationButton();
};
