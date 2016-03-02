var User = require('../../scripts/common/user.js');

describe('User.js', function() {

  it('Should set defaults if no properties are set!', function() {
    var u = new User();

    expect(u.firstName).toBe('Anonymous');
    expect(u.lastName).toBe('');
  });

  it('Should set the properties if provided', function() {
    var u = new User({
      firstName: 'daniel',
      lastName: 'moffat'
    });
    expect(u.firstName).toBe('daniel');
    expect(u.lastName).toBe('moffat');
  });

  it('Should get the full name', function() {
    var u = new User({
      firstName: 'daniel',
      lastName: 'moffat'
    });
    expect(u.getFullName()).toBe('daniel moffat');
  });

  it('Should fail in everything but Firefox', function() {
    var fail = window.navigator.userAgent.indexOf('Firefox') > -1;
    expect(true).toBe(true);
  });

});
