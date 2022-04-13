const bcrypt = require('bcryptjs');
const { USER_EXISTS } = require('../../config/errors/auth');
const User = require('../../models/user');
const HttpError = require('../../models/utils/http-error');
const sendWhatsappMessage = require('../utils/send-whatsapp-message');
const getVerificationCode = require('./utils/get-verification-code');

class SignUp extends User {
  constructor({ _id, ...data }) {
    super(data);
    this._id = _id;
  }

  static async getUser(phone) {
    const userData = await User.findOne({ phone }, { _id: 1, confirmation: 1 });
    return new this(userData || {});
  }

  isExists() {
    const isUser = this._id && this.confirmation.isConfirmed;
    if (isUser) throw new HttpError(USER_EXISTS, 400);
    return this;
  }

  setData(data) {
    const user = Object.assign(this, data);
    return user;
  }

  hashPassword() {
    const { password } = this;
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(password, salt);
    return this;
  }

  isMaster(specialization, placeOfWork) {
    if (!specialization) return this;

    this.role = 'master';
    this.specialization = specialization;
    this.placeOfWork = placeOfWork;
    this.tools = { isServices: false, isTimetable: false };

    return this;
  }

  generateVerificationCode() {
    const verificationCode = getVerificationCode();
    this.confirmation.verificationCode = verificationCode;
    this.confirmation.lastSendAt = new Date();
    return this;
  }

  async save() {
    const { _id, ...userData } = this;
    const { insertedId: id } = await User.save(userData);
    this._id = id;
  }

  async sendVerificationCode() {
    const { phone, confirmation } = this;
    const { verificationCode } = confirmation;
    const message = `*Beaurel*❤️\nВаш код подтверждения: *${verificationCode}*`;
    await sendWhatsappMessage(phone, message);
  }
}

module.exports = SignUp;
