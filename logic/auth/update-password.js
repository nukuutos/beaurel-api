const bcrypt = require('bcryptjs');
const dayjs = require('dayjs');
const {
  INVALID_PHONE_NUMBER,
  ATTEMPTS_COUNT_LEFT,
  INVALID_VERIFICATION_CODE,
  TIME_IS_OUT,
} = require('../../config/errors/auth');
const User = require('../../models/user');
const HttpError = require('../../models/utils/http-error');

class UpdatePassword extends User {
  constructor({ _id, ...data }) {
    super(data);
    this._id = _id;
  }

  static async getUser(phone) {
    const userData = await User.findOne(
      { phone, 'confirmation.isConfirmed': true },
      {
        'resetPassword.verificationCode': 1,
        'resetPassword.attemptsCountLeft': 1,
        'resetPassword.lastSendAt': 1,
      }
    );

    if (userData) {
      userData.resetPassword.lastSendAt = dayjs(userData.resetPassword.lastSendAt);
    }

    return new this({ ...userData, phone } || {});
  }

  isExists() {
    if (!this._id) throw new HttpError(INVALID_PHONE_NUMBER, 404);
    return this;
  }

  checkAttemptsCount() {
    const { attemptsCountLeft } = this.resetPassword;

    if (!attemptsCountLeft) {
      throw new HttpError(ATTEMPTS_COUNT_LEFT, 400);
    }

    return this;
  }

  checkTime() {
    const { lastSendAt } = this.resetPassword;

    const now = dayjs();

    const difference = now.diff(lastSendAt, 'm');

    if (difference > 60) {
      throw new HttpError(TIME_IS_OUT, 400);
    }

    return this;
  }

  async checkVerificationCode(code) {
    const { phone, resetPassword } = this;
    const { verificationCode } = resetPassword;

    if (code !== verificationCode) {
      await User.updateOne(
        { phone, 'confirmation.isConfirmed': true },
        { $inc: { 'resetPassword.attemptsCountLeft': -1 } }
      );
      throw new HttpError(INVALID_VERIFICATION_CODE, 400);
    }
  }

  hashNewPassword(newPassword) {
    const salt = bcrypt.genSaltSync(10);
    this.newPassword = bcrypt.hashSync(newPassword, salt);
    return this;
  }

  async updatePassword() {
    const { phone, newPassword } = this;
    await User.updateOne({ phone, 'confirmation.isConfirmed': true }, { password: newPassword });
  }
}

module.exports = UpdatePassword;
