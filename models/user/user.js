const { USER } = require('../../config/collection-names');
const Collection = require('../utils/collection/collection');

class User extends Collection {
  static name = USER;

  constructor({ email, password, firstName = null, lastName = null, role = 'user' }) {
    super();

    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.photo = null;
    this.isConfirmed = { email: false, phone: false };
    this.role = role;
    this.createdAt = new Date();
  }
}

module.exports = User;
