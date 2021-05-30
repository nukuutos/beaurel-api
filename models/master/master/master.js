const getDb = require('../../../utils/database').getDb;

const profileAndReviews = require('./pipelines/profile-and-reviews');
const mastersAndRating = require('./pipelines/masters-and-rating');
// const masters = require('./pipelines/masters');

class Master {
  // static async getMasters(userId) {
  //   const db = getDb();

  //   const data = await db.collection('users').aggregate(masters(userId)).toArray();
  //   return data[0];
  // }

  static async getMasterProfile(masterId) {
    const db = getDb();

    try {
      const profile = await db.collection('users').aggregate(profileAndReviews(masterId)).toArray();
      // for (let {value, counter} of profile.reviewStats.reviewCounters

      return profile[0];
    } catch (error) {
      console.log(error.message);
      throw new Error();
    }
  }

  static async findMasters(query, page = 0) {
    const db = getDb();
    const data = await db.collection('users').aggregate(mastersAndRating(query, page)).toArray();
    return data;
  }

  // static async becomeMaster(id, masterFields) {
  //   const db = getDb();
  //   try {
  //     return await db.collection('users').updateOne({ _id: id }, { $set: { status: 'master', ...masterFields } });
  //   } catch (error) {
  //     throw new Error();
  //   }
  // }
}

module.exports = Master;
