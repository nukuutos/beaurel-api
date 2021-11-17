const bcrypt = require('bcryptjs');

const { USER_EXISTS } = require('../../config/errors/auth');
const User = require('../../models/user');
const HttpError = require('../../models/utils/http-error');

class SignUp extends User {
  constructor({ _id, ...data }) {
    super(data);
    this._id = _id;
  }

  static async getUser(email) {
    const userData = await User.findOne({ email }, { _id: 1 });
    return new this(userData || {});
  }

  isExists() {
    if (this._id) throw new HttpError(USER_EXISTS, 400);
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

  async save() {
    const { _id, ...userData } = this;
    const { insertedId: id } = await User.save(userData);
    this._id = id;
  }
}

module.exports = SignUp;
