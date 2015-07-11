module.exports = function( grunt ) {
	require( 'load-grunt-tasks' )( grunt );

	grunt.initConfig( {
		options: {
			sourceComments: 'map',
			outputStyle: 'nested'
		},

		browserify: {
			dev: {
				src: [ 'js/main.js' ],
				dest: 'js/humblepress.js'
			}
		},

		uglify: {
			dist: {
				options: {
					maxLineLen: 2048
				},
				files: {
				'js/humblepress.js': 'js/humblepress.js',
				}
			}
		},

		watch: {
			js: {
				files: [ 'js/**/*.js', '!js/humblepress.js' ],
				tasks: [ 'browserify' ]
			}
		}
	} );

	grunt.registerTask( 'default', [ 'browserify', 'watch' ] );
};

