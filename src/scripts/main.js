/**
 *  Main application script
 *
 *  @author danielmoffat
 */

var $     = require('jquery');
var utils = require('./common/utils');
var user = require('./common/user');
var Handlebars = require('handlebars');
var template = Handlebars.compile('<p>This was created using JS. 1 + 1 = {{ result }}. My name is {{ name }}.</p>');

// This will be replaced!
var script = '/scripts/bundles/another-bundle.js';

var s = document.createElement('script');
s.src = script;
document.body.append(s);
