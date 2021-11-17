const { FAVORITES } = require('../../config/cache');
const { USER } = require('../../config/collection-names');
const { MASTER_IS_FRIEND, NO_MASTER } = require('../../config/errors/favorite');
const User = require('../../models/user');
const HttpError = require('../../models/utils/http-error');
const favoriteMasters = require('../../pipelines/favorite/favorite-masters');

class Favorite extends User {
  static name = USER;

  constructor(_id) {
    super({});
    this._id = _id;
  }

  static async getMasters(userId) {
    const pipeline = favoriteMasters(userId);
    return await this.aggregate(pipeline).cache(userId, FAVORITES).next();
  }

  async addMaster(masterId) {
    const { _id } = this;
    await User.updateOne({ _id }, { $push: { masters: masterId } });
  }

  async deleteMaster(masterId) {
    const { _id } = this;
    await User.updateOne({ _id }, { $pull: { masters: masterId } });
  }

  async checkMaster(masterId) {
    const { _id } = this;

    const { masters } = await User.findOne({ _id }, { _id: 0, masters: 1 });

    const stringMasters = masters.map((master) => master.toString());
    const stringMasterId = masterId.toString();

    if (stringMasters.includes(stringMasterId)) {
      throw new HttpError(MASTER_IS_FRIEND, 400);
    }

    const isMaster = await User.findOne({ _id: masterId, role: 'master' }, { _id: 1, role: 1 });

    if (!isMaster) {
      throw new HttpError(NO_MASTER, 404);
    }
  }
}

module.exports = Favorite;
