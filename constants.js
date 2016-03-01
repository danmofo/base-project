/**
 *  Constants used in the Grunt script, including:
 *  - Error mesages,
 *  - Default file paths
 *  - ???
 *
 *  @author danielmoffat
 */

module.exports = {
  DEFAULT_BASE_DIRECTORY: '/var/everyclick/development',

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

  // Regular expressions
  STYLE_REGEX: /css\/.*css/,
  SCRIPT_REGEX: /scripts\/bundles\/.*js/,
  IMAGE_REGEX: /images\/.*(jpg|png|gif)/
};
