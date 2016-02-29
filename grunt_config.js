/**
 * 	Grunt config wrapper 
 *  @author: danielmoffat
 * 
 * 	Wraps grunt.config and adds some useful utility methods:
 * 	- Pretty print config
 * 	- Checks if config key exists
 * 	- Load existing configuration from disc
 * 	- Save current configuration to disc
 *
 *  The last two points are very useful for prompt based configuration,
 *  e.g. where the user has to set up some paths before they can
 *  get going.
 * 
 */

var grunt = require('grunt');
var gruntConfig = grunt.config;

// Defaults
var DEFAULT_CONFIG_LOCATION = './config.json';

// Module definition
gruntConfig.prettyPrint = prettyPrint;
gruntConfig.load = load;
gruntConfig.save = save;
gruntConfig.hasKey = hasKey;
// Temp storage for config from disc
gruntConfig.localConfig = {};

module.exports = gruntConfig;

/**
 * Pretty print the current config state
 * @return {void}
 */
function prettyPrint() {
	grunt.log.writeln(prettifyJson(this.data));
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
 * Load any existing configuration from DEFAULT_CONFIG_LOCATION
 * and copies any configuration found to the internal config.
 *
 * @return {void} 
 */
function load(configLocation) {
	var configLocation = configLocation || DEFAULT_CONFIG_LOCATION;

	if(grunt.file.exists(configLocation)) {
		try {
			this.localConfig = grunt.file.readJSON(configLocation);	
		} catch(exception) {
			grunt.log.writeln('Error parsing existing config, deleting...');
			grunt.file.delete(configLocation);
			createEmptyConfig();
		}
	} else {
		createEmptyConfig();
	}

	// Copy properties over
	merge(this.localConfig, this.data);

	return this;
}

/**
 * Merge properties from a (target) to b (destination).
 * 
 * @param  {Object} a Target object
 * @param  {Object} b Destination object
 * @return {void}
 */
function merge(a, b) {
	for(var key in a) {
		if(!b.hasOwnProperty(key)) {
			b[key] = a[key];
		}
	}
}

/**
 * Creates an empty configuration file at DEFAULT_CONFIG_LOCATION.
 * @return {void}
 */
function createEmptyConfig(configLocation) {
	var configLocation = configLocation || DEFAULT_CONFIG_LOCATION;
	grunt.log.writeln('Created an empty config at ' + configLocation);
	grunt.file.write(configLocation, JSON.stringify({}));
	return this;
}

/**
 * Check if the key exists in the configuration
 * @param  {String}  key The key to check
 * @return {Boolean}     Whether the specified key exists
 */
function hasKey(key) {
	return this.data[key] !== undefined;
}

/**
 * Persist the configuration to disc.
 * @return {[type]} [description]
 */
function save() {
	grunt.file.write(DEFAULT_CONFIG_LOCATION, JSON.stringify(this.data));
	return this;
}