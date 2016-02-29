/**
 *  See README.md for more explanation.
 *
 *  @author: danielmoffat
 */

var CONSTANTS = require('./constants');

module.exports = function(grunt) {

  // Load tasks, todo: replace with a 1 liner that loads everything
	grunt.loadNpmTasks('grunt-prompt');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-userev');
  grunt.loadNpmTasks('grunt-pageres');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.initConfig({
		baseDirectory: '.',
		projectDirectory: './',
    distDirectory: './prod',
    filerev: {
      prod: {
        src: ['prod/styles/css/*.css', 'prod/scripts/bundles/*.js']
      }
    },
    userev: {
      prod: {
        src: 'prod/velocity/index.html'
      }
    },
    clean: {
      prod: ['prod/']
    },
    postcss: {
      dev: {
        options: {
          map: true,
          processors: [
            require('pixrem')(),
            require('autoprefixer')({
              browsers: 'last 5 versions'
            }),
            require('cssnano')({
              discardComments: {
                removeAll: true
              }
            })
          ]
        },
        src: 'src/styles/css/*.css'
      },
      prod: {
        options: {
          map: false,
          processors: [
            require('pixrem')(),
            require('autoprefixer')({
              browsers: 'last 5 versions'
            }),
            require('cssnano')({

            })
          ]
        },
        src: 'prod/styles/css/*.css'
      }
    },
    browserify: {
      dev: {
        options: {
          browserifyOptions: {
            debug: true
          }
        },
        files: [{
          expand: true,
          cwd: 'src/scripts/',
          src: ['*.js', '!_*.js'],
          dest: 'src/scripts/bundles/',
          ext: '-bundle.js'
        }]
      },
      prod: {
        options: {},
        files: [{
          expand: true,
          cwd: 'src/scripts/',
          src: ['*.js', '!_*.js'],
          dest: 'prod/scripts/bundles/',
          ext: '-bundle.js'
        }]
      }
    },
		less: {
			dev: {
        options: {
          sourceMap: true
        },
				files: [{
						expand: true,
						cwd: 'src/styles/less/',
						src: ['*.less', '!_*.less'],
						dest: './src/styles/css/',
						ext: '.css'
				}]
			},
      prod: {
        files: [{
            expand: true,
            cwd: 'src/styles/less/',
            src: ['*.less', '!_*.less'],
            dest: './prod/styles/css/',
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
    concurrent: {
      watch: {
        tasks: ['watch:devStyles', 'watch:devScripts'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    uglify: {
      prod: {
        files: [{
            expand: true,
            cwd: 'prod/scripts/bundles/',
            src: '*.js',
            dest: 'prod/scripts/bundles/',
            ext: '.js'
        }]
      }
    },
    // Copy all files NOT copied by other tasks, if you copy stuff which is already copied
    // by another task bad things will happen
    copy: {
      prod: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: [
            'velocity/**/**'
          ],
          dest: 'prod/'
        }]
      }
    }
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
		'setup',
    'clean:prod',
    'copy:prod',
    'less:prod',
    'postcss:prod',
    'browserify:prod',
    'uglify:prod',
    'filerev:prod',
    'userev:prod',
    'state'
	]);

  // Convenience task groups
  grunt.registerTask('createCss', [
    'less:dev',
    'postcss:dev'
  ]);

  grunt.registerTask('createScripts', [
    'browserify:dev'
  ]);

  grunt.registerTask('state', function() {
    var config = require('./grunt_config').load();
    grunt.log.writeln(config.prettyPrint())
    grunt.log.writeln(config.get('filerev.summary'))
  });

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
