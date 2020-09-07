const getDb = require('../utils/database').getDb;

class Rating {
  constructor(masterId, customerId, value, comment) {
    this.masterId = masterId;
    this.customerId = customerId;
    this.value = value;
    this.comment = comment;
    this.reply = null;
    this.createdAt = new Date();
  }

  async save() {
    const db = getDb();
    try {
      await db.collection('ratings').insertOne(this);
    } catch (error) {
      throw new Error();
    }
  }

  static async findOne(query, projection = null) {
    const db = getDb();
    try {
      return await db.collection('ratings').findOne(query, { projection: projection });
    } catch (error) {
      throw new Error();
    }
  }

  static async updateOne(query, update) {
    const db = getDb();
    try {
      await db.collection('ratings').updateOne(query, { $set: update });
    } catch (error) {
      throw new Error();
    }
  }

  static async deleteOne(query) {
    const db = getDb();
    try {
      // await db.collection('ratings').deleteOne({ _id: ratingId, customerId });
      await db.collection('ratings').deleteOne(query);
    } catch (error) {
      throw new Error();
    }
  }

  // static async saveReply(ratingId, masterId, reply) {
  //   const db = getDb();
  //   try {
  //     await db.collection('ratings').updateOne({ _id: ratingId, masterId }, { $set: { reply } });
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // }

  // static async deleteReply(ratingId, masterId) {
  //   const db = getDb();
  //   try {
  //     await db.collection('ratings').updateOne({ _id: ratingId, masterId }, { $set: { reply: null } });
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // }
}

module.exports = Rating;
