const HttpError = require('./http-error');
const { saveImageFS } = require('./utils/image');

const getDb = require('../utils/database').getDb;

class Work {
  constructor(masterId, title) {
    this.masterId = masterId;
    this.title = title;
  }

  async save(buffer) {
    const db = getDb();

    const { insertedId } = await db.collection('works').insertOne(this);
    const imageUrl = 'images/' + 'works/' + insertedId + '.png';
    // can i refactor this?
    try {
      // save in fs image
      await saveImageFS(buffer, imageUrl);
    } catch (error) {
      // if error, delete in db without await
      Work.deleteOne({ _id: insertedId });
      throw new Error(error.message);
    }

    return insertedId;
  }

  static async find(query, projection = null) {
    const db = getDb();
    return await db.collection('works').find(query, { projection: projection }).toArray();
  }

  static async findOne(query, projection = null) {
    const db = getDb();
    return await db.collection('works').findOne(query, { projection: projection });
  }

  static async updateOne(query, update) {
    const db = getDb();
    return await db.collection('works').updateOne(query, { $set: update });
  }

  static async updateMany(query, update) {
    const db = getDb();
    return await db.collection('works').updateMany(query, { $set: update });
  }

  static async deleteOne(query) {
    const db = getDb();
    return await db.collection('works').deleteOne(query);
  }

  static async deleteMany(query) {
    const db = getDb();

    return await db.collection('works').deleteMany(query);
  }
}

module.exports = Work;
