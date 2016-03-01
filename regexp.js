var test = '<script src="/scripts/bundles/main-bundle.js"></script>\
<script src="/styles/css/main.css"></script>\
<script src="/scripts/bundles/main-bundle.4fccc4a4d8.js"></script>\
<script src="/styles/css/main.4fccc4a4d8.css"></script>\
p {\
  background-image: url("/images/link.jpg");\
}\
\
var template = "/images/link.jpg";\
var script = document.createElement("script");\
script.src = "/scripts/bundles/main-bundle.js";\
var css = "/styles/css/main.css";'

var constants = require('./constants');

var expressions = [
  constants.STYLE_REGEX,
  constants.SCRIPT_REGEX,
  constants.IMAGE_REGEX
];

expressions.forEach(function(expression) {
  console.log(test.match(expression))
});
