/**
 *  Constants used in the Grunt script.
 *
 *  @author danielmoffat
 */

module.exports = {

  // Directory glob patterns, todo: add directory glob patterns...
  DIRECTORIES: {

  },

  // Human readable task descriptions
  TASK_DESCRIPTIONS: {
    help:                   'Use grunt --help',
    setup:                  'Runs some setup tasks',
    dev:                    'For developing a web project',
    build:                  'For a full production build',
    screenshots:            'Take some screenshots for testing',
    perf:                   'Run some performance analysis',
    'optimise-images':      'Optimise images',
    createCss:              'Run CSS compilation steps',
    createScripts:          'Run JS compilation steps',
    validateFlags:          'Checks the command-line flags given are OK',
    validateTests:          'Checks each source file and makes sure it has a matching test file.',
    isProdReady:            'Lints, tests and runs website through page speed.',
    devChromeExtension:     'For developing a Chrome Extension',
    prodChromeExtension:    'Creates a production-read Chrome extension, ready for deployment on the Chrome Webstore.',
    scratchpad:             'For testing things',
    createChromeExtension:  'Creates a chrome extension from src directory into extension.',
  },

  CLI_DEFAULTS: {
    src: './src',
    dest: './prod',
  },

  CLI_BLACKLIST: [
    '--color'
  ],

  // Required folders in the src directory, generally just a styles / scripts / images will do, this
  // implies it's some sort of web project that this may work in
  REQUIRED_FOLDERS: ['styles/sass', 'scripts/', 'images/'],

  // File types / extensions we want to ignore
  FILE_BLACKLIST: [
    '.DS_Store',
    '.metadata',
    '.recommenders'
  ],

  // Messages displayed to the user
  MESSAGES: {
    selectWorkingDirectory: 'Select the working directory (where the project lives)'
  },

  ERROR_MESSAGES: {
    'invalidSrc': [
      'The specified source folder "<%= directory %> doesnt exist, ',
      'create it (mkdir folder_name) and add your source manually, or use a symbolic link (rm src && ln -s your/src/ src)',
  	  ' to use existing sources.'
    ].join(''),
    'invalidDest': 'The specified destination folder "<%= directory %>" doesnt exist.',
    'missingFolders': 'Your src folder is missing a folder (<%= directory %>), things may not work as you expect, investigate!',
    'testCountMismatch': 'Expected <%= expected %> tests but only found <%= found %>. Files were <%= files %>.',
    'missingCommand': 'You need to specify a command! For a list of commands use grunt --help!'
  },

  // Regular expressions
  STYLE_REGEX: /css\/.*css/,
  SCRIPT_REGEX: /scripts\/bundles\/.*js/,
  IMAGE_REGEX: /images\/.*(jpg|png|gif)/,

  // Banner for prepending scripts
  SCRIPT_BANNER: '/* daniel moffat (@danmofo), www.dmoffat.com */'
};
