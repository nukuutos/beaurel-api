const { FAVORITES } = require("../../config/cache");
const { USER } = require("../../config/collection-names");
const { MASTER_IS_FRIEND } = require("../../config/errors/favorite");
const favoriteMasters = require("../../pipelines/favorite/favorite-masters");
const HttpError = require("../utils/http-error");
const AuthUser = require("./auth-user");

class Favorite extends AuthUser {
  static name = USER;

  constructor(_id) {
    super({ _id });
  }

  static async getFavoriteMasters(userId) {
    const pipeline = favoriteMasters(userId);
    return await this.aggregate(pipeline).cache(userId, FAVORITES).next();
  }

  async checkMaster(masterId) {
    const { _id } = this;

    const { masters } = await Favorite.findOne({ _id }, { _id: 0, masters: 1 });

    const stringMasters = masters.map((master) => master.toString());
    const stringMasterId = masterId.toString();

    if (stringMasters.includes(stringMasterId)) {
      throw new HttpError(MASTER_IS_FRIEND, 400);
    }
  }

  async addMaster(masterId) {
    const { _id } = this;

    await Favorite.updateOne({ _id }, { $push: { masters: masterId } });
  }

  async deleteMaster(masterId) {
    const { _id } = this;

    await Favorite.updateOne({ _id }, { $pull: { masters: masterId } });
  }
}

module.exports = Favorite;
