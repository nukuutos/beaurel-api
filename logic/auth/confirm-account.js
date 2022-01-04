const dayjs = require('dayjs');
const {
  INVALID_PHONE_NUMBER,
  ATTEMPTS_COUNT_LEFT,
  INVALID_VERIFICATION_CODE,
  TIME_IS_OUT,
} = require('../../config/errors/auth');
const User = require('../../models/user');
const HttpError = require('../../models/utils/http-error');

class ConfirmAccount extends User {
  constructor({ _id, ...data }) {
    super(data);
    this._id = _id;
  }

  static async getUser(phone) {
    const userData = await User.findOne(
      { phone },
      {
        'confirmation.verificationCode': 1,
        'confirmation.attemptsCountLeft': 1,
        'confirmation.lastSendAt': 1,
        role: 1,
        username: 1,
      }
    );

    if (userData) {
      userData.confirmation.lastSendAt = dayjs(userData.confirmation.lastSendAt);
    }

    return new this({ ...userData, phone } || {});
  }

  isExists() {
    if (!this._id) throw new HttpError(INVALID_PHONE_NUMBER, 404);
    return this;
  }

  checkAttemptsCount() {
    const { attemptsCountLeft } = this.confirmation;

    if (!attemptsCountLeft) {
      throw new HttpError(ATTEMPTS_COUNT_LEFT, 400);
    }

    return this;
  }

  checkTime() {
    const { lastSendAt } = this.confirmation;

    const now = dayjs();

    const difference = now.diff(lastSendAt, 'm');

    if (difference > 60) {
      throw new HttpError(TIME_IS_OUT, 400);
    }

    return this;
  }

  async checkVerificationCode(code) {
    const { phone, confirmation } = this;
    const { verificationCode } = confirmation;

    if (code !== verificationCode) {
      await User.updateOne({ phone }, { $inc: { 'confirmation.attemptsCountLeft': -1 } });
      throw new HttpError(INVALID_VERIFICATION_CODE, 400);
    }
  }

  async confirmAccount() {
    const { phone } = this;
    await User.updateOne({ phone }, { 'confirmation.isConfirmed': true });
  }
}

module.exports = ConfirmAccount;
