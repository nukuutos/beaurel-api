const getDb = require('../../../utils/database').getDb;

const favoriteMasters = require('./pipelines/favorite-masters');

class Favorite {
  static async getFavoriteMasters(userId) {
    // get favorite and not favorite masters
    const db = getDb();

    const data = await db.collection('users').aggregate(favoriteMasters(userId)).toArray();

    return data[0];
  }
}

module.exports = Favorite;
