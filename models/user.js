const getDb = require('../utils/database').getDb;

const { bookAppointmentPipeline } = require('./pipelines/user');

// http error when update
// check updated service

class User {
  constructor(email, password, firstName, lastName) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.photo = null;
    this.isConfirmed = { email: false, phone: false };
    this.role = 'user';
    this.createdAt = new Date();
  }

  async save() {
    const db = getDb();
    try {
      await db.collection('users').insertOne(this);
    } catch (error) {
      throw new Error();
    }
  }

  static async findOne(query, projection = null) {
    const db = getDb();
    try {
      return await db.collection('users').findOne(query, { projection: projection });
    } catch (error) {
      throw new Error();
    }
  }

  static async updateOne(query, update) {
    const db = getDb();

    try {
      await db.collection('users').updateOne(query, { $set: update });
    } catch (error) {
      throw new Error();
    }
  }

  // static async becomeMaster(id, masterFields) {
  //   const db = getDb();
  //   try {
  //     return await db.collection('users').updateOne({ _id: id }, { $set: { status: 'master', ...masterFields } });
  //   } catch (error) {
  //     throw new Error();
  //   }
  // }

  // static async starMaster(userId, masterId) {
  //   const db = getDb();
  //   try {
  //     return await db.collection('users').updateOne({ _id: userId }, { $push: { staredMaster: masterId } });
  //   } catch (error) {
  //     throw new Error();
  //   }
  // }

  // static async unstarMaster(userId, masterId) {
  //   const db = getDb();
  //   try {
  //     return await db.collection('users').updateOne({ _id: userId }, { $pull: { staredMaster: { $eq: masterId } } });
  //   } catch (error) {
  //     throw new Error();
  //   }
  // }

  static async getInfoForBookingAppointment(masterId, serviceId, date) {
    const db = getDb();
    try {
      const daySchedule = await db // array
        .collection('timetables')
        .aggregate(bookAppointmentPipeline(masterId, serviceId, date))
        .toArray();

      return daySchedule[0];
    } catch (error) {
      throw new Error();
    }
  }
}

module.exports = User;
