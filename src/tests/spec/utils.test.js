var utils = require('../scripts/common/utils');

var add = utils.add;
var subtract = utils.subtract;

describe('testing utils.js', function() {

  it('should add numbers', function() {
    expect(add(1, 1)).toBe(2);
  });

  it('should subtract number a from b', function() {
    expect(subtract(1, 10)).toBe(9);
  });

});
