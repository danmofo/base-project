// @author: danielmoffat
//
// Some extremely useful utlities.

var utils = {
	add: add,
  subtract: subtract
};

function add(a, b) {
  'use strict';
	return a + b;
}

function subtract(a, b) {
  'use strict';
  return a - b;
}

module.exports = utils;
