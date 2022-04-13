const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const { INVALID_TOKEN } = require('../../config/errors/auth');
const User = require('../../models/user');
const HttpError = require('../../models/utils/http-error');

const { JWT_KEY_REFRESH } = process.env;

class RefreshToken extends User {
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

  async getData() {
    const { _id } = this;

    const userData = await User.findOne({ _id }, { _id: 0, role: 1, username: 1 });
    if (!userData) throw new HttpError(INVALID_TOKEN, 400);

    const user = Object.assign(this, userData);
    return user;
  }
}

module.exports = RefreshToken;
