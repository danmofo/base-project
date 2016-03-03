module.exports = {
  prettyifyJson: prettifyJson,
  getConcurrentTask: getConcurrentTask
};

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
 * Gets the 'concurrent' task to run
 * @param opts Hash of options, this makes function parameters more readable allows us to control
 * what tasks grunt uses with flags.
 * 
 * Examples of some calling code:
 * 
 * getConcurrentTask({'no-tests':true, 'no-scripts': false })
 * => Your dev task would only watch styles / scripts, it will not watch and run any tests, not recommended!
 * 
 * getConcurrentTask({'no-tests: true, 'no-scripts': true })
 * => Your dev task would only watch styles, it will not watch any js files, this is useful if you're just changing css
 * 
 * @returns
 */

// I'm sure I've done something stupid here, but I'm really tired
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