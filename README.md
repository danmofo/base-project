Base Grunt tasks
===

This `Gruntfile` is designed to work for people who aren't comfortable configuring this stuff manually themselves


Assumptions
---

 In order to work the following folder structure / naming convention should be followed:
 
 - src
 	- styles/
 		- css/
 		- less/
 			- my-app.less
 			- another-website.less
 			- another-subdomain.less
 	- scripts
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

By default it will create js / css bundles from everything contained in the root asset dir (/scripts or /styles/less). Files
beginning with a `_` will be ignored!

Plugins
---

- `grunt-contrib-copy`
- `grunt-contrib-clean`
- `grunt-contrib-less`
- `grunt-contrib-watch`
- `grunt-prompt`
- `grunt-browserify`
- `grunt-concurrent`
- `grunt-filerev`
- `grunt-userev`
- `grunt-pageres`
- `grunt-postcss`, plugins used:
    - `cssnano`, minifies css
    - `autoprefixer`, adds vendor prefixes
    - `pixrem`, adds support for REM units in crud browsers

Todo:
---
- Normalise the file format used in `Gruntfile.js`, it's a mess.
To add:
- CSS linter
- JS linter
- Look for useful `postcss` plugins
- Seperate config into several files
- Clean up grunt config

Available tasks:
---

- `dev` develop a project
- `prod` produce a fully-optimized project build
- `setup` setup your environment for development
- `util` utility task for running one off optimizations (e.g. image compression, page screenshots, etc.)

Useful links:
---

- List of PostCSS plugins: [https://github.com/postcss/postcss](https://github.com/postcss/postcss)

Useful software:
---

- Hub ([project link](https://hub.github.com/)), `brew install hub`, `hub browse`

Useful commands:
---

- `grunt --verbose`, see what Grunt is actually doing.
- Serve development build, `cd ./src; server 2222`
- Serve production build, `cd ./prod; server 4444`
