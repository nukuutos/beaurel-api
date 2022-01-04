const { USER } = require('../config/collection-names');
const Collection = require('./utils/collection/collection');

class User extends Collection {
  static name = USER;

  constructor({
    phone,
    password,
    role = 'customer',
    confirmation = null,
    firstName = null,
    lastName = null,
  }) {
    super();

    this.phone = phone;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = null;
    this.email = null;
    this.avatar = null;
    this.confirmation = confirmation || {
      lastSendAt: null,
      isConfirmed: false,
      verificationCode: null,
      attemptsCountLeft: 5,
      resendCountLeft: 5,
    };
    this.role = role;
    this.createdAt = new Date();
  }
}

module.exports = User;
