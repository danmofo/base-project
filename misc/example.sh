# An extremely simple example build process template

# Pull source from repository
svn checkout url /path/to/yourSrcDir

# Process frontend assets
grunt build --src='/path/to/yourSrcDir' --dest='/path/to/outputDirectory'

# Process backend things
# todo