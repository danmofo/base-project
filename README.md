Base project
===

This project aims to be a starting point for all new personal website builds (and eventually integrate it into work development / build process).

Uses `grunt` for tasks. It's been designed to work for people who aren't comfortable configuring this stuff manually themselves, generally as long as you keep your projects in the structure listed below, it will hopefully *just work*.

What is Grunt and what is it doing?
---

Grunt is a task-runner, a task is essentially a function that does something. Something can be anything from logging a message to the console, minifying a css file to optimising an image.

Here's a diagram that tries to visualise it, the coloured blocks in the middle represent the tasks we use, you can easily see which steps each file type goes through.

![Alt text](diagram.jpg?raw=true "title")

For more information, the official documentation can be [found here](http://gruntjs.com/).


Getting started
---

Install by doing the following (make sure you have `node` and `git` installed on your system):
- `git clone` this repo into a directory, `cd` into it
- `npm install` to install the required dependencies
- **(Optional)** `npm install -g http-server` to serve files if you aren't running Apache or Tomcat.
- `grunt <command> --<flag>=<flag-value>`, where you can specify the following tasks:
	- `dev` used when developing a project, watches less / js files for changes in the working directory
	- `prod` produce a fully-optimized project build
	- `optimise-images` optimises images in the source directory
	- `test` runs project tests on their own
	- `screenshots` takes screenshots of the specified URIs and stores them in `./grunt-temp/screenshots`.
	- `perf` runs project through [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)
	- `scratchpad`, for testing things
	
Use these flags to dictate what tasks run / which files are watched. All of these have default values of `false`. These are generally used when the tests take too long to execute or if you are just changing styles. They are also good for working with legacy projects (projects before these practices were followed) since they may not have tests for example (and therefore would fail a lot of things!)
	- `--no-tests`, removes tests from `dev` task.
	- `--no-scripts`, removes scripts from `dev` task (and since right now all we test are scripts, this applies `--no-tests` implicitly.
	- `--src`, specify the source directory, default is `./src`.
	- `--dest`, specifiy the destination directory, default is `./prod`.

Some examples:

- Run a full build with a custom source directory: `grunt build  --src='/var/everyclick/development/giveasyoulive.com/trunk'`
- Develop the project in `src` without running tests: `grunt dev --no-tests`
- Output the build to a `dest` directory: `grunt build dest='/var/everyclick/tomcat/foo/'`


In order to work the following folder structure / naming convention should be followed in a project, any changes will probably not work as intended so only change that if you know what you're doing: 

     - src/
     	- styles/
     		- css/
     		- less/
     			- my-app.less
     			- another-website.less
     			- another-subdomain.less
     	- scripts/
     		- bundles/
     		- another-app/
     			app.js
     		main.js
     		subdomain.js
     		_i-will-be-ignored.js
     	- images/
     		- my-image.jpg
     	- ???
     - prod/
     	- styles/
     		css/
     		
Generally we won't have files directly in `src`, instead it should be a symbolic link to your repository branch

By default it will create `js` / `css` bundles from everything contained in the root asset directory (`/scripts` or `/styles/less`). Files beginning with a `_` will be ignored! So for example, following folder structure:

	src/
		styles/
			less/
				app.less
				ghoul.less
				_variables.less
			scripts/
				main.js
				search-application.js
				one-off-page.js
				_illbeignored.js
				_and-so-will-i.js				
				
Would be compiled into (where # is the file hash):

	src/
		styles/	
			css/
				app.#.css
				ghoul.#.css
			scripts/
				bundles/
					main-bundle.#.js
					search-application-bundle.#.js
					one-off-page-bundle.#.js
				
Scripts will always be placed in `bundles/` and styles will always be placed in `css/` in the output directory.

Useful commands:
---

- To see what Grunt is actually doing whilst running, use the `--verbose` flag when running `grunt`.
- Serve the development build, `cd ./src && http-server`, open `127.0.0.1:8080` in your browser.
- Serve the production build, `cd ./prod && http-server`, open `127.0.0.1:8080` in your browser

Plugins used:
---

See `package.json` for a full list.

TODO:
---
- Normalise the file format used in `Gruntfile.js`, it's a mess.
- CSS linter
- Look for useful `postcss` plugins
- Seperate config into several files
- Clean up grunt config
- Integrate into `vagrant` repo
- Add existing Angular application
- Add work project source
- Add prompt / helper for setting up configuration
- Remove config file completely, all state is passed with flags now with sensible defaults.
- Add a pre-commit hook to the source code directory which makes sure tests pass before allowing a commit.

Useful links:
---

- List of PostCSS plugins: [https://github.com/postcss/postcss](https://github.com/postcss/postcss)
- Hub ([project link](https://hub.github.com/)), `brew install hub`, `hub browse`
