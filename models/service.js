const getDb = require('../utils/database').getDb;

const servicesCountAndIsTitle = require('./pipelines/service/services-count-and-is-title');
const servicesAndTimetable = require('./pipelines/service/services-and-timetable');

// Service to  ServiceParameter perhaps and SubService
class Service {
  constructor(masterId, title, duration, price, order) {
    this.masterId = masterId;
    this.title = title;
    this.duration = duration;
    this.price = price;
    this.order = order;
    this.subOrder = null;
    this.parameter = null;
  }

  async save() {
    const db = getDb();
    return await db.collection('services').insertOne(this);
  }

  static async findOne(query, projection = null) {
    const db = getDb();
    return await db.collection('services').findOne(query, { projection: projection });
  }

  static async updateOne(query, update) {
    const db = getDb();
    return await db.collection('services').updateOne(query, { $set: update });
  }

  static async updateMany(query, update) {
    const db = getDb();
    return await db.collection('services').updateMany(query, { $set: update });
  }

  static async deleteOne(query) {
    const db = getDb();
    return await db.collection('services').deleteOne(query);
  }

  static async deleteMany(query) {
    const db = getDb();

    return await db.collection('services').deleteMany(query);
  }

  // goes to profile or mb user?
  // static async getServiceAndTimetable(serviceId, masterId) {
  //   const db = getDb();

  //   const serviceAndTimetable = await db
  //     .collection('services')
  //     .aggregate(serviceAndTimetablePipeline(serviceId, masterId))
  //     .toArray();

  //   return serviceAndTimetable[0];
  // }

  static async getServicesAndTimetable(masterId) {
    const db = getDb();

    const resp = await db.collection('timetables').aggregate(servicesAndTimetable(masterId)).toArray();

    return resp[0];
  }

  static async getServiceCounterAndIsTitleExists(masterId, title) {
    const db = getDb();

    const resp = await db.collection('services').aggregate(servicesCountAndIsTitle(masterId, title)).toArray();

    return resp[0];
  }
  //to  service parameter

  // static async getServicesByMasterId(masterId) {
  //   const db = getDb();
  //   const services = await db.collection('services').aggregate(serviceByMasterIdPipeline(masterId)).toArray();

  //   return services;
  // }

  static async updateOrder(newOrder) {
    const db = getDb();
    const bulkOp = db.collection('services').initializeOrderedBulkOp();

    newOrder.forEach(({ id, ...order }) => {
      bulkOp.find({ _id: id }).updateOne({ $set: order });
    });

    await bulkOp.execute();
  }
}

module.exports = Service;
