const {
  INVALID_PHONE_NUMBER,
  ATTEMPTS_COUNT_LEFT,
  ACCOUNT_HAS_CONFIRMED,
} = require('../../config/errors/auth');
const User = require('../../models/user');
const HttpError = require('../../models/utils/http-error');
const getVerificationCode = require('./utils/get-verification-code');

class ResendVerificationCode extends User {
  constructor({ _id, ...data }) {
    super(data);
    this._id = _id;
  }

  static async getUser(phone) {
    const userData = await User.findOne(
      { phone },
      {
        'confirmation.isConfirmed': 1,
        'confirmation.resendCountLeft': 1,
        'confirmation.verificationCode': 1,
        role: 1,
        username: 1,
      }
    );

    return new this({ ...userData, phone } || {});
  }

  isExists() {
    if (!this._id) throw new HttpError(INVALID_PHONE_NUMBER, 404);
    return this;
  }

  isConfirmed() {
    const { isConfirmed } = this.confirmation;

    if (isConfirmed) {
      throw new HttpError(ACCOUNT_HAS_CONFIRMED, 400);
    }

    return this;
  }

  checkAttemptsCount() {
    const { resendCountLeft } = this.confirmation;

    if (!resendCountLeft) {
      throw new HttpError(ATTEMPTS_COUNT_LEFT, 400);
    }

    return this;
  }

  generateVerificationCode() {
    const verificationCode = getVerificationCode();
    this.confirmation.verificationCode = verificationCode;
    this.confirmation.lastSendAt = new Date();
    return this;
  }

  async updateConfirmationField() {
    const { phone, confirmation } = this;
    const { verificationCode, lastSendAt } = confirmation;

    await User.updateOne(
      { phone },
      {
        $set: {
          'confirmation.verificationCode': verificationCode,
          'confirmation.lastSendAt': lastSendAt,
        },
        $inc: { 'confirmation.resendCountLeft': -1 },
      }
    );
  }
}

module.exports = ResendVerificationCode;
