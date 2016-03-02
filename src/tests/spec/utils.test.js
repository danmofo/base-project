var utils = require('../../scripts/common/utils');

var add = utils.add;
var subtract = utils.subtract;

describe('utils.js', function() {

  it('add() should add numbers', function() {
    expect(add(1, 1)).toBe(2);
  });

  it('subtract() should subtract number a from b', function() {
    expect(subtract(1, 10)).toBe(9);
  });

  it('nothing() should do nothing', function() {
    expect(false).toBe(false);
  })

});
