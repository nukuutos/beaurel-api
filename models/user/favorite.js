const { USER } = require("../../config/collection-names");
const favoriteMasters = require("../../pipelines/favorite/favorite-masters");

class Favorite {
  static name = USER;

  static async getFavoriteMasters(userId) {
    const pipeline = favoriteMasters(userId);
    return await this.aggregate(pipeline).next();
  }
}

module.exports = Favorite;
