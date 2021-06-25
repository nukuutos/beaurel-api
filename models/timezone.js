const { getDb } = require('../utils/database');

class Timezone {
  static async insertMany(data) {
    const db = getDb();
    return await db.collection('timezone').insertMany(data);
  }

  static async find(city, page) {
    const db = getDb();

    return await db
      .collection('timezone')
      .find({ city })
      .project({ _id: 0 })
      .skip(page * 10)
      .limit(10)
      .toArray();
  }
}

module.exports = Timezone;
