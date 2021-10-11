const bcrypt = require("bcryptjs");

const { USER } = require("../../config/collection-names");
const { INVALID_EMAIL_OR_PASSWORD } = require("../../config/errors/auth");
const HttpError = require("../utils/http-error");
const User = require("./user");

class AuthUser extends User {
  static name = USER;

  constructor({ _id, email = null, password = null, role = null }) {
    super({ email, password, role });
    this._id = _id;
  }

  checkPassword(enteredPassword) {
    const isMatch = bcrypt.compareSync(enteredPassword, this.password);
    if (!isMatch) throw new HttpError(INVALID_EMAIL_OR_PASSWORD, 404);
    return this;
  }
}

module.exports = AuthUser;
