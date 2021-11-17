const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const { INVALID_TOKEN } = require('../../config/errors/auth');
const User = require('../../models/user');
const HttpError = require('../../models/utils/http-error');

const { JWT_KEY_REFRESH } = process.env;

class RefereshToken extends User {
  constructor({ _id, ...data }) {
    super(data);
    this._id = _id;
  }

  static verifyToken(token) {
    try {
      const { user } = jwt.verify(token, JWT_KEY_REFRESH);
      const userId = new ObjectId(user.id);
      return new this({ _id: userId });
    } catch (error) {
      throw new HttpError(INVALID_TOKEN, 400);
    }
  }

  async isExists() {
    const { _id } = this;

    const userData = await User.findOne({ _id }, { role: 1 });
    if (!userData) throw new HttpError(INVALID_TOKEN, 400);

    const user = Object.assign(this, userData);
    return user;
  }
}

module.exports = RefereshToken;
