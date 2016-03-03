/**
 *  Constants used in the Grunt script, including:
 *  - Error mesSages,
 *  - Default file paths
 *  - ???
 *
 *  @author danielmoffat
 */

module.exports = {
	
  DEFAULT_SRC_DIRECTORY: './src',
  DEFAULT_DEST_DIRECTORY: './prod',
  
  // Required folders in the src directory, generally just a styles / scripts / images will do, this
  // implies it's some sort of web project that this may work in
  REQUIRED_FOLDERS: ['styles/less', 'scripts/', 'images/'],

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
    'missingCommand': 'You need to specify a command! Example commands: dev, build, optmise-images, screenshots, perf'

  },

  // Regular expressions
  STYLE_REGEX: /css\/.*css/,
  SCRIPT_REGEX: /scripts\/bundles\/.*js/,
  IMAGE_REGEX: /images\/.*(jpg|png|gif)/,

  // Banner for prepending scripts
  SCRIPT_BANNER: '/* daniel moffat (@danmofo), www.dmoffat.com */'
};
