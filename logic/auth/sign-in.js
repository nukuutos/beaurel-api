const bcrypt = require('bcryptjs');

const { INVALID_EMAIL_OR_PASSWORD } = require('../../config/errors/auth');
const User = require('../../models/user');
const HttpError = require('../../models/utils/http-error');

class SignIn extends User {
  constructor({ _id, ...data }) {
    super(data);
    this._id = _id;
  }

  static async getUser(email) {
    const userData = await User.findOne({ email }, { email: 1, password: 1, role: 1 });
    return new this(userData || {});
  }

  isExists() {
    if (!this._id) throw new HttpError(INVALID_EMAIL_OR_PASSWORD, 404);
    return this;
  }

  checkPassword(enteredPassword) {
    const isMatch = bcrypt.compareSync(enteredPassword, this.password);
    if (!isMatch) throw new HttpError(INVALID_EMAIL_OR_PASSWORD, 404);
    return this;
  }
}

module.exports = SignIn;
