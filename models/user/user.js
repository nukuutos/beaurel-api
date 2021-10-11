const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const { USER } = require("../../config/collection-names");
const { INVALID_EMAIL_OR_PASSWORD } = require("../../config/errors/auth");
const Collection = require("../utils/collection/collection");
const HttpError = require("../utils/http-error");

const { JWT_KEY_REFRESH } = process.env;

class User extends Collection {
  static name = USER;

  constructor({ email, password, firstName = null, lastName = null, role = "user" }) {
    super();

    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.photo = null;
    this.isConfirmed = { email: false, phone: false };
    this.role = role;
    this.createdAt = new Date();
  }

  async save() {
    const { insertedId: _id } = await User.save(this);
    this._id = _id;
  }

  static verifyToken(token) {
    const { user } = jwt.verify(token, JWT_KEY_REFRESH);
    return new ObjectId(user.id);
  }

  checkPassword(enteredPassword) {
    const isMatch = bcrypt.compareSync(enteredPassword, this.password);
    if (!isMatch) throw new HttpError(INVALID_EMAIL_OR_PASSWORD, 404);
    return this;
  }

  hashPassword() {
    const { password } = this;
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(password, salt);
    return this;
  }
}

module.exports = User;
