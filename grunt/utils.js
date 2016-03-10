module.exports = {
  prettyifyJson: prettifyJson,
  getConcurrentTask: getConcurrentTask,
  prettyPrintCliArguments: prettyPrintCliArguments,
  arrayContains: arrayContains,
  hasCliArguments: hasCliArguments,
  parseCliOptions: parseCliOptions
};

var grunt = require('grunt');
var CONSTANTS = require('./constants');

/**
 * Looks at grunt.options.flags() and creates an object from them (converting flags to keys like so:
 * --no-tests would be added with the 'no-tests' key.
 *
 * It also applies the defaults from CONSTANTS.CLI_OPTIONS and filters out items from CONSTANTS.CLI_BLACKLIST
 *
 * @return {Object} The CLI options
 */
function parseCliOptions() {
  var opts = {};

  copyProps(CONSTANTS.CLI_DEFAULTS, opts, true);

  // grunt.option(option) evauluates to true if it's present (even if it doesnt have a value)
  grunt.option.flags().forEach(function(flag) {
    var key = flag.substring(2);
    // Set the option to the value of grunt.option(option) or true if it doesn't have a value (aka is was passed without a value)
    opts[key] = grunt.option(flag) ? grunt.option(flag) : true;
  });

  return opts;
}

/**
 * Pretty prints the CLI arguments, filtering out the crappy arguments.
 *
 * @return
 */
function prettyPrintCliArguments() {
  if(!grunt.option.flags().length) {
    grunt.log.writeln('No arguments found, using defaults...');
    return;
  }

  if(hasCliArguments()) {
    grunt.log.writeln('Found the following flags: ')
    grunt.option.flags().forEach(function(flag) {
      grunt.log.writeln('Flag name: ' + flag);

      grunt.log.writeln('Flag value: ' +  (grunt.option(flag) ? grunt.option(flag) : true));
    });
  }
}

/**
 * Determine whether we have "real" arguments or not.
 *
 * @return {Boolean} True if there are real arguments
 */
function hasCliArguments() {
  var flags = grunt.option.flags();
  var ok = true;

  for (var i = 0; i < CONSTANTS.CLI_BLACKLIST.length; i++) {
    if(arrayContains(flags, CONSTANTS.CLI_BLACKLIST[i])) {
      ok = false;
      break;
    }
  }

  return ok;
}

/**
 * Determine if the array contains a value
 * @param  {Array}    arr  The array to search
 * @param  {Object}   find The Object to find
 * @return {Boolean}       True if the array contains find.
 */
function arrayContains(arr, find) {
  if(!arr || !arr.length) return false;

  return arr.indexOf(find) > 0;
}

/**
 * Basic copy properties from object a to object b
 * @param  {Object} target Object to copy properties from
 * @param  {Object} dest   Object to copy properties to
 * @return
 */
function copyProps(target, dest) {
  for(var key in target) {
    dest[key] = target[key];
  }
}

/**
 * Prettify an object for debugging
 *
 * @param  {Object} obj    The object to prettify
 * @param  {Number} spaces Number of spaces to pad with
 * @return {String}        Formatted string of JSON
 */
function prettifyJson(obj, spaces) {
  return JSON.stringify(obj, null, spaces || 4);
}

/**
 * Determine which 'concurrent' task to run based on options.
 *
 * @param opts Hash of options, this makes function parameters more readable and allows us to control
 * which tasks grunt runs with flags.
 *
 * @return {String}
 */
function getConcurrentTask(opts) {
	opts = opts || {};

	// At the moment we only test scripts, so no scripts means no tests!
	if(opts['no-scripts']) {
		return 'concurrent:watchStylesOnly'
	}

	if(opts['no-tests']) {
		return 'concurrent:watch';
	}

	return 'concurrent:watchWithTests';
}
