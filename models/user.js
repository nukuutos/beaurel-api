const { USER } = require('../config/collection-names');
const Collection = require('./utils/collection/collection');

class User extends Collection {
  static name = USER;

  constructor({
    email,
    password,
    username = null,
    firstName = null,
    lastName = null,
    role = 'user',
  }) {
    super();

    this.email = email;
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.avatar = null;
    this.isConfirmed = { email: false, phone: false };
    this.role = role;
    this.createdAt = new Date();
  }
}

module.exports = User;
