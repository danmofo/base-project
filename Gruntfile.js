/**
 * @author: danielmoffat
 */

(function() {
	return require('fs').readdirSync(require('./grunt_config').load().get('baseDirectory')).filter(function(directory) {
		return FILE_BLACKLIST.indexOf(directory) === -1;
	}).filter(function(directory) {
		return directory.indexOf('_Assets') > -1;
	});
});

var DEFAULT_BASE_DIRECTORY = '/var/everyclick/development';

// File types / extensions we want to ignore
var FILE_BLACKLIST = [
	'.DS_Store',
	'.metadata',
	'.recommenders'
];

var MESSAGES = {
	selectWorkingDirectory: 'Select the working directory (where the project lives)'
};

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-prompt');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.initConfig({
		less: {
			dev: {
				files: [
					{
						expand: true,
						cwd: 'src/styles/less/',
						src: ['*.less', '!_*.less'],
						dest: 'src/styles/css/',
						ext: '.css'
					}
				]
			}
		},
		watch: {
			dev: {
				files: './src/styles/less/**/**/*.less',
				tasks: ['less:dev']
			}
		},
		prompt: {
			setup: {
				options: {
					questions: [
						{
							config: 'config.selections',
							type: 'list',
							message: MESSAGES.selectWorkingDirectory,
							default: 'test',
							choices: ['']
						}
					]
				}
			}
		}
	});

	/**
	 * 	Task registration
	 */

	// Register default task
	grunt.registerTask('default', ['setup']);

	// Setup tasks, these must be ran before you can work on anything
	grunt.registerTask('setup', [
		'validateConfig'
	]);

	// Development tasks, these are for when you're working on a project
	grunt.registerTask('dev', [
		'setup',
		'watch:dev'
	]);

	// Production tasks, these are for when you want to create a production-ready build
	grunt.registerTask('build', [
		'setup'
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
			config.set('projectDirectory', './src');
			config.save();
		}

		grunt.log.writeln(config.prettyPrint());

	});
};