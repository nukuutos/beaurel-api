const { USER } = require('../config/collection-names');
const Collection = require('./utils/collection/collection');

class User extends Collection {
  static name = USER;

  constructor({
    phone,
    password,
    city,
    role = 'customer',
    username = null,
    resetPassword = null,
    confirmation = null,
    firstName = null,
    lastName = null,
  }) {
    super();

    this.phone = phone;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.masters = [];
    this.username = username;
    this.isAvatar = false;
    this.confirmation = confirmation || {
      lastSendAt: null,
      isConfirmed: false,
      verificationCode: null,
      attemptsCountLeft: 5,
      resendCountLeft: 5,
    };
    this.resetPassword = resetPassword || {
      lastSendAt: null,
      verificationCode: null,
      attemptsCountLeft: 5,
      resendCountLeft: 5,
    };
    this.role = role;
    this.city = city;
    this.createdAt = new Date();
  }
}

module.exports = User;
