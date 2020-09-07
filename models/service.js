const getDb = require('../utils/database').getDb;

const { serviceAndTimetablePipeline, serviceByMasterIdPipeline } = require('./pipelines/service');

class Service {
  constructor(masterId, title, duration, price, parameter = null) {
    this.masterId = masterId;
    this.title = title;
    this.parameter = parameter;
    this.duration = duration;
    this.price = price;
  }

  async save() {
    const db = getDb();
    try {
      return await db.collection('services').insertOne(this);
    } catch (error) {
      throw new Error();
    }
  }
  // goes to profile or mb user?
  static async getServiceAndTimetable(serviceId, masterId) {
    const db = getDb();

    try {
      const serviceAndTimetable = await db
        .collection('services')
        .aggregate(serviceAndTimetablePipeline(serviceId, masterId))
        .toArray();

      return serviceAndTimetable[0];
    } catch (error) {
      throw new Error();
    }
  }

  static async getServicesByMasterId(masterId) {
    const db = getDb();

    try {
      return await db.collection('services').aggregate(serviceByMasterIdPipeline(masterId));
    } catch (error) {
      throw new Error();
    }
  }

  static async updateService(serviceId, masterId, service) {
    const db = getDb();

    try {
      return await db.collection('services').updateOne({ _id: serviceId, masterId }, { $set: { ...service } });
    } catch (error) {
      throw new Error();
    }
  }

  static async deleteService(serviceId, masterId) {
    const db = getDb();
    try {
      return await db.collection('services').deleteOne({ _id: serviceId, masterId });
    } catch (error) {
      throw new Error();
    }
  }
}

module.exports = Service;
