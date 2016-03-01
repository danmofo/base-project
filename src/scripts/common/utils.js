// @author: danielmoffat
//
// Some extremely useful utlities.

var utils = {
	add: add,
  subtract: subtract
};

module.exports = utils;

function add(a, b) {
  'use strict';
	return a + b;
}

function subtract(a, b) {
  'use strict';
  return b - a;
}
