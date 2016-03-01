var User = require('../../scripts/common/user.js')

var UserDetails = {
  firstName: 'daniel',
  lastName: 'moffat'
};

describe('User.js', function() {

  it('Should set defaults if no properties are set!', function() {
    var u = new User();

    expect(u.firstName).toBe(User.defaults.firstName);
    expect(u.lastName).toBe(User.defaults.lastName);

  });

  it('Should set the properties if provided', function() {
    var u = new User(UserDetails);
    expect(u.firstName).toBe(UserDetails.firstName);
    expect(u.lastName).toBe(UserDetails.lastName);
  });

  it('Should get the full name', function() {
    var u = new User(UserDetails);
    expect(u.getFullName()).toBe('daniel moffat');
  });

});
