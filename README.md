Base Grunt tasks
===

Improvements to the Grunt build script, unfortunately I'm stuck on this bandwagon so can't just hop over to gulp or whatever.

Plugins used:
- `grunt-prompt`
- `grunt-contrib-less`
- `grunt-contrib-watch`
- `grunt-browserify`
- `grunt-postcss`, plugins used:
    - `cssnano`, minifies css
    - `autoprefixer`, adds vendor prefixes
    - `pixrem`, adds support for REM units in crud browsers

To add:
- `grunt-pageres` for quick Q&A,
- `grunt-browserify` for developing JS
- CSS linter
- JS linter
- ???

Available tasks:
- `dev`, develop a project
- `prod`, produce a fully-optimized project build
- `setup`
- `util`, utility task for running one off optimizations (e.g. image compression, page screenshots, etc.)

Useful links:
- List of PostCSS plugins: [https://github.com/postcss/postcss](https://github.com/postcss/postcss)

Useful software:
- Hub ([project link](https://hub.github.com/)), `brew install hub`

Useful commands:
- Serve development build, `cd ./src; server 2222`
- Serve production build, `cd ./prod; server 4444`
