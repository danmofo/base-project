/**
 *  Main application script
 *
 *  @author danielmoffat
 */

var $     = require('jquery');
var utils = require('./common/utils');
var Handlebars = require('handlebars');
var template = Handlebars.compile('<p>This was created using JS. 1 + 1 = {{ result }}. My name is {{ name }}.</p>');


console.log(utils.add(1, 2))

console.log(template({
  result: utils.subtract(10, 1),
  name: 'Daniel'
}))

console.log('hello world!')


