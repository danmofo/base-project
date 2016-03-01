var DEFAULTS = {
  firstName: 'Anonymous',
  lastName: ''
};

function User(info) {
  info = info || {};
  this.firstName = info.firstName || 'Anonymous';
  this.lastName = info.lastName || '';
}

User.prototype.getFullName = function getFullName() {
  return this.firstName + ' ' + this.lastName;
};

User.defaults = DEFAULTS;

module.exports = User;
