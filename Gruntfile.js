/**
 *  See README.md for more explanation.
 *
 *  @author: danielmoffat
 */

var config = require('./grunt_config').load();
var CONSTANTS = require('./constants');

module.exports = function(grunt) {

  // Load tasks, todo: replace
	grunt.loadNpmTasks('grunt-prompt');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-concurrent');

	grunt.initConfig({
		baseDirectory: config.get('baseDirectory'),
		projectDirectory: config.get('projectDirectory'),
    distDirectory: './prod',
    postcss: {
      // todo: transform less source map to this, so we can retain .less file names/  numbers
      options: {
        map: true,
        processors: [
          require('pixrem')(),
          require('autoprefixer')({
            browsers: 'last 5 versions'
          }),
          require('cssnano')()
        ]
      },
      // Tasks
      dev: {
        src: grunt.template.process('<%= projectDirectory %>src/styles/css/*.css')
      },
      prod: {
        src: grunt.template.process('<%= projectDirectory %>prod/styles/css/*.css', {data: config.data})
      }
    },
    browserify: {
      dev: {
        files: [{
          './src/scripts/bundles/main.js': './src/scripts/main.js'
        }]
      }
    },
		less: {
			dev: {
        options: {

        },
				files: [{
						expand: true,
						cwd: grunt.template.process('<%= projectDirectory %>src/styles/less/', {data: config.data}),
						src: ['*.less', '!_*.less'],
						dest: './src/styles/css/',
						ext: '.css'
				}]
			}
		},
		watch: {
			devStyles: {
				files: 'src/styles/less/**/*.less',
				tasks: [
          'less:dev',
          'postcss:dev'
        ]
			},
      devScripts: {
        files: ['src/scripts/**/**', '!src/scripts/bundles/**/**'],
        tasks: [
          'browserify:dev'
        ]
      }
		},
		prompt: {
			setup: {
				options: {
					questions: [
						{
							config: 'config.selections',
							type: 'list',
							message: '',
							default: 'test',
							choices: ['']
						}
					]
				}
			}
		},
    concurrent: {
      watch: {
        tasks: ['watch:devStyles', 'watch:devScripts'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
	});

	/**
	 * 	Task registration
	 */

	grunt.registerTask('default', ['dev']);

	// Setup tasks, these must be ran before you can work on anything
	grunt.registerTask('setup', [
		'validateConfig'
	]);

	// Development tasks, these are for when you're working on a project
	grunt.registerTask('dev', [
		'setup',
		'createCss',
    'createScripts',
    'concurrent:watch'
	]);


	// Production tasks, these are for when you want to create a production-ready build
	grunt.registerTask('build', [
		'setup'
	]);

  // Convenience task groups
  grunt.registerTask('createCss', [
    'less:dev',
    'postcss:dev'
  ]);

  grunt.registerTask('createScripts', [
    'browserify:dev'
  ]);

	// Make sure the configuration has some crucial values set!
	grunt.registerTask('validateConfig', function() {
		grunt.log.writeln('Validating config...');

		var config = require('./grunt_config').load();
		var requiredKeys = ['baseDirectory', 'projectDirectory'];
		var ok = true;

		// Check keys exists
		requiredKeys.forEach(function(key) {
			if(!config.hasKey(key)) {
				ok = false;
				grunt.log.writeln('Missing ' + key + ' from your config.');
			}
		});

		// Add missing keys
		if(!ok) {
			config.set('baseDirectory', '.');
			config.set('projectDirectory', './');
			config.save();
		}

    config.save();

	});
};
