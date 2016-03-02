Base project
===

This project aims to be a starting point for all new personal website builds (and eventually integrate it into to work development / build process).

Uses `grunt` for tasks. It's been designed to work for people who aren't comfortable configuring this stuff manually themselves, generally
as long as you keep your projects in the structure listed below, it will hopefully *just work*.

What is Grunt and what is it doing?
---

Grunt is a task-runner, [see more info](http://gruntjs.com/).

![Alt text](diagram.jpg?raw=true "title")


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

By default it will create `js` / `css` bundles from everything contained in the root asset dir (`/scripts` or `/styles/less`). Files
beginning with a `_` will be ignored!

Scripts will always be placed in `bundles/` and styles will always be placed in `css/`

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

Available tasks:
---

- `dev`, used when developing a project, watches less / js files for changes in the working directory
- `prod`, produce a fully-optimized project build
- `optimise-images`, optimises images in the source directory
- `test`, runs project tests on their own
- `screenshots`, takes screenshots of the specified URIs and stores them in `./grunt-temp/screenshots`.
- `perf`, runs project through [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)

Available options:
---

Use these options to dictate what tasks run / what files are watched. All of these have default values of `false`.

- `--no-tests`, removes tests from `dev` task.
- `--no-scripts`, removes scripts from `dev` task.

Generally used when the tests take too long to execute or if you are just changing styles.

Useful links:
---

- List of PostCSS plugins: [https://github.com/postcss/postcss](https://github.com/postcss/postcss)
- Hub ([project link](https://hub.github.com/)), `brew install hub`, `hub browse`

Useful commands:
---

- `grunt --verbose`, see what Grunt is actually doing.
- Serve development build, `cd ./src; server 2222`
- Serve production build, `cd ./prod; server 4444`
