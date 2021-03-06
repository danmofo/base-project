/**
 *  See README.md for more explanation.
 *
 *  @author: danielmoffat
 */

var CONSTANTS = require('./grunt/constants');
var utils = require('./grunt/utils');

module.exports = function(grunt) {

  // Allow user to specify several flags using a cli to exclude / include certain tasks,
  // because the extra tasks needed for running tests (watch, karma, jasmine..)
  // can slow down development.
  //
  // Likewise for scripts, if you are only changing CSS, there's no reason to watch scripts for
  // changes along with the overhead that comes with it.
  //
  // Example:
  // grunt dev --src=src --dest=prod --no-tests --no-scripts
  var cliOptions = utils.parseCliOptions();

  utils.prettyPrintCliArguments();

  // Show time taken for each task
  require('time-grunt')(grunt);

  // Only load the required plugins for each task, this drastically speeds up watch times,
  // since we aren't loading the heavy plugins (imagemin etc) unless we actually use them
  require('jit-grunt')(grunt);

  // Config
  grunt.initConfig({
	 srcDirectory: cliOptions.src,
	 destDirectory: cliOptions.dest,
    filerev: {
      prod: {
        src: [
          '<%= destDirectory %>/styles/css/*.css',
          '<%= destDirectory %>/scripts/bundles/**/*.js',
          '<%= destDirectory %>/images/*.jpg'
        ]
      }
    },
    userev: {
      prod: {
        src: [
          '<%= destDirectory %>/velocity/*.html',
          '<%= destDirectory %>/velocity/*.vm',
          '<%= destDirectory %>/styles/css/*.css',
          '<%= destDirectory %>/scripts/bundles/*.js'
        ],
        options: {
          patterns: {
            'styles': CONSTANTS.STYLE_REGEX,
            'scripts': CONSTANTS.SCRIPT_REGEX,
            'images': CONSTANTS.IMAGE_REGEX
          }
        }
      }
    },
    clean: {
      options: {
        // Since srcDirectory / destDirectory can be outside Grunt's directory, we need to
        // force deletion of files.
        force: true
      },
      bundles: ['<%= srcDirectory %>/scripts/bundles/'],
      prod: ['<%= destDirectory %>'],
      temp: ['.grunt-temp/']
    },
    postcss: {
      options: {
        processors: [
          require('pixrem')(),
          require('autoprefixer')({
            browsers: 'last 5 versions'
          })
        ]
      },
      dev: {
        options: {
          map: true,
          processors: [
            require('cssnano')({
              discardComments: {
                removeAll: true
              }
            })
          ]
        },
        src: '<%= srcDirectory %>/styles/css/*.css'
      },
      prod: {
        options: {
          map: false,
          processors: [
            require('cssnano')()
          ]
        },
        src: '<%= destDirectory %>/styles/css/*.css'
      }
    },
    browserify: {
      dev: {
        options: {
          browserifyOptions: {
            debug: false
          }
        },
        files: [{
          expand: true,
          cwd: '<%= srcDirectory %>/scripts/',
          src: ['*.js', '!_*.js', 'angular/**/app.js'],
          dest: '<%= srcDirectory %>/scripts/bundles/',
          ext: '-bundle.js'
        }]
      },
      devChromeExtension: {
        options: {
          browserifyOptions: {
            debug: false
          }
        },
        src: '<%= srcDirectory %>/scripts/main.js',
        dest: '<%= srcDirectory %>/extension/background.js'
      },
      prodChromeExtension: {
        options: {},
        src: '<%= srcDirectory %>/scripts/main.js',
        dest: '<%= destDirectory %>/extension/background.js'
      },
      prod: {
        options: {},
        files: [{
          expand: true,
          cwd: '<%= srcDirectory %>/scripts/',
          src: ['*.js', '!_*.js', 'angular/**/app.js'],
          dest: '<%= destDirectory %>/scripts/bundles/',
          ext: '-bundle.js'
        }]
      }
    },
    sass: {
      dev: {
        files: [{
            expand: true,
            cwd: '<%= srcDirectory %>/styles/sass/',
            src: ['*.scss', '!_*.scss'],
            dest: '<%= srcDirectory %>/styles/css/',
            ext: '.css'
        }]
      },
      prod: {
        files: [{
            expand: true,
            cwd: '<%= srcDirectory %>/styles/sass/',
            src: ['*.scss', '!_*.scss'],
            dest: '<%= destDirectory %>/styles/css/',
            ext: '.css'
        }]
      }
    },
    watch: {
      devStyles: {
        files: '<%= srcDirectory %>/styles/sass/**/*.scss',
        tasks: [
          'sass:dev',
          'postcss:dev'
        ]
      },
      devScripts: {
        files: [
          '<%= srcDirectory %>/scripts/**/**',
          '!<%= srcDirectory %>/scripts/bundles/**'
        ],
        tasks: [
          'browserify:dev',
          'jshint:dev'
        ]
      },
      devChromeExtension: {
        files: [
          '<%= srcDirectory %>/scripts/**/**',
          '!<%= srcDirectory %>/scripts/bundles/**'
        ],
        tasks: [
          'browserify:devChromeExtension',
          'jshint:dev'
        ]
      },
      devScriptsWithTests: {
        files: [
          '<%= srcDirectory %>/tests/spec/*.js',
          '<%= srcDirectory %>/scripts/**/**/*.js',
          '!<%= srcDirectory %>/scripts/bundles/**/**'
        ],
        tasks: [
          'browserify:dev',
          'jshint:dev',
          'karma:dev:run'
        ]
      }
    },
    concurrent: {
     options: {
    	 logConcurrentOutput: true
     },
      watchStylesOnly: {
    	  tasks: ['watch:devStyles']
      },
      watch: {
        tasks: [
          'watch:devStyles',
          'watch:devScripts',
        ]
      },
      watchChromeExtension: {
        tasks: [
          'watch:devStyles',
          'watch:devChromeExtension'
        ]
      },
      watchWithTests: {
        tasks: [
          'watch:devStyles',
          'watch:devScriptsWithTests',
          'karma:dev'
        ]
      },
    },
    uglify: {
      prod: {
        options: {
          banner: CONSTANTS.SCRIPT_BANNER,
          report: 'gzip'
        },
        files: [{
            expand: true,
            cwd: '<%= destDirectory %>/scripts/bundles/',
            src: '**/*.js',
            dest: '<%= destDirectory %>/scripts/bundles/',
            ext: '.js'
        }]
      },
      prodChromeExtension: {
        options: {
          banner: CONSTANTS.SCRIPT_BANNER,
          report: 'gzip'
        },
        // Rewrite the file in place
        src: '<%= destDirectory %>/extension/background.js',
        dest: '<%= destDirectory %>/extension/background.js'
      }
    },
    // Copy all files NOT copied by other tasks, if you copy stuff which is already copied
    // by another task bad things will happen
    copy: {
      prod: {
        files: [{
          expand: true,
          cwd: '<%= srcDirectory %>/',
          src: [
            'velocity/**/**',
            'scripts/angular/**/views/**/*.html'
          ],
          dest: '<%= destDirectory %>/'
        }]
      },
      'optimised-images': {
    	  files: [{
    		  expand: true,
    		  cwd: '<%= srcDirectory %>/images/optimised/',
    		  src: [
    		    '*.jpg',
    		    '*.png',
    		    '*.gif'
    		  ],
    		  dest: '<%= destDirectory %>/images/'
    	  }]
      },
      prodChrome: {
        files: [{
          expand: true,
          cwd: '<%= srcDirectory %>/images/optimised/',
          src: [
            '*.jpg',
            '*.png',
            '*.gif'
          ],
          dest: '<%= destDirectory %>/extension/'
        }, {
          src: '<%= srcDirectory %>/extension/manifest.json',
          dest: '<%= destDirectory %>/extension/manifest.json',
        }]
      },
      chrome: {
        files: [{
          expand: true,
          cwd: '<%= srcDirectory %>/images/optimised/',
          src: [
            '*.jpg',
            '*.png',
            '*.gif'
          ],
          dest: '<%= srcDirectory %>/extension/'
        }]
      }
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        globals: {
          'module': true
        }
      },
      dev: [
        'Gruntfile.js',
        '<%= srcDirectory %>/scripts/**/*.js',
        '!<%= srcDirectory %>/scripts/bundles/**/*.js'
      ]
    },
    karma: {
      dev: {
        configFile: './karma.conf.js'
      }
    },
    pageres: {
      screenshot: {
        options: {
          urls: [
            'www.giveasyoulive.com',
            'www.giveasyoulive.com/ways-to-raise',
            'cardsforcauses.giveasyoulive.com',
            'workwithus.giveasyoulive.com'
          ],
          // look into pulling resolutions directly from our analytics:
          // https://www.npmjs.com/package/googleanalytics
          sizes: [
            '1920x1080', // Normal desktop
            '1366x768', // Average user's desktop
            '1024x768', // iPad (smallest)
            '320x480' // iPhone (smallest)
          ],
          dest: '.grunt-temp/screenshots'
        }
      }
    },
    pagespeed: {
      desktop: {
        options: {
            nokey: true,
            threshold: 40,
            url: 'www.giveasyoulive.com',
            locale: 'en_GB',
            strategy: 'desktop'

        }
      },
      mobile: {
          options: {
              nokey: true,
              threshold: 40,
              url: 'www.giveasyoulive.com',
              locale: 'en_GB',
              strategy: 'mobile'

          }
        }
    },
    imagemin: {
    	squash: {
    		files: [{
    			expand: true,
    			cwd: '<%= srcDirectory %>/images/',
    			src: [
    			  '**/*.*',
    			  '!optimised/*.*'
    			],
    			dest: '<%= srcDirectory %>/images/optimised/'
    		}]
    	}
    }
  });

  /**
   *  Task registration
   */
  grunt.registerTask('default', ['help']);

  grunt.registerTask('help', CONSTANTS.TASK_DESCRIPTIONS.help, function() {
	  grunt.fail.warn(CONSTANTS.ERROR_MESSAGES.missingCommand);
  });

  // Setup tasks, these must be ran before you can work on anything
  grunt.registerTask('setup', CONSTANTS.TASK_DESCRIPTIONS.setup, [
    'validateFlags'
  ]);

  // Development task, this is for when you're working on a project
  grunt.registerTask('dev', CONSTANTS.TASK_DESCRIPTIONS.dev, [
      // Set directories / API keys
    'setup',
    // Compile less & postcss css files
    'createCss',
    // Bundle js, this runs regardless of whether you are changing scripts or not, since
    // you may not have created scripts from the sources before.
    'createScripts',
    // Watch ALL less / js files for change
    utils.getConcurrentTask()
  ]);

  grunt.registerTask('devChromeExtension', CONSTANTS.TASK_DESCRIPTIONS.devChromeExtension, [
    'setup',
    'createCss',
    'createChromeExtension',
    'optimise-images',
    'copy:chrome',
    'concurrent:watchChromeExtension'
  ]);

  grunt.registerTask('prodChromeExtension', CONSTANTS.TASK_DESCRIPTIONS.prodChromeExtension, [
    'setup',
    'clean:prod',
    'clean:bundles',
    'optimise-images',
    'copy:prodChrome',
    'browserify:prodChromeExtension',
    'uglify:prodChromeExtension'
  ]);

  // Production task, this is for when you want to create a production-ready build
  grunt.registerTask('build', CONSTANTS.TASK_DESCRIPTIONS.build, [
      // Set directories / API keys
    'setup',
    // Clean production folder if anything is in there already
    'clean:prod',
    // Clean any stray development bundles since our production build is built from here
    'clean:bundles',
    // Minify images
    'optimise-images',
    // Copy all static files across (minus css and js)
    'copy:prod',
    // Copy optimised images from optimised/ to / in the prod images folder
    'copy:optimised-images',
    // Compile sass files
    'sass:prod',
    // PostCSS css files
    'postcss:prod',
    // Bundle js
    'browserify:prod',
    // Minify js
    'uglify:prod',
    // Change file names
    'filerev:prod',
    // Use newly changed file names in source files
    'userev:prod'
  ]);

  // Screenshot task, this is for testing purposes
  grunt.registerTask('screenshots', CONSTANTS.TASK_DESCRIPTIONS.screenshots, [
    'pageres:screenshot'
  ]);

  // Perf task, this is for giving a general overview of performance on the website
  grunt.registerTask('perf', CONSTANTS.TASK_DESCRIPTIONS.perf, [
    'pagespeed:desktop',
    'pagespeed:mobile'
  ]);

  // Optimise images task, this is for optimising images by making their size smaller with sacrificing
  // too much quality.
  grunt.registerTask('optimise-images', CONSTANTS.TASK_DESCRIPTIONS['optimise-images'], [
     'imagemin:squash'
  ]);

  // Convenience task groups - this allows us to add more related processing in these blocks
  // without having to touch anything else in the build
  grunt.registerTask('createCss', CONSTANTS.TASK_DESCRIPTIONS.createCss, [
    'sass:dev',
    'postcss:dev'
  ]);

  grunt.registerTask('createScripts', CONSTANTS.TASK_DESCRIPTIONS.createScripts, [
    'clean:bundles',
    'browserify:dev'
  ]);

  grunt.registerTask('createChromeExtension', CONSTANTS.TASK_DESCRIPTIONS.createChromeExtension, [
    'clean:bundles',
    'browserify:devChromeExtension'
  ]);

  // For testing
  grunt.registerTask('scratchpad', CONSTANTS.TASK_DESCRIPTIONS.scratchpad, function() {
	 grunt.log.writeln('hello world!');
  });

  // Validate the flag values (make sure folders exist and that folder structure looks usable)
  grunt.registerTask('validateFlags', CONSTANTS.TASK_DESCRIPTIONS.validateFlags, function() {

	  // Check src exists
	  if(!grunt.file.exists(cliOptions.src)) {
		  grunt.fail.fatal(
	        grunt.template.process(CONSTANTS.ERROR_MESSAGES.invalidSrc, {directory: cliOptions.src})
		  );
	  }

	  // Check dest exists
	  if(!grunt.file.exists(cliOptions.dest)) {
		  grunt.fail.fatal(
	        grunt.template.process(CONSTANTS.ERROR_MESSAGES.invalidDest, {data: {directory: cliOptions.dest}})
	      );
	  }

	  // Check src has 'web' like folders, it can flag problems with your project setup
	  CONSTANTS.REQUIRED_FOLDERS.forEach(function(folder) {
		  var path = cliOptions.src + '/' + folder;
		  if(!grunt.file.exists(path)){
			  var errorMessage = grunt.template.process(CONSTANTS.ERROR_MESSAGES.missingFolders, {data: {directory: path}});

			  grunt.fail.fatal(errorMessage);
		  }
	  });
  });

  // Generally each file should have a test to accompany it, we warn if that isn't the case as it promotes
  // crappy coding (not writing tests). If a test doesn't make sense, create an empty test file.

  // Angular tests are not implemented yet so we filter those out (same with bundles)
  grunt.registerTask('validateTests', CONSTANTS.TASK_DESCRIPTIONS.validateTests, function() {
	  var testFiles = grunt.file.expand('src/tests/**/*.test.js');
	  var srcFiles = grunt.file.expand([
	                                    'src/scripts/**/*.js',
	                                    '!src/scripts/angular/**/*.js',
	                                    '!src/scripts/bundles/*.js'
	                                  ]);

	  grunt.log.writeln(testFiles.length + ' found.');
	  grunt.log.writeln(srcFiles.length + ' expected.');

	  if(testFiles.length != srcFiles.length && !cliOptions['force-no-tests']) {
		  var errorMessage = grunt.template.process(CONSTANTS.ERROR_MESSAGES.testCountMismatch, {data: {
			  found: testFiles.length,
			  expected: srcFiles.length,
			  files: srcFiles
		  }});
		  grunt.fail.fatal(errorMessage);
	  }
  });

  // Run linter and tests, also check test count against file count in the `src/scripts` directory.
  grunt.registerTask('isProdReady', CONSTANTS.TASK_DESCRIPTIONS.isProdReady, ['validateTests', 'jshint:dev', 'pagespeed:desktop', 'pagespeed:mobile']);
};
