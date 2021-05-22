const getDb = require('../../../utils/database').getDb;

class Review {
  constructor(masterId, customerId, appointmentId, value, comment) {
    this.masterId = masterId;
    this.customerId = customerId;
    this.appointmentId = appointmentId;
    this.value = value;
    this.comment = comment;
    this.reply = null;
    this.createdAt = new Date();
  }

  async save() {
    const db = getDb();
    try {
      await db.collection('reviews').insertOne(this);
    } catch (error) {
      throw new Error();
    }
  }

  static async findOne(query, projection = null) {
    const db = getDb();
    return await db.collection('reviews').findOne(query, { projection: projection });
  }

  static async updateOne(query, update) {
    const db = getDb();

    await db.collection('reviews').updateOne(query, update);
  }

  // static async deleteOne(query) {
  //   const db = getDb();
  //   try {
  //     // await db.collection('reviews').deleteOne({ _id: reviewId, customerId });
  //     await db.collection('reviews').deleteOne(query);
  //   } catch (error) {
  //     throw new Error();
  //   }
  // }

  // static async saveReply(reviewId, masterId, reply) {
  //   const db = getDb();
  //   try {
  //     await db.collection('reviews').updateOne({ _id: reviewId, masterId }, { $set: { reply } });
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // }

  // static async deleteReply(reviewId, masterId) {
  //   const db = getDb();
  //   try {
  //     await db.collection('reviews').updateOne({ _id: reviewId, masterId }, { $set: { reply: null } });
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // }
}

module.exports = Review;
