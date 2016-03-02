/**
 *  See README.md for more explanation.
 *
 *  @author: danielmoffat
 */

var CONSTANTS = require('./constants');
var gruntConfig = require('./grunt-config');
var prettyifyJson = require('./grunt-utils').prettyifyJson;

module.exports = function(grunt) {
  // Allow user to specify several flags using a cli to exclude / include certain tasks,
  // because the extra stuff needed for running tests (more watched files, karma, jasmine..)
  // can slow down development.
  //
  // Likewise for scripts, if you are only changing CSS, there's no reason to watch scripts for
  // changes along with the overhead that comes with that.
  //
  // grunt dev --no-tests --no-scripts
  //
  var cliOptions = {
    'no-tests' : grunt.option('no-tests'),
    'no-scripts': grunt.option('no-scripts')
  };

  grunt.log.writeln('CLI options: ');
  grunt.log.writeln(prettyifyJson(cliOptions, 2));
  grunt.log.writeln('Exisiting config found at ./config.json: ');
  grunt.log.writeln(prettyifyJson(gruntConfig.localConfig, 2));

  // Show time taken for each task
  require('time-grunt')(grunt);

  // Only load the required plugins for each task
  require('jit-grunt')(grunt);

  // Config
  grunt.initConfig({
    filerev: {
      prod: {
        src: ['prod/styles/css/*.css', 'prod/scripts/bundles/*.js', 'prod/images/*.jpg']
      }
    },
    userev: {
      prod: {
        src: [
          'prod/velocity/index.html',
          'prod/velocity/general.vm',
          'prod/styles/css/*.css',
          'prod/scripts/bundles/*.js'
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
      prod: ['prod/'],
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
        src: 'src/styles/css/*.css'
      },
      prod: {
        options: {
          map: false,
          processors: [
            require('cssnano')()
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
        files: [
          'src/scripts/**/**',
          '!src/scripts/bundles/**/**'
        ],
        tasks: [
          'browserify:dev',
          'jshint:dev'
        ]
      },
      devScriptsWithTests: {
        files: [
          'src/tests/spec/*.js',
          'src/scripts/**/**/*.js',
          '!src/scripts/bundles/**/**'
        ],
        tasks: [
          'browserify:dev',
          'jshint:dev',
          'karma:dev:run'
        ]
      }
    },
    concurrent: {
      watch: {
        tasks: [
          'watch:devStyles',
          'watch:devScripts'
        ],
        options: {
          logConcurrentOutput: true
        }
      },
      watchWithTests: {
        tasks: [
          'watch:devStyles',
          'watch:devScriptsWithTests',
          'karma:dev'
        ],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    uglify: {
      prod: {
        options: {
          banner: CONSTANTS.SCRIPT_BANNER,
          report: 'gzip'
        },
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
            'velocity/**/**',
            'images/**/**'
          ],
          dest: 'prod/'
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
        'src/scripts/**/*.js',
        '!src/scripts/bundles/*.js'
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
            'resources.giveasyoulive.dev/giveasyoulive/?cid=1517',
            'www.giveasyoulive.com'
          ],
          // look into pulling resolutions directly from our analytics:
          // https://www.npmjs.com/package/googleanalytics
          sizes: ['1200x800', '800x600'],
          dest: '.grunt-temp/screenshots'
        }
      }
    },
    pagespeed: {
      test: {
        options: {
          nokey: true,
          strategy: 'desktop',
          threshold: 40,
          url: 'www.giveasyoulive.com',
          locale: 'en_GB'
        }
      }
    }
  });

  /**
   *  Task registration
   */

  grunt.registerTask('default', ['dev']);

  // Setup tasks, these must be ran before you can work on anything
  grunt.registerTask('setup', [
    'validateConfig'
  ]);

  // Development tasks, these are for when you're working on a project
  grunt.registerTask('dev', [
      // Set directories / API keys
    'setup',
    // Compile less & postcss css files
    'createCss',
    // Bundle js
    'createScripts',
    // Watch ALL less / js files for changes
    'concurrent:watchWithTests'
  ]);

  // Production tasks, these are for when you want to create a production-ready build
  grunt.registerTask('build', [
      // Set directories / API keys
    'setup',
    // Clean production folder if anything is in there already
    'clean:prod',
    // Copy all static files across (minus css and js)
    'copy:prod',
    // Compile less files
    'less:prod',
    // PostCSS css files
    'postcss:prod',
    // Bundle js
    'browserify:prod',
    // Minify js
    'uglify:prod',
    // Change file names
    'filerev:prod',
    // Use newly changed file names
    'userev:prod'
  ]);

  grunt.registerTask('screenshots', [
    'pageres:screenshot'
  ]);

  grunt.registerTask('perf', [
    'pagespeed:test'
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

    var config = require('./grunt-config').load();
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
    }


  });
};
