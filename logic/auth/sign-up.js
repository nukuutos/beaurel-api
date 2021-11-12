const bcrypt = require('bcryptjs');

const { USER_EXISTS } = require('../../config/errors/auth');
const User = require('../../models/user/user');
const HttpError = require('../../models/utils/http-error');

class SignUp {
  constructor(data) {
    this.data = data;
  }

  static async getUser(email) {
    const userData = await User.findOne({ email }, { _id: 1 });
    return new this(userData);
  }

  isExists() {
    if (this.data) throw new HttpError(USER_EXISTS, 400);
    return this;
  }

  setData(data) {
    const userData = new User(data);
    this.data = userData;
    return this;
  }

  hashPassword() {
    const { password } = this.data;
    const salt = bcrypt.genSaltSync(10);
    this.data.password = bcrypt.hashSync(password, salt);
    return this;
  }

  async save() {
    const { insertedId: _id } = await User.save(this.data);
    this.data._id = _id;
  }
}

module.exports = SignUp;
