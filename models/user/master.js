const profileAndReviews = require("../../pipelines/master/profile-and-reviews");
const mastersAndRating = require("../../pipelines/master/masters-and-rating");
const Collection = require("../utils/collection/collection");
const { USER } = require("../../config/collection-names");

class Master extends Collection {
  static name = USER;

  static async getMasterProfile(masterId) {
    const pipeline = profileAndReviews(masterId);
    return await this.aggregate(pipeline).next();
  }

  static async findMasters(query, page = 0) {
    const pipeline = mastersAndRating(query, page);
    return await this.aggregate(pipeline).toArray();
  }
}

module.exports = Master;
