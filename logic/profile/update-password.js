const bcrypt = require('bcryptjs');
const { INVALID_PASSWORD } = require('../../config/errors/auth');
const { NO_USER } = require('../../config/errors/profile');
const User = require('../../models/user');
const HttpError = require('../../models/utils/http-error');

class UpdatePassword extends User {
  constructor({ _id, ...data }) {
    super(data);
    this._id = _id;
  }

  static async getUser(userId) {
    const userData = await User.findOne({ _id: userId }, { password: 1 });
    return new this({ ...userData, _id: userId } || {});
  }

  isExisted() {
    const isUser = this.password;
    if (!isUser) throw new HttpError(NO_USER, 404);
    return this;
  }

  checkCurrentPassword(enteredPassword) {
    const isMatch = bcrypt.compareSync(enteredPassword, this.password);
    if (!isMatch) throw new HttpError(INVALID_PASSWORD, 400);
    return this;
  }

  hashNewPassword(newPassword) {
    const salt = bcrypt.genSaltSync(10);
    this.newPassword = bcrypt.hashSync(newPassword, salt);
    return this;
  }

  async update() {
    const { _id, newPassword } = this;
    await User.updateOne({ _id }, { password: newPassword });
  }
}

module.exports = UpdatePassword;
