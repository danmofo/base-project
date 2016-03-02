var DEFAULTS = {
  firstName: 'Anonymous',
  lastName: ''
};

function User(info) {
  info = info || {};
  this.firstName = info.firstName || DEFAULTS.firstName;
  this.lastName = info.lastName || DEFAULTS.lastName;
}

User.prototype.getFullName = function getFullName() {
  return this.firstName + ' ' + this.lastName;
};

module.exports = User;
