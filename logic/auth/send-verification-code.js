const { ATTEMPTS_COUNT_LEFT } = require('../../config/errors/auth');
const User = require('../../models/user');
const HttpError = require('../../models/utils/http-error');
const sendWhatsappMessage = require('../utils/send-whatsapp-message');
const getVerificationCode = require('./utils/get-verification-code');

class SendVerificationCode extends User {
  constructor({ _id, ...data }) {
    super(data);
    this._id = _id;
  }

  static async getUser(phone) {
    const userData = await User.findOne(
      { phone, 'confirmation.isConfirmed': true },
      {
        'resetPassword.resendCountLeft': 1,
        'resetPassword.verificationCode': 1,
      }
    );

    return new this({ ...userData, phone } || {});
  }

  isExisted() {
    if (this._id) return true;
    return false;
  }

  checkAttemptsCount() {
    const { resendCountLeft } = this.resetPassword;

    if (!resendCountLeft) {
      throw new HttpError(ATTEMPTS_COUNT_LEFT, 400);
    }

    return this;
  }

  generateVerificationCode() {
    const verificationCode = getVerificationCode();
    this.resetPassword.verificationCode = verificationCode;
    this.resetPassword.lastSendAt = new Date();
    return this;
  }

  async updateResetPasswordField() {
    const { phone, resetPassword } = this;
    const { verificationCode, lastSendAt } = resetPassword;

    await User.updateOne(
      { phone },
      {
        $set: {
          'resetPassword.verificationCode': verificationCode,
          'resetPassword.lastSendAt': lastSendAt,
        },
        $inc: { 'resetPassword.resendCountLeft': -1 },
      }
    );
  }

  async sendVerificationCode() {
    const { phone, confirmation } = this;
    const { verificationCode } = confirmation;
    const message = `*Beaurel*❤️\nВаш код подтверждения: *${verificationCode}*`;
    await sendWhatsappMessage(phone, message);
  }
}

module.exports = SendVerificationCode;
