const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const { INVALID_TOKEN } = require('../../config/errors/auth');
const User = require('../../models/user/user');
const HttpError = require('../../models/utils/http-error');

const { JWT_KEY_REFRESH } = process.env;

class RefereshToken {
  constructor(data) {
    this.data = data;
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
    const { _id } = this.data;

    const user = await User.findOne({ _id }, { role: 1 });
    if (!user) throw new HttpError(INVALID_TOKEN, 400);

    this.data = user;
  }
}

module.exports = RefereshToken;
